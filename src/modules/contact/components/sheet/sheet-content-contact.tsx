'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSubContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SheetActions,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@tc96/ui-react'
import { Files, Home, ListTodo, NotepadText } from 'lucide-react'
import { useId, useState } from 'react'
import { useStoreContact } from '../../store'
import { ActivityTimeline } from '../activity-timeline'
import { CreateContactForm } from '../forms'
import { NotesTab } from './notes-tab'

export function SheetContentContact() {
	const formId = useId()
	const { selected, operation } = useStoreContact()
	const [isEditing, setIsEditing] = useState(false)

	if (!selected && operation === 'UPDATE') {
		return (
			<SheetContent className="border-t">
				<div className="flex h-full items-center justify-center text-muted-foreground">
					No contact selected. Try selecting one from the list.
				</div>
			</SheetContent>
		)
	}

	const isCreateMode = operation === 'CREATE'
	const showForm = isCreateMode || isEditing

	const title = isCreateMode ? 'Novo Contato' : 'Contato'

	return (
		<SheetContent className="border-t">
			<SheetHeader>
				<SheetActions />
			</SheetHeader>
			<Tabs defaultValue="home">
				<TabsList className="w-full border-b">
					<TabsTrigger value="home">
						<Home className="size-4" />
						Home
					</TabsTrigger>
					<TabsTrigger disabled={isCreateMode} value="activities">
						<ListTodo className="size-4" />
						Tasks
					</TabsTrigger>
					<TabsTrigger disabled={isCreateMode} value="files">
						<Files className="size-4" />
						Files
					</TabsTrigger>
					<TabsTrigger disabled={isCreateMode} value="notes">
						<NotepadText className="size-4" />
						Notes
					</TabsTrigger>
				</TabsList>

				<TabsContent className="m-0 p-4" value="home">
					{/* {showForm ? (
						<CreateContactForm formId={formId} />
					) : (
						<HomeContactTab initialValues={selected ?? null} />
					)} */}
				</TabsContent>

				<TabsContent className="m-0 p-6" value="activities">
					<ActivityTimeline />
				</TabsContent>

				<TabsContent className="m-0 h-full p-6" value="files">
					<div className="flex h-full items-center justify-center text-muted-foreground">
						No files
					</div>
				</TabsContent>

				<TabsContent className="m-0 p-6" value="notes">
					<NotesTab />
				</TabsContent>
			</Tabs>

			<SheetFooter>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant="outline">
							Actions
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Abrir</DropdownMenuItem>
						<DropdownMenuItem>Editar</DropdownMenuItem>

						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Button size="sm" variant="destructive">
								Delete
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button form={formId} size="sm" type="submit">
					Save
				</Button>
			</SheetFooter>
		</SheetContent>
	)
}
