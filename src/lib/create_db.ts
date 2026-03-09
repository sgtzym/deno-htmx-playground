import { Database, type DatabaseOpenOptions } from '@db/sqlite'
import { Sparq, type SqlParam } from '@sgtzym/sparq'

interface Pragmas {
	busy_timeout?: number
	cache_size?: number
	foreign_keys?: 'on' | 'off'
	journal_mode?: 'delete' | 'truncate' | 'persist' | 'memory' | 'wal' | 'off'
	synchronous?: 'normal' | 'full' | 'extra' | 'off'
	// Add more if needed...
}

/**
 * Creates a configured SQLite database client.
 *
 * @param dbPath - Path to the database file, or `:memory:` for an in-memory database.
 * @param options - Optional SQLite open options.
 */
export default function createDatabase(
	dbPath: string,
	pragmas: Pragmas = {},
	options?: DatabaseOpenOptions,
) {
	const client = new Database(dbPath, options)

	for (const [key, value] of Object.entries(pragmas)) {
		client.exec(`PRAGMA ${key} = ${value};`)
	}

	return {
		/** Creates tables for the provided Sparq schemas if they don't exist. */
		init(schemas: Sparq<any>[]): void {
			for (const schema of schemas) {
				client.exec(schema.create({ ifNotExists: true }).sql)
			}
		},

		/** Closes the database connection. */
		close(): void {
			client.close()
		},

		/** Runs a prepared statement and returns all rows. */
		all<T>(sql: string, params: readonly SqlParam[]): T[] {
			return client.prepare(sql).all(...params) as T[]
		},

		/** Runs a prepared statement and returns the first row, or `null`. */
		get<T>(sql: string, params: readonly SqlParam[]): T | null {
			const item = client.prepare(sql).get(...params)
			return item ? (item as T) : null
		},

		/** Executes a statement without returning rows. */
		exec(sql: string, params: readonly SqlParam[]): void {
			client.exec(sql, ...params)
		},
	}
}
