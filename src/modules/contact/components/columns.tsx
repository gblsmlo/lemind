'use client'

import {
	TableCellText,
	TableCellTextEmpty,
} from '@/components/data-table/data-table-cell'
import { DataTableColumnHeader } from '@/components/data-table/data-table-view'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage, Text } from '@tc96/ui-react'
import { format } from 'date-fns'
import type { Contact } from '../types'
import { DataTableProductsRowActions } from './row-actions'

export const contactColumns: ColumnDef<Contact>[] = [
	{
		accessorKey: 'name',
		cell: ({ row }) => {
			console.log(row.getValue('avatar'))
			return (
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage
							alt={row.getValue('name')}
							src={row.getValue('avatar')}
						/>
						<AvatarFallback>{row.getValue('name')}</AvatarFallback>
					</Avatar>
					<Text className="font-medium" size="sm">
						{row.getValue('name')}
					</Text>
				</div>
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
			return <DataTableProductsRowActions row={row} />
		},
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Ações" />
		),
		enableSorting: false,
		size: 48,
	},
]
