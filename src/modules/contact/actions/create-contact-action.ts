'use server'

import { failure, type Result, success } from '@/shared/errors'
import { contactRepository } from '../repository/contact-drizzle-repository'
import { type CreateContactInput, createContactInput } from '../schemas'
import type { Contact } from '../types'

type Output = {
	row: Contact
}

export const createContactAction = async (
	data: CreateContactInput,
): Promise<Result<Output>> => {
	const validated = createContactInput.safeParse(data)

	if (!validated.success) {
		return failure({
			message: validated.error.message,
			type: 'VALIDATION_ERROR',
			error: validated.error,
		})
	}

	const { name, email, phone, notes, avatarUrl } = validated.data

	try {
		const result = await contactRepository.create({
			name,
			email,
			phone,
			notes,
			avatar: avatarUrl ?? null,
			spaceId: 'a069aabe-abdd-4b03-9c11-84437f7d1384', // TODO: Get from context/session
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
