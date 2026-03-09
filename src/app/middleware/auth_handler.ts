import { Context, Next } from '@hono/hono'
import { getCookie } from '@hono/hono/cookie'

export const sessionAuth = async (c: Context, next: Next) => {
	const sessionId = getCookie(c, 'session')
	if (!sessionId) return c.redirect('/login')

	await next()
}
