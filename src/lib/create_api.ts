import { Hono } from '@hono/hono'
import { HTTPException } from '@hono/hono/http-exception'

import { AuditColumn, Mutable } from './column.ts'
import { type Repo } from './create_repo.ts'

interface ApiOptions<T> {
	transform?: (item: T) => unknown
}

/**
 * Creates a base REST router for a repository.
 *
 * Mounts GET, PUT, DELETE /:id endpoints.
 *
 * @param repo - The repository to expose.
 */
export default function createApi<T extends AuditColumn>(
	repo: Repo<T>,
	options: ApiOptions<T> = {},
): Hono {
	const { transform } = options
	const result = (item: T) => transform ? transform(item) : item

	const api = new Hono()

	api.get('/:id', (c) => {
		const item = repo.find(c.req.param('id')!)
		if (!item) throw new HTTPException(404)
		return c.json(result(item), 200)
	})

	api.put('/:id', async (c) => {
		const id = c.req.param('id')!
		if (!repo.find(id)) throw new HTTPException(404)

		const data = await c.req.json<Partial<Mutable<T>>>()
		if (!data) throw new HTTPException(400)

		const item = repo.update(id, data)
		if (!item) throw new HTTPException(500)
		return c.json(result(item), 200)
	})

	api.delete('/:id', (c) => {
		const id = c.req.param('id')!
		if (!repo.find(id)) throw new HTTPException(404)

		const item = repo.delete(id)
		if (!item) throw new HTTPException(500)
		return c.json(result(item), 200)
	})

	return api
}
