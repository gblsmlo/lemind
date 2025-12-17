import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { auditFields } from '../helpers'
import { contactsTable } from './contact'
import { spacesTable } from './space'

export const clientStatusEnum = pgEnum('client_status', ['active', 'inactive'])

export const clientsTable = pgTable('clients', {
	id: uuid().primaryKey().defaultRandom(),
	title: text().notNull(),
	document: text('document'),
	notes: text('notes'),
	status: clientStatusEnum().notNull().default('active'),
	mainContactId: uuid('main_contact_id')
		.notNull()
		.references(() => contactsTable.id),
	spaceId: uuid()
		.notNull()
		.references(() => spacesTable.id, { onDelete: 'cascade' }),
	...auditFields,
})
