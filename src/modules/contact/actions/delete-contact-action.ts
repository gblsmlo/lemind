'use server'

import { failure, type Result, success } from '@/shared/errors'
import { PostgrestError } from '@supabase/supabase-js'
import { cache } from 'react'
import { contactRepository } from '../repository/contact-drizzle-repository'

type Output = {
	deletedId: string
}

const action = async (id: string): Promise<Result<Output>> => {
	if (!id) {
		return failure({
			message: 'Contact ID is required',
			type: 'VALIDATION_ERROR',
		})
	}

	try {
		const result = await contactRepository.delete(id)

		if (!result || !result.deletedId) {
			return failure({
				message: 'Contact not found',
				type: 'NOT_FOUND_ERROR',
			})
		}

		return success({
			deletedId: result.deletedId,
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
				message: 'Failed to delete contact',
				type: 'UNKNOWN_ERROR',
				error,
			})
		}

		return failure({
			message: 'Failed to delete contact',
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
		})
	}
}

export const deleteContactAction = cache(action)
