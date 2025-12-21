import { contactsTable } from '@/infra/db/schemas'
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from 'drizzle-zod'
import z from 'zod'

export const contactSelectSchema = createSelectSchema(contactsTable)
export const contactInsertSchema = createInsertSchema(contactsTable)
export const contactUpdateSchema = createUpdateSchema(contactsTable)

export const findContactsInput = z.object({
	searchQuery: z.string().optional(),
	sortBy: z.enum(['createdAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	page: z.number().min(1).optional().default(1),
	pageSize: z.number().min(1).optional().default(20),
	spaceId: z.uuid(),
})

export const contactInsertFormSchema = z.object({
	avatar: z.instanceof(File).nullable().optional(),
	name: z
		.string({ message: 'O nome é obrigatório.' })
		.min(2, 'O nome deve ter no mínimo 2 caracteres.'),
	email: z.email('Insira um email válido.'),
	phone: z.string().optional(),
	notes: z.string().optional(),
})

export const contacUpdateFormSchema = z.object({
	avatar: z
		.union([z.instanceof(File), z.string().url()])
		.nullable()
		.optional(),
	name: z
		.string({ message: 'O nome é obrigatório.' })
		.min(2, 'O nome deve ter no mínimo 2 caracteres.'),
	email: z.email('Insira um email válido.'),
	phone: z.string().optional(),
	notes: z.string().optional(),
})
