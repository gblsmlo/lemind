import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Contact, ContactUpdate } from '../types'

vi.mock('../repository/contact-drizzle-repository', () => ({
	contactRepository: {
		update: vi.fn(),
		findById: vi.fn(),
		findByDocumentInSpace: vi.fn(),
	},
}))

import { contactRepository } from '../repository/contact-drizzle-repository'
import { updateContactAction } from './update-contact-action'

const mockContact: Contact = {
	id: '550e8400-e29b-41d4-a716-446655440010',
	name: 'John Doe',
	email: 'john.doe@example.com',
	phone: '+1234567890',
	notes: 'Test contact notes',
	document: '12345678909',
	type: 'NEW',
	spaceId: '550e8400-e29b-41d4-a716-446655440000',
	createdAt: new Date('2024-01-01'),
	updatedAt: new Date('2024-01-01'),
}

const mockContactUpdate: ContactUpdate = {
	name: 'Jane Doe',
	email: 'jane.doe@example.com',
}

describe('updateContactAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should update contact successfully', async () => {
		const updatedContact = { ...mockContact, ...mockContactUpdate }
		vi.mocked(contactRepository.findById).mockResolvedValue({
			row: mockContact,
		})
		vi.mocked(contactRepository.findByDocumentInSpace).mockResolvedValue({
			row: undefined,
		})
		vi.mocked(contactRepository.update).mockResolvedValue({
			row: updatedContact,
		})

		const result = await updateContactAction(mockContact.id, mockContactUpdate)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.row).toEqual(updatedContact)
		}
		expect(contactRepository.update).toHaveBeenCalledWith(
			mockContact.id,
			mockContactUpdate,
		)
	})

	it('should return validation error for missing id', async () => {
		const result = await updateContactAction('', mockContactUpdate)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
			expect(result.message).toBe('Contact ID is required')
		}
		expect(contactRepository.findById).not.toHaveBeenCalled()
		expect(contactRepository.update).not.toHaveBeenCalled()
	})

	it('should return validation error for invalid input', async () => {
		const invalidUpdate = {
			id: 'cannot-update-id',
			spaceId: 'cannot-update-spaceId',
		} as unknown as ContactUpdate

		const result = await updateContactAction(mockContact.id, invalidUpdate)

		expect(result.success).toBe(false)

		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
		}
	})

	it('should return not found error when contact does not exist', async () => {
		vi.mocked(contactRepository.update).mockResolvedValue({
			row: undefined,
		})

		const result = await updateContactAction(
			'non-existent-id',
			mockContactUpdate,
		)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('NOT_FOUND_ERROR')
			expect(result.message).toBe('Contact not found')
		}
	})

	it('should handle database error', async () => {
		const dbError = new Error('Update failed')
		vi.mocked(contactRepository.update).mockRejectedValue(dbError)

		const result = await updateContactAction(mockContact.id, mockContactUpdate)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('UNKNOWN_ERROR')
			expect(result.message).toBe('Failed to update contact')
		}
	})
})
