'use server'

import { failure, type Result, success } from '@/shared/errors/result'
import { PostgrestError } from '@supabase/supabase-js'
import { cache } from 'react'
import { contactRepository } from '../repository/contact-drizzle-repository'
import { findContactsInput } from '../schemas'
import type { Contact, FindContactsInput } from '../types'

type Output = {
	rows: Contact[] | null
	total: number
}

async function action(input: FindContactsInput): Promise<Result<Output>> {
	const validated = findContactsInput.safeParse(input)

	if (!validated.success) {
		return failure({
			type: 'VALIDATION_ERROR',
			error: validated.error.name,
			message: validated.error.message,
		})
	}

	try {
		const { rows, total } = await contactRepository.findMany({
			spaceId: input.spaceId,
			searchQuery: input.searchQuery,
			sortBy: input.sortBy,
			page: input.page,
			pageSize: input.pageSize,
		})

		return success({
			rows,
			total,
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
				message: 'Failed to find contacts',
				type: 'UNKNOWN_ERROR',
				error,
			})
		}

		return failure({
			message: 'Failed to find contacts',
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
		})
	}
}

export const findContacts = cache(action)
