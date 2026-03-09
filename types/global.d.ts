declare global {
	/** A single value or an array of values of the same type. */
	type OneOrMany<T> = T | T[]

	/** A value that may be undefined. */
	type Maybe<T> = T | undefined
}

export {}
