'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { Form } from '@/components/ui/form'
import { uploadToBucket } from '@/lib/supabase/upload-to-bucket'
import { useAuth } from '@/modules/auth'
import { isFailure, isSuccess } from '@/shared/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@tc96/ui-react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { updateContactAction } from '../../actions/update-contact-action'
import { contacUpdateFormSchema } from '../../schemas'
import type { Contact, ContactUpdate, ContactUpdateFormData } from '../../types'
import { ContactFormFields } from './contact-form-fields'

interface UpdateContactFormProps {
	contact: Contact
}

export function UpdateContactForm({ contact }: UpdateContactFormProps) {
	const { user } = useAuth()
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm<ContactUpdateFormData>({
		resolver: zodResolver(contacUpdateFormSchema),
		values: {
			avatar: contact.avatar,
			name: contact.name,
			email: contact.email,
			phone: contact.phone ?? '',
			notes: contact.notes ?? '',
			type: contact.type,
		},
	})

	const handleCancel = () => {
		form.reset()
		router.back()
	}

	const handleSubmit = form.handleSubmit(
		async (formData: ContactUpdateFormData) => {
			startTransition(async () => {
				const dirtyFields = form.formState.dirtyFields

				const updatePayload = {} as ContactUpdate

				if (dirtyFields.avatar) {
					if (formData.avatar instanceof File) {
						const uploadResult = await uploadToBucket(formData.avatar, {
							bucketName: 'avatars',
							fileName: user?.id,
						})

						if (!uploadResult.success) {
							form.setError('avatar', {
								message: 'Falha ao enviar o avatar. Tente novamente.',
							})
							return
						}

						updatePayload.avatar = uploadResult.data.url
					} else {
						updatePayload.avatar = formData.avatar ?? null
					}
				}

				if (dirtyFields.name) updatePayload.name = formData.name
				if (dirtyFields.email) updatePayload.email = formData.email
				if (dirtyFields.phone) updatePayload.phone = formData.phone
				if (dirtyFields.notes) updatePayload.notes = formData.notes
				if (dirtyFields.type) updatePayload.type = formData.type

				if (Object.keys(updatePayload).length === 0) {
					toast.info('Nenhuma alteração detectada.')
					return
				}

				const result = await updateContactAction(contact.id, updatePayload)

				if (isSuccess(result)) {
					toast.success('Contato atualizado com sucesso!')
					form.reset(formData)
					router.refresh()
				}

				if (isFailure(result)) {
					form.setError('root', {
						message: result.message,
					})
				}
			})
		},
	)

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

					<ContactFormFields form={form} isDisabled={isDisabled} />

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
