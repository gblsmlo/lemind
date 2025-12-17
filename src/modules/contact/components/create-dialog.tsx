'use client'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@tc96/ui-react'

type CreateProductDialogProps = {
	trigger?: React.ReactNode
	spaceId: string
}

export function CreateContactDialog({ trigger }: CreateProductDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger || <Button size="sm">Criar contato</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Novo contato</DialogTitle>
					<DialogDescription>
						Preencha os dados abaixo para criar um novo contato. Clique em
						salvar quando terminar.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
