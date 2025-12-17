import { caseStatusTypes } from '@/modules/case'
import { contactStatusTypes } from '@/modules/contact'
import { taskPriorityTypes } from '@/modules/task/types'
import { pgEnum } from 'drizzle-orm/pg-core'

export const taskPriorityEnum = pgEnum('task_priority', taskPriorityTypes)
export const contactStatusEnum = pgEnum('contact_status', contactStatusTypes)
export const caseStatusEnum = pgEnum('case_status', caseStatusTypes)
