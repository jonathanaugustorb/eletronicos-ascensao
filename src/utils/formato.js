/** Funções de formatação e normalização reutilizadas em toda a loja. */

const MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const INTEIRO = new Intl.NumberFormat('pt-BR');

const DECIMAL_UM = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Formata um valor em reais. Ex.: 1290 -> "R$ 1.290,00".
 * @param {number} valor
 * @returns {string}
 */
export function formatarMoeda(valor) {
  return MOEDA.format(Number.isFinite(valor) ? valor : 0);
}

/**
 * Formata um número inteiro com separador de milhar.
 * @param {number} valor
 * @returns {string}
 */
export function formatarNumero(valor) {
  return INTEIRO.format(valor);
}

/**
 * Formata uma nota com uma casa decimal. Ex.: 4.8 -> "4,8".
 * @param {number} valor
 * @returns {string}
 */
export function formatarNota(valor) {
  return DECIMAL_UM.format(valor);
}

/**
 * Remove acentos e baixa a caixa, para comparação de texto na busca.
 * @param {string} texto
 * @returns {string}
 */
export function normalizar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Mantém apenas os dígitos de uma string.
 * @param {string} texto
 * @returns {string}
 */
export function somenteDigitos(texto) {
  return String(texto).replace(/\D/g, '');
}

/**
 * Aplica a máscara de CEP (00000-000) conforme o usuário digita.
 * @param {string} texto
 * @returns {string}
 */
export function mascaraCep(texto) {
  const digitos = somenteDigitos(texto).slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
}

/**
 * Aplica a máscara de telefone celular ((00) 00000-0000).
 * @param {string} texto
 * @returns {string}
 */
export function mascaraTelefone(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/**
 * Aplica a máscara de CPF (000.000.000-00).
 * @param {string} texto
 * @returns {string}
 */
export function mascaraCpf(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

/**
 * Agrupa o número do cartão em blocos de quatro dígitos.
 * @param {string} texto
 * @returns {string}
 */
export function mascaraCartao(texto) {
  return somenteDigitos(texto)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Aplica a máscara de validade do cartão (MM/AA).
 * @param {string} texto
 * @returns {string}
 */
export function mascaraValidade(texto) {
  const d = somenteDigitos(texto).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/**
 * Calcula o valor de cada parcela sem juros.
 * @param {number} total
 * @param {number} parcelas
 * @returns {number}
 */
export function valorParcela(total, parcelas) {
  if (parcelas <= 0) return total;
  return total / parcelas;
}

/**
 * Valida um CPF pelos dígitos verificadores.
 * @param {string} texto
 * @returns {boolean}
 */
export function cpfValido(texto) {
  const cpf = somenteDigitos(texto);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digitoVerificador = (ateIndice) => {
    let soma = 0;
    for (let i = 0; i < ateIndice; i += 1) {
      soma += Number(cpf[i]) * (ateIndice + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digitoVerificador(9) === Number(cpf[9]) && digitoVerificador(10) === Number(cpf[10]);
}

/**
 * Validação simples de e-mail — suficiente para um formulário simulado.
 * @param {string} texto
 * @returns {boolean}
 */
export function emailValido(texto) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(texto).trim());
}
