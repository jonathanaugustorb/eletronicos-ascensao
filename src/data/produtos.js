/**
 * Catálogo simulado da EletronicosAscensão.
 *
 * As marcas são fictícias (projeto acadêmico). As fotos são hospedadas no
 * Unsplash e carregadas por URL — cada `foto` guarda apenas o id, e a montagem
 * da URL fica em `montarUrlFoto` para manter um único ponto de ajuste.
 */

const BASE_UNSPLASH = 'https://images.unsplash.com/photo-';

/**
 * Monta a URL de uma foto do catálogo já recortada no tamanho pedido.
 * @param {string} foto id da foto no Unsplash
 * @param {number} largura
 * @param {number} altura
 * @returns {string}
 */
export function montarUrlFoto(foto, largura = 640, altura = 640) {
  const params = new URLSearchParams({
    w: String(largura),
    h: String(altura),
    fit: 'crop',
    q: '80',
    auto: 'format',
  });
  return `${BASE_UNSPLASH}${foto}?${params.toString()}`;
}

/** Categorias na ordem em que aparecem nos filtros e no menu. */
export const CATEGORIAS = [
  { id: 'smartphones', nome: 'Smartphones', icone: 'celular' },
  { id: 'notebooks', nome: 'Notebooks', icone: 'notebook' },
  { id: 'audio', nome: 'Áudio', icone: 'fone' },
  { id: 'perifericos', nome: 'Periféricos', icone: 'teclado' },
  { id: 'monitores', nome: 'Monitores', icone: 'monitor' },
  { id: 'games', nome: 'Games', icone: 'controle' },
  { id: 'vestiveis', nome: 'Vestíveis', icone: 'relogio' },
  { id: 'foto', nome: 'Foto e Vídeo', icone: 'camera' },
];

/**
 * @typedef {object} Produto
 * @property {string} id
 * @property {string} nome
 * @property {string} marca
 * @property {string} categoria id presente em CATEGORIAS
 * @property {number} preco preço à vista, em reais
 * @property {number} [precoAntigo] preenchido apenas quando há desconto
 * @property {number} nota média de 0 a 5
 * @property {number} avaliacoes quantidade de avaliações
 * @property {number} estoque unidades disponíveis
 * @property {string} foto id da foto no Unsplash
 * @property {string} resumo uma linha para o card
 * @property {string[]} destaques bullets curtos de especificação
 * @property {string[]} etiquetas termos extras usados pela busca
 * @property {number} lancamento ano de lançamento (ordenação "novidades")
 */

