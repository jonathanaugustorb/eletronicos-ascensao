import { Outlet } from 'react-router-dom';
import { Cabecalho } from './Cabecalho.jsx';
import { Rodape } from './Rodape.jsx';
import { FundoLiquido } from './FundoLiquido.jsx';
import { RolarParaTopo } from './RolarParaTopo.jsx';

/** Moldura comum a todas as páginas. */
export function Layout() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <FundoLiquido />
      <RolarParaTopo />

      <a
        href="#conteudo"
        className="apenas-leitor focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
                   focus:h-auto focus:w-auto focus:rounded-full focus:bg-turquesa-400 focus:px-5 focus:py-2.5
                   focus:text-sm focus:font-bold focus:text-abissal focus:[clip-path:none]"
      >
        Pular para o conteúdo
      </a>

      <Cabecalho />

      <main id="conteudo" className="relative flex-1">
        <Outlet />
      </main>

      <Rodape />
    </div>
  );
}
