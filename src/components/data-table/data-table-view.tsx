'use client'

import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { useDataTable } from '@/hooks/use-data-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'

interface DataTableViewProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	pageCount?: number
	children?: ReactNode
	getRowId?: (row: TData) => string
}

export function DataTableView<TData, TValue>({
	columns,
	data,
	pageCount = 1,
	children,
	getRowId,
}: DataTableViewProps<TData, TValue>) {
	const { table } = useDataTable({
		columns,
		data,
		getRowId,
		pageCount,
	})

	return (
		<DataTable table={table}>
			<DataTableToolbar table={table}>{children}</DataTableToolbar>
		</DataTable>
	)
}
