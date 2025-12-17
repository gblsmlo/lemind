import { pgEnum, pgTable, uuid } from 'drizzle-orm/pg-core'
import { authUsers } from 'drizzle-orm/supabase'
import { auditFields } from '../helpers'
import { spacesTable } from './space'

export const memberRoleEnum = pgEnum('roles', ['owner', 'admin', 'member'])

export const membersTable = pgTable('members', {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	role: memberRoleEnum().notNull().default('owner'),
	spaceId: uuid('space_id')
		.notNull()
		.references(() => spacesTable.id, { onDelete: 'cascade' }),
	...auditFields,
})
