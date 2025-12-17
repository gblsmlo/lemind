import type z from 'zod'
import type {
	contactInsertSchema,
	contactSelectSchema,
	contactUpdateSchema,
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

export type FindContactsInput = z.infer<typeof findContactsInput>

export type FindContactsOutput = {
	rows: Contact[] | null
	total: number
}

export type EntityRowOutput<T> = {
	row: T | null
}

export type EntityRowsOutput<T> = {
	rows: Array<T> | null
	total: number
}

export type FindContactOutput = {
	row: Contact | null
}

export type FindBySpaceIdOutput = {
	rows: Contact[] | null
}

export type FindDeletedOutput = {
	rows: Contact[] | null
}
