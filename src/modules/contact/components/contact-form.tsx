'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { isFailure, isSuccess } from '@/shared/errors/result'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@tc96/ui-react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createContactAction } from '../actions/create-contact-action'
import { type ContactFormData, contactFormSchema } from '../schemas'

interface ContactFormProps {
	spaceId: string
	onSuccess?: () => void
}

export function ContactForm({ spaceId, onSuccess }: ContactFormProps) {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm<ContactFormData>({
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			notes: '',
			spaceId,
		},
		resolver: zodResolver(contactFormSchema),
	})

	const onSubmit = (formData: ContactFormData) => {
		form.clearErrors()

		startTransition(async () => {
			const result = await createContactAction(formData)

			if (isFailure(result)) {
				form.setError('root', {
					message: result.message,
				})
			}

			if (isSuccess(result)) {
				toast.success('Contato criado com sucesso!')
				form.reset()
				router.refresh()

				if (onSuccess) {
					onSuccess()
				}
			}
		})
	}

	const isSubmitting = form.formState.isSubmitting || isPending

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-6"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="grid gap-4">
					{form.formState.errors.root && (
						<Alert variant="destructive">
							<AlertTitle>{form.formState.errors.root.message}</AlertTitle>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<Input
										placeholder="Nome completo"
										{...field}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="email@exemplo.com"
										type="email"
										{...field}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Telefone</FormLabel>
								<FormControl>
									<Input
										placeholder="(00) 00000-0000"
										type="tel"
										{...field}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Observações</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Adicione observações sobre o contato"
										rows={4}
										{...field}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-4">
						<Button disabled={isSubmitting} type="button" variant="ghost">
							Cancelar
						</Button>
						<Button disabled={isSubmitting} type="submit">
							{isSubmitting ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								'Criar contato'
							)}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
