import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../repository/contact-drizzle-repository', () => ({
	contactRepository: {
		delete: vi.fn(),
	},
}))

import { contactRepository } from '../repository/contact-drizzle-repository'
import { deleteContactAction } from './delete-contact-action'

describe('deleteContactAction', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should delete contact successfully', async () => {
		vi.mocked(contactRepository.delete).mockResolvedValue({
			deletedId: '550e8400-e29b-41d4-a716-446655440010',
		})

		const result = await deleteContactAction(
			'550e8400-e29b-41d4-a716-446655440010',
		)

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.deletedId).toBe('550e8400-e29b-41d4-a716-446655440010')
		}
		expect(contactRepository.delete).toHaveBeenCalledWith(
			'550e8400-e29b-41d4-a716-446655440010',
		)
	})

	it('should return validation error for missing id', async () => {
		const result = await deleteContactAction('')

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
			expect(result.message).toBe('Contact ID is required')
		}
		expect(contactRepository.delete).not.toHaveBeenCalled()
	})

	it('should return not found error when contact does not exist', async () => {
		vi.mocked(contactRepository.delete).mockResolvedValue({
			deletedId: undefined as unknown as string,
		})

		const result = await deleteContactAction('non-existent-id')

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('NOT_FOUND_ERROR')
			expect(result.message).toBe('Contact not found')
		}
	})

	it('should handle database error', async () => {
		const dbError = new Error('Delete failed')
		vi.mocked(contactRepository.delete).mockRejectedValue(dbError)

		const result = await deleteContactAction(
			'550e8400-e29b-41d4-a716-446655440010',
		)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('UNKNOWN_ERROR')
			expect(result.message).toBe('Failed to delete contact')
		}
	})
})
