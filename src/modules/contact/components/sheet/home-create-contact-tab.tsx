'use client'

import { Alert, AlertTitle } from '@/components/ui/alert'
import { FileUpload } from '@/components/ui/file-upload'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { InfoRow } from '@/components/ui/info-row'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatCpfCnpj } from '@/lib/format'
import { uploadToBucket } from '@/lib/supabase/upload-to-bucket'
import { stripNonDigits } from '@/lib/validators'
import { useAuth } from '@/modules/auth'
import { isFailure, isSuccess } from '@/shared/errors'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@tc96/ui-react'
import { Loader2, Mail, MapPin, Phone, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createContactAction } from '../../actions/create-contact-action'
import { updateContactAction } from '../../actions/update-contact-action'
import { contactInsertFormSchema, contacUpdateFormSchema } from '../../schemas'
import { useStoreContact } from '../../store'
import type {
	Contact,
	ContactInsertFormData,
	ContactUpdate,
	ContactUpdateFormData,
} from '../../types'
import { contactStatusTypes } from '../../types'

// Hardcoded spaceId - TODO: Get from context/session
const DEFAULT_SPACE_ID = 'a069aabe-abdd-4b03-9c11-84437f7d1384'

interface HomeCreateContactTabProps {
	initialValues?: Contact | null
}

export function HomeCreateContactTab({
	initialValues,
}: HomeCreateContactTabProps) {
	const { user } = useAuth()
	const [isPending, startTransition] = useTransition()
	const router = useRouter()
	const { onSelected } = useStoreContact()

	const isUpdateMode = Boolean(initialValues?.id)

	const form = useForm<ContactInsertFormData | ContactUpdateFormData>({
		resolver: zodResolver(
			isUpdateMode ? contacUpdateFormSchema : contactInsertFormSchema,
		),
		values: {
			avatar: initialValues?.avatar ?? undefined,
			name: initialValues?.name ?? '',
			email: initialValues?.email ?? '',
			phone: initialValues?.phone ?? '',
			notes: initialValues?.notes ?? '',
			document: initialValues?.document ?? '',
			type: initialValues?.type ?? 'NEW',
		},
	})

	const handleSubmit = form.handleSubmit(async (formData) => {
		startTransition(async () => {
			if (isUpdateMode && initialValues) {
				// Update logic
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
						updatePayload.avatar = (formData.avatar as string) ?? null
					}
				}

				if (dirtyFields.name) updatePayload.name = formData.name
				if (dirtyFields.email) updatePayload.email = formData.email
				if (dirtyFields.phone) updatePayload.phone = formData.phone
				if (dirtyFields.notes) updatePayload.notes = formData.notes
				if (dirtyFields.document)
					updatePayload.document = formData.document
						? stripNonDigits(formData.document)
						: null
				if (dirtyFields.type) updatePayload.type = formData.type

				if (Object.keys(updatePayload).length === 0) {
					toast.info('Nenhuma alteração detectada.')
					return
				}

				const result = await updateContactAction(
					initialValues.id,
					updatePayload,
				)

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
			} else {
				// Create logic
				let avatarUrl: string | undefined

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

					avatarUrl = uploadResult.data.url
				}

				const result = await createContactAction({
					name: formData.name,
					email: formData.email || undefined,
					phone: formData.phone || undefined,
					notes: formData.notes || undefined,
					avatar: avatarUrl,
					type: formData.type ?? 'NEW',
					document: formData.document
						? stripNonDigits(formData.document)
						: null,
					spaceId: DEFAULT_SPACE_ID,
				})

				if (isSuccess(result)) {
					toast.success('Contato criado com sucesso!')
					form.reset()
					onSelected(result.data.row)
					router.refresh()
				}

				if (isFailure(result)) {
					form.setError('root', {
						message: result.message,
					})
				}
			}
		})
	})

	const isDisabled = isPending
	const isLoading = isPending || form.formState.isSubmitting

	return (
		<Form {...form}>
			<form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
								<FileUpload
									disabled={isDisabled}
									name={field.name}
									onBlur={field.onBlur}
									onChange={(file) => field.onChange(file)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<InfoRow icon={User} label="Nome">
									<FormControl>
										<Input
											className="h-8"
											disabled={isDisabled}
											placeholder="Nome completo"
											{...field}
										/>
									</FormControl>
								</InfoRow>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="document"
						render={({ field }) => {
							const handleDocumentChange = (
								e: React.ChangeEvent<HTMLInputElement>,
							) => {
								const value = e.target.value
								const digits = stripNonDigits(value)
								field.onChange(digits)
							}

							return (
								<FormItem>
									<InfoRow icon={MapPin} label="Documento">
										<FormControl>
											<Input
												className="h-8"
												disabled={isDisabled}
												maxLength={18}
												onChange={handleDocumentChange}
												placeholder="CPF ou CNPJ"
												type="text"
												value={formatCpfCnpj(field.value as string)}
											/>
										</FormControl>
									</InfoRow>
									<FormMessage />
								</FormItem>
							)
						}}
					/>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<InfoRow icon={Mail} label="Email">
									<FormControl>
										<Input
											className="h-8"
											disabled={isDisabled}
											placeholder="email@exemplo.com"
											type="email"
											{...field}
										/>
									</FormControl>
								</InfoRow>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<InfoRow icon={Phone} label="Telefone">
									<FormControl>
										<Input
											className="h-8"
											disabled={isDisabled}
											placeholder="(00) 00000-0000"
											type="tel"
											{...field}
										/>
									</FormControl>
								</InfoRow>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator className="my-2" />

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<InfoRow icon={User} label="Status">
									<Select
										disabled={isDisabled}
										onValueChange={field.onChange}
										value={field.value as string}
									>
										<FormControl>
											<SelectTrigger className="h-8">
												<SelectValue placeholder="Selecione o status" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{contactStatusTypes.map((status) => (
												<SelectItem key={status} value={status}>
													{status}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</InfoRow>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Separator className="my-2" />

					<FormField
						control={form.control}
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										className="min-h-[80px]"
										disabled={isDisabled}
										placeholder="Notas sobre o contato..."
										rows={3}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-2 pt-4">
						<Button disabled={isDisabled} type="submit">
							{isLoading ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : isUpdateMode ? (
								'Salvar'
							) : (
								'Criar Contato'
							)}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	)
}
