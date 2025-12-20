'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { FileUpload } from '@/components/ui/file-upload'
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
import { uploadAvatar } from '@/lib/supabase/upload-avatar'
import { useAuth } from '@/modules/auth'
import { isFailure, isSuccess } from '@/shared/errors'
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
	initialValues?: ContactFormData
}

export function ContactForm({ initialValues }: ContactFormProps) {
	const { user } = useAuth()
	const [isPending, startTransition] = useTransition()

	const router = useRouter()

	const form = useForm<ContactFormData>({
		values: initialValues,
		resolver: zodResolver(contactFormSchema),
	})

	const handleCancel = () => {
		form.reset()
		router.back()
	}

	const handleSubmit = form.handleSubmit((formData: ContactFormData) => {
		startTransition(async () => {
			let avatarUrl: string | undefined

			if (formData.avatar) {
				const uploadResult = await uploadAvatar(formData.avatar, {
					folder: 'avatars',
					fileName: user?.id,
				})

				if (!uploadResult.success) {
					form.setError('avatar', {
						message: 'Falha ao enviar o avatar. Tente novamente.',
					})

					return
				}

				avatarUrl = uploadResult.data.url
			}

			const result = await createContactAction({
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				notes: formData.notes,
				avatarUrl,
			})

			if (isSuccess(result)) {
				const contactId = result.data.row.id

				toast.success('Contato criado com sucesso!')
				form.reset(formData)

				router.push(`/contacts/${contactId}`)
			}

			if (isFailure(result)) {
				form.setError('root', {
					message: result.message,
				})
			}
		})
	})

	const isDisabled = isPending
	const isLoading = isPending || form.formState.isSubmitting

	return (
		<Form {...form}>
			<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
				<div className="grid gap-4">
					{form.formState.errors.root && (
						<Alert variant="destructive">
							<AlertTitle>{form.formState.errors.root.message}</AlertTitle>
						</Alert>
					)}

					<FormField
						control={form.control}
						name="avatar"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<FileUpload disabled={isDisabled} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nome</FormLabel>
								<FormControl>
									<Input placeholder="Nome completo" {...field} />
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
									<Input placeholder="(00) 00000-0000" type="tel" {...field} />
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
								<FormLabel>Notas</FormLabel>
								<FormControl>
									<Textarea placeholder="" rows={4} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex justify-end gap-4">
						<Button
							disabled={isDisabled}
							onClick={handleCancel}
							type="button"
							variant="ghost"
						>
							Cancelar
						</Button>
						<Button disabled={isDisabled}>
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								'Salvar'
							)}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
