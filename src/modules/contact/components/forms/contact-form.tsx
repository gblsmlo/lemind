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
import { isFailure, isSuccess } from '@/shared/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@tc96/ui-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createContactAction } from '../../actions/create-contact-action'
import { contactInsertFormSchema } from '../../schemas'
import type { ContactInsertFormData } from '../../types'

// Hardcoded spaceId - TODO: Get from context/session
const DEFAULT_SPACE_ID = 'a069aabe-abdd-4b03-9c11-84437f7d1384'

export function ContactForm({ formId }: { formId: string }) {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm({
		resolver: zodResolver(contactInsertFormSchema),
		defaultValues: {
			avatar: null,
			name: '',
			email: '',
			phone: '',
			notes: '',
			document: '',
			type: 'NEW',
		},
	})

	// const handleCancel = () => {
	// 	form.reset()
	// 	router.back()
	// }

	const handleSubmit = form.handleSubmit((formData: ContactInsertFormData) => {
		startTransition(async () => {
			let avatarUrl: string | undefined

			// if (formData.avatar) {
			// 	const uploadResult = await uploadToBucket(formData.avatar, {
			// 		bucketName: 'avatars',
			// 		fileName: user?.id,
			// 	})

			// 	if (!uploadResult.success) {
			// 		form.setError('avatar', {
			// 			message: 'Falha ao enviar o avatar. Tente novamente.',
			// 		})
			// 		return
			// 	}

			// 	avatarUrl = uploadResult.data.url
			// }

			const result = await createContactAction({
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				notes: formData.notes,
				avatar: avatarUrl,
				document: formData.document || undefined,
				type: formData.type,
				spaceId: DEFAULT_SPACE_ID,
			})

			if (isSuccess(result)) {
				const contactId = result.data.row.id

				toast.success('Contato criado com sucesso!')
				form.reset()

				router.push(`/dashboard/contacts/${contactId}`)
			}

			if (isFailure(result)) {
				form.setError('root', {
					message: result.message,
				})
			}
		})
	})

	const isDisabled = isPending
	// const isLoading = isPending || form.formState.isSubmitting

	return (
		<Form {...form}>
			<form className="flex flex-col gap-6" id={formId} onSubmit={handleSubmit}>
				<div className="grid gap-4">
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
									<Input placeholder="" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* <FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Telefone</FormLabel>
								<FormControl>
									<Input placeholder="" type="tel" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}

					{/* <FormField
						control={form.control}
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Notas</FormLabel>
								<FormControl>
									<Textarea rows={4} {...field} value={field.value ?? ''} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/> */}
				</div>
				<button type="submit">enviar</button>
			</form>
		</Form>
	)
}
