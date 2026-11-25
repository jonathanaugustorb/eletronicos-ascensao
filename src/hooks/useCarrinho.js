import { useContext } from 'react';
import { CarrinhoContexto } from '../context/CarrinhoContexto.js';

/**
 * Acessa o carrinho. Lança um erro claro se for usado fora do provider.
 * @returns {{
 *   itens: Array<{produto: import('../data/produtos.js').Produto, quantidade: number, subtotal: number}>,
 *   cupom: object|null,
 *   resumo: import('../utils/pedido.js').ResumoPedido,
 *   quantidadeTotal: number,
 *   vazio: boolean,
 *   adicionar: (id: string, quantidade?: number) => void,
 *   definirQuantidade: (id: string, quantidade: number) => void,
 *   remover: (id: string) => void,
 *   limpar: () => void,
 *   aplicarCupom: (codigo: string) => {ok: boolean, mensagem: string},
 *   removerCupom: () => void,
 *   quantidadeDe: (id: string) => number,
 * }}
 */
export function useCarrinho() {
  const contexto = useContext(CarrinhoContexto);

  if (!contexto) {
    throw new Error('useCarrinho precisa ser usado dentro de <CarrinhoProvider>.');
  }

  return contexto;
}
