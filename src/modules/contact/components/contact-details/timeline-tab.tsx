import { Button } from '@/components/ui/button'
import {
	Calendar,
	CheckCircle2,
	FileText,
	Link as LinkIcon,
	Mail,
	MessageSquare,
	PenSquare,
	PlusCircle,
} from 'lucide-react'

export function TimelineTab() {
	const timelineEvents = [
		{
			id: 1,
			type: 'created_note',
			user: 'You',
			action: 'created a',
			targetType: 'related note',
			targetName: 'Untitled',
			time: 'about 1 hour ago',
			icon: PlusCircle,
		},
		{
			id: 2,
			type: 'updated_field',
			user: 'You',
			action: 'updated',
			targetType: 'Job Title',
			targetName: 'Jobs',
			fromValue: 'Job Title', // inferred arrow
			time: 'about 1 hour ago',
			icon: PenSquare,
		},
	]

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-semibold text-muted-foreground text-xs">
					December 2025
				</h3>
				<div className="mt-4 space-y-6">
					{timelineEvents.map((event) => (
						<div className="flex gap-4" key={event.id}>
							<div className="relative mt-0.5 h-8 w-8 shrink-0">
								<div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground">
									<event.icon className="h-3 w-3" />
								</div>
							</div>
							<div className="flex flex-1 items-start justify-between gap-4">
								<div className="text-sm">
									<span className="font-medium text-foreground">
										{event.user}
									</span>{' '}
									<span className="text-muted-foreground">{event.action}</span>{' '}
									{event.type === 'created_note' && (
										<>
											<span className="text-amber-500">{event.targetType}</span>{' '}
											<span className="underline decoration-muted-foreground/30 underline-offset-4">
												{event.targetName}
											</span>
										</>
									)}
									{event.type === 'updated_field' && (
										<>
											<div className="inline-flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 align-middle text-muted-foreground text-xs">
												<BriefcaseIcon className="h-3 w-3" />
												{event.fromValue}
											</div>{' '}
											<span className="text-muted-foreground">→</span>{' '}
											<span className="font-medium text-foreground">
												{event.targetName}
											</span>
										</>
									)}
								</div>
								<div className="whitespace-nowrap text-muted-foreground text-xs">
									{event.time}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

function BriefcaseIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect height="14" rx="2" ry="2" width="20" x="2" y="7" />
			<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
		</svg>
	)
}
