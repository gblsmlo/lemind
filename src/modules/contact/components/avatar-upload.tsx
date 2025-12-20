'use client'

import {
	type FileWithPreview,
	formatBytes,
	useFileUpload,
} from '@/hooks/use-file-upload'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, Button } from '@tc96/ui-react'
import { User, X } from 'lucide-react'

interface AvatarUploadProps {
	maxSize?: number
	className?: string
	onFileChange?: (file: FileWithPreview | null) => void
	defaultAvatar?: string
}

export default function AvatarUpload({
	maxSize = 1 * 1024 * 1024, // 1MB
	onFileChange,
	defaultAvatar,
}: AvatarUploadProps) {
	const [
		{ files, isDragging, errors },
		{
			removeFile,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			getInputProps,
		},
	] = useFileUpload({
		maxFiles: 1,
		maxSize,
		accept: 'image/*',
		multiple: false,
		onFilesChange: (files) => {
			onFileChange?.(files[0] || null)
		},
	})

	const currentFile = files[0]
	const previewUrl = currentFile?.preview || defaultAvatar

	const handleRemove = () => {
		if (currentFile) {
			removeFile(currentFile.id)
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative">
				<button
					className={cn(
						'group/avatar relative size-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
						isDragging
							? 'border-primary bg-primary/5'
							: 'border-muted-foreground/25 hover:border-muted-foreground/20',
						previewUrl && 'border-solid',
					)}
					onClick={openFileDialog}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					type="button"
				>
					<input {...getInputProps()} className="sr-only" />

					{previewUrl ? (
						<Avatar className="size-24" size="lg">
							<AvatarImage src={previewUrl} />
						</Avatar>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<User className="size-6 text-muted-foreground" />
						</div>
					)}
				</button>

				{currentFile && (
					<Button
						aria-label="Remove avatar"
						className="absolute end-0 top-0 size-6 rounded-full"
						isIcon
						onClick={handleRemove}
						variant="destructive"
					>
						<X className="size-3.5" />
					</Button>
				)}
			</div>

			<div className="space-y-0.5 text-center">
				<p className="font-medium text-sm">
					{currentFile ? 'Avatar uploaded' : 'Upload avatar'}
				</p>
				<p className="text-muted-foreground text-xs">
					PNG, JPG up to {formatBytes(maxSize)}
				</p>
			</div>

			{/* Error Messages */}
			{/* {errors.length > 0 && (
				<Alert appearance="light" className="mt-5" variant="destructive">
					<AlertIcon>
						<TriangleAlert />
					</AlertIcon>
					<AlertContent>
						<AlertTitle>File upload error(s)</AlertTitle>
						<AlertDescription>
							{errors.map((error, index) => (
								<p className="last:mb-0" key={index}>
									{error}
								</p>
							))}
						</AlertDescription>
					</AlertContent>
				</Alert>
			)} */}
		</div>
	)
}
