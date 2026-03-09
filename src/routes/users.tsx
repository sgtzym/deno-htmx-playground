import { Context, Hono } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'

import { repo as users, type User } from '~entities/user.ts'
import { type Insertable } from '~lib/column.ts'
import createApi from '~lib/create_api.ts'
import { hashPassword } from '~lib/crypto.ts'
import { strip } from '~lib/utils.ts'
import { render } from '~web/shared/render.tsx'
import { UserList } from '~web/user/list.tsx'
import { UserListPage } from '~web/user/page.tsx'

// ----------------------------------------------------------------------------
// Utils

const serialize = (user: User) => strip(['password'], user)

async function create(data: Insertable<User>) {
	if (!data.password) throw new HTTPException(400)

	const existing = users.findOne({ email: data.email })
	if (existing) throw new HTTPException(409, { message: 'Email already in use.' })

	const password = await hashPassword(data.password)
	const created = users.create({ ...data, password })

	if (!created) throw new HTTPException(500)

	return serialize(created)
}

const list = (c: Context) => {
	const { name, email } = c.req.query()
	return users.findMany({
		...(name && { name }),
		...(email && { email }),
	}).map(serialize)
}

// ----------------------------------------------------------------------------
// API routes

export const api = createApi(users, { serialize })
	.get('/', (c: Context) => c.json(list(c), 200))
	.post('/', async (c: Context) => {
		const data = await c.req.json<User>()
		if (!data?.name || !data?.email || !data?.password) throw new HTTPException(400)

		return c.json(await create(data), 201)
	})

// ----------------------------------------------------------------------------
// Web routes

export const web = new Hono()
	.get('/', (c: Context) => {
		return render(c, {
			page: () => <UserListPage users={list(c)} />,
			fragments: { '#users-list': () => <UserList users={list(c)} /> },
		})
	})
	.post('/', async (c: Context) => {
		const form = await c.req.formData()
		const name = form.get('name')?.toString()
		const email = form.get('email')?.toString()
		const password = form.get('password')?.toString()
		const alias = form.get('alias')?.toString()

		if (!name || !email || !password) throw new HTTPException(400)

		await create({ name, email, password, alias: alias ?? '' })

		return c.html(<UserList users={list(c)} />)
	})
