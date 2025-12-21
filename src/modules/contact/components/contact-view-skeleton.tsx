import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ContactViewSkeleton() {
	return (
		<Card>
			<CardContent>
				<div className="flex flex-col gap-6">
					<div className="grid gap-4">
						<div>
							<Skeleton className="mx-auto h-24 w-24" />
						</div>

						<div className="grid gap-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>

						<div className="grid gap-2">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-10 w-full" />
						</div>

						<div className="grid gap-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>

						<div className="grid gap-2">
							<Skeleton className="h-4 w-12" />
							<Skeleton className="h-24 w-full" />
						</div>

						<div className="flex justify-end gap-4">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
