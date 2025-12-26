'use client'

import {
	TableCellAction,
	TableCellText,
	TableCellTextEmpty,
} from '@/components/data-table/data-table-cell'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { useSheetPanel } from '@/hooks/use-sheet-panel'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui-react'
import { format } from 'date-fns'
import { useStoreContact } from '../store'
import type { Contact } from '../types'
import { DataTableContactRowActions } from './row-actions'

export const contactColumns: ColumnDef<Contact>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => {
			const { toggleOpenSheet } = useSheetPanel()
			const { onSelected } = useStoreContact()

			const contact = row.original

			function handleSelected() {
				onSelected(contact)
				toggleOpenSheet()
			}

			return (
				<TableCellAction onClick={handleSelected}>
					<div className="inline-flex items-center gap-2 px-1">
						<Avatar size="sm">
							<AvatarImage
								alt={contact.name}
								src={contact.avatar ?? undefined}
							/>
							<AvatarFallback>{contact.name}</AvatarFallback>
						</Avatar>
						<TableCellText>{contact.name}</TableCellText>
					</div>
				</TableCellAction>
			)
		},
		enableColumnFilter: true,
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Name" />
		),
		meta: {
			label: 'Name',
			placeholder: 'Filter by name...',
			variant: 'text',
		},
	},
	{
		accessorKey: 'email',
		cell: ({ row }) =>
			row.getValue('email') ? (
				<TableCellText>{row.getValue('email')}</TableCellText>
			) : (
				<TableCellTextEmpty />
			),
		enableColumnFilter: true,
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Email" />
		),
		meta: {
			label: 'Email',
		},
	},
	{
		accessorKey: 'phone',
		cell: ({ row }) =>
			row.getValue('phone') ? (
				<TableCellText>{row.getValue('phone')}</TableCellText>
			) : (
				<TableCellTextEmpty />
			),
		enableColumnFilter: true,
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Telefone" />
		),
		meta: {
			label: 'Telefone',
		},
	},
	{
		accessorKey: 'createdAt',
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date
			return <div className="text-sm">{format(date, 'MMM dd, yyyy')}</div>
		},
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Crieado em" />
		),
		meta: {
			label: 'Criado em',
		},
	},
	{
		accessorKey: 'action',
		cell: ({ row }) => {
			return <DataTableContactRowActions row={row} />
		},
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Ações" />
		),
		enableSorting: false,
		maxSize: 60,
	},
]
