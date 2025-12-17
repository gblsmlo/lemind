import { Button } from '@tc96/ui-react'
import type { ReactNode } from 'react'

type DataTableCreateActionProps = {
	children: ReactNode
	linkTo: string
}

export function DataTableCreateAction({
	children,
	linkTo,
}: DataTableCreateActionProps) {
	return (
		<Button size="sm">
			<a href={linkTo}>{children}</a>
		</Button>
	)
}
