import type { Select, Sparq, SqlNodeValue, TextColumn } from '@sgtzym/sparq'

import { db } from '~app/db.ts'
import type { AuditColumn, Insertable, Patchable } from '~lib/column.ts'

import { now, uid } from './utils.ts'

export interface Repo<T> {
	create(data: Insertable<T>): T | null
	find(id: string): T | null
	findOne(filters: Partial<T>): T | null
	findMany(filters?: Partial<T>): T[]
	query(build: (q: Select) => Select): T[]
	update(id: string, data: Patchable<T>): T | null
	delete(id: string, force?: boolean): string | null
}

/** Creates a CRUD repository for a Sparq schema. */
export default function createRepo<T extends AuditColumn>(schema: Sparq<any>): Repo<T> {
	const { $ } = schema
	const pk = Object.keys($).find((key) => $[key].options?.primaryKey) ?? 'id'

	function conditions(filters: Partial<T>, fuzzy = false) {
		return Object.entries(filters)
			.filter(([key]) => $[key])
			.map(([key, value]) =>
				fuzzy && typeof value === 'string'
					? ($[key] as TextColumn).like(`%${value}%`)
					: $[key].eq(value as SqlNodeValue)
			)
	}

	return {
		/** Creates a record and returns it, or `null` on failure. */
		create(data: Insertable<T>): T | null {
			const id = uid()
			const timestamp = now()

			// Omits undefined values so SQLite can apply column defaults.
			const rec = Object.fromEntries(
				Object.entries({
					active: true,
					...data,
					[pk]: id,
					createdAt: timestamp,
					updatedAt: timestamp,
				}).filter(([_, v]) => v !== undefined),
			)

			const columns = Object.keys(rec)
			const values = Object.values(rec)

			const q = schema
				.insert(...columns.map((k) => $[k]))
				.values(...values as SqlNodeValue[])

			db.exec(q.sql, q.params)

			return this.find(id)
		},

		/** Returns a record by primary key, or `null`. */
		find(id: string): T | null {
			const q = schema.select().where($[pk].eq(id))

			return db.get<T>(q.sql, q.params)
		},

		/** Returns the first record matching all filters, or `null`. */
		findOne(filters: Partial<T> = {}): T | null {
			const q = schema.select()
			const conds = conditions(filters)
			if (conds.length > 0) q.where(...conds)

			return db.get<T>(q.sql, q.params)
		},

		/** Returns all records matching optional filters. Strings use LIKE matching. */
		findMany(filters?: Partial<T>): T[] {
			const q = schema.select()
			if (!filters) return db.all<T>(q.sql, q.params)

			const conds = conditions(filters, true)
			if (conds.length > 0) q.where(...conds)

			return db.all<T>(q.sql, q.params)
		},

		/** Returns records matching a custom query. */
		query(build: (q: Select) => Select): T[] {
			const q = build(schema.select())

			return db.all<T>(q.sql, q.params)
		},

		/** Updates a record by primary key and returns it, or `null` on failure. */
		update(id: string, data: Patchable<T>): T | null {
			const q = schema
				.update({ ...data, updatedAt: now() })
				.where($[pk].eq(id))
			db.exec(q.sql, q.params)

			return this.find(id)
		},

		/**
		 * Deletes a record by primary key and returns its id, or `null`. Soft-deletes (`active = false`) by default.
		 * @param force - Hard-deletes the record, if set.
		 */
		delete(id: string, force?: boolean): string | null {
			const item = this.find(id)
			if (!item) return null

			if (item.active && !force) {
				const q = schema
					.update({ active: false, updatedAt: now() })
					.where($[pk].eq(id))
				db.exec(q.sql, q.params)
			} else {
				const q = schema.delete().where($[pk].eq(id))
				db.exec(q.sql, q.params)
			}

			return item.id
		},
	}
}
