import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from './contact-form'

export const ContactView = () => {
	const spaceId = 'a069aabe-abdd-4b03-9c11-84437f7d1384'

	return (
		<Card>
			<CardContent>
				<ContactForm spaceId={spaceId} />
			</CardContent>
		</Card>
	)
}
