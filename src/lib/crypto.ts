import { timingSafeEqual } from '@std/crypto'

/**
 * Hashes a secret string using PBKDF2-SHA256.
 *
 * @param secret - Plain-text secret to hash.
 * @returns Base64-encoded hash string.
 */
export async function hashPassword(secret: string): Promise<string> {
	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
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

	const hashArray = new Uint8Array(bits)
	const combined = new Uint8Array(salt.length + hashArray.length)
	combined.set(salt)
	combined.set(hashArray, salt.length)

	return btoa(String.fromCharCode(...combined))
}

/**
 * Verifies a secret string using stored PBKDF2 hash.
 *
 * @param secret - Plain-text password to verify.
 * @param stored - Previously hashed value from {@link hashPassword}.
 */
export async function verifyPassword(secret: string, stored: string): Promise<boolean> {
	const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0))
	const salt = combined.slice(0, 16)
	const storedHash = combined.slice(16)

	const encoder = new TextEncoder()
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		'PBKDF2',
		false,
		['deriveBits'],
	)

	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100_000 },
		keyMaterial,
		256,
	)

	return timingSafeEqual(storedHash, new Uint8Array(bits))
}
