import { DataTableView } from '@/components/data-table/data-table-view'
import { DataTableCreateAction } from '@/components/data-table/data-tablet-create-action'
import { isFailure, isSuccess } from '@/shared/errors'
import { sleep } from '@/shared/utils/sleep'
import { findContacts } from '../actions/find-contacts-actions'
import type { FindContactsInput } from '../types'
import { contactColumns } from './columns'

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

	await sleep(1000)

	if (isSuccess(result)) {
		const { rows, total } = result.data

		return (
			<DataTableView
				actionToCreate={
					<DataTableCreateAction linkTo="contacts/new">
						Create contact
					</DataTableCreateAction>
				}
				columns={contactColumns}
				data={rows ?? []}
				pageCount={total}
			/>
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
