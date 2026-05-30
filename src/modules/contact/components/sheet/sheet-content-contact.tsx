'use client'

import {
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@tc96/ui-react'
import { Files, Home, ListTodo, NotepadText } from 'lucide-react'
import { useId } from 'react'
import { useStoreContact } from '../../store'
import { ActivityTimeline } from '../activity-timeline'
import { ContactForm } from '../forms'
import { NotesTab } from './notes-tab'

export function SheetContentContact() {
	const formId = useId()
	const { selected, operation } = useStoreContact()

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

	console.log(formId)

	const onSubmit = (formData: FormData) => {
		console.log(formData)
	}
	return (
		<SheetContent className="border-t">
			<SheetHeader>
				<SheetTitle>Contato</SheetTitle>
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
					<ContactForm formId={formId} />

					{/* <CreateContactForm formId={formId} /> */}
					{/* {showForm ? (
						
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
				<Button form={formId} size="sm" type="submit">
					Save
				</Button>
			</SheetFooter>
		</SheetContent>
	)
}
