import { Link } from 'react-router-dom';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-200 ' +
  'disabled:cursor-not-allowed disabled:opacity-45 disabled:saturate-50 ' +
  'active:translate-y-px select-none whitespace-nowrap';

const VARIACOES = {
  primario:
    'bg-linear-to-r from-turquesa-400 to-turquesa-500 text-abissal shadow-[0_8px_30px_-10px_var(--color-turquesa-500)] ' +
    'hover:from-turquesa-300 hover:to-turquesa-400 hover:shadow-[0_10px_34px_-8px_var(--color-turquesa-400)]',
  roxo:
    'bg-linear-to-r from-purpura-400 to-purpura-500 text-white shadow-[0_8px_30px_-10px_var(--color-purpura-500)] ' +
    'hover:from-purpura-300 hover:to-purpura-400',
  contorno:
    'border border-borda-forte bg-grafite/60 text-claro hover:border-turquesa-400 hover:text-turquesa-300 hover:bg-grafite',
  fantasma: 'text-neutro hover:text-claro hover:bg-fumaca/70',
  perigo: 'border border-erro/40 text-erro hover:bg-erro/10 hover:border-erro/70',
};

const TAMANHOS = {
  pequeno: 'h-9 px-4 text-sm',
  medio: 'h-11 px-6 text-sm',
  grande: 'h-13 px-8 text-base',
  icone: 'h-10 w-10',
};

/**
 * Botão da loja. Renderiza um `<button>`, um `<Link>` do router (prop `para`)
 * ou uma âncora comum (prop `href`), mantendo a mesma aparência.
 *
 * @param {object} props
 * @param {'primario'|'roxo'|'contorno'|'fantasma'|'perigo'} [props.variacao]
 * @param {'pequeno'|'medio'|'grande'|'icone'} [props.tamanho]
 * @param {string} [props.para] destino interno; usa o Link do react-router
 * @param {string} [props.href] destino externo
 * @param {boolean} [props.blocoCompleto] ocupa toda a largura disponível
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function Botao({
  variacao = 'primario',
  tamanho = 'medio',
  para,
  href,
  blocoCompleto = false,
  className = '',
  children,
  ...resto
}) {
  const classes = [
    BASE,
    VARIACOES[variacao] ?? VARIACOES.primario,
    TAMANHOS[tamanho] ?? TAMANHOS.medio,
    blocoCompleto ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (para) {
    return (
      <Link to={para} className={classes} {...resto}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer" {...resto}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...resto}>
      {children}
    </button>
  );
}
