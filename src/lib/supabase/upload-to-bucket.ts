import { failure, type Result, success } from '@/shared/errors'
import { makeSupabaseClient } from './factories-client'

type Options = {
	fileName?: string
	bucketName?: string
	path?: string
}

type Output = {
	url?: string
	path?: string
	error?: string
}

export async function uploadToBucket(
	file: File,
	options: Options,
): Promise<Result<Output>> {
	const {
		fileName = crypto.randomUUID(),
		bucketName = 'images',
		path,
	} = options

	try {
		const supabase = makeSupabaseClient()

		const fileExt = file.name.split('.').pop()
		const filePath = options.path
			? `${path}/${fileName}.${fileExt}`
			: `${fileName}.${fileExt}`

		const { error } = await supabase.storage
			.from(bucketName)
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
		} = supabase.storage.from(bucketName).getPublicUrl(filePath)

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
