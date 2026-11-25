import { createContext } from 'react';

/**
 * Contexto do carrinho.
 *
 * Fica em um arquivo próprio (sem componente junto) para que o Fast Refresh
 * do Vite continue funcionando no provider e no hook.
 *
 * @type {import('react').Context<null|object>}
 */
export const CarrinhoContexto = createContext(null);
