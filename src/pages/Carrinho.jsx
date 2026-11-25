import { Link } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { EstadoVazio } from '../components/ui/EstadoVazio.jsx';
import { LinhaCarrinho } from '../components/carrinho/LinhaCarrinho.jsx';
import { CampoCupom } from '../components/carrinho/CampoCupom.jsx';
import { ResumoPedido } from '../components/carrinho/ResumoPedido.jsx';
import { GradeProdutos } from '../components/produtos/GradeProdutos.jsx';
import { useCarrinho } from '../hooks/useCarrinho.js';
import { PRODUTOS } from '../data/produtos.js';

/**
 * Sugere quatro produtos bem avaliados que ainda não estão no carrinho.
 * @param {string[]} idsNoCarrinho
 */
function sugerirProdutos(idsNoCarrinho) {
  return PRODUTOS.filter((produto) => produto.estoque > 0 && !idsNoCarrinho.includes(produto.id))
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 4);
}

export function Carrinho() {
  const { itens, vazio, resumo, quantidadeTotal, limpar } = useCarrinho();

  if (vazio) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-tight text-claro sm:text-4xl">
          Seu carrinho
        </h1>

        <EstadoVazio
          icone="carrinho"
          titulo="Seu carrinho está vazio"
          texto="Explore o catálogo e adicione os produtos que quiser. O que você escolher fica guardado mesmo se você fechar a página."
        >
          <Botao para="/produtos" tamanho="grande">
            Ver catálogo
            <Icone nome="setaDireita" tamanho={17} />
          </Botao>
          <Botao para="/produtos?promo=1&ordem=desconto" variacao="contorno" tamanho="grande">
            Ir para as ofertas
          </Botao>
        </EstadoVazio>
      </div>
    );
  }

  const sugestoes = sugerirProdutos(itens.map((item) => item.produto.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-tenue">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="transition-colors hover:text-neutro">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-neutro">Carrinho</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-claro sm:text-4xl">Seu carrinho</h1>
        <p className="numerico mt-2 text-sm text-neutro">
          {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'} em {itens.length}{' '}
          {itens.length === 1 ? 'produto' : 'produtos'}
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        {/* --------------------------- Itens --------------------------- */}
        <section aria-label="Itens do carrinho" className="rounded-2xl border border-borda bg-breu/70 px-5">
          <ul className="divide-y divide-[var(--color-borda)]">
            {itens.map((item) => (
              <li key={item.produto.id}>
                <LinhaCarrinho item={item} />
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borda py-4">
            <Link
              to="/produtos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutro transition-colors hover:text-turquesa-300"
            >
              <Icone nome="setaEsquerda" tamanho={16} />
              Continuar comprando
            </Link>

            <button
              type="button"
              onClick={limpar}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium
                         text-tenue transition-colors hover:bg-erro/10 hover:text-erro"
            >
              <Icone nome="lixeira" tamanho={14} />
              Esvaziar carrinho
            </button>
          </div>
        </section>

        {/* -------------------------- Resumo --------------------------- */}
        <aside className="lg:sticky lg:top-24">
          <div className="space-y-4">
            <div className="rounded-2xl border border-borda bg-breu/70 p-5">
              <CampoCupom />
              <p className="mt-3 text-[11px] leading-relaxed text-tenue">
                Cupons de teste: <code className="text-purpura-300">ASCENSAO10</code>,{' '}
                <code className="text-purpura-300">BEMVINDO5</code> e{' '}
                <code className="text-purpura-300">FRETEGRATIS</code>.
              </p>
            </div>

            <ResumoPedido resumo={resumo} quantidadeTotal={quantidadeTotal}>
              <Botao para="/finalizar-pedido" blocoCompleto tamanho="grande">
                Finalizar pedido
                <Icone nome="setaDireita" tamanho={17} />
              </Botao>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-tenue">
                <Icone nome="cadeado" tamanho={12} />
                Ambiente simulado — nenhum pagamento é cobrado
              </p>
            </ResumoPedido>
          </div>
        </aside>
      </div>

      {/* ------------------------- Sugestões -------------------------- */}
      {sugestoes.length > 0 ? (
        <section className="pt-16">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-claro sm:text-2xl">
            Quem levou esses itens também viu
          </h2>
          <GradeProdutos produtos={sugestoes} prioridadeAte={0} />
        </section>
      ) : null}
    </div>
  );
}
