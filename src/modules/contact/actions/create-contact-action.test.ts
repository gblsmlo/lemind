import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Contact, ContactInsert } from '../types'

vi.mock('../repository/contact-drizzle-repository', () => ({
	contactRepository: {
		create: vi.fn(),
		findByDocumentInSpace: vi.fn(),
	},
}))

import { contactRepository } from '../repository/contact-drizzle-repository'
import { createContactAction } from './create-contact-action'

const mockContact: Contact = {
	id: '550e8400-e29b-41d4-a716-446655440010',
	name: 'John Doe',
	avatar: null,
	email: 'john.doe@example.com',
	phone: '+1234567890',
	notes: 'Test contact notes',
	document: '12345678909',
	type: 'NEW',
	spaceId: '550e8400-e29b-41d4-a716-446655440000',
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-01'),
}

const mockContactInsert: ContactInsert = {
	name: mockContact.name,
	email: mockContact.email,
	phone: mockContact.phone,
	notes: mockContact.notes,
	document: '12345678909',
	type: 'NEW',
	spaceId: mockContact.spaceId,
}

describe('createContactAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should create a contact successfully', async () => {
		vi.mocked(contactRepository.findByDocumentInSpace).mockResolvedValue({
			row: null,
		})
		vi.mocked(contactRepository.create).mockResolvedValue({ row: mockContact })

		const result = await createContactAction(mockContactInsert)

		expect(result.success).toBe(true)

		if (result.success) {
			expect(result.data.row).toEqual(mockContact)
		}

		expect(contactRepository.create).toHaveBeenCalledWith(mockContactInsert)
	})

	it('should return validation error for invalid input', async () => {
		const invalidInput = {
			name: '',
			spaceId: 'invalid-uuid',
		} as ContactInsert

		const result = await createContactAction(invalidInput)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
		}
		expect(contactRepository.create).not.toHaveBeenCalled()
	})

	it('should handle database error', async () => {
		const dbError = new Error('Database connection failed')
		vi.mocked(contactRepository.findByDocumentInSpace).mockResolvedValue({
			row: null,
		})
		vi.mocked(contactRepository.create).mockRejectedValue(dbError)

		const result = await createContactAction(mockContactInsert)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('DATABASE_ERROR')
			expect(result.message).toBe('Failed to create contact')
		}
	})

	it('should create contact with only required fields', async () => {
		const minimalInput: ContactInsert = {
			name: 'Minimal Contact',
			spaceId: mockContact.spaceId,
		}
		const minimalContact = {
			...mockContact,
			name: 'Minimal Contact',
			email: null,
			phone: null,
			notes: null,
		}

		vi.mocked(contactRepository.findByDocumentInSpace).mockResolvedValue({
			row: null,
		})
		vi.mocked(contactRepository.create).mockResolvedValue({
			row: minimalContact,
		})

		const result = await createContactAction(minimalInput)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.row.name).toBe('Minimal Contact')
		}
	})
})
