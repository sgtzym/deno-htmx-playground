import { column } from '@sgtzym/sparq'

export type AuditColumn = {
	id: string
	createdAt: Date
	updatedAt: Date
	active: boolean
}

/** All non-audit fields required – for insert operations. */
export type Insertable<T> = Omit<T, keyof AuditColumn>

/** All non-audit fields optional – for patch operations. */
export type Patchable<T> = Partial<Omit<T, keyof AuditColumn>>

/** Returns standard audit columns for a Sparq schema. */
export function auditColumns() {
	return {
		id: column.text({ primaryKey: true, notNull: true }),
		createdAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		updatedAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		active: column.boolean({ notNull: true, default: true }),
	}
}
