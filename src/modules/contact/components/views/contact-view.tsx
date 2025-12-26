import { Card, CardContent } from '@/components/ui/card'
import { isFailure } from '@/shared/errors'
import { findContactByIdAction } from '../../actions/find-by-id-action'
import { CreateContactForm } from '../forms/create-contact-form'
import { UpdateContactForm } from '../forms/update-contact-form'

type ContactViewProps = {
	contactId?: string
}

export async function ContactView({ contactId }: ContactViewProps) {
	if (!contactId) {
		return (
			<Card>
				<CardContent>
					<CreateContactForm />
				</CardContent>
			</Card>
		)
	}

	const result = await findContactByIdAction(contactId)

	if (isFailure(result) || !result.data.row) {
		return (
			<Card>
				<CardContent>
					<p>Contato não encontrado.</p>
				</CardContent>
			</Card>
		)
	}

	const contact = result.data.row

	return (
		<Card>
			<CardContent>
				<UpdateContactForm contact={contact} />
			</CardContent>
		</Card>
	)
}
