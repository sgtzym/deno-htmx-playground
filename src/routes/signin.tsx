import { Hono } from '@hono/hono'
import { deleteCookie, getCookie, setCookie } from '@hono/hono/cookie'
import { HTTPException } from '@hono/hono/http-exception'

import { repo as user, type User } from '~entities/user.ts'
import { verifyPassword } from '~lib/crypto.ts'
import { render } from '~web/shared/render.tsx'
import { Login } from '~web/views/login.tsx'

export const web = new Hono()
	.get('/signin', (c) => {
		if (getCookie(c, 'session')) return c.redirect('/')
		return render(c, { page: () => <Login /> })
	})
	.post('/signin', async (c) => {
		const form = await c.req.formData()
		const name = form.get('name')?.toString()
		const password = form.get('password')?.toString()
		if (!name || !password) throw new HTTPException(400)

		const entry: User | null = user.findOne({ name, active: true })
		if (!entry) throw new HTTPException(401)

		const valid = await verifyPassword(password, entry.password)
		if (!valid) throw new HTTPException(401)

		setCookie(c, 'session', entry.id, {
			httpOnly: true,
			secure: true,
			sameSite: 'Strict',
		})

		return c.redirect('/')
	})
	.post('/signout', (c) => {
		deleteCookie(c, 'session')
		return c.redirect('/signin')
	})
