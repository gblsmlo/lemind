import { MainContent } from '@/components/ui/main-content'
import {
	PageDescription,
	PageHeader,
	PageTitle,
} from '@/components/ui/page-header'
import { ContactView } from '@/modules/contact/components/views/contact-view'
import { ContactViewSkeleton } from '@/modules/contact/components/views/contact-view-skeleton'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Contato',
	description: 'Criar um novo contato',
}

export default async function Page() {
	const title = String(metadata.title)
	const description = String(metadata.description)

	return (
		<MainContent size="sm">
			<PageHeader>
				<PageTitle>{title}</PageTitle>
				<PageDescription>{description}</PageDescription>
			</PageHeader>
			<Suspense fallback={<ContactViewSkeleton />}>
				<ContactView />
			</Suspense>
		</MainContent>
	)
}
