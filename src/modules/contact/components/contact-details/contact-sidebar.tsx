import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Contact } from '@/modules/contact/types'
import { ContactInfoList } from './contact-info-list'

interface ContactSidebarProps {
	contact: Contact
}

export function ContactSidebar({ contact }: ContactSidebarProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Profile Header */}
			<div className="flex flex-col items-center gap-3 text-center">
				<Avatar className="h-20 w-20">
					<AvatarImage alt={contact.name} src={contact.avatar || undefined} />
					<AvatarFallback className="text-2xl">
						{contact.name.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div>
					<h2 className="font-bold text-xl">{contact.name}</h2>
					<p className="text-muted-foreground text-sm">
						Added about 1 hour ago
					</p>
				</div>
			</div>

			{/* Details List */}
			<ContactInfoList contact={contact} />
		</div>
	)
}
