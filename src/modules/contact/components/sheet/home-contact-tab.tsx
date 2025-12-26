import { Badge } from '@/components/ui/badge'
import { InfoRow } from '@/components/ui/info-row'
import { Separator } from '@/components/ui/separator'
import { formatCpfCnpj } from '@/lib/format'
import type { Contact } from '@/modules/contact/types'
import { Briefcase, Copy, Link, Mail, MapPin, Phone, User } from 'lucide-react'

interface HomeTabProps {
	initialValues?: Contact | null
}

const defaultMockData = {
	address: 'Rua Pascoal de Castro Alves, 985.',
	city: 'San Francisco',
	createdBy: null,
	company: 'Notion',
	jobTitle: 'Jobs',
	linkedin: 'tmarkiewicz',
	twitter: '@tmarkiewicz',
	lastUpdate: '1 minute ago',
}

export function HomeContactTab({ initialValues }: HomeTabProps) {
	const mockData = defaultMockData

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	return (
		<div className="flex flex-col gap-8">
			<div className="grid gap-4">
				<InfoRow icon={MapPin} label="Documento">
					<Badge variant="secondary">
						{formatCpfCnpj(initialValues?.document)}
					</Badge>
				</InfoRow>

				<InfoRow icon={Mail} label="Emails">
					<Badge variant="secondary">{initialValues?.email}</Badge>
				</InfoRow>

				<InfoRow icon={Phone} label="Phones">
					<Badge
						className="cursor-pointer"
						onClick={() => handleCopy(String(initialValues?.phone))}
						variant="secondary"
					>
						{initialValues?.phone}
						<Copy />
					</Badge>
				</InfoRow>

				<InfoRow icon={MapPin} label="Endereço">
					<span className="text-sm">{mockData.address}</span>
				</InfoRow>

				<InfoRow icon={MapPin} label="City">
					{mockData.city}
				</InfoRow>

				<Separator className="my-4" />

				<InfoRow icon={Link} label="Linkedin">
					<Badge variant="secondary">{mockData.linkedin}</Badge>
				</InfoRow>

				<InfoRow icon={Link} label="X">
					<Badge variant="secondary">{mockData.twitter}</Badge>
				</InfoRow>

				<Separator className="my-4" />

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
						<span className="ml-6">Last update</span>
					</div>
					<div className="text-sm">{mockData.lastUpdate}</div>
				</div>
			</div>

			{/* Company Section */}
			{/*<div className="grid grid-cols-[120px_1fr] items-center gap-2">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<Briefcase className="h-4 w-4" />
					<span>Job Title</span>
				</div>
				<div className="text-sm">{mockData.jobTitle}</div>
			</div>*/}

			{/* <div className="space-y-4">
				<h4 className="font-medium text-sm">Company</h4>
				<Button className="h-9 justify-start gap-2 px-3" variant="outline">
					<div className="flex h-5 w-5 items-center justify-center rounded bg-black text-white">
						<span className="font-bold text-[10px]">N</span>
					</div>
					{mockData.company}
				</Button>
			</div> */}

			{/* Opportunities Section */}
			{/* <div className="space-y-4">
				<div className="flex items-center justify-between">
					<h4 className="font-medium text-sm">Opportunities</h4>
					<Button className="h-6 w-6" size="icon" variant="ghost">
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div> */}
		</div>
	)
}
