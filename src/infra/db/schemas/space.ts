import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'
import { auditFields } from '../helpers'
import { clientsTable } from './client'
import { contactsTable } from './contact'
import { membersTable } from './member'

export const spacesTable = pgTable('spaces', {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	description: text(),
	ownerId: uuid('owner_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	slug: text().unique().notNull(),
	...auditFields,
})

export const spaceRelations = relations(spacesTable, ({ many }) => ({
	clients: many(clientsTable),
	contacts: many(contactsTable),
	members: many(membersTable),
}))
