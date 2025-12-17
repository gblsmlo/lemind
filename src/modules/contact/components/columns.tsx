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
		cell: ({ row }) => (
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
		),
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
			<DataTableColumnHeader column={column} label="Phone" />
		),
	},
	// {
	// 	accessorKey: 'description',
	// 	cell: ({ row }) => (
	// 		<div className="max-w-[300px] truncate text-muted-foreground">
	// 			{row.getValue('description')}
	// 		</div>
	// 	),
	// 	enableSorting: true,
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} label="Description" />
	// 	),
	// 	meta: {
	// 		label: 'Description',
	// 		placeholder: 'Filter by description...',
	// 		variant: 'text',
	// 	},
	// },
	// {
	// 	accessorKey: 'priceId',
	// 	cell: ({ row }) => {
	// 		const priceId = row.getValue('priceId') as string | null
	// 		return priceId ? (
	// 			<Badge variant="secondary">{priceId}</Badge>
	// 		) : (
	// 			<Badge variant="secondary">Free</Badge>
	// 		)
	// 	},
	// 	enableSorting: true,
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} label="Price ID" />
	// 	),
	// 	meta: {
	// 		label: 'Price ID',
	// 	},
	// },
	{
		accessorKey: 'createdAt',
		cell: ({ row }) => {
			const date = row.getValue('createdAt') as Date
			return <div className="text-sm">{format(date, 'MMM dd, yyyy')}</div>
		},
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Created At" />
		),
		meta: {
			label: 'Created At',
		},
	},
	{
		accessorKey: 'updatedAt',
		cell: ({ row }) => {
			const date = row.getValue('updatedAt') as Date
			return (
				<div className="text-muted-foreground text-sm">
					{format(date, 'MMM dd, yyyy')}
				</div>
			)
		},
		enableSorting: true,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Updated At" />
		),
		meta: {
			label: 'Updated At',
			placeholder: 'Filter by date...',
			variant: 'date',
		},
	},
	{
		accessorKey: 'action',
		cell: ({ row }) => {
			return <DataTableProductsRowActions row={row} />
		},
		enableColumnFilter: false,
		enableSorting: false,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} label="Actions" />
		),
		size: 48,
	},
]
