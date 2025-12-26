import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContactSidebar } from '@/modules/contact/components/contact-details/contact-sidebar'
import { TimelineTab } from '@/modules/contact/components/contact-details/timeline-tab'
import type { Contact } from '@/modules/contact/types'
import {
	Calendar,
	CheckSquare,
	FileText,
	Mail,
	MessageSquare,
	PenTool,
} from 'lucide-react'

export default function ContactDetailsPage({
	params,
}: {
	params: { contactId: string }
}) {
	// Mock contact data as requested
	const mockContact: Contact = {
		id: params.contactId,
		name: 'Brian Chesky',
		email: 'chesky@airbnb.com',
		phone: '+1 123456789',
		avatar: null,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		spaceId: '123',
		type: 'NEW', // Default status
		document: null,
		notes: null,
	}

	return (
		<div className="container mx-auto h-full max-w-7xl py-6">
			<div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
				{/* Left Sidebar */}
				<aside className="no-scrollbar h-full overflow-y-auto border-r pr-6">
					<ContactSidebar contact={mockContact} />
				</aside>

				{/* Main Content */}
				<main className="h-full overflow-hidden">
					<Tabs className="flex h-full flex-col" defaultValue="timeline">
						<TabsList className="w-full justify-start rounded-none bg-transparent p-0">
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="timeline"
							>
								<PenTool className="h-4 w-4" />
								Timeline
							</TabsTrigger>
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="tasks"
							>
								<CheckSquare className="h-4 w-4" />
								Tasks
							</TabsTrigger>
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="notes"
							>
								<FileText className="h-4 w-4" />
								Notes
							</TabsTrigger>
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="files"
							>
								<MessageSquare className="h-4 w-4" />
								Files
							</TabsTrigger>
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="emails"
							>
								<Mail className="h-4 w-4" />
								Emails
							</TabsTrigger>
							<TabsTrigger
								className="gap-2 rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
								value="calendar"
							>
								<Calendar className="h-4 w-4" />
								Calendar
							</TabsTrigger>
						</TabsList>

						<div className="mt-8 flex-1 overflow-y-auto">
							<TabsContent className="m-0 h-full" value="timeline">
								<TimelineTab />
							</TabsContent>

							<TabsContent className="m-0 h-full" value="tasks">
								<div className="flex h-full items-center justify-center text-muted-foreground">
									No tasks
								</div>
							</TabsContent>
							<TabsContent className="m-0 h-full" value="notes">
								<div className="flex h-full items-center justify-center text-muted-foreground">
									No notes
								</div>
							</TabsContent>
							<TabsContent className="m-0 h-full" value="files">
								<div className="flex h-full items-center justify-center text-muted-foreground">
									No files
								</div>
							</TabsContent>
							<TabsContent className="m-0 h-full" value="emails">
								<div className="flex h-full items-center justify-center text-muted-foreground">
									No emails
								</div>
							</TabsContent>
							<TabsContent className="m-0 h-full" value="calendar">
								<div className="flex h-full items-center justify-center text-muted-foreground">
									No calendar events
								</div>
							</TabsContent>
						</div>
					</Tabs>
				</main>
			</div>
		</div>
	)
}
