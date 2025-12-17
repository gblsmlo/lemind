import { MainContent } from '@/components/ui/main-content'
import {
	PageDescription,
	PageHeader,
	PageTitle,
} from '@/components/ui/page-header'
import { ContactView } from '@/modules/contact/components/contact-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Create contact',
	description: 'Create a new contact',
}

export default function Page() {
	const title = String(metadata.title)
	const description = String(metadata.description)

	return (
		<MainContent size="sm">
			<PageHeader>
				<PageTitle>{title}</PageTitle>
				<PageDescription>{description}</PageDescription>
			</PageHeader>

			<ContactView />
		</MainContent>
	)
}
