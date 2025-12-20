import {
	type FileMetadata,
	formatBytes,
	useFileUpload,
} from '@/hooks/use-file-upload'
import { Avatar, AvatarImage, Button } from '@tc96/ui-react'
import { User, X } from 'lucide-react'

const MAX_SIZE = 1 * 1024 * 1024 // 1MB

export type FileUploadProps = {
	name: string
	value?: File | FileMetadata | null
	onChange: (file: File | null) => void
	onBlur?: () => void
	disabled?: boolean
	accept?: string
	multiple?: boolean
	maxSize?: number
}

export function FileUpload({
	name,
	value = null,
	onChange,
	onBlur,
	disabled,
	accept = '.jpg,.jpeg,.png',
	multiple = false,
	maxSize = MAX_SIZE,
}: FileUploadProps) {
	const initialFiles =
		value && typeof value === 'object' && 'url' in value
			? [value as FileMetadata]
			: []

	const [state, actions] = useFileUpload({
		maxFiles: multiple ? Number.POSITIVE_INFINITY : 1,
		maxSize,
		accept,
		multiple,
		initialFiles,
		onFilesChange: (files) => {
			const first = files[0]
			onChange(first && first.file instanceof File ? first.file : null)
		},
		onError: (errs) => {
			console.warn('File upload errors:', errs)
		},
	})

	const previewUrl = !multiple ? state.files[0]?.preview : undefined

	return (
		<div className="flex flex-col items-center gap-2">
			<div className="relative size-24">
				<label
					className="group/avatar relative block size-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors"
					htmlFor={name}
				>
					<input
						disabled={disabled}
						id={name}
						name={name}
						{...actions.getInputProps({
							accept,
							multiple,
							onBlur,
						})}
						className="sr-only"
					/>

					{previewUrl ? (
						<Avatar className="size-24">
							<AvatarImage src={previewUrl} />
						</Avatar>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<User className="size-6 text-muted-foreground" />
						</div>
					)}
				</label>

				{!!state.files.length && (
					<Button
						aria-label="Remove avatar"
						className="absolute end-0 top-0 size-6 rounded-full"
						isIcon
						onClick={() => actions.clearFiles()}
						variant="destructive"
					>
						<X className="size-3.5" />
					</Button>
				)}
			</div>

			<div className="space-y-0.5 text-center">
				<p className="font-medium text-sm">
					{state.files.length ? 'Avatar uploaded' : 'Upload avatar'}
				</p>
				<p className="text-muted-foreground text-xs">
					PNG, JPG up to {formatBytes(maxSize)}
				</p>
				{state.errors.length > 0 && (
					<p className="text-destructive text-xs">{state.errors[0]}</p>
				)}
			</div>
		</div>
	)
}
