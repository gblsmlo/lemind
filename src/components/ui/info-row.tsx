import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type InfoRowProps = {
	icon: LucideIcon
	label: string
	children: ReactNode
}

export function InfoRow({ icon, label, children }: InfoRowProps) {
	const Icon = icon

	return (
		<div className="grid grid-cols-[120px_1fr] items-center gap-2">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				<Icon className="h-4 w-4" />
				<span>{label}</span>
			</div>

			{children}
		</div>
	)
}
