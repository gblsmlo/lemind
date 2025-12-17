import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { taskPriorityEnum } from './_enums'
import { casesTable } from './case'
import { membersTable } from './member'
import { spacesTable } from './space'

export const tasksTable = pgTable('tasks', {
	id: uuid().defaultRandom().primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	assigneeId: uuid('assignee_id')
		.references(() => membersTable.id)
		.notNull(),
	caseId: uuid('case_id')
		.references(() => casesTable.id)
		.notNull(),
	dueDate: timestamp('due_date'),
	priority: taskPriorityEnum('priority').default('MEDIUM'),
	spaceId: uuid('organization_id')
		.references(() => spacesTable.id)
		.notNull(),
})
