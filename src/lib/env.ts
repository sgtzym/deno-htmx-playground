export type Constructor = typeof String | typeof Number | typeof Boolean

type Infer<T extends Constructor> = T extends typeof String ? string
	: T extends typeof Number ? number
	: T extends typeof Boolean ? boolean
	: never

/**
 * Retrieves an environment variable and casts it to the given type.
 * Returns the fallback if the variable is missing or cannot be cast.
 *
 * @param key - Environment variable name.
 * @param type - Target type constructor.
 * @param fallback - Default value if the variable is missing.
 */
export function env<T extends Constructor>(
	key: string,
	type: T,
	fallback: Infer<T>,
): Infer<T>
export function env<T extends Constructor>(
	key: string,
	type: T,
	fallback?: Infer<T>,
): Infer<T> | undefined
export function env<T extends Constructor>(
	key: string,
	type: T,
	fallback?: Infer<T>,
): Infer<T> | undefined {
	const raw = Deno.env.get(key)
	if (raw === undefined) return fallback

	switch (type) {
		case Boolean:
			return ['true', '1', 'on', 'yes'].includes(raw.toLowerCase()) as Infer<T>
		case Number: {
			const num = Number(raw)
			return (!isNaN(num) ? num : fallback) as Infer<T>
		}
		default:
			return raw as Infer<T>
	}
}
