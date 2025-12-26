import type {
	Contact,
	ContactInsert,
	ContactUpdate,
	EntityRowOutput,
	EntityRowsOutput,
	FindContactsInput,
} from '../types'

export interface ContactRepository {
	create(input: ContactInsert): Promise<EntityRowOutput<Contact>>
	update(id: string, input: ContactUpdate): Promise<EntityRowOutput<Contact>>
	delete(id: string): Promise<{ deletedId: string }>
	findMany(input: FindContactsInput): Promise<EntityRowsOutput<Contact>>
	findById(id: string): Promise<EntityRowOutput<Contact>>
	findByDocumentInSpace(
		document: string,
		spaceId: string,
		excludeId?: string,
	): Promise<EntityRowOutput<Contact>>
}
