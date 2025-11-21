import { pgTable, text } from 'drizzle-orm/pg-core'
import { uuidv7 } from 'uuidv7'
import { auditFieldsWithDeletedAt } from '../helpers/audit-fields'

export const accounts = pgTable('accounts', {
	_id: text('id')
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	email: text('email').notNull(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number'),
	...auditFieldsWithDeletedAt,
})
