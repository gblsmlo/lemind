import { MainContent } from '@/components/ui/main-content'
import {
	PageDescription,
	PageHeader,
	PageTitle,
} from '@/components/ui/page-header'
import { ContactView } from '@/modules/contact/components'
import { ContactViewSkeleton } from '@/modules/contact/components/views/contact-view-skeleton'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Contato',
	description: 'Edite as informações do contato',
}

type Params = Promise<{ contactId: string }>

export default async function Page({ params }: { params: Params }) {
	const title = String(metadata.title)
	const description = String(metadata.description)

	const { contactId } = await params

	return (
		<MainContent size="sm">
			<PageHeader>
				<PageTitle>{title}</PageTitle>
				<PageDescription>{description}</PageDescription>
			</PageHeader>

			<Suspense fallback={<ContactViewSkeleton />}>
				<ContactView contactId={contactId} />
			</Suspense>
		</MainContent>
	)
}
