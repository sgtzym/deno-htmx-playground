import { Hono } from '@hono/hono'

import { logger } from '~app/middleware/logger.ts'
import { api as usersApi, web as usersWeb } from '~routes/users.tsx'
import { render } from '~web/shared/render.tsx'
import { Home } from '~web/views/home.tsx'

export const api = new Hono()
	.use('*', logger)
	.route('/users', usersApi)

export const web = new Hono()
	.use('*', logger)
	.get('/', (c) => render(c, { page: () => <Home /> }))
	.route('/users', usersWeb)
