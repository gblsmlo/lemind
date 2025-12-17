export const taskPriorityTypes = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const
export type TaskPriorityTypes = (typeof taskPriorityTypes)[number]
