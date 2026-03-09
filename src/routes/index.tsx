import { Hono } from '@hono/hono'

import { logger } from '~app/middleware/logger.ts'
import { api as userApi } from '~routes/user_api.ts'
import { web as userWeb } from '~routes/user_web.tsx'
import { HomePage } from '~web/home_page.tsx'
import { render } from '~web/shared/render.tsx'

export const api = new Hono()
	.use('*', logger)
	.route('/users', userApi)

export const web = new Hono()
	.use('*', logger)
	.get('/', (c) => render(c, { page: () => <HomePage /> }))
	.route('/users', userWeb)
