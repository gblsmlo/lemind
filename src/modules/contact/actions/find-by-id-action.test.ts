import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Contact } from '../types'

vi.mock('../repository/contact-drizzle-repository', () => ({
	contactRepository: {
		findById: vi.fn(),
	},
}))

import { contactRepository } from '../repository/contact-drizzle-repository'
import { findContactByIdAction } from './find-by-id-action'

const mockContact: Contact = {
	id: '550e8400-e29b-41d4-a716-446655440010',
	name: 'John Doe',
	email: 'john.doe@example.com',
	phone: '+1234567890',
	notes: 'Test contact notes',
	spaceId: '550e8400-e29b-41d4-a716-446655440000',
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-01'),
}

describe('findContactByIdAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should find contact by id successfully', async () => {
		vi.mocked(contactRepository.findById).mockResolvedValue({
			row: mockContact,
		})

		const result = await findContactByIdAction(mockContact.id)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.row).toEqual(mockContact)
		}
		expect(contactRepository.findById).toHaveBeenCalledWith(mockContact.id)
	})

	it('should return validation error for missing id', async () => {
		const result = await findContactByIdAction('')

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
			expect(result.message).toBe('Contact ID is required')
		}
		expect(contactRepository.findById).not.toHaveBeenCalled()
	})

	it('should return not found error when contact does not exist', async () => {
		vi.mocked(contactRepository.findById).mockResolvedValue({ row: undefined })

		const result = await findContactByIdAction('non-existent-id')

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('NOT_FOUND_ERROR')
			expect(result.message).toBe('Contact not found')
		}
	})

	it('should handle database error', async () => {
		const dbError = new Error('Database query failed')
		vi.mocked(contactRepository.findById).mockRejectedValue(dbError)

		const result = await findContactByIdAction(mockContact.id)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('UNKNOWN_ERROR')
			expect(result.message).toBe('Failed to find contact')
		}
	})
})
