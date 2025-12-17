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
	spaceId: z.uuid(),
	searchQuery: z.string().optional(),
	sortBy: z.enum(['createdAt']).optional(),
	sortDirection: z.enum(['asc', 'desc']).optional(),
	page: z.number().min(1).optional().default(1),
	pageSize: z.number().min(1).optional().default(20),
})

export const contactFormSchema = z.object({
	name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.'),
	email: z.email('Insira um email válido.').optional().or(z.literal('')),
	phone: z.string().optional(),
	notes: z.string().optional(),
	spaceId: z.uuid(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
