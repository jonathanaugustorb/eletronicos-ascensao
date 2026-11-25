import { CardProduto } from './CardProduto.jsx';

/**
 * Grade responsiva de cards.
 *
 * @param {object} props
 * @param {import('../../data/produtos.js').Produto[]} props.produtos
 * @param {number} [props.prioridadeAte] quantos cards carregam a foto de imediato
 * @param {string} [props.className]
 */
export function GradeProdutos({ produtos, prioridadeAte = 4, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
    >
      {produtos.map((produto, indice) => (
        <CardProduto key={produto.id} produto={produto} prioridade={indice < prioridadeAte} />
      ))}
    </div>
  );
}
