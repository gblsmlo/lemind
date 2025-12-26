import { MainContent } from '@/components/ui/main-content'
import { ContactsView } from '@/modules/contact/components/views/contacts-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Contatos',
	description: 'Visualize e gerencie seus contatos',
}

export default function Page() {
	return (
		<MainContent size="2xl">
			<ContactsView />
		</MainContent>
	)
}
