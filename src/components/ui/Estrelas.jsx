import { formatarNota, formatarNumero } from '../../utils/formato.js';

/**
 * Nota em estrelas, preenchidas proporcionalmente (4,3 preenche 86%).
 *
 * O preenchimento é feito com uma segunda camada recortada por `width`, o que
 * mantém o componente puramente visual e sem dependências.
 *
 * @param {object} props
 * @param {number} props.nota de 0 a 5
 * @param {number} [props.avaliacoes] quando informado, exibe a contagem ao lado
 * @param {number} [props.tamanho] lado de cada estrela em pixels
 * @param {boolean} [props.mostrarNumero]
 * @param {string} [props.className]
 */
export function Estrelas({
  nota,
  avaliacoes,
  tamanho = 14,
  mostrarNumero = true,
  className = '',
}) {
  const percentual = `${Math.max(0, Math.min(nota / 5, 1)) * 100}%`;
  const largura = tamanho * 5 + 4 * 2; // 5 estrelas + os vãos de 2px

  const estrelas = (preenchida) =>
    Array.from({ length: 5 }, (_, indice) => (
      <svg
        key={indice}
        width={tamanho}
        height={tamanho}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="m12 3.1 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.13l-5.5 2.89 1.05-6.12L3.1 9.57l6.15-.9z"
          fill={preenchida ? 'var(--color-alerta)' : 'var(--color-fumaca)'}
          stroke={preenchida ? 'none' : 'var(--color-borda-forte)'}
          strokeWidth="1"
        />
      </svg>
    ));

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="relative inline-flex shrink-0"
        style={{ width: largura }}
        role="img"
        aria-label={`Nota ${formatarNota(nota)} de 5`}
      >
        <span className="flex gap-0.5">{estrelas(false)}</span>
        <span
          className="pointer-events-none absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden"
          style={{ width: percentual }}
        >
          {estrelas(true)}
        </span>
      </span>

      {mostrarNumero ? (
        <span className="numerico text-xs font-semibold text-neutro">
          {formatarNota(nota)}
          {typeof avaliacoes === 'number' ? (
            <span className="font-normal text-tenue"> ({formatarNumero(avaliacoes)})</span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
