'use server'

import { failure, type Result, success } from '@/shared/errors'
import { PostgrestError } from '@supabase/supabase-js'
import { cache } from 'react'
import { contactRepository } from '../repository/contact-drizzle-repository'
import { contactUpdateSchema } from '../schemas'
import type { Contact, ContactUpdate } from '../types'

type Output = {
	row: Contact
}

const action = async (
	id: string,
	input: ContactUpdate,
): Promise<Result<Output>> => {
	const validated = contactUpdateSchema.safeParse(input)

	if (!validated.success) {
		return failure({
			message: validated.error.message,
			type: 'VALIDATION_ERROR',
			error: validated.error,
		})
	}

	try {
		const { row } = await contactRepository.update(id, input)

		if (!row) {
			return failure({
				message: 'Contact not found',
				type: 'NOT_FOUND_ERROR',
			})
		}

		return success({
			row,
		})
	} catch (error) {
		if (error instanceof PostgrestError) {
			return failure({
				type: 'DATABASE_ERROR',
				message: error.message,
				error,
			})
		}

		if (error instanceof Error) {
			return failure({
				message: 'Failed to update contact',
				type: 'UNKNOWN_ERROR',
				error,
			})
		}

		return failure({
			message: 'Failed to update contact',
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
		})
	}
}

export const updateContactAction = cache(action)
