'use client'

import { DataTableView } from '@/components/data-table/data-table-view'
import { DataTableCreateAction } from '@/components/data-table/data-tablet-create-action'
import { useState } from 'react'
import type { Contact } from '../types'
import { contactColumns } from './columns'
import { ContactSheet } from './contact-sheet/contact-sheet'

interface ContactDataTableProps {
	data: Contact[]
	pageCount: number
}

export function ContactDataTable({ data, pageCount }: ContactDataTableProps) {
	const [selectedContactId, setSelectedContactId] = useState<string | null>(
		null,
	)
	const [isSheetOpen, setIsSheetOpen] = useState(false)

	const handleRowClick = (contact: Contact) => {
		setSelectedContactId(contact.id)
		setIsSheetOpen(true)
	}

	const handleSheetOpenChange = (open: boolean) => {
		setIsSheetOpen(open)
		if (!open) {
			setSelectedContactId(null)
		}
	}

	return (
		<>
			<DataTableView
				actionToCreate={
					<DataTableCreateAction linkTo="contacts/new">
						Novo contato
					</DataTableCreateAction>
				}
				columns={contactColumns}
				data={data}
				onRowClick={handleRowClick}
				pageCount={pageCount}
			/>
			<ContactSheet
				contactId={selectedContactId}
				onOpenChange={handleSheetOpenChange}
				open={isSheetOpen}
			/>
		</>
	)
}
