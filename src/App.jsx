import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Produtos } from './pages/Produtos.jsx';
import { ProdutoDetalhe } from './pages/ProdutoDetalhe.jsx';
import { Carrinho } from './pages/Carrinho.jsx';
import { FinalizarPedido } from './pages/FinalizarPedido.jsx';
import { PedidoConfirmado } from './pages/PedidoConfirmado.jsx';
import { QuemSomos } from './pages/QuemSomos.jsx';
import { NaoEncontrada } from './pages/NaoEncontrada.jsx';

/** Mapa de rotas da loja. */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="produtos/:id" element={<ProdutoDetalhe />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="finalizar-pedido" element={<FinalizarPedido />} />
        <Route path="pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="quem-somos" element={<QuemSomos />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}
