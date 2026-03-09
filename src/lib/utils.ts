import { ensureDir as _ensureDir } from '@std/fs'
import { dirname, extname } from '@std/path'
import { v7 } from '@std/uuid'

// ----------------------------------------------------------------------------
// Misc.

export const now = () => new Date().toISOString()
export const uid = () => v7.generate()

// ----------------------------------------------------------------------------
// Format

/** Formats a date as a localized date-time string (e.g. `MM/DD/YYYY HH:mm:ss`). */
export function dateTime(date: Date, locale: string = 'en-US'): string {
	return Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(date).replace(',', '')
}

// ----------------------------------------------------------------------------
// File System

/**
 * Ensures the directory for a file or directory path exists.
 * Creates missing parent directories as needed.
 *
 * @param path - File or directory path (e.g. `./data/app.db`).
 */
export async function ensureDir(path: string): Promise<void> {
	const dir = extname(path) ? dirname(path) : path
	await _ensureDir(dir)
}

// ----------------------------------------------------------------------------
// Data

/**
 * Strips the specified keys from a record.
 *
 * @param keys - Keys to remove.
 * @param record - The record to sanitize.
 */
export function strip<T extends object, K extends keyof T>(
	keys: K[],
	record: T,
): Omit<T, K> {
	const result = { ...record }
	for (const key of keys) delete result[key]
	return result as Omit<T, K>
}
