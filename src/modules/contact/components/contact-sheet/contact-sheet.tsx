'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isSuccess } from '@/shared/errors'
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@tc96/ui-react'
import { Mail, MessageSquare, Phone } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { findContactByIdAction } from '../../actions/find-by-id-action'
import type { Contact } from '../../types'
import { ActivityTimeline } from '../activity-timeline'
import { CalendarTab } from './calendar-tab'
import { ContactProfile } from './contact-profile'
import { NotesTab } from './notes-tab'

interface ContactSheetProps {
	contactId: string | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ContactSheet({
	contactId,
	open,
	onOpenChange,
}: ContactSheetProps) {
	const [contact, setContact] = useState<Contact | null>(null)
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		if (contactId && open) {
			startTransition(async () => {
				const result = await findContactByIdAction(contactId)
				if (isSuccess(result)) {
					setContact(result.data.row)
				} else {
					setContact(null)
				}
			})
		} else {
			setContact(null)
		}
	}, [contactId, open])

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent className="w-full sm:max-w-md" side="right">
				<SheetHeader>
					<SheetTitle className="sr-only">Detalhes do contato</SheetTitle>
					<SheetDescription className="sr-only">
						Visualização dos dados do contato selecionado
					</SheetDescription>
				</SheetHeader>

				{isPending ? (
					<div className="flex flex-col gap-6 p-4">
						<div className="flex flex-col items-center gap-4 pt-4 text-center">
							<Skeleton className="h-20 w-20 rounded-full" />
							<div className="flex flex-col items-center space-y-2">
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
						<div className="flex justify-center gap-4 py-2">
							<Skeleton className="h-10 w-10 rounded-full" />
							<Skeleton className="h-10 w-10 rounded-full" />
							<Skeleton className="h-10 w-10 rounded-full" />
						</div>
						<div className="space-y-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-40 w-full" />
						</div>
					</div>
				) : contact ? (
					<div className="flex flex-1 flex-col overflow-hidden">
						<div className="m-4">
							<ContactProfile />
						</div>

						{/* Tabs Section */}
						<div className="flex-1 overflow-hidden bg-background">
							<Tabs className="h-full flex-col" defaultValue="activities">
								<TabsList className="w-full justify-start rounded-none bg-transparent p-0">
									<TabsTrigger
										className="rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
										value="activities"
									>
										Atividades
									</TabsTrigger>
									<TabsTrigger
										className="rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
										value="details"
									>
										Detalhes
									</TabsTrigger>
									<TabsTrigger
										className="rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
										value="calendar"
									>
										Calendário
									</TabsTrigger>
									<TabsTrigger
										className="rounded-none border-transparent border-b-2 px-4 pt-2 pb-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
										value="notes"
									>
										Notas
									</TabsTrigger>
								</TabsList>

								<TabsContent className="m-0 p-6" value="activities">
									<ActivityTimeline />
								</TabsContent>

								<TabsContent className="m-0 p-6" value="details">
									<div className="space-y-6">
										<div className="grid gap-1">
											<h4 className="font-medium text-muted-foreground text-sm">
												Informações de Contato
											</h4>
											<div className="space-y-4 rounded-lg border bg-card p-4">
												<div className="flex items-center gap-3">
													<Mail className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">{contact.email}</span>
												</div>
												<div className="flex items-center gap-3">
													<Phone className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">
														{contact.phone || 'Não informado'}
													</span>
												</div>
											</div>
										</div>

										<div className="grid gap-1">
											<h4 className="font-medium text-muted-foreground text-sm">
												Metadados
											</h4>
											<div className="space-y-2 rounded-lg border bg-card p-4">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Criado em
													</span>
													<span>
														{contact.createdAt
															? new Date(contact.createdAt).toLocaleDateString(
																	'pt-BR',
																)
															: '-'}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">ID</span>
													<span className="font-mono text-muted-foreground text-xs">
														{contact.id.split('-')[0]}...
													</span>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent className="m-0 h-full p-6" value="calendar">
									<CalendarTab />
								</TabsContent>

								<TabsContent className="m-0 p-6" value="notes">
									<NotesTab />
								</TabsContent>
							</Tabs>
						</div>
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center p-4">
						<p className="text-muted-foreground">Nenhum contato selecionado</p>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}
