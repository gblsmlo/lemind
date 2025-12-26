import { Button } from '@tc96/ui-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

type DataTableCreateActionProps = {
	children: ReactNode
	href: string
}

export function DataTableCreateAction({
	children,
	href,
}: DataTableCreateActionProps) {
	return (
		<Button size="sm">
			<Link href={href}>{children}</Link>
		</Button>
	)
}
