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
import { createContactAction } from '../../actions/create-contact-action'
import { contactInsertFormSchema } from '../../schemas'
import type { ContactInsertFormData } from '../../types'
import { ContactFormFields } from './contact-form-fields'

// Hardcoded spaceId - TODO: Get from context/session
const DEFAULT_SPACE_ID = 'a069aabe-abdd-4b03-9c11-84437f7d1384'

export function CreateContactForm() {
	const { user } = useAuth()
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm<ContactInsertFormData>({
		resolver: zodResolver(contactInsertFormSchema),
		defaultValues: {
			avatar: null,
			name: '',
			email: '',
			phone: '',
			notes: '',
			type: 'NEW',
		},
	})

	const handleCancel = () => {
		form.reset()
		router.back()
	}

	const handleSubmit = form.handleSubmit((formData: ContactInsertFormData) => {
		startTransition(async () => {
			let avatarUrl: string | undefined

			if (formData.avatar) {
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

				avatarUrl = uploadResult.data.url
			}

			const result = await createContactAction({
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				notes: formData.notes,
				avatar: avatarUrl,
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
