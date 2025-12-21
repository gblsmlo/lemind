'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@tc96/ui-react'
import {
	Briefcase,
	Calendar,
	FileText,
	Mail,
	MessageSquare,
	Phone,
} from 'lucide-react'

type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'document'

interface Activity {
	id: string
	type: ActivityType
	title: string
	description: string
	date: string
	user: {
		name: string
		avatar?: string
	}
}

const MOCK_ACTIVITIES: Activity[] = [
	{
		id: '1',
		type: 'document',
		title: 'Minuta de Contrato Enviada',
		description:
			'Enviada a primeira versão da minuta do contrato de prestação de serviços para revisão do cliente.',
		date: 'Hoje, 14:30',
		user: {
			name: 'Dra. Ana Silva',
			avatar: 'https://i.pravatar.cc/150?u=ana',
		},
	},
	{
		id: '2',
		type: 'meeting',
		title: 'Reunião de Alinhamento',
		description:
			'Reunião realizada para discutir os pontos principais da defesa no processo nº 12345/2024.',
		date: 'Ontem, 16:00',
		user: {
			name: 'Dr. Carlos Mendes',
		},
	},
	{
		id: '3',
		type: 'email',
		title: 'Email Recebido: Dúvidas sobre Honorários',
		description:
			'Cliente questionou sobre as condições de parcelamento dos honorários iniciais.',
		date: '20 de Dez, 09:15',
		user: {
			name: 'Dra. Ana Silva',
			avatar: 'https://i.pravatar.cc/150?u=ana',
		},
	},
	{
		id: '4',
		type: 'call',
		title: 'Ligação Realizada',
		description:
			'Tentativa de contato para confirmar recebimento da notificação extrajudicial. Sem sucesso, deixado recado.',
		date: '18 de Dez, 11:00',
		user: {
			name: 'Secretária Júlia',
		},
	},
	{
		id: '5',
		type: 'note',
		title: 'Observação Interna',
		description:
			'Cliente mencionou interesse em regularizar a situação fiscal da empresa parceira também.',
		date: '15 de Dez, 15:45',
		user: {
			name: 'Dr. Carlos Mendes',
		},
	},
]

const getActivityIcon = (type: ActivityType) => {
	switch (type) {
		case 'call':
			return <Phone className="h-4 w-4" />
		case 'email':
			return <Mail className="h-4 w-4" />
		case 'meeting':
			return <Calendar className="h-4 w-4" />
		case 'document':
			return <FileText className="h-4 w-4" />
		case 'note':
			return <MessageSquare className="h-4 w-4" />
		default:
			return <Briefcase className="h-4 w-4" />
	}
}

const getActivityColor = (type: ActivityType) => {
	switch (type) {
		case 'call':
			return 'bg-blue-100 text-blue-600'
		case 'email':
			return 'bg-yellow-100 text-yellow-600'
		case 'meeting':
			return 'bg-purple-100 text-purple-600'
		case 'document':
			return 'bg-red-100 text-red-600'
		case 'note':
			return 'bg-gray-100 text-gray-600'
		default:
			return 'bg-gray-100 text-gray-600'
	}
}

export function ActivityTimeline() {
	return (
		<div className="flex flex-col gap-6 pt-2">
			{MOCK_ACTIVITIES.map((activity, index) => (
				<div className="flex gap-4" key={activity.id}>
					<div className="flex flex-col items-center">
						<div
							className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(
								activity.type,
							)}`}
						>
							{getActivityIcon(activity.type)}
						</div>
						{index !== MOCK_ACTIVITIES.length - 1 && (
							<div className="my-2 w-px flex-1 bg-border" />
						)}
					</div>
					<div className="flex flex-1 flex-col gap-1 pb-4">
						<div className="flex items-center justify-between">
							<span className="font-medium text-sm">{activity.title}</span>
							<span className="text-muted-foreground text-xs">
								{activity.date}
							</span>
						</div>
						<p className="text-muted-foreground text-sm">
							{activity.description}
						</p>
						<div className="mt-2 flex items-center gap-2">
							<Avatar className="h-5 w-5">
								<AvatarImage src={activity.user.avatar} />
								<AvatarFallback className="text-[10px]">
									{activity.user.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<span className="text-muted-foreground text-xs">
								{activity.user.name}
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
