import { createClient } from './server'

export async function makeSupabaseStoage() {
	const supabase = await createClient()

	return supabase.storage
}
