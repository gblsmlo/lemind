import { describe, expect, it } from 'vitest'
import { formatCpfCnpj } from '../format'
import {
	isValidCnpj,
	isValidCpf,
	isValidDocument,
	stripNonDigits,
} from '../validators'

describe('stripNonDigits', () => {
	it('should remove all non-numeric characters', () => {
		expect(stripNonDigits('123.456.789-59')).toBe('12345678959')
		expect(stripNonDigits('12.345.678/0001-95')).toBe('12345678000195')
		expect(stripNonDigits('(11) 98765-4321')).toBe('11987654321')
	})

	it('should handle empty or null values', () => {
		expect(stripNonDigits('')).toBe('')
		expect(stripNonDigits(null)).toBe('')
		expect(stripNonDigits(undefined)).toBe('')
	})

	it('should handle strings with only digits', () => {
		expect(stripNonDigits('12345678959')).toBe('12345678959')
	})
})

describe('formatCpfCnpj', () => {
	it('should format CPF with 11 digits', () => {
		expect(formatCpfCnpj('12345678959')).toBe('123.456.789-59')
	})

	it('should format CNPJ with 14 digits', () => {
		expect(formatCpfCnpj('12345678000195')).toBe('12.345.678/0001-95')
	})

	it('should handle partial input (typing)', () => {
		expect(formatCpfCnpj('123')).toBe('123')
		expect(formatCpfCnpj('12345')).toBe('123.45')
		expect(formatCpfCnpj('12345678')).toBe('123.456.78')
		expect(formatCpfCnpj('123456789')).toBe('123.456.789')
		expect(formatCpfCnpj('12345678959')).toBe('123.456.789-59')
	})

	it('should handle input with existing punctuation', () => {
		expect(formatCpfCnpj('123.456.789-59')).toBe('123.456.789-59')
		expect(formatCpfCnpj('12.345.678/0001-95')).toBe('12.345.678/0001-95')
	})

	it('should limit CNPJ to 14 digits', () => {
		expect(formatCpfCnpj('123456780001951234567890')).toBe('12.345.678/0001-95')
	})

	it('should handle empty or null values', () => {
		expect(formatCpfCnpj('')).toBe('')
		expect(formatCpfCnpj(null)).toBe('')
		expect(formatCpfCnpj(undefined)).toBe('')
	})
})

describe('isValidCpf', () => {
	it('should validate correct CPF', () => {
		expect(isValidCpf('123.456.789-09')).toBe(true)
		expect(isValidCpf('12345678909')).toBe(true)
		expect(isValidCpf('111.444.777-35')).toBe(true)
		expect(isValidCpf('11144477735')).toBe(true)
	})

	it('should reject CPF with incorrect check digits', () => {
		expect(isValidCpf('123.456.789-00')).toBe(false)
		expect(isValidCpf('12345678900')).toBe(false)
		expect(isValidCpf('111.444.777-99')).toBe(false)
	})

	it('should reject CPF with all same digits', () => {
		expect(isValidCpf('000.000.000-00')).toBe(false)
		expect(isValidCpf('111.111.111-11')).toBe(false)
		expect(isValidCpf('222.222.222-22')).toBe(false)
		expect(isValidCpf('99999999999')).toBe(false)
	})

	it('should reject CPF with incorrect length', () => {
		expect(isValidCpf('123.456.789')).toBe(false)
		expect(isValidCpf('123456789')).toBe(false)
		expect(isValidCpf('123.456.789-091')).toBe(false)
	})

	it('should handle empty string', () => {
		expect(isValidCpf('')).toBe(false)
	})
})

describe('isValidCnpj', () => {
	it('should validate correct CNPJ', () => {
		expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
		expect(isValidCnpj('11222333000181')).toBe(true)
		expect(isValidCnpj('11.444.777/0001-61')).toBe(true)
		expect(isValidCnpj('11444777000161')).toBe(true)
	})

	it('should reject CNPJ with incorrect check digits', () => {
		expect(isValidCnpj('11.222.333/0001-00')).toBe(false)
		expect(isValidCnpj('11222333000100')).toBe(false)
		expect(isValidCnpj('11.444.777/0001-99')).toBe(false)
	})

	it('should reject CNPJ with all same digits', () => {
		expect(isValidCnpj('00.000.000/0000-00')).toBe(false)
		expect(isValidCnpj('11.111.111/1111-11')).toBe(false)
		expect(isValidCnpj('22222222222222')).toBe(false)
		expect(isValidCnpj('99999999999999')).toBe(false)
	})

	it('should reject CNPJ with incorrect length', () => {
		expect(isValidCnpj('11.222.333/0001')).toBe(false)
		expect(isValidCnpj('112223330001')).toBe(false)
		expect(isValidCnpj('11.222.333/0001-811')).toBe(false)
	})

	it('should handle empty string', () => {
		expect(isValidCnpj('')).toBe(false)
	})
})

describe('isValidDocument', () => {
	it('should validate CPF when 11 digits', () => {
		expect(isValidDocument('123.456.789-09')).toBe(true)
		expect(isValidDocument('12345678909')).toBe(true)
	})

	it('should validate CNPJ when 14 digits', () => {
		expect(isValidDocument('11.222.333/0001-81')).toBe(true)
		expect(isValidDocument('11222333000181')).toBe(true)
	})

	it('should reject invalid CPF', () => {
		expect(isValidDocument('123.456.789-00')).toBe(false)
		expect(isValidDocument('111.111.111-11')).toBe(false)
	})

	it('should reject invalid CNPJ', () => {
		expect(isValidDocument('11.222.333/0001-00')).toBe(false)
		expect(isValidDocument('11.111.111/1111-11')).toBe(false)
	})

	it('should reject document with incorrect length', () => {
		expect(isValidDocument('123')).toBe(false)
		expect(isValidDocument('12345678')).toBe(false)
		expect(isValidDocument('123456789012')).toBe(false)
		expect(isValidDocument('123456789012345')).toBe(false)
	})

	it('should handle empty string', () => {
		expect(isValidDocument('')).toBe(false)
	})
})

describe('formatCpfCnpj - round-trip', () => {
	it('should format and strip correctly for CPF', () => {
		const input = '12345678909'
		const formatted = formatCpfCnpj(input)
		const stripped = stripNonDigits(formatted)

		expect(formatted).toBe('123.456.789-09')
		expect(stripped).toBe(input)
	})

	it('should format and strip correctly for CNPJ', () => {
		const input = '11222333000181'
		const formatted = formatCpfCnpj(input)
		const stripped = stripNonDigits(formatted)

		expect(formatted).toBe('11.222.333/0001-81')
		expect(stripped).toBe(input)
	})
})
