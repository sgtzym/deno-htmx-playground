import { HTTPException } from '@hono/hono/http-exception'

import { repo, type User } from '~entities/user.ts'
import createApi from '~lib/create_api.ts'
import { hashPassword } from '~lib/crypto.ts'
import { strip } from '~lib/utils.ts'

export const api = createApi(repo, {
	transform: (user) => strip(['password'], user),
})
	.get('/', (c) => {
		const { name, email } = c.req.query()
		const users = repo.findMany({
			...(name && { name }),
			...(email && { email }),
		})
		return c.json(users.map((user) => strip(['password'], user)), 200)
	})
	.post('/', async (c) => {
		const data = await c.req.json<User>()
		if (!data?.name || !data?.email || !data?.password) throw new HTTPException(400)

		const existing = repo.findOne({ email: data.email })
		if (existing) throw new HTTPException(409, { message: 'Email already in use.' })

		const hashed = await hashPassword(data.password)

		const created = repo.create({ ...data, password: hashed })
		if (!created) throw new HTTPException(500)

		return c.json(strip(['password'], created), 201)
	})
