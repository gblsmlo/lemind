'use client'

import { FileUpload } from '@/components/ui/file-upload'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

interface ContactFormFieldsProps<T extends FieldValues> {
	form: UseFormReturn<T>
	isDisabled?: boolean
}

export function ContactFormFields<T extends FieldValues>({
	form,
	isDisabled,
}: ContactFormFieldsProps<T>) {
	return (
		<>
			<FormField
				control={form.control}
				name={'avatar' as Path<T>}
				render={({ field }) => {
					// Adapter para FileUpload: converte string URL em FileMetadata
					// const adaptedValue =
					// 	typeof field.value === 'string' && field.value
					// 		? {
					// 				url: field.value,
					// 				name: 'avatar',
					// 				size: 0,
					// 				type: 'image/*',
					// 				id: 'existing-avatar',
					// 			}
					// 		: field.value

					const adaptedOnChange = (file: File | null) => {
						field.onChange(file)
					}

					return (
						<FormItem>
							<FormControl>
								<FileUpload
									disabled={isDisabled}
									name={field.name}
									onBlur={field.onBlur}
									onChange={adaptedOnChange}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)
				}}
			/>

			<FormField
				control={form.control}
				name={'name' as Path<T>}
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
				name={'email' as Path<T>}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<Input placeholder="email@exemplo.com" type="email" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={'phone' as Path<T>}
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
				name={'notes' as Path<T>}
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
		</>
	)
}
