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
import type { Row } from '@tanstack/react-table'
import { Button } from '@tc96/ui-react'
import { EllipsisIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Contact } from '../types'

export function DataTableProductsRowActions({
	row: _row,
}: {
	row: Row<Contact>
}) {
	const router = useRouter()

	const contactId = _row.original.id

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex justify-end">
					<Button
						aria-label="Edit item"
						className="shadow-none"
						isIcon={true}
						variant="ghost"
					>
						<EllipsisIcon aria-hidden="true" size={16} />
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => router.push(`/dashboard/contacts/${contactId}/edit`)}
					>
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
				<DropdownMenuItem className="text-destructive focus:text-destructive">
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
