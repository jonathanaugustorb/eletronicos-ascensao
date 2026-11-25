import { Link } from 'react-router-dom';
import { EMPRESA } from '../../data/empresa.js';

/**
 * Marca da loja: símbolo em degradê mais o nome.
 *
 * @param {object} props
 * @param {boolean} [props.compacta] esconde o nome, deixando só o símbolo
 */
export function Logo({ compacta = false }) {
  return (
    <Link
      to="/"
      className="group inline-flex shrink-0 items-center gap-2.5"
      aria-label={`${EMPRESA.nome} — página inicial`}
    >
      <span className="relative grid size-9 place-items-center">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-xl bg-linear-to-br from-turquesa-400 to-purpura-500 opacity-80
                     blur-[10px] transition-opacity duration-300 group-hover:opacity-100"
        />
        <svg viewBox="0 0 32 32" className="relative size-9" aria-hidden="true">
          <defs>
            <linearGradient id="logo-degrade" x1="0" y1="32" x2="32" y2="0">
              <stop offset="0" stopColor="var(--color-purpura-500)" />
              <stop offset="1" stopColor="var(--color-turquesa-400)" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="9" fill="var(--color-abissal)" />
          <rect
            x="0.6"
            y="0.6"
            width="30.8"
            height="30.8"
            rx="8.4"
            fill="none"
            stroke="url(#logo-degrade)"
            strokeWidth="1.2"
          />
          <path d="M16 6.5 24.5 25 16 20.3 7.5 25Z" fill="url(#logo-degrade)" />
        </svg>
      </span>

      {!compacta ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold tracking-tight text-claro">
            Eletronicos<span className="texto-degrade">Ascensão</span>
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-tenue">
            {EMPRESA.slogan}
          </span>
        </span>
      ) : null}
    </Link>
  );
}
