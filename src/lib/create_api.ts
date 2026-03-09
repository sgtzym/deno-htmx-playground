import { Context, Hono } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'

import { AuditColumn, Patchable } from './column.ts'
import { type Repo } from './create_repo.ts'

interface ApiOptions<T> {
	serialize?: (item: T) => unknown
}

/** Creates a base REST router with GET, PUT, and DELETE /:id endpoints. */
export default function createApi<T extends AuditColumn>(
	repo: Repo<T>,
	options: ApiOptions<T> = {},
): Hono {
	const serialize = options.serialize ?? ((item: T) => item)

	const api = new Hono()

	api.get('/:id', (c: Context) => {
		const item: T | null = repo.find(c.req.param('id')!)
		if (!item) throw new HTTPException(404)

		return c.json(serialize(item), 200)
	})

	api.put('/:id', async (c: Context) => {
		const id = c.req.param('id')!
		if (!repo.find(id)) throw new HTTPException(404)

		const data = await c.req.json<Patchable<T>>()
		if (!data) throw new HTTPException(400)

		const updated: T | null = repo.update(id, data)
		if (!updated) throw new HTTPException(500)

		return c.json(serialize(updated), 200)
	})

	api.delete('/:id', (c: Context) => {
		const id = c.req.param('id')!
		if (!repo.find(id)) throw new HTTPException(404)

		const deleted: string | null = repo.delete(id)
		if (!deleted) throw new HTTPException(500)

		return c.json({ id: deleted }, 200)
	})

	return api
}
