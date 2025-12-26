'use client'

import { Button } from '@/components/ui/button'
import { useSheetPanel } from '@/hooks/use-sheet-panel'
import type { ReactNode } from 'react'
import { useStoreContact } from './store'

type NewRowProps = {
	children: ReactNode
}

export function NewRowButton({ children }: NewRowProps) {
	const { toggleOpenSheet } = useSheetPanel()
	const { onCreate } = useStoreContact()

	function handleCreateRow() {
		onCreate()
		toggleOpenSheet()
	}

	return (
		<Button onClick={handleCreateRow} size="sm">
			{children}
		</Button>
	)
}
