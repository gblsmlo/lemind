import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { taskPriorityEnum } from './_enums'
import { casesTable } from './case'
import { membersTable } from './member'
import { spacesTable } from './space'

export const tasksTable = pgTable('tasks', {
	id: uuid().defaultRandom().primaryKey(),
	assigneeId: uuid('assignee_id')
		.references(() => membersTable.id)
		.notNull(),
	caseId: uuid('case_id')
		.references(() => casesTable.id)
		.notNull(),
	description: text('description'),
	dueDate: timestamp('due_date'),
	priority: taskPriorityEnum('priority').default('MEDIUM'),
	spaceId: uuid('organization_id')
		.references(() => spacesTable.id)
		.notNull(),
	title: text('title').notNull(),
})
