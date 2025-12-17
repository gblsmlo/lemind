import { relations } from 'drizzle-orm'
import { decimal, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { auditFields } from '../helpers'
import { caseStatusEnum } from './_enums'
import { clientsTable } from './client'
import { spacesTable } from './space'
import { tasksTable } from './task'

export const casesTable = pgTable('cases', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').notNull(),
	caseNumber: text('case_number').notNull(),
	caseValue: decimal('case_value', { precision: 10, scale: 2 }),
	court: text('court'),
	status: caseStatusEnum('status').default('ACTIVE').notNull(),
	clientId: uuid('client_id')
		.references(() => clientsTable.id)
		.notNull(),
	spaceId: uuid('space_id')
		.references(() => spacesTable.id)
		.notNull(),
	...auditFields,
})

export const caseRelations = relations(casesTable, ({ one, many }) => ({
	client: one(clientsTable, {
		fields: [casesTable.clientId],
		references: [clientsTable.id],
	}),
	tasks: many(tasksTable),
}))
