/**
 * Conjunto de ícones em SVG desenhados para o projeto.
 *
 * Manter os traçados aqui evita uma biblioteca inteira de ícones no bundle e
 * garante que todos compartilhem a mesma espessura de linha e o mesmo encaixe
 * na grade de 24 px.
 */

const TRACADOS = {
  busca: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4.5 4.5" /></>,
  carrinho: (
    <>
      <path d="M3 4h2.2l2.4 11.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 8H6.1" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </>
  ),
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  fechar: <><path d="m6 6 12 12M18 6 6 18" /></>,
  setaDireita: <><path d="M5 12h13m-5-6 6 6-6 6" /></>,
  setaEsquerda: <><path d="M19 12H6m5 6-6-6 6-6" /></>,
  setaBaixo: <><path d="m6 9 6 6 6-6" /></>,
  filtro: <><path d="M3 6h18M7 12h10M10 18h4" /></>,
  estrela: (
    <path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.7l5.8-.8z" />
  ),
  mais: <><path d="M12 5v14M5 12h14" /></>,
  menos: <><path d="M5 12h14" /></>,
  lixeira: <><path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4L17.5 7" /></>,
  check: <><path d="m4.5 12.5 4.8 4.8L19.5 7" /></>,
  caminhao: (
    <>
      <path d="M2 6.5h11v9H2zM13 9.5h4l3 3.2v2.8h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  escudo: <><path d="M12 3.2 20 6v5.6c0 4.9-3.3 8.1-8 9.2-4.7-1.1-8-4.3-8-9.2V6z" /><path d="m8.8 12 2.3 2.3 4.1-4.4" /></>,
  cartao: <><path d="M2.5 6h19v12h-19z" /><path d="M2.5 10h19M6 14.5h3.5" /></>,
  troca: <><path d="M4 8h12.5l-3-3M20 16H7.5l3 3" /></>,
  alvo: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" /></>,
  coracao: (
    <path d="M12 20.3C6.2 16.6 3.5 13.6 3.5 10.1A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8.5 2.5c0 3.5-2.7 6.5-8.5 10.2Z" />
  ),
  folha: <><path d="M20 4C9 4 4 8.6 4 14.5A5.5 5.5 0 0 0 9.5 20C15.4 20 20 15 20 4Z" /><path d="M16 8 7 17" /></>,
  raio: <><path d="M13.5 2.5 5 13.5h5.5L10 21.5 19 10.5h-5.5z" /></>,
  cadeado: <><path d="M5.5 10.5h13v10h-13z" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" /></>,
  celular: <><path d="M7 2.5h10v19H7z" /><path d="M10.5 18.5h3" /></>,
  notebook: <><path d="M4.5 5.5h15v10h-15z" /><path d="M2 18.5h20" /></>,
  fone: <><path d="M4 14.5v-2.2a8 8 0 0 1 16 0v2.2" /><path d="M4 13.5h2.8v6H5.5A1.5 1.5 0 0 1 4 18zM20 13.5h-2.8v6h1.3a1.5 1.5 0 0 0 1.5-1.5z" /></>,
  teclado: <><path d="M2.5 6.5h19v11h-19z" /><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M8 14h8" /></>,
  monitor: <><path d="M3 4.5h18v12H3z" /><path d="M9 20.5h6M12 16.5v4" /></>,
  controle: (
    <>
      <path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.7 3.4A2.6 2.6 0 0 1 15.8 18l-1.4-1.6H9.6L8.2 18a2.6 2.6 0 0 1-4.4-1.2l-.7-3.4A4.5 4.5 0 0 1 7.5 8Z" />
      <path d="M7 12.5h2.4M8.2 11.3v2.4M15.5 12h.01M17.5 13.8h.01" />
    </>
  ),
  relogio: <><rect x="7" y="6" width="10" height="12" rx="3" /><path d="M9 6V3.5h6V6M9 18v2.5h6V18M12 10v2.5l1.6 1" /></>,
  camera: <><path d="M3 7.5h4l1.5-2.5h7L17 7.5h4v12H3z" /><circle cx="12" cy="13" r="3.8" /></>,
  usuario: <><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20.5c1-4 3.9-6 7.5-6s6.5 2 7.5 6" /></>,
  local: <><path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10.2" r="2.6" /></>,
  email: <><path d="M3 5.5h18v13H3z" /><path d="m3 7 9 6 9-6" /></>,
  telefone: (
    <path d="M7.4 3.5 9.6 8l-2 1.8a12 12 0 0 0 6.6 6.6l1.8-2 4.5 2.2v3a2 2 0 0 1-2.2 2C10.9 20.8 3.2 13.1 2.5 4.7a2 2 0 0 1 2-2.2z" />
  ),
  caixa: <><path d="m12 2.8 8.5 4.4v9.6L12 21.2 3.5 16.8V7.2z" /><path d="M3.5 7.2 12 11.6l8.5-4.4M12 11.6v9.6" /></>,
  etiqueta: <><path d="M3.5 3.5h7.6l9.4 9.4-7.6 7.6-9.4-9.4z" /><circle cx="7.8" cy="7.8" r="1.3" /></>,
  relampago: <><path d="M13.5 2.5 5 13.5h5.5L10 21.5 19 10.5h-5.5z" /></>,
  grafico: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  presente: <><path d="M3.5 9.5h17v4h-17zM5 13.5h14v7H5z" /><path d="M12 9.5v11M12 9.5c-3.5 0-5-1-5-2.6S8.5 4 12 9.5Zm0 0c3.5 0 5-1 5-2.6S15.5 4 12 9.5Z" /></>,
};

/**
 * @param {object} props
 * @param {keyof typeof TRACADOS} props.nome
 * @param {number} [props.tamanho] lado do ícone em pixels
 * @param {string} [props.className]
 * @param {string} [props.titulo] descreve o ícone para leitores de tela;
 *   sem ele o ícone é tratado como decorativo
 * @param {number} [props.espessura]
 */
export function Icone({ nome, tamanho = 20, className = '', titulo, espessura = 1.6, ...resto }) {
  const tracado = TRACADOS[nome];
  if (!tracado) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth={espessura}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : 'true'}
      focusable="false"
      {...resto}
    >
      {titulo ? <title>{titulo}</title> : null}
      {tracado}
    </svg>
  );
}
