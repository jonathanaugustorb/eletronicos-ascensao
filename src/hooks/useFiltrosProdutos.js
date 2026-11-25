import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FAIXA_PRECO, PRODUTOS, calcularDesconto, nomeCategoria } from '../data/produtos.js';
import { normalizar } from '../utils/formato.js';

/** Opções da lista de ordenação. */
export const ORDENACOES = [
  { id: 'relevancia', nome: 'Mais relevantes' },
  { id: 'menor-preco', nome: 'Menor preço' },
  { id: 'maior-preco', nome: 'Maior preço' },
  { id: 'nota', nome: 'Melhor avaliados' },
  { id: 'desconto', nome: 'Maior desconto' },
  { id: 'novidades', nome: 'Lançamentos' },
];

/** Valores padrão — um filtro igual ao padrão não entra na URL. */
const PADRAO = {
  busca: '',
  categorias: [],
  marcas: [],
  precoMin: FAIXA_PRECO.minimo,
  precoMax: FAIXA_PRECO.maximo,
  notaMinima: 0,
  somentePromocao: false,
  somenteEstoque: false,
  ordem: 'relevancia',
};

/** Nome de cada filtro na query string. */
const CHAVES = {
  busca: 'busca',
  categorias: 'cat',
  marcas: 'marca',
  precoMin: 'min',
  precoMax: 'max',
  notaMinima: 'nota',
  somentePromocao: 'promo',
  somenteEstoque: 'estoque',
  ordem: 'ordem',
};

/**
 * Transforma os parâmetros da URL em um objeto de filtros tipado.
 * @param {URLSearchParams} params
 */
