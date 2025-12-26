import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { Contact } from '@/modules/contact/types'
import {
	Briefcase,
	Linkedin,
	Mail,
	MapPin,
	Phone,
	Plus,
	Twitter,
	User,
} from 'lucide-react'

// Mock data moved here or kept close
const defaultMockData = {
	city: 'San Francisco',
	address: '',
	createdBy: 'System',
	jobTitle: 'Jobs',
	linkedin: 'Linkedin',
	twitter: 'X',
	company: 'Notion',
	lastUpdate: '1 minute ago',
}

interface ContactInfoListProps {
	contact: Contact
}

export function ContactInfoList({ contact }: ContactInfoListProps) {
	const mockData = defaultMockData

	return (
		<div className="flex flex-col gap-8">
			{/* Details Section */}
			<div className="grid gap-4">
				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<MapPin className="h-4 w-4" />
						<span>City</span>
					</div>
					<div className="text-sm">{mockData.city}</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<User className="h-4 w-4" />
						<span>Created by</span>
					</div>
					<div className="flex items-center gap-2 text-sm">
						<Briefcase className="h-4 w-4" />
						<span>{mockData.createdBy}</span>
					</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Mail className="h-4 w-4" />
						<span>Emails</span>
					</div>
					<div>
						<div className="inline-flex h-7 items-center rounded-full border px-3 text-sm">
							{contact.email || 'chesky@airbnb.com'}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Briefcase className="h-4 w-4" />
						<span>Job Title</span>
					</div>
					<div className="text-sm">{mockData.jobTitle}</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Linkedin className="h-4 w-4" />
						<span>Linkedin</span>
					</div>
					<div className="text-muted-foreground text-sm">
						{mockData.linkedin}
					</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Phone className="h-4 w-4" />
						<span>Phones</span>
					</div>
					<div>
						<div className="inline-flex h-7 items-center rounded-full border px-3 text-sm">
							{contact.phone || '+1 123456789'}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<span className="ml-6">Last update</span>
					</div>
					<div className="text-sm">{mockData.lastUpdate}</div>
				</div>

				<div className="grid grid-cols-[120px_1fr] items-center gap-2">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<Twitter className="h-4 w-4" />
						<span>X</span>
					</div>
					<div className="text-muted-foreground text-sm">
						{mockData.twitter}
					</div>
				</div>
			</div>

			<Separator />

			{/* Company Section */}
			<div className="space-y-4">
				<h4 className="font-medium text-sm">Company</h4>
				<Button className="h-9 justify-start gap-2 px-3" variant="outline">
					<div className="flex h-5 w-5 items-center justify-center rounded bg-black text-white">
						<span className="font-bold text-[10px]">N</span>
					</div>
					{mockData.company}
				</Button>
			</div>

			{/* Opportunities Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h4 className="font-medium text-sm">Opportunities</h4>
					<Button className="h-6 w-6" size="icon" variant="ghost">
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
