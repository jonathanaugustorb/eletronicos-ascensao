import { useEffect, useState } from 'react';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { CampoBusca } from '../ui/CampoBusca.jsx';
import { Icone } from '../ui/Icone.jsx';
import { useCarrinho } from '../../hooks/useCarrinho.js';
import { CATEGORIAS } from '../../data/produtos.js';
import { FRETE_GRATIS_ACIMA } from '../../utils/pedido.js';
import { formatarMoeda } from '../../utils/formato.js';

const LINKS = [
  { para: '/', rotulo: 'Início' },
  { para: '/produtos', rotulo: 'Produtos' },
  { para: '/quem-somos', rotulo: 'Quem somos' },
];

/** Classe de um link de navegação, conforme esteja ativo ou não. */
function classeLink({ isActive }) {
  return [
    'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-claro' : 'text-neutro hover:text-claro',
    isActive
      ? 'after:absolute after:inset-x-3.5 after:-bottom-px after:h-0.5 after:rounded-full after:bg-linear-to-r after:from-turquesa-400 after:to-purpura-400'
      : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Cabeçalho fixo: marca, navegação, busca e carrinho. */
export function Cabecalho() {
  const { quantidadeTotal } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [params] = useSearchParams();
  const local = useLocation();

  // Fecha o menu móvel sempre que a rota muda.
  useEffect(() => setMenuAberto(false), [local.pathname, local.search]);

  // Trava a rolagem do corpo enquanto o menu móvel está aberto.
  useEffect(() => {
    document.body.style.overflow = menuAberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuAberto]);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const buscaAtual = local.pathname === '/produtos' ? (params.get('busca') ?? '') : '';

  return (
    <>
      {/* Faixa de aviso */}
      <div className="relative z-50 overflow-hidden border-b border-borda bg-linear-to-r from-purpura-600/25 via-abissal to-turquesa-600/25">
        <p className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-xs text-neutro">
          <Icone nome="raio" tamanho={13} className="shrink-0 text-turquesa-400" />
          <span>
            Frete grátis acima de {formatarMoeda(FRETE_GRATIS_ACIMA)} &middot; 10% de desconto no Pix
          </span>
        </p>
      </div>

      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
          rolou
            ? 'border-borda bg-abissal/85 backdrop-blur-xl'
            : 'border-transparent bg-abissal/60 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav aria-label="Principal" className="ml-2 hidden items-center lg:flex">
            {LINKS.map((link) => (
              <NavLink key={link.para} to={link.para} end={link.para === '/'} className={classeLink}>
                {link.rotulo}
              </NavLink>
            ))}
          </nav>

          <CampoBusca
            key={buscaAtual}
            valorInicial={buscaAtual}
            className="mx-auto hidden w-full max-w-md md:block"
          />

          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <NavLink
              to="/carrinho"
              className={({ isActive }) =>
                `relative grid size-10 place-items-center rounded-full border transition-colors ${
                  isActive
                    ? 'border-turquesa-500/60 bg-turquesa-500/12 text-turquesa-300'
                    : 'border-borda bg-grafite/70 text-neutro hover:border-borda-forte hover:text-claro'
                }`
              }
              aria-label={`Carrinho com ${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'}`}
            >
              <Icone nome="carrinho" tamanho={19} />
              {quantidadeTotal > 0 ? (
                <span
                  className="numerico absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full
                             bg-linear-to-r from-turquesa-400 to-purpura-400 px-1 text-[10px] font-bold text-abissal"
                >
                  {quantidadeTotal > 99 ? '99+' : quantidadeTotal}
                </span>
              ) : null}
            </NavLink>

            <button
              type="button"
              onClick={() => setMenuAberto((valor) => !valor)}
              className="grid size-10 place-items-center rounded-full border border-borda bg-grafite/70
                         text-neutro transition-colors hover:text-claro lg:hidden"
              aria-expanded={menuAberto}
              aria-controls="menu-movel"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            >
              <Icone nome={menuAberto ? 'fechar' : 'menu'} tamanho={20} />
            </button>
          </div>
        </div>

        {/* Busca em telas pequenas */}
        <div className="border-t border-borda px-4 py-2.5 md:hidden">
          <CampoBusca key={`movel-${buscaAtual}`} valorInicial={buscaAtual} />
        </div>
      </header>

      {/* Menu móvel */}
      {menuAberto ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-abissal/80 backdrop-blur-sm"
            onClick={() => setMenuAberto(false)}
            aria-label="Fechar menu"
          />

          <nav
            id="menu-movel"
            aria-label="Menu"
            className="animate-deslizar absolute inset-y-0 left-0 w-[min(20rem,85vw)] overflow-y-auto
                       border-r border-borda bg-breu p-5 pt-24"
          >
            <ul className="space-y-1">
              {LINKS.map((link) => (
                <li key={link.para}>
                  <NavLink
                    to={link.para}
                    end={link.para === '/'}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-turquesa-500/12 text-turquesa-300'
                          : 'text-neutro hover:bg-fumaca hover:text-claro'
                      }`
                    }
                  >
                    {link.rotulo}
                  </NavLink>
                </li>
              ))}
            </ul>

            <p className="mt-7 px-4 text-[11px] font-bold uppercase tracking-widest text-tenue">
              Categorias
            </p>
            <ul className="mt-2 space-y-0.5">
              {CATEGORIAS.map((categoria) => (
                <li key={categoria.id}>
                  <NavLink
                    to={`/produtos?cat=${categoria.id}`}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-neutro
                               transition-colors hover:bg-fumaca hover:text-claro"
                  >
                    <Icone nome={categoria.icone} tamanho={17} className="text-purpura-300" />
                    {categoria.nome}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
