/**
 * Hashes a plain-text password using PBKDF2-SHA256.
 *
 * @param password - Plain-text password to hash.
 * @returns Base64-encoded hash string.
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits'],
	)

	const salt = crypto.getRandomValues(new Uint8Array(16))
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
		keyMaterial,
		256,
	)

	// Encode salt + hash for verification
	const hashArray = new Uint8Array(bits)
	const combined = new Uint8Array(salt.length + hashArray.length)
	combined.set(salt)
	combined.set(hashArray, salt.length)

	return btoa(String.fromCharCode(...combined))
}

/**
 * Verifies a plain-text password against a stored hash.
 *
 * @param password - Plain-text password to verify.
 * @param stored - Previously hashed value from {@link hashPassword}.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0))
	const salt = combined.slice(0, 16)
	const storedHash = combined.slice(16)

	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits'],
	)

	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
		keyMaterial,
		256,
	)

	const newHash = new Uint8Array(bits)
	return storedHash.every((byte, i) => byte === newHash[i])
}
