import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Suspense } from 'react'
import { DataTableContact } from './data-table-contact'

export async function DataTableContactView() {
	return (
		<Suspense fallback={<DataTableSkeleton columnCount={6} />}>
			<DataTableContact />
		</Suspense>
	)
}
