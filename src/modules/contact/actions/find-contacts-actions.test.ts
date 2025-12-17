import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Contact } from '../types'

vi.mock('../repository/contact-drizzle-repository', () => ({
	contactRepository: {
		findMany: vi.fn(),
	},
}))

import { contactRepository } from '../repository/contact-drizzle-repository'
import { findContacts } from './find-contacts-actions'

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

describe('findContacts', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should find contacts with pagination', async () => {
		const mockOutput = {
			rows: [mockContact],
			total: 1,
		}
		vi.mocked(contactRepository.findMany).mockResolvedValue(mockOutput)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
			page: 1,
			pageSize: 20,
		})

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.rows).toEqual([mockContact])
			expect(result.data.total).toBe(1)
		}
		expect(contactRepository.findMany).toHaveBeenCalledWith({
			spaceId: mockContact.spaceId,
			page: 1,
			pageSize: 20,
		})
	})

	it('should return validation error for invalid input', async () => {
		const invalidInput = {
			spaceId: 'invalid-uuid',
			page: 1,
			pageSize: 20,
		}

		const result = await findContacts(
			invalidInput as unknown as Parameters<typeof findContacts>[0],
		)

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('VALIDATION_ERROR')
		}
		expect(contactRepository.findMany).not.toHaveBeenCalled()
	})

	it('should find contacts with search query', async () => {
		const mockOutput = {
			rows: [mockContact],
			total: 1,
		}
		vi.mocked(contactRepository.findMany).mockResolvedValue(mockOutput)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
			searchQuery: 'John',
			page: 1,
			pageSize: 20,
		})

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.rows).toEqual([mockContact])
		}
	})

	it('should find contacts with sorting', async () => {
		const mockOutput = {
			rows: [mockContact],
			total: 1,
		}
		vi.mocked(contactRepository.findMany).mockResolvedValue(mockOutput)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
			sortBy: 'createdAt' as const,
			sortDirection: 'asc' as const,
			page: 1,
			pageSize: 20,
		})

		expect(result.success).toBe(true)
		expect(contactRepository.findMany).toHaveBeenCalled()
	})

	it('should return empty result when no contacts found', async () => {
		const mockOutput = {
			rows: null,
			total: 0,
		}
		vi.mocked(contactRepository.findMany).mockResolvedValue(mockOutput)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
			page: 1,
			pageSize: 20,
		})

		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.rows).toBeNull()
			expect(result.data.total).toBe(0)
		}
	})

	it('should handle database error', async () => {
		const dbError = new Error('Database query failed')
		vi.mocked(contactRepository.findMany).mockRejectedValue(dbError)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
			page: 1,
			pageSize: 20,
		})

		expect(result.success).toBe(false)
		if (!result.success) {
			expect(result.type).toBe('UNKNOWN_ERROR')
			expect(result.message).toBe('Failed to find contacts')
		}
	})

	it('should use default pagination values', async () => {
		const mockOutput = {
			rows: [mockContact],
			total: 1,
		}
		vi.mocked(contactRepository.findMany).mockResolvedValue(mockOutput)

		const result = await findContacts({
			spaceId: mockContact.spaceId,
		} as unknown as Parameters<typeof findContacts>[0])

		expect(result.success).toBe(true)
		expect(contactRepository.findMany).toHaveBeenCalled()
	})
})
