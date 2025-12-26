import { create } from 'zustand'
import type { Contact } from './types'

type OperationsType = 'CREATE' | 'UPDATE' | 'DELETE'

type Store = {
	selected?: Contact | null
	operation: OperationsType | null
}

type Actions = {
	onCreate: () => void
	onSelected: (contact: Contact) => void
	onDelete: (id: string) => void
}

export const useStoreContact = create<Store & Actions>((set) => ({
	selected: null,
	operation: null,
	onCreate: () => set({ selected: null, operation: 'CREATE' }),
	onSelected: (prevState: Contact) =>
		set({ selected: prevState, operation: 'UPDATE' }),
	onDelete: (id: string) =>
		set((state) => ({
			selected:
				state.selected && state.selected.id === id ? null : state.selected,
			operation: 'DELETE',
		})),
}))
