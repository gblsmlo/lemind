import type z from 'zod'
import type {
	contactInsertFormSchema,
	contactInsertSchema,
	contactSelectSchema,
	contactUpdateSchema,
	contacUpdateFormSchema,
	findContactsInput,
} from './schemas'

export const contactStatusTypes = [
	'NEW',
	'QUALIFIED',
	'NEGOTIATION',
	'CONVERTED',
	'LOST',
] as const

export type ContactStatusType = (typeof contactStatusTypes)[number]

export const contactSourceTypes = [
	'WEBSITE',
	'REFERRAL',
	'SOCIAL_MEDIA',
	'AD_CAMPAIGN',
	'OTHER',
] as const

export type Contact = z.infer<typeof contactSelectSchema>
export type ContactInsert = z.infer<typeof contactInsertSchema>
export type ContactUpdate = z.infer<typeof contactUpdateSchema>

export type ContactFormData = z.infer<typeof contactInsertFormSchema>
export type ContactInsertFormData = z.infer<typeof contactInsertFormSchema>
export type ContactUpdateFormData = z.infer<typeof contacUpdateFormSchema>

export type FindContactsInput = z.infer<typeof findContactsInput>

export type EntityRowOutput<T> = {
	row: T | null
}

export type EntityRowsOutput<T> = {
	rows: Array<T> | null
	total: number
}
