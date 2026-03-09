import { type Context } from '@hono/hono'
import { type SqlParam } from '@sgtzym/sparq'

export type Constructor =
	| typeof String
	| typeof Number
	| typeof Boolean
	| typeof Date
	| typeof Array

type Infer<T extends Constructor> = T extends typeof String ? string
	: T extends typeof Number ? number
	: T extends typeof Boolean ? boolean
	: T extends typeof Date ? Date
	: T extends typeof Array ? string[]
	: never

export type Schema = Record<string, Constructor>
type ParsedSchema<T extends Schema> = { [K in keyof T]?: Infer<T[K]> }

const cast = (value: string, type: Constructor): SqlParam | undefined => {
	if (value.trim() === '') return undefined
	switch (type) {
		case Boolean: {
			const v = value.toLowerCase()
			return v === 'true' ? true : v === 'false' ? false : undefined
		}
		case Number: {
			const n = Number(value)
			return isNaN(n) ? undefined : n
		}
		case Date: {
			const d = new Date(value)
			return isNaN(d.getTime()) ? undefined : d
		}
		case Array:
			return value.split(',').map((v) => v.trim()).filter(Boolean)
		case String:
		default:
			return value
	}
}

/**
 * Parses and casts query parameters from a Hono request context against a schema.
 *
 * @param c - The Hono request context.
 * @param schema - An object mapping parameter names to their target types.
 * @returns An object containing the parsed parameters, omitting invalid or missing values.
 */
export function parse<T extends Schema>(
	c: Context,
	schema: T,
): ParsedSchema<T> {
	const result: Record<string, SqlParam | string[]> = {}

	for (
		const [key, type] of Object.entries(schema) as [string, Constructor][]
	) {
		if (type === Array) {
			const values = c.req.queries(key) ?? []
			if (values.length) result[key] = values
		} else {
			const value = c.req.query(key)
			if (value !== undefined) {
				const parsed = cast(value, type)
				if (parsed !== undefined) result[key] = parsed
			}
		}
	}

	return result as ParsedSchema<T>
}
