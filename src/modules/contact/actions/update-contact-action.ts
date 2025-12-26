'use server'

import { stripNonDigits } from '@/lib/validators'
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
	if (!id) {
		return failure({
			message: 'Contact ID is required',
			type: 'VALIDATION_ERROR',
		})
	}

	const validated = contactUpdateSchema.safeParse(input)

	if (!validated.success) {
		return failure({
			message: validated.error.message,
			type: 'VALIDATION_ERROR',
			error: validated.error,
		})
	}

	try {
		// Verificar se o documento já existe no mesmo espaço (exceto o contato atual)
		if (validated.data.document) {
			const sanitizedDocument = stripNonDigits(validated.data.document)

			// Primeiro buscar o contato para obter o spaceId
			const currentContact = await contactRepository.findById(id)
			if (!currentContact.row) {
				return failure({
					message: 'Contact not found',
					type: 'NOT_FOUND_ERROR',
				})
			}

			const existing = await contactRepository.findByDocumentInSpace(
				sanitizedDocument,
				currentContact.row.spaceId,
				id,
			)

			if (existing.row && existing.row.id !== id) {
				return failure({
					message: 'Já existe um contato com este documento neste espaço.',
					type: 'VALIDATION_ERROR',
					error: 'Duplicate document',
				})
			}

			// Sanitizar o documento antes de atualizar
			validated.data.document = sanitizedDocument
		}

		// Se document for uma string vazia, transformar em null
		if (validated.data.document === '') {
			validated.data.document = null
		}

		const { row } = await contactRepository.update(id, validated.data)

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
