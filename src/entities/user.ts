import { column, Rec, sparq } from '@sgtzym/sparq'

import { auditColumns } from '~lib/column.ts'
import createRepo from '~lib/create_repo.ts'

// ----------------------------------------------------------------------------
// Model

export const model = sparq('user', {
	...auditColumns(),
	name: column.text({ notNull: true, unique: true }),
	email: column.text({ notNull: true, unique: true }),
	password: column.text({ notNull: true }),
	alias: column.text(),
})

export type User = Rec<typeof model>

// ----------------------------------------------------------------------------
// Repo

export const repo = createRepo<User>(model)
