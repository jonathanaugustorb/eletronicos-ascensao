import { useCallback, useMemo, useState } from 'react';
import {
  cpfValido,
  emailValido,
  mascaraCartao,
  mascaraCep,
  mascaraCpf,
  mascaraTelefone,
  mascaraValidade,
  somenteDigitos,
} from '../utils/formato.js';

/** Etapas do fechamento do pedido, na ordem em que aparecem. */
export const ETAPAS = [
  { id: 'identificacao', nome: 'Identificação', icone: 'usuario' },
  { id: 'entrega', nome: 'Entrega', icone: 'caminhao' },
  { id: 'pagamento', nome: 'Pagamento', icone: 'cartao' },
  { id: 'revisao', nome: 'Revisão', icone: 'check' },
];

const VALORES_INICIAIS = {
  nome: '',
  email: '',
  cpf: '',
  telefone: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  entrega: 'padrao',
  pagamento: 'pix',
  parcelas: 1,
  cartaoNumero: '',
  cartaoNome: '',
  cartaoValidade: '',
  cartaoCvv: '',
};

/** Campos que cada etapa precisa ter válidos para liberar a próxima. */
const CAMPOS_POR_ETAPA = {
  identificacao: ['nome', 'email', 'cpf', 'telefone'],
  entrega: ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'],
  pagamento: ['cartaoNumero', 'cartaoNome', 'cartaoValidade', 'cartaoCvv'],
  revisao: [],
};

/** Máscara aplicada a cada campo conforme o usuário digita. */
const MASCARAS = {
  cpf: mascaraCpf,
  telefone: mascaraTelefone,
  cep: mascaraCep,
  cartaoNumero: mascaraCartao,
  cartaoValidade: mascaraValidade,
  cartaoCvv: (texto) => somenteDigitos(texto).slice(0, 4),
  uf: (texto) =>
    texto
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase()
      .slice(0, 2),
};

/**
 * Valida um campo isolado.
 * @param {string} campo
 * @param {typeof VALORES_INICIAIS} valores
 * @returns {string|null} mensagem de erro, ou null se estiver válido
 */
function validarCampo(campo, valores) {
  const valor = String(valores[campo] ?? '').trim();

  switch (campo) {
    case 'nome':
      if (valor.length < 3) return 'Informe seu nome completo.';
      if (!valor.includes(' ')) return 'Inclua também o sobrenome.';
      return null;

    case 'email':
      return emailValido(valor) ? null : 'E-mail inválido.';

    case 'cpf':
      if (somenteDigitos(valor).length !== 11) return 'O CPF precisa ter 11 dígitos.';
      return cpfValido(valor) ? null : 'CPF inválido.';

    case 'telefone':
      return somenteDigitos(valor).length >= 10 ? null : 'Informe o DDD e o número.';

    case 'cep':
      return somenteDigitos(valor).length === 8 ? null : 'O CEP precisa ter 8 dígitos.';

    case 'rua':
      return valor.length >= 3 ? null : 'Informe o logradouro.';

    case 'numero':
      return valor.length >= 1 ? null : 'Informe o número.';

    case 'bairro':
      return valor.length >= 2 ? null : 'Informe o bairro.';

    case 'cidade':
      return valor.length >= 2 ? null : 'Informe a cidade.';

    case 'uf':
      return valor.length === 2 ? null : 'Use a sigla com 2 letras.';

    case 'cartaoNumero':
      return somenteDigitos(valor).length === 16 ? null : 'O número do cartão tem 16 dígitos.';

    case 'cartaoNome':
      return valor.length >= 3 ? null : 'Informe o nome impresso no cartão.';

    case 'cartaoValidade': {
      const [mes, ano] = valor.split('/');
      if (!mes || !ano || ano.length < 2) return 'Use o formato MM/AA.';
      const mesNumero = Number(mes);
      if (mesNumero < 1 || mesNumero > 12) return 'Mês inválido.';
      return null;
    }

    case 'cartaoCvv':
      return somenteDigitos(valor).length >= 3 ? null : 'O código tem 3 ou 4 dígitos.';

    default:
      return null;
  }
}

/**
 * Estado, máscaras e validação do formulário de fechamento do pedido.
 *
 * Os campos do cartão só são exigidos quando a forma de pagamento escolhida
 * é o cartão de crédito.
 */
export function useFormularioPedido() {
  const [valores, setValores] = useState(VALORES_INICIAIS);
  const [tocados, setTocados] = useState({});

  const camposObrigatorios = useCallback(
    (etapa) => {
      if (etapa === 'pagamento' && valores.pagamento !== 'cartao') return [];
      return CAMPOS_POR_ETAPA[etapa] ?? [];
    },
    [valores.pagamento],
  );

  const definir = useCallback((campo, valor) => {
    const mascara = MASCARAS[campo];
    setValores((atuais) => ({ ...atuais, [campo]: mascara ? mascara(valor) : valor }));
  }, []);

  const erros = useMemo(() => {
    const encontrados = {};
    for (const etapa of Object.keys(CAMPOS_POR_ETAPA)) {
      for (const campo of camposObrigatorios(etapa)) {
        const erro = validarCampo(campo, valores);
        if (erro) encontrados[campo] = erro;
      }
    }
    return encontrados;
  }, [valores, camposObrigatorios]);

  /** Erro de um campo, mostrado só depois que ele foi tocado. */
  const erroVisivel = useCallback(
    (campo) => (tocados[campo] ? (erros[campo] ?? null) : null),
    [erros, tocados],
  );

  const etapaValida = useCallback(
    (etapa) => camposObrigatorios(etapa).every((campo) => !erros[campo]),
    [camposObrigatorios, erros],
  );

  /** Marca todos os campos da etapa como tocados, revelando os erros. */
  const revelarErros = useCallback(
    (etapa) => {
      setTocados((atuais) => {
        const proximos = { ...atuais };
        for (const campo of camposObrigatorios(etapa)) proximos[campo] = true;
        return proximos;
      });
    },
    [camposObrigatorios],
  );

  return {
    valores,
    definir,
    erros,
    erroVisivel,
    etapaValida,
    revelarErros,
  };
}
