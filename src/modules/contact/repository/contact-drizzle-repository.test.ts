import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/infra/db', () => ({
	db: {},
	contactsTable: {
		id: 'mock-id',
		name: 'mock-name',
		email: 'mock-email',
		phone: 'mock-phone',
		notes: 'mock-notes',
		spaceId: 'mock-spaceId',
		createdAt: 'mock-createdAt',
		updatedAt: 'mock-updatedAt',
	},
}))

import type { Database } from '@/infra/db'
import { contactsTable } from '@/infra/db'
import type { Contact, ContactInsert, ContactUpdate } from '../types'
import { ContactDrizzleRepository } from './contact-drizzle-repository'

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

const mockContactInsert: ContactInsert = {
	name: mockContact.name,
	email: mockContact.email,
	phone: mockContact.phone,
	notes: mockContact.notes,
	spaceId: mockContact.spaceId,
}

const mockContactUpdate: ContactUpdate = {
	name: 'Jane Doe',
	email: 'jane.doe@example.com',
}

describe('ContactDrizzleRepository', () => {
	let repository: ContactDrizzleRepository
	let mockDb: Database

	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('create', () => {
		it('should create a new contact successfully', async () => {
			const mockReturning = vi.fn().mockResolvedValue([mockContact])
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues })

			mockDb = {
				insert: mockInsert,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.create(mockContactInsert)

			expect(mockInsert).toHaveBeenCalledWith(contactsTable)
			expect(mockValues).toHaveBeenCalledWith(mockContactInsert)
			expect(mockReturning).toHaveBeenCalled()
			expect(result).toEqual({ row: mockContact })
		})

		it('should propagate error when database fails', async () => {
			const dbError = new Error('Database connection failed')
			const mockReturning = vi.fn().mockRejectedValue(dbError)
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues })

			mockDb = {
				insert: mockInsert,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			await expect(repository.create(mockContactInsert)).rejects.toThrow(
				'Database connection failed',
			)
		})

		it('should create contact with only required fields', async () => {
			const minimalInsert: ContactInsert = {
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

			const mockReturning = vi.fn().mockResolvedValue([minimalContact])
			const mockValues = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockInsert = vi.fn().mockReturnValue({ values: mockValues })

			mockDb = {
				insert: mockInsert,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.create(minimalInsert)

			expect(result).toEqual({ row: minimalContact })
			expect(mockValues).toHaveBeenCalledWith(minimalInsert)
		})
	})

	describe('update', () => {
		it('should update existing contact successfully', async () => {
			const updatedContact = { ...mockContact, ...mockContactUpdate }
			const mockReturning = vi.fn().mockResolvedValue([updatedContact])
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
			const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

			mockDb = {
				update: mockUpdate,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.update(mockContact.id, mockContactUpdate)

			expect(mockUpdate).toHaveBeenCalledWith(contactsTable)
			expect(mockSet).toHaveBeenCalledWith(mockContactUpdate)
			expect(mockWhere).toHaveBeenCalled()
			expect(mockReturning).toHaveBeenCalled()
			expect(result).toEqual({ row: updatedContact })
		})

		it('should propagate error when update fails', async () => {
			const dbError = new Error('Update failed')
			const mockReturning = vi.fn().mockRejectedValue(dbError)
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
			const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

			mockDb = {
				update: mockUpdate,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			await expect(
				repository.update(mockContact.id, mockContactUpdate),
			).rejects.toThrow('Update failed')
		})

		it('should return row as undefined when no record is found', async () => {
			const mockReturning = vi.fn().mockResolvedValue([])
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockSet = vi.fn().mockReturnValue({ where: mockWhere })
			const mockUpdate = vi.fn().mockReturnValue({ set: mockSet })

			mockDb = {
				update: mockUpdate,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.update(
				'non-existent-id',
				mockContactUpdate,
			)

			expect(result).toEqual({ row: undefined })
		})
	})

	describe('delete', () => {
		it('should delete a contact successfully and return deletedId', async () => {
			const mockReturning = vi.fn().mockResolvedValue([{ id: mockContact.id }])
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockDelete = vi.fn().mockReturnValue({ where: mockWhere })

			mockDb = {
				delete: mockDelete,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.delete(mockContact.id)

			expect(mockDelete).toHaveBeenCalledWith(contactsTable)
			expect(mockWhere).toHaveBeenCalled()
			expect(mockReturning).toHaveBeenCalled()
			expect(result).toEqual({ deletedId: mockContact.id })
		})

		it('should propagate error when delete fails', async () => {
			const dbError = new Error('Delete failed')
			const mockReturning = vi.fn().mockRejectedValue(dbError)
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockDelete = vi.fn().mockReturnValue({ where: mockWhere })

			mockDb = {
				delete: mockDelete,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			await expect(repository.delete(mockContact.id)).rejects.toThrow(
				'Delete failed',
			)
		})

		it('should handle attempt to delete non-existent record', async () => {
			const mockReturning = vi.fn().mockResolvedValue([])
			const mockWhere = vi.fn().mockReturnValue({ returning: mockReturning })
			const mockDelete = vi.fn().mockReturnValue({ where: mockWhere })

			mockDb = {
				delete: mockDelete,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.delete('non-existent-id')

			expect(result.deletedId).toBeUndefined()
		})
	})

	describe('findById', () => {
		it('should find contact by id successfully', async () => {
			const mockWhere = vi.fn().mockResolvedValue([mockContact])
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findById(mockContact.id)

			expect(mockSelect).toHaveBeenCalled()
			expect(mockFrom).toHaveBeenCalledWith(contactsTable)
			expect(mockWhere).toHaveBeenCalled()
			expect(result).toEqual({ row: mockContact })
		})

		it('should return row as undefined when no contact is found', async () => {
			const mockWhere = vi.fn().mockResolvedValue([])
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findById('non-existent-id')

			expect(result).toEqual({ row: undefined })
		})

		it('should propagate error when query fails', async () => {
			const dbError = new Error('Query failed')
			const mockWhere = vi.fn().mockRejectedValue(dbError)
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			await expect(repository.findById(mockContact.id)).rejects.toThrow(
				'Query failed',
			)
		})
	})

	describe('findMany', () => {
		const mockFindManyInput = {
			spaceId: mockContact.spaceId,
			page: 1,
			pageSize: 20,
		}

		it('should find contacts with pagination', async () => {
			const mockTotalResult = [{ total: 1 }]

			vi.spyOn(Promise, 'all').mockResolvedValue([
				[mockContact],
				mockTotalResult,
			])

			const mockLimit = vi.fn().mockReturnValue(Promise.resolve([mockContact]))
			const mockOffset = vi.fn().mockReturnValue({ limit: mockLimit })
			const mockOrderBy = vi.fn().mockReturnValue({ offset: mockOffset })
			const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findMany(mockFindManyInput)

			expect(result).toEqual({
				rows: [mockContact],
				total: 1,
			})
		})

		it('should find contacts with search query', async () => {
			const inputWithSearch = {
				...mockFindManyInput,
				searchQuery: 'John',
			}

			const mockTotalResult = [{ total: 1 }]

			vi.spyOn(Promise, 'all').mockResolvedValue([
				[mockContact],
				mockTotalResult,
			])

			const mockLimit = vi.fn().mockReturnValue(Promise.resolve([mockContact]))
			const mockOffset = vi.fn().mockReturnValue({ limit: mockLimit })
			const mockOrderBy = vi.fn().mockReturnValue({ offset: mockOffset })
			const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findMany(inputWithSearch)

			expect(result.rows).toBeDefined()
			expect(result.total).toBe(1)
		})

		it('should apply sorting when sortBy is provided', async () => {
			const inputWithSort = {
				...mockFindManyInput,
				sortBy: 'createdAt' as const,
				sortDirection: 'asc' as const,
			}

			const mockTotalResult = [{ total: 1 }]

			vi.spyOn(Promise, 'all').mockResolvedValue([
				[mockContact],
				mockTotalResult,
			])

			const mockLimit = vi.fn().mockReturnValue(Promise.resolve([mockContact]))
			const mockOffset = vi.fn().mockReturnValue({ limit: mockLimit })
			const mockOrderBy = vi.fn().mockReturnValue({ offset: mockOffset })
			const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findMany(inputWithSort)

			expect(result.rows).toBeDefined()
			expect(mockOrderBy).toHaveBeenCalled()
		})

		it('should return empty rows when no contacts found', async () => {
			const mockTotalResult = [{ total: 0 }]

			vi.spyOn(Promise, 'all').mockResolvedValue([[], mockTotalResult])

			const mockLimit = vi.fn().mockReturnValue(Promise.resolve([]))
			const mockOffset = vi.fn().mockReturnValue({ limit: mockLimit })
			const mockOrderBy = vi.fn().mockReturnValue({ offset: mockOffset })
			const mockWhere = vi.fn().mockReturnValue({ orderBy: mockOrderBy })
			const mockFrom = vi.fn().mockReturnValue({ where: mockWhere })
			const mockSelect = vi.fn().mockReturnValue({ from: mockFrom })

			mockDb = {
				select: mockSelect,
			} as unknown as Database

			repository = new ContactDrizzleRepository(mockDb)

			const result = await repository.findMany(mockFindManyInput)

			expect(result).toEqual({
				rows: [],
				total: 0,
			})
		})
	})
})
