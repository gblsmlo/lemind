import { pgEnum } from 'drizzle-orm/pg-core'
import { caseStatusTypes } from '../../../modules/case/types'
import { contactStatusTypes } from '../../../modules/contact/types'
import { taskPriorityTypes } from '../../../modules/task/types'

export const taskPriorityEnum = pgEnum('task_priority', taskPriorityTypes)
export const contactStatusEnum = pgEnum('contact_status', contactStatusTypes)
export const caseStatusEnum = pgEnum('case_status', caseStatusTypes)
