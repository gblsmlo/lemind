import { relations } from 'drizzle-orm'
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { auditFields } from '../helpers'
import { contactStatusEnum } from './_enums'
import { spacesTable } from './space'

export const contactsTable = pgTable('contacts', {
	id: uuid().defaultRandom().primaryKey(),
	avatar: text('avatar_url'),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	notes: text(),
	document: text(),
	type: contactStatusEnum().default('NEW').notNull(),
	spaceId: uuid('space_id')
		.references(() => spacesTable.id)
		.notNull(),
	...auditFields,
})

export const contactRelations = relations(contactsTable, ({ one }) => ({
	space: one(spacesTable, {
		fields: [contactsTable.spaceId],
		references: [spacesTable.id],
	}),
}))
