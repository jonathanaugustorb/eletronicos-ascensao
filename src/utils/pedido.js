/**
 * Regras de negócio do pedido (frete, cupom e desconto por pagamento).
 *
 * São funções puras: não dependem do React nem do DOM, o que deixa a lógica
 * fácil de ler e de reaproveitar entre o carrinho e o fechamento do pedido.
 */

/** Valor mínimo do subtotal para o frete sair de graça. */
export const FRETE_GRATIS_ACIMA = 499;

/**
 * Opções de entrega oferecidas no fechamento do pedido.
 *
 * `cobreFreteGratis` marca quais modalidades entram na promoção de frete
 * grátis: a expressa continua cobrando, porque é um serviço à parte.
 */
export const OPCOES_ENTREGA = [
  {
    id: 'padrao',
    nome: 'Entrega padrão',
    prazo: '3 a 7 dias úteis',
    valor: 29.9,
    cobreFreteGratis: true,
  },
  {
    id: 'expressa',
    nome: 'Entrega expressa',
    prazo: 'até 48 horas úteis',
    valor: 59.9,
    cobreFreteGratis: false,
  },
  {
    id: 'retirada',
    nome: 'Retirar na loja',
    prazo: '2 horas após o pagamento',
    valor: 0,
    cobreFreteGratis: true,
  },
];

/** Formas de pagamento aceitas. `desconto` é um percentual sobre o subtotal. */
export const FORMAS_PAGAMENTO = [
  { id: 'pix', nome: 'Pix', detalhe: '10% de desconto à vista', desconto: 0.1 },
  { id: 'cartao', nome: 'Cartão de crédito', detalhe: 'até 12x sem juros', desconto: 0 },
  { id: 'boleto', nome: 'Boleto bancário', detalhe: 'compensa em até 3 dias úteis', desconto: 0 },
];

/** Parcelamentos oferecidos no cartão. */
export const PARCELAS_DISPONIVEIS = [1, 2, 3, 4, 6, 10, 12];

/**
 * Cupons simulados aceitos pela loja.
 * - `percentual`: desconto sobre o subtotal
 * - `freteGratis`: zera o frete independentemente do subtotal
 * - `minimo`: subtotal mínimo para o cupom valer
 */
const CUPONS = {
  ASCENSAO10: { percentual: 0.1, freteGratis: false, minimo: 0, descricao: '10% de desconto' },
  BEMVINDO5: { percentual: 0.05, freteGratis: false, minimo: 0, descricao: '5% de desconto' },
  FRETEGRATIS: { percentual: 0, freteGratis: true, minimo: 199, descricao: 'frete grátis' },
};

/**
 * Procura um cupom pelo código digitado, ignorando caixa e espaços.
 * @param {string} codigo
 * @returns {{codigo: string, percentual: number, freteGratis: boolean, minimo: number, descricao: string}|null}
 */
export function encontrarCupom(codigo) {
  const chave = String(codigo ?? '').trim().toUpperCase();
  const cupom = CUPONS[chave];
  return cupom ? { codigo: chave, ...cupom } : null;
}

/**
 * Valor do frete de uma modalidade, já considerando a promoção e o cupom.
 *
 * Exportada porque a tela de entrega precisa etiquetar cada opção antes de o
 * visitante escolher uma.
 *
 * @param {(typeof OPCOES_ENTREGA)[number]} opcao
 * @param {number} subtotal
 * @param {ReturnType<typeof encontrarCupom>} [cupom] cupom já validado
 * @returns {number}
 */
export function calcularFrete(opcao, subtotal, cupom = null) {
  if (subtotal <= 0) return 0; // carrinho vazio não gera frete
  if (opcao.valor === 0) return 0;
  if (!opcao.cobreFreteGratis) return opcao.valor;
  if (subtotal >= FRETE_GRATIS_ACIMA || cupom?.freteGratis) return 0;
  return opcao.valor;
}

/**
 * @typedef {object} ItemDetalhado
 * @property {import('../data/produtos.js').Produto} produto
 * @property {number} quantidade
 * @property {number} subtotal
 */

/**
 * @typedef {object} ResumoPedido
 * @property {number} subtotal
 * @property {number} descontoCupom
 * @property {number} descontoPagamento
 * @property {number} frete
 * @property {number} total
 * @property {number} economia  soma do desconto de vitrine com os descontos aplicados
 * @property {boolean} freteGratuito
 * @property {number} faltaParaFreteGratis
 */

/**
 * Calcula todos os valores de um pedido.
 *
 * A ordem importa: o cupom incide sobre o subtotal, o desconto de pagamento
 * incide sobre o subtotal já descontado, e o frete é somado por último.
 *
 * @param {object} parametros
 * @param {ItemDetalhado[]} parametros.itens
 * @param {ReturnType<typeof encontrarCupom>} [parametros.cupom]
 * @param {string} [parametros.entrega] id de OPCOES_ENTREGA
 * @param {string} [parametros.pagamento] id de FORMAS_PAGAMENTO
 * @returns {ResumoPedido}
 */
export function calcularResumo({ itens, cupom = null, entrega = 'padrao', pagamento = null }) {
  const subtotal = itens.reduce((soma, item) => soma + item.subtotal, 0);

  const cupomValido = cupom && subtotal >= cupom.minimo ? cupom : null;
  const descontoCupom = cupomValido ? subtotal * cupomValido.percentual : 0;

  const forma = FORMAS_PAGAMENTO.find((item) => item.id === pagamento);
  const descontoPagamento = forma ? (subtotal - descontoCupom) * forma.desconto : 0;

  const opcaoEntrega = OPCOES_ENTREGA.find((item) => item.id === entrega) ?? OPCOES_ENTREGA[0];
  const frete = calcularFrete(opcaoEntrega, subtotal, cupomValido);
  const freteGratuito = frete === 0;

  const economiaVitrine = itens.reduce((soma, item) => {
    const antigo = item.produto.precoAntigo;
    return antigo ? soma + (antigo - item.produto.preco) * item.quantidade : soma;
  }, 0);

  return {
    subtotal,
    descontoCupom,
    descontoPagamento,
    frete,
    total: Math.max(0, subtotal - descontoCupom - descontoPagamento + frete),
    economia: economiaVitrine + descontoCupom + descontoPagamento,
    freteGratuito,
    faltaParaFreteGratis: Math.max(0, FRETE_GRATIS_ACIMA - subtotal),
  };
}

/**
 * Gera um código de pedido legível. Ex.: "ASC-7F3K2D".
 * @returns {string}
 */
export function gerarCodigoPedido() {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let i = 0; i < 6; i += 1) {
    sufixo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return `ASC-${sufixo}`;
}
