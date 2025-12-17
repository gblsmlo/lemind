'use server'

import { failure, type Result, success } from '@/shared/errors'
import { PostgrestError } from '@supabase/supabase-js'
import { cache } from 'react'
import { contactRepository } from '../repository/contact-drizzle-repository'
import type { Contact } from '../types'

type Output = {
	row: Contact | null
}

const action = async (id: string): Promise<Result<Output>> => {
	if (!id || typeof id !== 'string') {
		return failure({
			message: 'Contact ID is required',
			type: 'VALIDATION_ERROR',
		})
	}

	try {
		const { row } = await contactRepository.findById(id)

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
				message: 'Failed to find contact',
				type: 'UNKNOWN_ERROR',
				error,
			})
		}

		return failure({
			message: 'Failed to find contact',
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
		})
	}
}

export const findContactByIdAction = cache(action)
