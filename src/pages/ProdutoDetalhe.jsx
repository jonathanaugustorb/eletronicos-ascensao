import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Contador } from '../components/ui/Contador.jsx';
import { Estrelas } from '../components/ui/Estrelas.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { Selo } from '../components/ui/Selo.jsx';
import { GradeProdutos } from '../components/produtos/GradeProdutos.jsx';
import { ImagemProduto } from '../components/produtos/ImagemProduto.jsx';
import { NaoEncontrada } from './NaoEncontrada.jsx';
import { useCarrinho } from '../hooks/useCarrinho.js';
import {
  buscarProduto,
  calcularDesconto,
  nomeCategoria,
  produtosRelacionados,
} from '../data/produtos.js';
import { formatarMoeda, formatarNumero, valorParcela } from '../utils/formato.js';
import { FORMAS_PAGAMENTO, FRETE_GRATIS_ACIMA } from '../utils/pedido.js';

const PARCELAS_VITRINE = 12;
const ANO_LANCAMENTO_RECENTE = 2025;
const ESTOQUE_BAIXO = 5;

const DESCONTO_PIX = FORMAS_PAGAMENTO.find((forma) => forma.id === 'pix')?.desconto ?? 0;

/** Garantias e prazos mostrados ao lado do preço. */
const VANTAGENS = [
  { icone: 'caminhao', titulo: 'Frete grátis', texto: `em compras acima de ${formatarMoeda(FRETE_GRATIS_ACIMA)}` },
  { icone: 'escudo', titulo: '15 meses de garantia', texto: '12 de fábrica mais 3 da loja' },
  { icone: 'troca', titulo: '30 dias para trocar', texto: 'logística reversa por nossa conta' },
];

/** Linha "rótulo / valor" da ficha técnica. */
function LinhaFicha({ rotulo, children }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-borda py-3 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-widest text-tenue">{rotulo}</dt>
      <dd className="text-sm text-claro">{children}</dd>
    </div>
  );
}

