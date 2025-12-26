import { DataTableView } from '@/components/data-table/data-table-view'
import { SheetPanel } from '@/components/sheet-panel'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { isFailure, isSuccess } from '@/shared/errors'
import { findContacts } from '../actions/find-contacts-actions'
import { NewRowButton } from '../new-row-button'
import type { FindContactsInput } from '../types'
import { contactColumns } from './columns'
import { SheetContentContact } from './sheet/sheet-content-contact'

export async function DataTableContact() {
	const spaceId = 'a069aabe-abdd-4b03-9c11-84437f7d1384'

	const input = {
		spaceId,
		searchQuery: '',
		sortBy: 'createdAt',
		page: 1,
		pageSize: 20,
	} satisfies FindContactsInput

	const result = await findContacts(input)

	if (isSuccess(result)) {
		const { rows } = result.data

		return (
			<>
				<DataTableView columns={contactColumns} data={rows ?? []}>
					<NewRowButton>Novo contato</NewRowButton>
				</DataTableView>

				<SheetPanel>
					<SheetContentContact />
				</SheetPanel>
			</>
		)
	}

	if (isFailure(result)) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-muted-foreground">
					Erro ao carregar contatos: {result.message}
				</p>
			</div>
		)
	}
}
