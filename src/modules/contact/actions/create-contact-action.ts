'use server'

import { failure, type Result, success } from '@/shared/errors'
import { contactRepository } from '../repository/contact-drizzle-repository'
import { contactInsertSchema } from '../schemas'
import type { Contact, ContactInsert } from '../types'

type Output = {
	row: Contact
}

export const createContactAction = async (
	insert: ContactInsert,
): Promise<Result<Output>> => {
	const validated = contactInsertSchema.safeParse(insert)

	if (!validated.success) {
		return failure({
			message: validated.error.message,
			type: 'VALIDATION_ERROR',
			error: validated.error,
		})
	}

	const { name, email, phone, notes, avatar, type, spaceId } = validated.data

	try {
		const result = await contactRepository.create({
			name,
			email,
			phone,
			notes,
			avatar,
			type,
			spaceId, // TODO: Get from context/session
		})

		if (!result.row) {
			return failure({
				message: 'Failed to create contact',
				type: 'DATABASE_ERROR',
				error: 'Contact not created',
			})
		}

		const { row } = result
		return success({
			row,
		})
	} catch (error) {
		console.error(error)

		if (error instanceof Error) {
			return failure({
				message: 'Failed to create contact',
				type: 'DATABASE_ERROR',
				error,
			})
		}

		return failure({
			message: 'Failed to create contact',
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
		})
	}
}