function lerFiltros(params) {
  const lista = (chave) =>
    (params.get(chave) ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  // Atenção: params.get devolve null quando a chave não existe, e Number(null)
  // é 0 — por isso a ausência precisa ser tratada antes da conversão.
  const numero = (chave, padrao) => {
    const bruto = params.get(chave);
    if (bruto === null || bruto.trim() === '') return padrao;
    const valor = Number(bruto);
    return Number.isFinite(valor) ? valor : padrao;
  };

  return {
    busca: params.get(CHAVES.busca) ?? PADRAO.busca,
    categorias: lista(CHAVES.categorias),
    marcas: lista(CHAVES.marcas),
    precoMin: numero(CHAVES.precoMin, PADRAO.precoMin),
    precoMax: numero(CHAVES.precoMax, PADRAO.precoMax),
    notaMinima: numero(CHAVES.notaMinima, PADRAO.notaMinima),
    somentePromocao: params.get(CHAVES.somentePromocao) === '1',
    somenteEstoque: params.get(CHAVES.somenteEstoque) === '1',
    ordem: ORDENACOES.some((item) => item.id === params.get(CHAVES.ordem))
      ? params.get(CHAVES.ordem)
      : PADRAO.ordem,
  };
}

/**
 * Palavras pesquisáveis de cada produto, calculadas uma única vez por módulo.
 * @type {Map<string, string[]>}
 */
const INDICE_BUSCA = new Map(
  PRODUTOS.map((produto) => [
    produto.id,
    normalizar(
      [
        produto.nome,
        produto.marca,
        nomeCategoria(produto.categoria),
        produto.resumo,
        ...produto.etiquetas,
        ...produto.destaques,
      ].join(' '),
    )
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  ]),
);

/**
 * Um termo casa quando é o começo de alguma palavra do produto.
 *
 * Comparar por início de palavra (e não por trecho solto) deixa a busca
 * incremental funcionando — "note" acha "notebook" — sem trazer resultados
 * enganosos, como "fone" cair dentro de "telefone".
 *
 * @param {string[]} palavras
 * @param {string} termo
 */
function casaTermo(palavras, termo) {
  return palavras.some((palavra) => palavra.startsWith(termo));
}

/**
 * Verifica se um produto atende aos filtros, podendo ignorar um deles.
 *
 * Ignorar um filtro é o que permite contar as opções de uma faceta sem que ela
 * zere a si mesma — ao marcar "Notebooks", as outras categorias continuam
 * mostrando quantos itens trariam.
 *
 * @param {import('../data/produtos.js').Produto} produto
 * @param {ReturnType<typeof lerFiltros>} filtros
 * @param {string} [ignorar] nome do campo de filtro a desconsiderar
 */
function atende(produto, filtros, ignorar) {
  const termos = normalizar(filtros.busca)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (ignorar !== 'busca' && termos.length > 0) {
    const palavras = INDICE_BUSCA.get(produto.id) ?? [];
    if (!termos.every((termo) => casaTermo(palavras, termo))) return false;
  }

  if (
    ignorar !== 'categorias' &&
    filtros.categorias.length > 0 &&
    !filtros.categorias.includes(produto.categoria)
  ) {
    return false;
  }

  if (ignorar !== 'marcas' && filtros.marcas.length > 0 && !filtros.marcas.includes(produto.marca)) {
    return false;
  }

  if (ignorar !== 'preco' && (produto.preco < filtros.precoMin || produto.preco > filtros.precoMax)) {
    return false;
  }

  if (ignorar !== 'nota' && produto.nota < filtros.notaMinima) return false;
  if (ignorar !== 'promocao' && filtros.somentePromocao && !produto.precoAntigo) return false;
  if (ignorar !== 'estoque' && filtros.somenteEstoque && produto.estoque === 0) return false;

  return true;
}

/**
 * Pontuação de relevância: casa o início do nome primeiro, depois usa a
 * reputação do produto como critério de desempate.
 * @param {import('../data/produtos.js').Produto} produto
 * @param {string} busca
 */
function pontuar(produto, busca) {
  const reputacao = produto.nota * Math.log10(produto.avaliacoes + 10);
  const termo = normalizar(busca);
  if (!termo) return reputacao;

  const nome = normalizar(produto.nome);
  if (nome.startsWith(termo)) return reputacao + 100;
  if (nome.includes(termo)) return reputacao + 50;
  if (normalizar(produto.marca).includes(termo)) return reputacao + 25;
  return reputacao;
}

/** Comparadores de ordenação, um por id de ORDENACOES. */
const COMPARADORES = {
  'menor-preco': (a, b) => a.preco - b.preco,
  'maior-preco': (a, b) => b.preco - a.preco,
  nota: (a, b) => b.nota - a.nota || b.avaliacoes - a.avaliacoes,
  desconto: (a, b) => calcularDesconto(b) - calcularDesconto(a),
  novidades: (a, b) => b.lancamento - a.lancamento || b.nota - a.nota,
};

/**
 * Lê, grava e aplica os filtros do catálogo.
 *
 * Todo o estado mora na query string: a URL filtrada pode ser recarregada,
 * compartilhada ou aberta a partir do menu e dos links da home.
 */
export function useFiltrosProdutos() {
  const [params, setParams] = useSearchParams();
  const filtros = useMemo(() => lerFiltros(params), [params]);

  /**
   * Grava um ou mais filtros na URL, removendo os que voltaram ao padrão.
   * @param {Partial<typeof PADRAO>} mudancas
   */
  const definirFiltros = useCallback(
    (mudancas) => {
      setParams(
        (atual) => {
          const proximos = new URLSearchParams(atual);

          for (const [campo, valor] of Object.entries(mudancas)) {
            const chave = CHAVES[campo];
            if (!chave) continue;

            const vazio =
              valor === PADRAO[campo] ||
              valor === '' ||
              valor === false ||
              (Array.isArray(valor) && valor.length === 0);

            if (vazio) {
              proximos.delete(chave);
            } else if (Array.isArray(valor)) {
              proximos.set(chave, valor.join(','));
            } else if (typeof valor === 'boolean') {
              proximos.set(chave, '1');
            } else {
              proximos.set(chave, String(valor));
            }
          }

          return proximos;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );

  /** Marca ou desmarca um item de um filtro de múltipla escolha. */
  const alternarItem = useCallback(
    (campo, item) => {
      const atuais = filtros[campo];
      const proximos = atuais.includes(item)
        ? atuais.filter((valor) => valor !== item)
        : [...atuais, item];
      definirFiltros({ [campo]: proximos });
    },
    [filtros, definirFiltros],
  );

  const limparFiltros = useCallback(() => {
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
  }, [setParams]);

  const produtos = useMemo(() => {
    const encontrados = PRODUTOS.filter((produto) => atende(produto, filtros));
    const comparador = COMPARADORES[filtros.ordem];

    return comparador
      ? [...encontrados].sort(comparador)
      : [...encontrados].sort((a, b) => pontuar(b, filtros.busca) - pontuar(a, filtros.busca));
  }, [filtros]);

  /** Quantos produtos cada categoria e cada marca trariam, dados os demais filtros. */
  const contagens = useMemo(() => {
    const porCategoria = {};
    const porMarca = {};

    for (const produto of PRODUTOS) {
      if (atende(produto, filtros, 'categorias')) {
        porCategoria[produto.categoria] = (porCategoria[produto.categoria] ?? 0) + 1;
      }
      if (atende(produto, filtros, 'marcas')) {
        porMarca[produto.marca] = (porMarca[produto.marca] ?? 0) + 1;
      }
    }

    return { porCategoria, porMarca };
  }, [filtros]);

  /** Lista de filtros ativos, para os "chips" removíveis acima da grade. */
  const filtrosAtivos = useMemo(() => {
    const ativos = [];

    if (filtros.busca) {
      ativos.push({ chave: 'busca', rotulo: `"${filtros.busca}"`, limpar: { busca: '' } });
    }
    for (const categoria of filtros.categorias) {
      ativos.push({
        chave: `cat-${categoria}`,
        rotulo: nomeCategoria(categoria),
        limpar: { categorias: filtros.categorias.filter((item) => item !== categoria) },
      });
    }
    for (const marca of filtros.marcas) {
      ativos.push({
        chave: `marca-${marca}`,
        rotulo: marca,
        limpar: { marcas: filtros.marcas.filter((item) => item !== marca) },
      });
    }
    if (filtros.precoMin !== PADRAO.precoMin || filtros.precoMax !== PADRAO.precoMax) {
      ativos.push({
        chave: 'preco',
        rotulo: 'faixa de preço',
        limpar: { precoMin: PADRAO.precoMin, precoMax: PADRAO.precoMax },
      });
    }
    if (filtros.notaMinima > 0) {
      ativos.push({
        chave: 'nota',
        rotulo: `nota ${filtros.notaMinima}+`,
        limpar: { notaMinima: 0 },
      });
    }
    if (filtros.somentePromocao) {
      ativos.push({ chave: 'promo', rotulo: 'em promoção', limpar: { somentePromocao: false } });
    }
    if (filtros.somenteEstoque) {
      ativos.push({ chave: 'estoque', rotulo: 'em estoque', limpar: { somenteEstoque: false } });
    }

    return ativos;
  }, [filtros]);

  return {
    filtros,
    padrao: PADRAO,
    produtos,
    contagens,
    filtrosAtivos,
    definirFiltros,
    alternarItem,
    limparFiltros,
  };
}
