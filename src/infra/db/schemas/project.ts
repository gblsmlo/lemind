import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'
import { auditFields } from '../helpers'
import { spacesTable } from './space'

export const processesTable = pgTable('processes', {
	id: uuid().primaryKey().defaultRandom(),
	title: text(),
	description: text(),
	slug: text().notNull().unique(),
	processNumber: text('process_number'),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	spaceId: uuid('space_id')
		.notNull()
		.references(() => spacesTable.id, { onDelete: 'cascade' }),
	...auditFields,
})
