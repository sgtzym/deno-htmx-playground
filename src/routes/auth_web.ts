import { Hono } from '@hono/hono'
import { setCookie } from '@hono/hono/cookie'
import { HTTPException } from '@hono/hono/http-exception'

import { repo as user, type User } from '~entities/user.ts'
import { verifyPassword } from '~lib/crypto.ts'

export const api = new Hono()
	.post('/login', async (c) => {
		const { name, password } = await c.req.json()
		if (!name || !password) throw new HTTPException(400)

		const entry: User | null = user.findOne({ name, active: true })
		if (!entry) throw new HTTPException(401)

		const valid = await verifyPassword(password, entry.password)
		if (!valid) throw new HTTPException(401)

		setCookie(c, 'session', entry.systemId, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
		})

		return c.redirect('/')
	})
