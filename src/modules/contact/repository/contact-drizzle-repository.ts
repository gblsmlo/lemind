import { type Database, db } from '@/infra/db/client'
import { contactsTable } from '@/infra/db/schemas'
import { and, asc, count, desc, eq, ilike } from 'drizzle-orm'
import type {
	Contact,
	ContactInsert,
	ContactUpdate,
	EntityRowOutput,
	EntityRowsOutput,
	FindContactsInput,
} from '../types'
import type { ContactRepository } from './contact-repository'

export class ContactDrizzleRepository implements ContactRepository {
	constructor(private db: Database) {}

	async create(input: ContactInsert): Promise<EntityRowOutput<Contact>> {
		const [row] = await this.db.insert(contactsTable).values(input).returning()

		return { row }
	}

	async update(
		id: string,
		input: ContactUpdate,
	): Promise<EntityRowOutput<Contact>> {
		const [row] = await this.db
			.update(contactsTable)
			.set(input)
			.where(eq(contactsTable.id, id))
			.returning()

		return { row }
	}

	async delete(id: string): Promise<{ deletedId: string }> {
		const [row] = await this.db
			.delete(contactsTable)
			.where(eq(contactsTable.id, id))
			.returning({ id: contactsTable.id })

		return {
			deletedId: row?.id,
		}
	}

	async findById(id: string): Promise<EntityRowOutput<Contact>> {
		const [row] = await this.db
			.select()
			.from(contactsTable)
			.where(eq(contactsTable.id, id))

		return {
			row,
		}
	}

	async findMany(input: FindContactsInput): Promise<EntityRowsOutput<Contact>> {
		const offset = (input.page - 1) * input.pageSize

		const spaceCondition = eq(contactsTable.spaceId, input.spaceId)

		const searchCondition = input.searchQuery
			? ilike(contactsTable.name, `%${input.searchQuery}%`)
			: undefined

		const condition = searchCondition
			? and(spaceCondition, searchCondition)
			: spaceCondition

		const [rows, [{ total }]] = await Promise.all([
			this.db
				.select()
				.from(contactsTable)
				.where(condition)
				.orderBy((fields) => {
					if (input.sortBy && input.sortDirection === 'asc') {
						return asc(fields[input.sortBy])
					}

					if (input.sortBy && input.sortDirection === 'desc') {
						return desc(fields[input.sortBy])
					}

					return desc(fields.id)
				})
				.offset(offset)
				.limit(input.pageSize),

			this.db
				.select({ total: count(contactsTable.id) })
				.from(contactsTable)
				.where(condition),
		])

		return {
			rows,
			total,
		}
	}
}

export const contactRepository = new ContactDrizzleRepository(db)