export function ProdutoDetalhe() {
  const { id } = useParams();
  const produto = buscarProduto(id);

  const { adicionar, quantidadeDe } = useCarrinho();
  const navegar = useNavigate();

  const [quantidade, setQuantidade] = useState(1);
  const [confirmado, setConfirmado] = useState(false);
  const cronometro = useRef(null);

  // Trocar de produto sem sair da rota precisa zerar o seletor e o aviso.
  useEffect(() => {
    setQuantidade(1);
    setConfirmado(false);
  }, [id]);

  useEffect(() => () => clearTimeout(cronometro.current), []);

  // Produto inexistente na URL cai na mesma página de 404 do resto do site.
  if (!produto) return <NaoEncontrada />;

  const desconto = calcularDesconto(produto);
  const esgotado = produto.estoque === 0;
  const noCarrinho = quantidadeDe(produto.id);
  const precoPix = produto.preco * (1 - DESCONTO_PIX);
  const relacionados = produtosRelacionados(produto);

  const aoAdicionar = () => {
    adicionar(produto.id, quantidade);
    setConfirmado(true);
    clearTimeout(cronometro.current);
    cronometro.current = setTimeout(() => setConfirmado(false), 2000);
  };

  const aoComprarAgora = () => {
    adicionar(produto.id, quantidade);
    navegar('/carrinho');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Trilha de navegação" className="mb-6 text-xs text-tenue">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="transition-colors hover:text-neutro">
              Início
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/produtos" className="transition-colors hover:text-neutro">
              Produtos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              to={`/produtos?cat=${produto.categoria}`}
              className="transition-colors hover:text-neutro"
            >
              {nomeCategoria(produto.categoria)}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-neutro">{produto.nome}</li>
        </ol>
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        {/* ----------------------------- Imagem ----------------------------- */}
        <div className="lg:sticky lg:top-24">
          <div className="painel-vidro relative overflow-hidden rounded-3xl">
            <div className="relative aspect-square overflow-hidden">
              <ImagemProduto
                produto={produto}
                largura={900}
                altura={900}
                carregamento="eager"
                className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${
                  esgotado ? 'grayscale-[0.7] opacity-60' : ''
                }`}
              />

              <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
                {desconto > 0 && !esgotado ? (
                  <Selo tom="roxo" sobreImagem>
                    -{desconto}% OFF
                  </Selo>
                ) : null}
                {produto.lancamento >= ANO_LANCAMENTO_RECENTE && !esgotado ? (
                  <Selo tom="turquesa" sobreImagem>
                    Lançamento
                  </Selo>
                ) : null}
                {esgotado ? (
                  <Selo tom="neutro" sobreImagem>
                    Esgotado
                  </Selo>
                ) : null}
              </div>
            </div>
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {VANTAGENS.map((vantagem) => (
              <li
                key={vantagem.titulo}
                className="rounded-xl border border-borda bg-breu/70 p-3.5 text-center"
              >
                <Icone
                  nome={vantagem.icone}
                  tamanho={19}
                  className="mx-auto mb-2 text-turquesa-400"
                />
                <p className="text-xs font-semibold text-claro">{vantagem.titulo}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-tenue">{vantagem.texto}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* --------------------------- Informações -------------------------- */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/produtos?cat=${produto.categoria}`}
              className="text-[11px] font-bold uppercase tracking-widest text-purpura-300 transition-colors hover:text-purpura-200"
            >
              {nomeCategoria(produto.categoria)}
            </Link>
            <span aria-hidden="true" className="text-tenue">
              &middot;
            </span>
            <Link
              to={`/produtos?marca=${encodeURIComponent(produto.marca)}`}
              className="text-[11px] font-medium text-tenue transition-colors hover:text-neutro"
            >
              {produto.marca}
            </Link>
          </div>

          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-claro sm:text-4xl">
            {produto.nome}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Estrelas nota={produto.nota} avaliacoes={produto.avaliacoes} tamanho={16} />
            <span className="text-xs text-tenue">
              {formatarNumero(produto.avaliacoes)} avaliações verificadas
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-neutro">{produto.resumo}</p>

          {/* Preço */}
          <div className="mt-7 rounded-2xl border border-borda bg-breu/70 p-5">
            {produto.precoAntigo ? (
              <p className="numerico flex items-center gap-2 text-sm text-tenue">
                <span className="line-through">{formatarMoeda(produto.precoAntigo)}</span>
                <Selo tom="sucesso">
                  economize {formatarMoeda(produto.precoAntigo - produto.preco)}
                </Selo>
              </p>
            ) : null}

            <p className="numerico mt-1 text-4xl font-bold tracking-tight text-claro">
              {formatarMoeda(produto.preco)}
            </p>

            <p className="numerico mt-1.5 text-sm text-neutro">
              em até {PARCELAS_VITRINE}x de{' '}
              <strong className="font-semibold text-claro">
                {formatarMoeda(valorParcela(produto.preco, PARCELAS_VITRINE))}
              </strong>{' '}
              sem juros
            </p>

            <p className="numerico mt-2.5 inline-flex items-center gap-2 rounded-lg bg-turquesa-500/10 px-3 py-2 text-sm">
              <Icone nome="relampago" tamanho={14} className="shrink-0 text-turquesa-300" />
              <span className="text-neutro">
                <strong className="font-bold text-turquesa-300">{formatarMoeda(precoPix)}</strong> no
                Pix ({DESCONTO_PIX * 100}% de desconto)
              </span>
            </p>
          </div>

          {/* Estoque */}
          <p className="mt-5 flex items-center gap-2 text-sm">
            {esgotado ? (
              <>
                <Icone nome="cadeado" tamanho={15} className="text-tenue" />
                <span className="text-tenue">Produto indisponível no momento</span>
              </>
            ) : produto.estoque <= ESTOQUE_BAIXO ? (
              <>
                <Icone nome="relampago" tamanho={15} className="text-alerta" />
                <span className="font-semibold text-alerta">
                  Últimas {produto.estoque} unidades em estoque
                </span>
              </>
            ) : (
              <>
                <Icone nome="check" tamanho={15} className="text-sucesso" />
                <span className="text-sucesso">
                  Em estoque &middot;{' '}
                  <span className="numerico">{produto.estoque} unidades disponíveis</span>
                </span>
              </>
            )}
          </p>

          {/* Compra */}
          {!esgotado ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Contador
                valor={quantidade}
                minimo={1}
                maximo={produto.estoque}
                rotulo={produto.nome}
                aoMudar={setQuantidade}
              />

              <Botao
                onClick={aoAdicionar}
                variacao="contorno"
                tamanho="grande"
                className={confirmado ? 'border-sucesso/60 text-sucesso' : ''}
              >
                <Icone nome={confirmado ? 'check' : 'carrinho'} tamanho={17} />
                {confirmado ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho'}
              </Botao>

              <Botao onClick={aoComprarAgora} tamanho="grande">
                Comprar agora
                <Icone nome="setaDireita" tamanho={17} />
              </Botao>
            </div>
          ) : (
            <div className="mt-5">
              <Botao variacao="contorno" tamanho="grande" disabled>
                <Icone nome="cadeado" tamanho={17} />
                Indisponível
              </Botao>
            </div>
          )}

          {noCarrinho > 0 ? (
            <p className="numerico mt-3 flex items-center gap-2 text-xs text-neutro">
              <Icone nome="carrinho" tamanho={13} className="text-turquesa-400" />
              {noCarrinho} {noCarrinho === 1 ? 'unidade já está' : 'unidades já estão'} no seu
              carrinho.{' '}
              <Link
                to="/carrinho"
                className="font-semibold text-turquesa-300 underline-offset-4 hover:underline"
              >
                Ver carrinho
              </Link>
            </p>
          ) : null}

          {/* Ficha técnica */}
          <section className="mt-9">
            <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-claro">
              Ficha técnica
            </h2>
            <dl>
              {produto.destaques.map((item, indice) => (
                <LinhaFicha key={item} rotulo={`Destaque ${indice + 1}`}>
                  {item}
                </LinhaFicha>
              ))}
              <LinhaFicha rotulo="Marca">{produto.marca}</LinhaFicha>
              <LinhaFicha rotulo="Categoria">{nomeCategoria(produto.categoria)}</LinhaFicha>
              <LinhaFicha rotulo="Ano de lançamento">
                <span className="numerico">{produto.lancamento}</span>
              </LinhaFicha>
              <LinhaFicha rotulo="Código">
                <span className="numerico text-tenue">{produto.id}</span>
              </LinhaFicha>
            </dl>
          </section>

          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-tenue">
            <Icone nome="alvo" tamanho={14} className="mt-0.5 shrink-0 text-purpura-300" />
            Projeto acadêmico: marca, preço e especificações deste produto são fictícios.
          </p>
        </div>
      </div>

      {/* --------------------------- Relacionados -------------------------- */}
      {relacionados.length > 0 ? (
        <section className="pt-20">
          <header className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-turquesa-400">
              Quem viu este, viu também
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
              Produtos relacionados
            </h2>
          </header>

          <GradeProdutos produtos={relacionados} prioridadeAte={0} />
        </section>
      ) : null}
    </div>
  );
}
