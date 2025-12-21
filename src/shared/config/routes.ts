import {
	Briefcase,
	Bug,
	CalendarCheck,
	Contact,
	FileText,
	Folder,
	HelpCircle,
	Home,
	type LucideIcon,
	PieChart,
	ReceiptIcon,
	Settings,
	User,
	Users,
} from 'lucide-react'

export type SubRoute = {
	title: string
	link: string
	icon?: LucideIcon
}

export type Route = {
	icon?: LucideIcon | null
	label: string
	link: string
	subs?: SubRoute[]
}

export const mainRoutes: Route[] = [
	{
		icon: Home,
		label: 'Dashboard',
		link: '/dashboard',
	},
	{
		icon: CalendarCheck,
		label: 'Tarefas',
		link: '/dashboard/tasks',
	},
	{
		icon: Folder,
		label: 'Processos',
		link: '/dashboard/processes',
	},
	{
		icon: PieChart,
		label: 'Analytics',
		link: '/dashboard/analytics',
	},
	{
		icon: Users,
		label: 'Team',
		link: '/dashboard/team',
	},
]

export const crmRoutes: Route[] = [
	{
		icon: Briefcase,
		label: 'Contratos',
		link: '/dashboard/deals',
	},
	{
		icon: Contact,
		label: 'Clientes',
		link: '/dashboard/clients',
	},
	{
		icon: Contact,
		label: 'Contatos',
		link: '/dashboard/contacts',
	},
]

export const secondaryRoutes: Route[] = [
	{
		icon: Settings,
		label: 'Settings',
		link: '/dashboard/settings',
	},
	{
		icon: HelpCircle,
		label: 'Help & Support',
		link: '/dashboard/help',
	},
	{
		icon: Bug,
		label: 'Bugs',
		link: '/dashboard/bugs',
	},
]

export const documentsRoutes: Route[] = [
	{
		icon: FileText,
		label: 'Files',
		link: '/dashboard/docs/files',
	},
	{
		icon: PieChart,
		label: 'Reports',
		link: '/dashboard/docs/reports',
	},
	{
		icon: FileText,
		label: 'Resources',
		link: '/dashboard/docs/resources',
	},
]

export const userRoutes: Route[] = [
	{
		icon: User,
		label: 'Account',
		link: '/dashboard/settings/account/profile',
	},
	{
		icon: ReceiptIcon,
		label: 'Billing',
		link: '/dashboard/billing',
	},
]

export const allRoutes: Route[] = [
	...mainRoutes,
	...crmRoutes,
	...secondaryRoutes,
	...documentsRoutes,
	...userRoutes,
]
