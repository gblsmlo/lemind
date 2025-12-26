export function formatDate(
	date: Date | string | number | undefined,
	opts: Intl.DateTimeFormatOptions = {},
) {
	if (!date) return ''

	try {
		return new Intl.DateTimeFormat('en-US', {
			day: opts.day ?? 'numeric',
			month: opts.month ?? 'long',
			year: opts.year ?? 'numeric',
			...opts,
		}).format(new Date(date))
	} catch (_err) {
		return ''
	}
}

/**
 * Formata um CPF ou CNPJ com máscara apropriada
 * CPF: 000.000.000-00 (11 dígitos)
 * CNPJ: 00.000.000/0000-00 (14 dígitos)
 */
export function formatCpfCnpj(value: string | null | undefined): string {
	if (!value) return ''

	// Remove todos os caracteres não numéricos
	const digits = value.replace(/\D/g, '')

	// CPF: 11 dígitos
	if (digits.length <= 11) {
		return digits
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
	}

	// CNPJ: 14 dígitos
	return digits
		.slice(0, 14)
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2')
		.replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}
