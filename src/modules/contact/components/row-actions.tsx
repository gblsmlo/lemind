'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { CardProfileMini } from '@/components/ui/car-profile-mini'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSheetPanel } from '@/hooks/use-sheet-panel'
import { isFailure, isSuccess } from '@/shared/errors'
import type { Row } from '@tanstack/react-table'
import { Button } from '@tc96/ui-react'
import { EllipsisIcon, Loader2 } from 'lucide-react'
import { type MouseEvent, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteContactAction } from '../actions/delete-contact-action'
import { useStoreContact } from '../store'
import type { Contact } from '../types'

export function DataTableContactRowActions({ row }: { row: Row<Contact> }) {
	const { toggleOpenSheet } = useSheetPanel()
	const { onSelected } = useStoreContact()

	const [isPending, startTransition] = useTransition()
	const [showDeleteDialog, setShowDeleteDialog] = useState(false)

	const contact = row.original
	const contactId = contact.id

	const onDelete = () => {
		startTransition(async () => {
			const result = await deleteContactAction(contactId)

			if (isSuccess(result)) {
				toast.success('Contato excluído com sucesso!')
				setShowDeleteDialog(false)
			}

			if (isFailure(result)) {
				toast.error(result.message || 'Erro ao excluir contato')
			}
		})
	}

	const handleSelected = () => {
		onSelected(contact)
		toggleOpenSheet()
	}

	const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onDelete()
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						aria-label="Edit item"
						className="shadow-none"
						isIcon={true}
						variant="ghost"
					>
						<EllipsisIcon aria-hidden="true" size={16} />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end">
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={handleSelected}>
							<span>Abrir</span>
							<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={handleSelected}>
							<span>Edit</span>
							<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<span>Archive</span>
							<DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem>Move to project</DropdownMenuItem>
									<DropdownMenuItem>Move to folder</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Advanced options</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>Share</DropdownMenuItem>
						<DropdownMenuItem>Add to favorites</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						className="text-destructive focus:text-destructive"
						disabled={isPending}
						onClick={() => setShowDeleteDialog(true)}
					>
						<span>Delete</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Excluir contato?</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja excluir{' '}
							<strong className="font-semibold">{contact.name}</strong>? Esta
							ação não pode ser desfeita.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive hover:bg-destructive/90"
							disabled={isPending}
							onClick={handleDelete}
						>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Excluir
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
