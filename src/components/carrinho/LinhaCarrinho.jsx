import { Link } from 'react-router-dom';
import { ImagemProduto } from '../produtos/ImagemProduto.jsx';
import { Contador } from '../ui/Contador.jsx';
import { Icone } from '../ui/Icone.jsx';
import { Selo } from '../ui/Selo.jsx';
import { useCarrinho } from '../../hooks/useCarrinho.js';
import { caminhoProduto, calcularDesconto, nomeCategoria } from '../../data/produtos.js';
import { formatarMoeda } from '../../utils/formato.js';

/**
 * Uma linha do carrinho: foto, dados, quantidade e subtotal.
 *
 * @param {object} props
 * @param {{produto: import('../../data/produtos.js').Produto, quantidade: number, subtotal: number}} props.item
 * @param {boolean} [props.somenteLeitura] usado no resumo do fechamento do pedido
 */
export function LinhaCarrinho({ item, somenteLeitura = false }) {
  const { definirQuantidade, remover } = useCarrinho();
  const { produto, quantidade, subtotal } = item;

  const desconto = calcularDesconto(produto);
  const noLimite = quantidade >= produto.estoque;

  return (
    <article className="flex gap-4 py-5">
      <Link
        to={caminhoProduto(produto.id)}
        tabIndex={-1}
        aria-hidden="true"
        className="size-20 shrink-0 overflow-hidden rounded-xl border border-borda sm:size-24"
      >
        <ImagemProduto
          produto={produto}
          largura={200}
          altura={200}
          className="size-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-purpura-300">
            {nomeCategoria(produto.categoria)}
          </p>

          <h3 className="mt-0.5 truncate text-sm font-semibold text-claro">
            <Link
              to={caminhoProduto(produto.id)}
              className="transition-colors hover:text-turquesa-300"
            >
              {produto.nome}
            </Link>
          </h3>

          <p className="numerico mt-1 text-xs text-tenue">
            {formatarMoeda(produto.preco)} a unidade
            {desconto > 0 ? (
              <span className="ml-2 font-semibold text-sucesso">-{desconto}%</span>
            ) : null}
          </p>

          {somenteLeitura ? (
            <p className="numerico mt-1.5 text-xs font-medium text-neutro">
              Quantidade: {quantidade}
            </p>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <Contador
                valor={quantidade}
                minimo={1}
                maximo={produto.estoque}
                rotulo={produto.nome}
                tamanho="pequeno"
                aoMudar={(novo) => definirQuantidade(produto.id, novo)}
              />

              <button
                type="button"
                onClick={() => remover(produto.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium
                           text-tenue transition-colors hover:bg-erro/10 hover:text-erro"
              >
                <Icone nome="lixeira" tamanho={14} />
                Remover
              </button>
            </div>
          )}

          {noLimite && !somenteLeitura ? (
            <p className="mt-2 text-[11px] text-alerta">
              Você já tem todo o estoque disponível deste item.
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <p className="numerico text-base font-bold text-claro">{formatarMoeda(subtotal)}</p>
          {quantidade > 1 ? (
            <p className="numerico mt-0.5 text-[11px] text-tenue">{quantidade} itens</p>
          ) : null}
          {produto.precoAntigo ? (
            <Selo tom="sucesso" className="mt-2">
              Economia {formatarMoeda((produto.precoAntigo - produto.preco) * quantidade)}
            </Selo>
          ) : null}
        </div>
      </div>
    </article>
  );
}