/** @type {Produto[]} */
export const PRODUTOS = [
  // ----------------------------- Smartphones -----------------------------
  {
    id: 'nexora-prism-12',
    nome: 'Nexora Prism 12 Pro',
    marca: 'Nexora',
    categoria: 'smartphones',
    preco: 6499,
    precoAntigo: 7299,
    nota: 4.8,
    avaliacoes: 412,
    estoque: 14,
    foto: '1511707171634-5f897ff02aa9',
    resumo: 'Tela OLED de 6,7 polegadas com 120 Hz e câmera tripla de 50 MP.',
    destaques: ['OLED 6,7" 120 Hz', '256 GB e 12 GB de RAM', 'Câmera tripla 50 MP', 'Bateria 5.000 mAh'],
    etiquetas: ['celular', 'telefone', '5g', 'android'],
    lancamento: 2025,
  },
  {
    id: 'zentri-aura-s',
    nome: 'Zentri Aura S',
    marca: 'Zentri',
    categoria: 'smartphones',
    preco: 3199,
    nota: 4.5,
    avaliacoes: 268,
    estoque: 31,
    foto: '1555774698-0b77e0d5fac6',
    resumo: 'Intermediário premium com carregamento rápido de 65 W.',
    destaques: ['AMOLED 6,4"', '128 GB e 8 GB de RAM', 'Carga rápida 65 W', 'Leitor na tela'],
    etiquetas: ['celular', 'telefone', '5g', 'custo beneficio'],
    lancamento: 2024,
  },
  {
    id: 'halvex-noir-x',
    nome: 'Halvex Noir X',
    marca: 'Halvex',
    categoria: 'smartphones',
    preco: 4890,
    precoAntigo: 5390,
    nota: 4.3,
    avaliacoes: 157,
    estoque: 0,
    foto: '1601784551446-20c9e07cdbdb',
    resumo: 'Acabamento em vidro fosco e modo noturno computacional.',
    destaques: ['AMOLED 6,6"', '256 GB e 8 GB de RAM', 'Modo noturno com IA', 'Resistência IP68'],
    etiquetas: ['celular', 'telefone', 'fotografia'],
    lancamento: 2025,
  },

  // ------------------------------ Notebooks ------------------------------
  {
    id: 'lumvo-slate-14',
    nome: 'Lumvo Slate 14',
    marca: 'Lumvo',
    categoria: 'notebooks',
    preco: 5290,
    nota: 4.6,
    avaliacoes: 193,
    estoque: 9,
    foto: '1496181133206-80ce9b88a853',
    resumo: 'Ultrafino de 1,2 kg para quem trabalha fora do escritório.',
    destaques: ['14" IPS Full HD', 'Ryzen 7 e 16 GB', 'SSD de 512 GB', 'Até 12 h de bateria'],
    etiquetas: ['laptop', 'ultrabook', 'trabalho', 'portatil'],
    lancamento: 2024,
  },
  {
    id: 'lumvo-slate-13-infinity',
    nome: 'Lumvo Slate 13 Infinity',
    marca: 'Lumvo',
    categoria: 'notebooks',
    preco: 7890,
    precoAntigo: 8690,
    nota: 4.9,
    avaliacoes: 341,
    estoque: 6,
    foto: '1593642632823-8f785ba67e45',
    resumo: 'Tela sem bordas 3.5K e chassi usinado em alumínio.',
    destaques: ['13,4" 3.5K OLED', 'Core i7 e 32 GB', 'SSD de 1 TB', 'Teclado retroiluminado'],
    etiquetas: ['laptop', 'ultrabook', 'oled', 'premium'],
    lancamento: 2025,
  },
  {
    id: 'krytek-forge-15',
    nome: 'Krytek Forge 15',
    marca: 'Krytek',
    categoria: 'notebooks',
    preco: 4290,
    nota: 4.2,
    avaliacoes: 128,
    estoque: 22,
    foto: '1588872657578-7efd1f1555ed',
    resumo: 'Notebook corporativo com dock e gestão remota.',
    destaques: ['15,6" Full HD', 'Core i5 e 16 GB', 'SSD de 512 GB', 'Chip TPM 2.0'],
    etiquetas: ['laptop', 'corporativo', 'empresa', 'windows'],
    lancamento: 2023,
  },
  {
    id: 'krytek-forge-rgb',
    nome: 'Krytek Forge RGB Gamer',
    marca: 'Krytek',
    categoria: 'notebooks',
    preco: 9450,
    precoAntigo: 10900,
    nota: 4.7,
    avaliacoes: 287,
    estoque: 5,
    foto: '1525547719571-a2d4ac8945e2',
    resumo: 'Placa dedicada de 12 GB e teclado com iluminação por tecla.',
    destaques: ['16" a 240 Hz', 'GPU de 12 GB GDDR6', 'Core i9 e 32 GB', 'Refrigeração dupla'],
    etiquetas: ['laptop', 'gamer', 'jogos', 'rgb', 'placa de video'],
    lancamento: 2025,
  },
  {
    id: 'orbyn-studio-16',
    nome: 'Orbyn Studio 16',
    marca: 'Orbyn',
    categoria: 'notebooks',
    preco: 12990,
    nota: 4.9,
    avaliacoes: 204,
    estoque: 4,
    foto: '1541807084-5c52b6b3adef',
    resumo: 'Estação de edição com tela calibrada de fábrica.',
    destaques: ['16" Liquid Retina', '32 GB de memória unificada', 'SSD de 1 TB', '100% DCI-P3'],
    etiquetas: ['laptop', 'edicao', 'video', 'design', 'criador'],
    lancamento: 2025,
  },
  {
    id: 'orbyn-air-13',
    nome: 'Orbyn Air 13',
    marca: 'Orbyn',
    categoria: 'notebooks',
    preco: 6790,
    nota: 4.7,
    avaliacoes: 519,
    estoque: 17,
    foto: '1498050108023-c5249f4df085',
    resumo: 'Silencioso, sem ventoinha, e 18 horas longe da tomada.',
    destaques: ['13,6" Retina', '16 GB de memória unificada', 'SSD de 512 GB', 'Sem ventoinha'],
    etiquetas: ['laptop', 'ultrabook', 'estudante', 'leve'],
    lancamento: 2024,
  },
  {
    id: 'vantrix-code-15',
    nome: 'Vantrix Code 15',
    marca: 'Vantrix',
    categoria: 'notebooks',
    preco: 5890,
    precoAntigo: 6390,
    nota: 4.4,
    avaliacoes: 96,
    estoque: 11,
    foto: '1517336714731-489689fd1ca8',
    resumo: 'Montado para desenvolvimento: muita RAM e Linux pré-instalado.',
    destaques: ['15,6" IPS', 'Ryzen 7 e 32 GB', 'SSD de 1 TB', 'Linux homologado'],
    etiquetas: ['laptop', 'programacao', 'desenvolvedor', 'linux'],
    lancamento: 2024,
  },

  // -------------------------------- Áudio --------------------------------
  {
    id: 'nuvex-pulse-anc',
    nome: 'Nuvex Pulse ANC',
    marca: 'Nuvex',
    categoria: 'audio',
    preco: 899,
    precoAntigo: 1199,
    nota: 4.6,
    avaliacoes: 733,
    estoque: 48,
    foto: '1505740420928-5e560c06d30e',
    resumo: 'Cancelamento ativo de ruído com 40 horas de autonomia.',
    destaques: ['ANC híbrido', '40 h de bateria', 'Bluetooth 5.3', 'Dobrável'],
    etiquetas: ['fone', 'headphone', 'bluetooth', 'sem fio'],
    lancamento: 2024,
  },
  {
    id: 'nuvex-studio-pro',
    nome: 'Nuvex Studio Pro',
    marca: 'Nuvex',
    categoria: 'audio',
    preco: 1690,
    nota: 4.8,
    avaliacoes: 211,
    estoque: 13,
    foto: '1583394838336-acd977736f90',
    resumo: 'Headphone de referência para monitoração em estúdio.',
    destaques: ['Drivers de 45 mm', 'Resposta de 5 Hz a 40 kHz', 'Cabo removível', 'Espuma viscoelástica'],
    etiquetas: ['fone', 'headphone', 'estudio', 'profissional', 'com fio'],
    lancamento: 2023,
  },
  {
    id: 'nuvex-retro-one',
    nome: 'Nuvex Retro One',
    marca: 'Nuvex',
    categoria: 'audio',
    preco: 549,
    nota: 4.1,
    avaliacoes: 164,
    estoque: 37,
    foto: '1484704849700-f032a568e944',
    resumo: 'Acabamento em alumínio e couro, com som quente e encorpado.',
    destaques: ['Drivers de 40 mm', 'Conector P2', 'Arco em alumínio', 'Almofadas em couro'],
    etiquetas: ['fone', 'headphone', 'retro', 'com fio'],
    lancamento: 2022,
  },
  {
    id: 'zentri-echo-mini',
    nome: 'Zentri Echo Mini',
    marca: 'Zentri',
    categoria: 'audio',
    preco: 429,
    precoAntigo: 529,
    nota: 4.5,
    avaliacoes: 892,
    estoque: 64,
    foto: '1608043152269-423dbba4e7e1',
    resumo: 'Caixa portátil à prova de água com 12 horas de reprodução.',
    destaques: ['Proteção IPX7', '12 h de bateria', 'Som 360 graus', 'Pareamento duplo'],
    etiquetas: ['caixa de som', 'speaker', 'bluetooth', 'portatil', 'festa'],
    lancamento: 2024,
  },
  {
    id: 'nuvex-drift-buds',
    nome: 'Nuvex Drift Buds',
    marca: 'Nuvex',
    categoria: 'audio',
    preco: 699,
    nota: 4.4,
    avaliacoes: 1204,
    estoque: 72,
    foto: '1572569511254-d8f925fe2cbb',
    resumo: 'Fones intra-auriculares com estojo de carga sem fio.',
    destaques: ['ANC adaptativo', '6 h mais 24 h no estojo', 'Carga por indução', 'Resistente a suor'],
    etiquetas: ['fone', 'earbuds', 'intra auricular', 'bluetooth', 'sem fio'],
    lancamento: 2025,
  },
  {
    id: 'orbyn-pods-air',
    nome: 'Orbyn Pods Air',
    marca: 'Orbyn',
    categoria: 'audio',
    preco: 1290,
    precoAntigo: 1490,
    nota: 4.7,
    avaliacoes: 2310,
    estoque: 25,
    foto: '1558756520-22cfe5d382ca',
    resumo: 'Áudio espacial com acompanhamento dinâmico de cabeça.',
    destaques: ['Áudio espacial', 'ANC e modo ambiente', 'Estojo com alto-falante', 'Conector USB-C'],
    etiquetas: ['fone', 'earbuds', 'bluetooth', 'sem fio', 'espacial'],
    lancamento: 2025,
  },

  // ----------------------------- Periféricos -----------------------------
  {
    id: 'vantrix-glide-wireless',
    nome: 'Vantrix Glide Wireless',
    marca: 'Vantrix',
    categoria: 'perifericos',
    preco: 189,
    nota: 4,
    avaliacoes: 318,
    estoque: 88,
    foto: '1527864550417-7fd91fc51a46',
    resumo: 'Mouse sem fio silencioso para uso diário no escritório.',
    destaques: ['1600 DPI', 'Receptor de 2,4 GHz', 'Clique silencioso', 'Até 18 meses de pilha'],
    etiquetas: ['mouse', 'sem fio', 'escritorio'],
    lancamento: 2022,
  },
  {
    id: 'krytek-strike-g',
    nome: 'Krytek Strike G',
    marca: 'Krytek',
    categoria: 'perifericos',
    preco: 349,
    precoAntigo: 429,
    nota: 4.6,
    avaliacoes: 574,
    estoque: 41,
    foto: '1527814050087-3793815479db',
    resumo: 'Mouse gamer de 85 g com sensor óptico de 12.000 DPI.',
    destaques: ['12.000 DPI', 'Apenas 85 g', '6 botões programáveis', 'Taxa de 1000 Hz'],
    etiquetas: ['mouse', 'gamer', 'jogos', 'leve'],
    lancamento: 2024,
  },
  {
    id: 'orbyn-keys-slim',
    nome: 'Orbyn Keys Slim',
    marca: 'Orbyn',
    categoria: 'perifericos',
    preco: 759,
    nota: 4.5,
    avaliacoes: 230,
    estoque: 19,
    foto: '1587829741301-dc798b83add3',
    resumo: 'Teclado de perfil baixo que conecta em até três aparelhos.',
    destaques: ['Perfil baixo', 'Até 3 dispositivos', 'Bateria recarregável', 'Layout ABNT2'],
    etiquetas: ['teclado', 'sem fio', 'bluetooth', 'minimalista'],
    lancamento: 2023,
  },
  {
    id: 'vantrix-combo-work',
    nome: 'Vantrix Combo Work',
    marca: 'Vantrix',
    categoria: 'perifericos',
    preco: 1099,
    precoAntigo: 1349,
    nota: 4.3,
    avaliacoes: 142,
    estoque: 27,
    foto: '1550009158-9ebf69173e03',
    resumo: 'Kit de teclado, mouse e headset para montar a mesa de trabalho.',
    destaques: ['Teclado, mouse e headset', 'Conexão unificada', 'Compatível com vários sistemas', 'Garantia de 2 anos'],
    etiquetas: ['kit', 'combo', 'teclado', 'mouse', 'headset', 'home office'],
    lancamento: 2024,
  },

  // ------------------------------ Monitores ------------------------------
  {
    id: 'lumvo-view-27',
    nome: 'Lumvo View 27 QHD',
    marca: 'Lumvo',
    categoria: 'monitores',
    preco: 2190,
    nota: 4.6,
    avaliacoes: 389,
    estoque: 16,
    foto: '1547658719-da2b51169166',
    resumo: 'Monitor QHD de 27 polegadas com base ajustável em altura.',
    destaques: ['27" QHD 2560 x 1440', '75 Hz e painel IPS', 'HDMI e DisplayPort', 'Ajuste de altura'],
    etiquetas: ['monitor', 'tela', 'qhd', 'escritorio'],
    lancamento: 2023,
  },
  {
    id: 'orbyn-canvas-24',
    nome: 'Orbyn Canvas 24 All-in-One',
    marca: 'Orbyn',
    categoria: 'monitores',
    preco: 8990,
    nota: 4.8,
    avaliacoes: 167,
    estoque: 7,
    foto: '1527443224154-c4a3942d3acf',
    resumo: 'Computador completo em 11,5 mm de espessura.',
    destaques: ['24" 4.5K Retina', '16 GB e SSD de 512 GB', 'Câmera de 12 MP', 'Teclado incluso'],
    etiquetas: ['all in one', 'desktop', 'computador', 'monitor'],
    lancamento: 2025,
  },
  {
    id: 'lumvo-view-32-dual',
    nome: 'Lumvo View 32 Dual Setup',
    marca: 'Lumvo',
    categoria: 'monitores',
    preco: 4590,
    precoAntigo: 5290,
    nota: 4.4,
    avaliacoes: 98,
    estoque: 10,
    foto: '1601524909162-ae8725290836',
    resumo: 'Par de monitores de 32 polegadas com suporte articulado incluso.',
    destaques: ['Dois monitores 32" 4K', 'Suporte articulado', 'USB-C de 90 W', 'Moldura fina'],
    etiquetas: ['monitor', 'tela', '4k', 'dual', 'setup'],
    lancamento: 2024,
  },

  // -------------------------------- Games --------------------------------
  {
    id: 'zentri-nova-5',
    nome: 'Zentri Nova 5',
    marca: 'Zentri',
    categoria: 'games',
    preco: 4199,
    nota: 4.9,
    avaliacoes: 1487,
    estoque: 8,
    foto: '1606144042614-b2417e99c4e3',
    resumo: 'Console de nova geração com SSD ultrarrápido e 4K a 120 fps.',
    destaques: ['4K a 120 fps', 'SSD de 1 TB', 'Controle com retorno háptico', 'Ray tracing'],
    etiquetas: ['console', 'videogame', 'jogos', '4k'],
    lancamento: 2025,
  },
  {
    id: 'zentri-nova-4-slim',
    nome: 'Zentri Nova 4 Slim',
    marca: 'Zentri',
    categoria: 'games',
    preco: 1899,
    precoAntigo: 2299,
    nota: 4.5,
    avaliacoes: 2042,
    estoque: 23,
    foto: '1486401899868-0e435ed85128',
    resumo: 'A geração anterior, agora com preço de entrada.',
    destaques: ['Full HD a 60 fps', 'HD de 500 GB', 'Controle sem fio', 'Catálogo retrocompatível'],
    etiquetas: ['console', 'videogame', 'jogos', 'custo beneficio'],
    lancamento: 2021,
  },
  {
    id: 'krytek-arena-pc',
    nome: 'Krytek Arena PC Gamer',
    marca: 'Krytek',
    categoria: 'games',
    preco: 11490,
    precoAntigo: 12900,
    nota: 4.7,
    avaliacoes: 156,
    estoque: 3,
    foto: '1542751371-adc38448a05e',
    resumo: 'PC montado e testado, pronto para competir em 1440p.',
    destaques: ['GPU de 16 GB', 'Ryzen 9 e 32 GB', 'SSD de 2 TB NVMe', 'Water cooler de 240 mm'],
    etiquetas: ['pc gamer', 'computador', 'desktop', 'jogos', 'montado'],
    lancamento: 2025,
  },

  // ------------------------------ Vestíveis ------------------------------
  {
    id: 'orbyn-watch-ultra',
    nome: 'Orbyn Watch Ultra',
    marca: 'Orbyn',
    categoria: 'vestiveis',
    preco: 3290,
    nota: 4.8,
    avaliacoes: 621,
    estoque: 12,
    foto: '1546868871-7041f2a55e12',
    resumo: 'Caixa em titânio, GPS duplo e autonomia de 36 horas.',
    destaques: ['Caixa de titânio', 'GPS duplo', 'ECG e oxímetro', '36 h de bateria'],
    etiquetas: ['smartwatch', 'relogio', 'saude', 'corrida', 'gps'],
    lancamento: 2025,
  },
  {
    id: 'halvex-band-fit',
    nome: 'Halvex Band Fit',
    marca: 'Halvex',
    categoria: 'vestiveis',
    preco: 459,
    precoAntigo: 599,
    nota: 4.2,
    avaliacoes: 876,
    estoque: 55,
    foto: '1498049794561-7780e7231661',
    resumo: 'Pulseira leve com 14 dias de bateria e 80 modos de treino.',
    destaques: ['14 dias de bateria', '80 modos de treino', 'Monitor de sono', 'Resistência 5 ATM'],
    etiquetas: ['smartband', 'pulseira', 'relogio', 'fitness', 'treino'],
    lancamento: 2024,
  },

  // ----------------------------- Foto e Vídeo ----------------------------
  {
    id: 'halvex-instant-p1',
    nome: 'Halvex Instant P1',
    marca: 'Halvex',
    categoria: 'foto',
    preco: 1149,
    nota: 4.3,
    avaliacoes: 203,
    estoque: 18,
    foto: '1526170375885-4d8ecf77b99f',
    resumo: 'Câmera instantânea com revelação em 90 segundos.',
    destaques: ['Revelação em 90 s', 'Flash automático', 'Autofoco', 'Pacote com 10 filmes'],
    etiquetas: ['camera', 'instantanea', 'polaroid', 'foto', 'presente'],
    lancamento: 2023,
  },
];

