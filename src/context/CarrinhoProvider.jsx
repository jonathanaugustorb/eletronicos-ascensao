import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { CarrinhoContexto } from './CarrinhoContexto.js';
import { buscarProduto } from '../data/produtos.js';
import { calcularResumo, encontrarCupom } from '../utils/pedido.js';

const CHAVE_ARMAZENAMENTO = 'ascensao:carrinho:v1';

/** @typedef {{ id: string, quantidade: number }} ItemCarrinho */
/** @typedef {{ itens: ItemCarrinho[], cupom: string|null }} EstadoCarrinho */

/** @type {EstadoCarrinho} */
const ESTADO_INICIAL = { itens: [], cupom: null };

/**
 * Lê o carrinho salvo no navegador.
 *
 * Guardamos apenas id e quantidade: preço, estoque e nome são sempre lidos do
 * catálogo atual, então um carrinho antigo nunca mostra um preço defasado.
 *
 * @returns {EstadoCarrinho}
 */
function lerArmazenamento() {
  if (typeof window === 'undefined') return ESTADO_INICIAL;

  try {
    const bruto = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!bruto) return ESTADO_INICIAL;

    const salvo = JSON.parse(bruto);
    const itens = Array.isArray(salvo?.itens) ? salvo.itens : [];

    return {
      itens: itens
        .filter((item) => buscarProduto(item?.id))
        .map((item) => ({
          id: item.id,
          quantidade: Math.max(1, Math.min(Number(item.quantidade) || 1, 99)),
        })),
      cupom: typeof salvo?.cupom === 'string' ? salvo.cupom : null,
    };
  } catch {
    // Dados corrompidos ou localStorage bloqueado: começa com o carrinho vazio.
    return ESTADO_INICIAL;
  }
}

/**
 * Limita a quantidade ao estoque disponível do produto.
 * @param {string} id
 * @param {number} quantidade
 * @returns {number}
 */
function limitarAoEstoque(id, quantidade) {
  const produto = buscarProduto(id);
  const teto = produto ? Math.max(1, produto.estoque) : 1;
  return Math.max(1, Math.min(quantidade, teto));
}

/**
 * @param {EstadoCarrinho} estado
 * @param {{ tipo: string, [chave: string]: unknown }} acao
 * @returns {EstadoCarrinho}
 */
function redutor(estado, acao) {
  switch (acao.tipo) {
    case 'adicionar': {
      const { id, quantidade = 1 } = acao;
      const existente = estado.itens.find((item) => item.id === id);

      if (!existente) {
        return {
          ...estado,
          itens: [...estado.itens, { id, quantidade: limitarAoEstoque(id, quantidade) }],
        };
      }

      return {
        ...estado,
        itens: estado.itens.map((item) =>
          item.id === id
            ? { ...item, quantidade: limitarAoEstoque(id, item.quantidade + quantidade) }
            : item,
        ),
      };
    }

    case 'definirQuantidade': {
      const { id, quantidade } = acao;
      if (quantidade <= 0) {
        return { ...estado, itens: estado.itens.filter((item) => item.id !== id) };
      }
      return {
        ...estado,
        itens: estado.itens.map((item) =>
          item.id === id ? { ...item, quantidade: limitarAoEstoque(id, quantidade) } : item,
        ),
      };
    }

    case 'remover':
      return { ...estado, itens: estado.itens.filter((item) => item.id !== acao.id) };

    case 'aplicarCupom':
      return { ...estado, cupom: acao.codigo };

    case 'removerCupom':
      return { ...estado, cupom: null };

    case 'limpar':
      return ESTADO_INICIAL;

    default:
      return estado;
  }
}

/**
 * Provê o estado do carrinho para toda a aplicação.
 * @param {{ children: import('react').ReactNode }} props
 */
export function CarrinhoProvider({ children }) {
  const [estado, despachar] = useReducer(redutor, undefined, lerArmazenamento);

  // Persiste a cada mudança para o carrinho sobreviver ao recarregar a página.
  useEffect(() => {
    try {
      window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado));
    } catch {
      // Modo privativo ou cota cheia: seguimos apenas com o estado em memória.
    }
  }, [estado]);

  const itens = useMemo(
    () =>
      estado.itens
        .map((item) => {
          const produto = buscarProduto(item.id);
          if (!produto) return null;
          return {
            produto,
            quantidade: item.quantidade,
            subtotal: produto.preco * item.quantidade,
          };
        })
        .filter(Boolean),
    [estado.itens],
  );

  const cupom = useMemo(() => encontrarCupom(estado.cupom), [estado.cupom]);

  const quantidadeTotal = useMemo(
    () => itens.reduce((soma, item) => soma + item.quantidade, 0),
    [itens],
  );

  const adicionar = useCallback(
    (id, quantidade = 1) => despachar({ tipo: 'adicionar', id, quantidade }),
    [],
  );
  const definirQuantidade = useCallback(
    (id, quantidade) => despachar({ tipo: 'definirQuantidade', id, quantidade }),
    [],
  );
  const remover = useCallback((id) => despachar({ tipo: 'remover', id }), []);
  const limpar = useCallback(() => despachar({ tipo: 'limpar' }), []);
  const removerCupom = useCallback(() => despachar({ tipo: 'removerCupom' }), []);

  /**
   * Valida e aplica um cupom.
   * @param {string} codigo
   * @returns {{ ok: boolean, mensagem: string }}
   */
  const aplicarCupom = useCallback(
    (codigo) => {
      const encontrado = encontrarCupom(codigo);
      if (!encontrado) {
        return { ok: false, mensagem: 'Cupom não encontrado.' };
      }

      const subtotal = itens.reduce((soma, item) => soma + item.subtotal, 0);
      if (subtotal < encontrado.minimo) {
        return {
          ok: false,
          mensagem: `Este cupom vale a partir de R$ ${encontrado.minimo.toFixed(2).replace('.', ',')}.`,
        };
      }

      despachar({ tipo: 'aplicarCupom', codigo: encontrado.codigo });
      return { ok: true, mensagem: `Cupom ${encontrado.codigo} aplicado: ${encontrado.descricao}.` };
    },
    [itens],
  );

  const quantidadeDe = useCallback(
    (id) => estado.itens.find((item) => item.id === id)?.quantidade ?? 0,
    [estado.itens],
  );

  const resumo = useMemo(() => calcularResumo({ itens, cupom }), [itens, cupom]);

  const valor = useMemo(
    () => ({
      itens,
      cupom,
      resumo,
      quantidadeTotal,
      vazio: itens.length === 0,
      adicionar,
      definirQuantidade,
      remover,
      limpar,
      aplicarCupom,
      removerCupom,
      quantidadeDe,
    }),
    [
      itens,
      cupom,
      resumo,
      quantidadeTotal,
      adicionar,
      definirQuantidade,
      remover,
      limpar,
      aplicarCupom,
      removerCupom,
      quantidadeDe,
    ],
  );

  return <CarrinhoContexto value={valor}>{children}</CarrinhoContexto>;
}
