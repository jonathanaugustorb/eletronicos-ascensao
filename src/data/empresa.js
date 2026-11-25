/**
 * Conteúdo institucional da loja.
 *
 * Projeto acadêmico: empresa, endereço, números e depoimentos são fictícios.
 */

export const EMPRESA = {
  nome: 'EletronicosAscensão',
  slogan: 'Tecnologia em ascensão',
  fundacao: 2019,
  cidade: 'Belo Horizonte, MG',
  email: 'contato@eletronicosascensao.com.br',
  telefone: '(31) 3000-0000',
  cnpj: '00.000.000/0001-00',
};

/**
 * Crédito de autoria, exibido na página Quem Somos e no rodapé.
 *
 * Fica aqui para que as duas telas usem exatamente o mesmo texto — mudar o
 * nome em um lugar muda nos dois.
 */
export const AUTORIA = {
  chamada: 'Plataforma com finalidade acadêmica, desenvolvida por',
  autor: 'Jonathan Augusto Rodrigues Barbosa',
};

/** Números exibidos na home e na página institucional. */
export const INDICADORES = [
  { valor: '120 mil', rotulo: 'pedidos entregues' },
  { valor: '4,8/5', rotulo: 'nota média dos clientes' },
  { valor: '48 h', rotulo: 'prazo médio nas capitais' },
  { valor: '2.400', rotulo: 'produtos no catálogo' },
];

/** Diferenciais usados na faixa de confiança da home. */
export const DIFERENCIAIS = [
  {
    icone: 'caminhao',
    titulo: 'Frete grátis acima de R$ 499',
    texto: 'Enviamos para todo o Brasil com rastreio em tempo real.',
  },
  {
    icone: 'escudo',
    titulo: 'Garantia estendida',
    texto: '12 meses de fábrica mais 3 meses por nossa conta.',
  },
  {
    icone: 'cartao',
    titulo: 'Até 12x sem juros',
    texto: 'Parcelamento no cartão ou 10% de desconto no Pix.',
  },
  {
    icone: 'troca',
    titulo: '30 dias para trocar',
    texto: 'Não gostou? A logística reversa é por nossa conta.',
  },
];

/** Linha do tempo da página Quem Somos. */
export const HISTORIA = [
  {
    ano: '2019',
    titulo: 'Uma bancada de reparos',
    texto:
      'Começamos consertando notebooks em uma sala de 20 m² no centro de Belo Horizonte, atendendo estudantes da região.',
  },
  {
    ano: '2021',
    titulo: 'A primeira loja online',
    texto:
      'Migramos o estoque para a internet e passamos a atender todo o estado de Minas Gerais com entrega própria.',
  },
  {
    ano: '2023',
    titulo: 'Centro de distribuição',
    texto:
      'Inauguramos um CD de 1.800 m² e reduzimos o prazo médio de entrega nas capitais para 48 horas.',
  },
  {
    ano: '2025',
    titulo: 'Assistência técnica própria',
    texto:
      'Abrimos um laboratório autorizado para que garantia e reparo aconteçam sem intermediários.',
  },
];

/** Valores institucionais. */
export const VALORES = [
  {
    icone: 'alvo',
    titulo: 'Descrição honesta',
    texto:
      'Cada ficha técnica é conferida antes de ir ao ar. Se um item tem limitação, ela aparece na página.',
  },
  {
    icone: 'coracao',
    titulo: 'Atendimento por gente',
    texto:
      'Nenhum robô fecha um chamado. Quem responde é a mesma equipe que separa e testa os produtos.',
  },
  {
    icone: 'folha',
    titulo: 'Descarte responsável',
    texto:
      'Recebemos eletrônicos antigos em qualquer compra e encaminhamos para reciclagem certificada.',
  },
];

/** Perguntas frequentes, usadas na página institucional. */
export const PERGUNTAS = [
  {
    pergunta: 'Em quanto tempo meu pedido chega?',
    resposta:
      'Capitais recebem em até 48 horas úteis. Demais regiões, de 3 a 7 dias úteis. O prazo exato aparece no fechamento do pedido.',
  },
  {
    pergunta: 'Posso retirar na loja?',
    resposta:
      'Sim. A retirada é gratuita na unidade de Belo Horizonte e fica disponível 2 horas após a confirmação do pagamento.',
  },
  {
    pergunta: 'Como funciona a garantia?',
    resposta:
      'Todos os produtos têm 12 meses de garantia de fábrica e mais 3 meses oferecidos pela loja, com atendimento no nosso laboratório.',
  },
  {
    pergunta: 'Quais formas de pagamento são aceitas?',
    resposta:
      'Pix com 10% de desconto, boleto bancário e cartão de crédito em até 12x sem juros.',
  },
];
