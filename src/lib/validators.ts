/**
 * Remove todos os caracteres não numéricos de uma string
 */
export function stripNonDigits(value: string | null | undefined): string {
	if (!value) return ''
	return value.replace(/\D/g, '')
}

/**
 * Valida se um CPF é válido (11 dígitos com dígitos verificadores corretos)
 */
export function isValidCpf(cpf: string): boolean {
	const digits = stripNonDigits(cpf)

	if (digits.length !== 11) return false

	// Rejeita CPFs com todos os dígitos iguais
	if (/^(\d)\1{10}$/.test(digits)) return false

	// Validação do primeiro dígito verificador
	let sum = 0
	for (let i = 0; i < 9; i++) {
		sum += Number.parseInt(digits.charAt(i), 10) * (10 - i)
	}
	let remainder = (sum * 10) % 11
	if (remainder === 10) remainder = 0
	if (remainder !== Number.parseInt(digits.charAt(9), 10)) return false

	// Validação do segundo dígito verificador
	sum = 0
	for (let i = 0; i < 10; i++) {
		sum += Number.parseInt(digits.charAt(i), 10) * (11 - i)
	}
	remainder = (sum * 10) % 11
	if (remainder === 10) remainder = 0
	if (remainder !== Number.parseInt(digits.charAt(10), 10)) return false

	return true
}

/**
 * Valida se um CNPJ é válido (14 dígitos com dígitos verificadores corretos)
 */
export function isValidCnpj(cnpj: string): boolean {
	const digits = stripNonDigits(cnpj)

	if (digits.length !== 14) return false

	// Rejeita CNPJs com todos os dígitos iguais
	if (/^(\d)\1{13}$/.test(digits)) return false

	// Validação do primeiro dígito verificador
	let sum = 0
	let weight = 5
	for (let i = 0; i < 12; i++) {
		sum += Number.parseInt(digits.charAt(i), 10) * weight
		weight = weight === 2 ? 9 : weight - 1
	}
	let remainder = sum % 11
	const digit1 = remainder < 2 ? 0 : 11 - remainder
	if (digit1 !== Number.parseInt(digits.charAt(12), 10)) return false

	// Validação do segundo dígito verificador
	sum = 0
	weight = 6
	for (let i = 0; i < 13; i++) {
		sum += Number.parseInt(digits.charAt(i), 10) * weight
		weight = weight === 2 ? 9 : weight - 1
	}
	remainder = sum % 11
	const digit2 = remainder < 2 ? 0 : 11 - remainder
	if (digit2 !== Number.parseInt(digits.charAt(13), 10)) return false

	return true
}

/**
 * Valida se um documento (CPF ou CNPJ) é válido
 */
export function isValidDocument(document: string): boolean {
	const digits = stripNonDigits(document)

	if (digits.length === 11) {
		return isValidCpf(digits)
	}

	if (digits.length === 14) {
		return isValidCnpj(digits)
	}

	return false
}
