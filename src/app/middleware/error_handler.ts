import type { Context, ErrorHandler } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'
import type { ContentfulStatusCode } from '@hono/hono/utils/http-status'

import config from '~app/config.ts'
import { ErrorPage } from '~web/shared/layout/page.tsx'

function parseError(
	err: unknown,
): { status: ContentfulStatusCode; message: string; stack?: string } {
	if (err instanceof Error) {
		return {
			status: (err instanceof HTTPException ? err.status : 500) as ContentfulStatusCode,
			message: err.message,
			stack: config.debug ? err.stack : undefined,
		}
	}
	return { status: 500, message: 'An unexpected error occurred.' }
}

// Error 4xx / 5xx
export const jsonErr: ErrorHandler = (err, c) => {
	const { status, message, stack } = parseError(err)
	return c.json({ error: message, status, ...(stack && { stack }) }, status)
}

export const htmlErr: ErrorHandler = (err, c) => {
	const { status, message } = parseError(err)
	return c.html(ErrorPage({ status, error: message }), status)
}

// Error 404: not found
export const jsonNotFound = (c: Context) => c.json({ error: 'Not found.', status: 404 }, 404)
export const htmlNotFound = (c: Context) =>
	c.html(ErrorPage({ error: 'Not found.', status: 404 }), 404)
