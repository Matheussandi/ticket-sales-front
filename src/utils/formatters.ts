/**
 * Formata um número de telefone no padrão (XX) XXXXX-XXXX
 *
 * Aceita apenas dígitos, limita a 11 dígitos e aplica a máscara
 * progressivamente conforme o usuário digita.
 *
 * @example
 * formatPhone("24999991234") // "(24) 99999-1234"
 * formatPhone("2499")        // "(24) 99"
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Formata uma data no padrão DD/MM/AAAA
 *
 * Aceita apenas dígitos, limita a 8 dígitos e aplica a máscara
 * progressivamente conforme o usuário digita.
 *
 * @example
 * formatDate("04031990") // "04/03/1990"
 * formatDate("0403")     // "04/03"
 */
export function formatDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length === 0) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
