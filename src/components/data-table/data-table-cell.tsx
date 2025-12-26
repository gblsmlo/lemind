import { Button, Text } from '@tc96/ui-react'
import { memo, type ReactNode } from 'react'

export const TableCellTextEmpty = memo(() => {
	return <Text size="sm">Não preenchido</Text>
})

TableCellTextEmpty.displayName = 'TableCellTextEmpty'

export const TableCellText = memo(({ children }: { children: ReactNode }) => {
	return <Text size="sm">{children}</Text>
})

TableCellText.displayName = 'TableCellText'

type TableCellActionProps = {
	children: ReactNode
	onClick: () => void
}

export const TableCellAction = memo(
	({ children, onClick }: TableCellActionProps) => {
		return (
			<Button className="px-1" onClick={onClick} type="button" variant="ghost">
				{children}
			</Button>
		)
	},
)
