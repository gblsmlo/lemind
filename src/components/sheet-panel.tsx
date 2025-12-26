'use client'

import { useSheetPanel } from '@/hooks/use-sheet-panel'
import type { ReactNode } from 'react'
import { Sheet } from './ui/sheet'

type SheetPanelProps = {
	children?: ReactNode
}

export function SheetPanel({ children }: SheetPanelProps) {
	const { isOpenSheet, toggleOpenSheet } = useSheetPanel()
	return (
		<Sheet onOpenChange={toggleOpenSheet} open={isOpenSheet}>
			{children}
		</Sheet>
	)
}