/** Marcas distintas do catálogo, em ordem alfabética. */
export const MARCAS = [...new Set(PRODUTOS.map((produto) => produto.marca))].sort((a, b) =>
  a.localeCompare(b, 'pt-BR'),
);

/** Menor e maior preço do catálogo — limites do filtro de faixa de preço. */
export const FAIXA_PRECO = {
  minimo: Math.floor(Math.min(...PRODUTOS.map((produto) => produto.preco))),
  maximo: Math.ceil(Math.max(...PRODUTOS.map((produto) => produto.preco))),
};

/**
 * Busca um produto pelo id.
 * @param {string} id
 * @returns {Produto|undefined}
 */
export function buscarProduto(id) {
  return PRODUTOS.find((produto) => produto.id === id);
}

/**
 * Percentual de desconto arredondado, ou 0 quando não há preço antigo.
 * @param {Produto} produto
 * @returns {number}
 */
export function calcularDesconto(produto) {
  if (!produto.precoAntigo || produto.precoAntigo <= produto.preco) return 0;
  return Math.round((1 - produto.preco / produto.precoAntigo) * 100);
}

/**
 * Nome legível de uma categoria.
 * @param {string} id
 * @returns {string}
 */
export function nomeCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id)?.nome ?? id;
}

/**
 * Caminho da página de um produto.
 *
 * Centralizar a montagem aqui evita que cada tela monte a URL à mão — se a
 * rota mudar, muda só nesta função.
 *
 * @param {string} id
 * @returns {string}
 */
export function caminhoProduto(id) {
  return `/produtos/${id}`;
}

/**
 * Produtos sugeridos na página de um produto.
 *
 * Prioriza a mesma categoria e, se faltar gente, completa com a mesma marca.
 * Itens esgotados ficam por último para não ocupar as primeiras posições.
 *
 * @param {Produto} produto
 * @param {number} [limite]
 * @returns {Produto[]}
 */
export function produtosRelacionados(produto, limite = 4) {
  const candidatos = PRODUTOS.filter((outro) => outro.id !== produto.id);

  const afinidade = (outro) => {
    if (outro.categoria === produto.categoria) return 2;
    if (outro.marca === produto.marca) return 1;
    return 0;
  };

  return candidatos
    .filter((outro) => afinidade(outro) > 0)
    .sort(
      (a, b) =>
        afinidade(b) - afinidade(a) ||
        Number(b.estoque > 0) - Number(a.estoque > 0) ||
        b.nota - a.nota,
    )
    .slice(0, limite);
}
