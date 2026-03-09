import { column } from '@sgtzym/sparq'

export type AuditColumn = {
	systemId: string
	createdAt: Date
	updatedAt: Date
	active: boolean
}

/** Omits auto-managed audit fields from a record type. */
export type Mutable<T> = Omit<T, keyof AuditColumn>

/** Returns standard audit columns for a Sparq schema. */
export function auditColumns() {
	return {
		systemId: column.text({ primaryKey: true, notNull: true }),
		createdAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		updatedAt: column.date({ notNull: true, default: 'CURRENT_TIMESTAMP' }),
		active: column.boolean({ notNull: true, default: true }),
	}
}
