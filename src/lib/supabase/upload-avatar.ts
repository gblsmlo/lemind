import { failure, type Result, success } from '@/shared/errors'
import { makeSupabaseClient } from './factories-client'

export type UploadAvatarOptions = {
	fileName?: string
	bucket?: string
	folder?: string
}

export type UploadResult = {
	url?: string
	path?: string
	error?: string
}

/**
 * Uploads an avatar image to Supabase Storage
 * @param file - The image file to upload
 * @param options - Upload options (spaceId required, contactId optional)
 * @returns Upload result with public URL or error
 */
export async function uploadAvatar(
	file: File,
	options: UploadAvatarOptions,
): Promise<Result<UploadResult>> {
	const { fileName = crypto.randomUUID(), bucket = 'images', folder } = options

	try {
		const supabase = makeSupabaseClient()

		const fileExt = file.name.split('.').pop()
		const filePath = options.folder
			? `${folder}/${fileName}.${fileExt}`
			: `${fileName}.${fileExt}`

		const { error } = await supabase.storage
			.from(bucket)
			.upload(filePath, file, {
				cacheControl: '3600',
				upsert: true,
			})

		if (error) {
			console.error('Upload error:', error)

			return failure({
				type: 'DATABASE_ERROR',
				error: error.name,
				message: error.message,
				details: error.cause,
			})
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(bucket).getPublicUrl(filePath)

		return success({
			url: publicUrl,
			path: filePath,
		})
	} catch (error) {
		console.error('Upload exception:', error)

		if (error instanceof Error) {
			return failure({
				type: 'DATABASE_ERROR',
				error: error.name,
				message: error.message,
			})
		}

		return failure({
			type: 'UNKNOWN_ERROR',
			error: 'Unknown error',
			message: 'An unknown error occurred during avatar upload',
		})
	}
}
