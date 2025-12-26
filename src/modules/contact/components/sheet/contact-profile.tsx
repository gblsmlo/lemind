import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '@tc96/ui-react'

type ContactProfileProps = {
	name: string
	avatar?: string
}

export function ContactProfile({ name, avatar }: ContactProfileProps) {
	return (
		<Card>
			<CardContent>
				<div className="flex flex-col items-center gap-3 text-center">
					<Avatar className="h-20 w-20 border-4 border-background shadow-sm">
						<AvatarImage alt={name} src={avatar} />
						<AvatarFallback className="text-2xl">
							{name.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>

					<div className="flex flex-col items-center gap-1">
						<h3 className="font-bold text-2xl">{name}</h3>
						<p className="font-medium text-muted-foreground text-sm">
							Amazon Art Inc.
						</p>
						<div className="mt-1">
							<Badge size="sm">
								<span className="size-2 rounded-full bg-amber-300" />
								Novo Lead
							</Badge>
						</div>
						<p className="mt-3 max-w-[280px] text-muted-foreground text-xs leading-relaxed">
							Interessado em opções de investimento de longo prazo e consultoria
							jurídica empresarial.
						</p>
					</div>

					{/* Quick Actions */}
					<div className="flex items-center gap-4">
						{/* <Button
							className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
							size="icon"
							variant="ghost"
						>
							<a href={`tel:${contact.phone}`}>
								<Phone className="h-5 w-5" />
								<span className="sr-only">Ligar</span>
							</a>
						</Button>
						<Button
							asChild
							className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
							size="icon"
							variant="ghost"
						>
							<a href={`mailto:${contact.email}`}>
								<Mail className="h-5 w-5" />
								<span className="sr-only">Email</span>
							</a>
						</Button>
						<Button
							asChild
							className="h-10 w-10 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
							size="icon"
							variant="ghost"
						>
							<a
								href={`https://wa.me/${contact.phone?.replace(/\D/g, '')}`}
								rel="noreferrer"
								target="_blank"
							>
								<MessageSquare className="h-5 w-5" />
								<span className="sr-only">WhatsApp</span>
							</a>
						</Button> */}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
