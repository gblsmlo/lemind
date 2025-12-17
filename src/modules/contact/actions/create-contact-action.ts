'use server'

import { failure, type Result, success } from '@/shared/errors'
import { PostgrestError } from '@supabase/supabase-js'
import { cache } from 'react'
import { contactRepository } from '../repository/contact-drizzle-repository'
import { contactInsertSchema } from '../schemas'
import type { Contact, ContactInsert } from '../types'

type Output = {
	row: Contact
}

const action = async (input: ContactInsert): Promise<Result<Output>> => {
	const validated = contactInsertSchema.safeParse(input)

	if (!validated.success) {
		return failure({
			message: validated.error.message,
			type: 'VALIDATION_ERROR',
			error: validated.error,
		})
	}

	const { name, email, phone, notes, spaceId } = input

	try {
		const result = await contactRepository.create({
			name,
			email,
			phone,
			notes,
			spaceId,
		})

		if (!result.row) {
			return failure({
				message: 'Failed to create contact',
				type: 'DATABASE_ERROR',
				error: 'Contact not created',
			})
		}

		return success({
			row: result.row,
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
				message: 'Failed to create contact',
				type: 'UNKNOWN_ERROR',
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

export const createContactAction = cache(action)
