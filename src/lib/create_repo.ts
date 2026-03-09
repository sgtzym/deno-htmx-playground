import type { Select, Sparq, SqlNodeValue, TextColumn } from '@sgtzym/sparq'

import { db } from '~app/db.ts'
import type { AuditColumn, Mutable } from '~lib/column.ts'

export interface Repo<T> {
	create(data: Mutable<T>): T | null
	find(id: string): T | null
	findOne(filters: Partial<T>): T | null
	findMany(filters?: Partial<T>): T[]
	query(build: (q: Select) => Select): T[]
	update(id: string, data: Partial<Mutable<T>>): T | null
	delete(id: string, force?: boolean): T | null
}

/**
 * Creates a generic CRUD repository for a Sparq schema.
 *
 * @param schema - The Sparq schema to build the repository for.
 */
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
		create(data: Mutable<T>): T | null {
			const id = db.id
			const columns = ['id', ...Object.keys(data)]
			const values = [id, ...Object.values(data)]

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

		/** Returns all records, optionally filtered. Strings use LIKE matching. */
		findMany(filters?: Partial<T>): T[] {
			const q = schema.select()
			if (!filters) return db.all<T>(q.sql, q.params)
			const conds = conditions(filters, true)
			if (conds.length > 0) q.where(...conds)
			return db.all<T>(q.sql, q.params)
		},

		/** Runs a custom query built with the Sparq query builder. */
		query(build: (q: Select) => Select): T[] {
			const q = build(schema.select())
			return db.all<T>(q.sql, q.params)
		},

		/** Updates a record by id and returns the updated record, or `null`. */
		update(id: string, data: Partial<Mutable<T>>): T | null {
			const q = schema
				.update({ ...data, updatedAt: db.timestamp })
				.where($[pk].eq(id))
			db.exec(q.sql, q.params)
			return this.find(id)
		},

		/**
		 * Deletes a record by id and returns it, or `null`.
		 *
		 * Soft-deletes by default (`active = false`). Pass `force = true` to hard-delete.
		 */
		delete(id: string, force?: boolean): T | null {
			const item = this.find(id)
			if (!item) return null

			if (item.active && !force) {
				const q = schema
					.update([$.active.to(false), $.updatedAt.to(db.timestamp)])
					.where($[pk].eq(id))
				db.exec(q.sql, q.params)
			} else {
				const q = schema.delete().where($[pk].eq(id))
				db.exec(q.sql, q.params)
			}

			return item
		},
	}
}
