import type { Context, Next } from '@hono/hono'

import { dateTime } from '~lib/utils.ts'

/** Logs each request with method, path, status, and elapsed time. */
export async function logger(c: Context, next: Next): Promise<void> {
	const path = new URL(c.req.url).pathname
	const start = performance.now()

	await next()

	const prefix = c.res.ok ? '→' : 'x'
	const elapsed = `${(performance.now() - start).toFixed(0)}ms`

	console.log([dateTime(new Date()), prefix, c.req.method, path, c.res.status, elapsed].join(' '))
}
