import { create } from 'zustand'

// 'use client'

// import { useState } from 'react'

// export const useSheet = <T extends object>(initialValues: T) => {
// 	const [open, setOpen] = useState(false)
// 	const [values, setValues] = useState<T | null>(null)

// 	const openSheet = (newValues: T | null = null) => {
// 		setValues(newValues)
// 		setOpen(true)
// 	}
// 	const closeSheet = () => setOpen(false)

// 	return {
// 		open,
// 		values,
// 		openSheet,
// 		closeSheet,
// 	}
// }
//

type Store = {
	isOpenSheet: boolean
}

type Actions = {
	toggleOpenSheet: () => void
}

export const useSheetPanel = create<Store & Actions>((set) => ({
	isOpenSheet: false,
	toggleOpenSheet: () =>
		set((prevState) => ({ isOpenSheet: !prevState.isOpenSheet })),
}))
