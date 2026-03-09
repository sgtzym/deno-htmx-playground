import { Hono } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'

import { repo } from '~entities/user.ts'
import { hashPassword } from '~lib/crypto.ts'
import { strip } from '~lib/utils.ts'
import { render } from '~web/shared/render.tsx'
import { UserListPage } from '~web/user/page.tsx'
import { UserList } from '~web/user/list.tsx'

export const web = new Hono()
	.get('/', (c) => {
		const { name, email } = c.req.query()
		const users = repo.findMany({
			...(name && { name }),
			...(email && { email }),
		}).map((u) => strip(['password'], u))
		return render(c, {
			page: () => <UserListPage users={users} />,
			fragments: {
				'#user-list': () => <UserList users={users} />,
			},
		})
	})
	.post('/', async (c) => {
		const form = await c.req.formData()
		const name = form.get('name')?.toString()
		const email = form.get('email')?.toString()
		const password = form.get('password')?.toString()
		const alias = form.get('alias')?.toString()

		if (!name || !email || !password) throw new HTTPException(400)

		const existing = repo.findOne({ email })
		if (existing) throw new HTTPException(409, { message: 'Email already in use.' })

		const hashed = await hashPassword(password)

		const created = repo.create({
			name,
			email,
			password: hashed,
			alias: alias ?? '',
		})
		if (!created) throw new HTTPException(500)

		const users = repo.findMany().map((u) => strip(['password'], u))
		return c.html(<UserList users={users} />)
	})
