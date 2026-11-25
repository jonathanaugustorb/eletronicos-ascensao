/** Fundo translúcido, para uso sobre as superfícies escuras da loja. */
const TONS = {
  turquesa: 'bg-turquesa-500/15 text-turquesa-300 border-turquesa-500/30',
  roxo: 'bg-purpura-500/15 text-purpura-300 border-purpura-500/35',
  sucesso: 'bg-sucesso/15 text-sucesso border-sucesso/30',
  alerta: 'bg-alerta/15 text-alerta border-alerta/30',
  erro: 'bg-erro/15 text-erro border-erro/30',
  neutro: 'bg-fumaca text-neutro border-borda',
};

/**
 * Fundo opaco, para uso sobre fotos.
 *
 * O tom translúcido some quando a foto atrás é clara — estes mantêm o texto
 * legível seja qual for a imagem do produto.
 */
const TONS_SOLIDOS = {
  turquesa: 'bg-abissal/90 text-turquesa-300 border-turquesa-500/50',
  roxo: 'bg-abissal/90 text-purpura-300 border-purpura-500/50',
  sucesso: 'bg-abissal/90 text-sucesso border-sucesso/50',
  alerta: 'bg-abissal/90 text-alerta border-alerta/50',
  erro: 'bg-abissal/90 text-erro border-erro/50',
  neutro: 'bg-abissal/90 text-neutro border-borda-forte',
};

/**
 * Etiqueta curta usada em cards, filtros e no resumo do pedido.
 *
 * @param {object} props
 * @param {keyof typeof TONS} [props.tom]
 * @param {boolean} [props.sobreImagem] usa fundo opaco, para ficar legível
 *   sobre fotos claras
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function Selo({ tom = 'neutro', sobreImagem = false, className = '', children, ...resto }) {
  const paleta = sobreImagem ? TONS_SOLIDOS : TONS;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
        paleta[tom] ?? paleta.neutro
      } ${sobreImagem ? 'backdrop-blur-sm' : ''} ${className}`}
      {...resto}
    >
      {children}
    </span>
  );
}
