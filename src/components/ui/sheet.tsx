'use client'

import { cn } from '@/lib/utils'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Button } from '@tc96/ui-react'
import {
	Maximize2Icon,
	PanelLeftClose,
	PanelRightClose,
	XIcon,
} from 'lucide-react'
import type * as React from 'react'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
	return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
	return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
	return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
	...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
	return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
	return (
		<SheetPrimitive.Overlay
			className={cn(
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/70 data-[state=closed]:animate-out data-[state=open]:animate-in',
				className,
			)}
			data-slot="sheet-overlay"
			{...props}
		/>
	)
}

type SheetActionsProps = {
	onOpen: () => void
}

function SheetActions() {
	return (
		<div className="flex items-center justify-between">
			<SheetPrimitive.Close className="-ml-2">
				<Button isIcon size="sm" variant="ghost">
					<XIcon className="size-4" />
					<span className="sr-only">Close</span>
				</Button>
			</SheetPrimitive.Close>
			<div>...</div>
		</div>
	)
}

function SheetContent({
	className,
	children,
	side = 'right',
	...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
	side?: 'top' | 'right' | 'bottom' | 'left'
}) {
	return (
		<SheetPortal>
			<SheetOverlay />
			<SheetPrimitive.Content
				className={cn(
					'fixed z-50 flex flex-col gap-4 bg-sidebar-secondary shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500',
					side === 'right' &&
						'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
					side === 'left' &&
						'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
					side === 'top' &&
						'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
					side === 'bottom' &&
						'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
					className,
				)}
				data-slot="sheet-content"
				{...props}
			>
				{children}
			</SheetPrimitive.Content>
		</SheetPortal>
	)
}

function SheetHeader({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('flex h-10 flex-col gap-1.5 px-4 py-3', className)}
			data-slot="sheet-header"
			{...props}
		>
			{children}
		</div>
	)
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('mt-auto flex justify-end gap-2 p-4', className)}
			data-slot="sheet-footer"
			{...props}
		/>
	)
}

function SheetTitle({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
	return (
		<SheetPrimitive.Title
			className={cn('font-semibold text-foreground', className)}
			data-slot="sheet-title"
			{...props}
		/>
	)
}

function SheetDescription({
	className,
	...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
	return (
		<SheetPrimitive.Description
			className={cn('text-muted-foreground text-sm', className)}
			data-slot="sheet-description"
			{...props}
		/>
	)
}

export {
	Sheet,
	SheetTrigger,
	SheetActions,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetFooter,
	SheetTitle,
	SheetDescription,
}
