import { Context, Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'

import { api, web } from '~routes/index.tsx'

import cfg from './config.ts'
import { htmlErr, htmlNotFound, jsonErr, jsonNotFound } from './middleware/error_handler.ts'

const isApi = (c: Context) => c.req.path.startsWith(cfg.path.api)

export const app = new Hono()
	.use(`/public/*`, serveStatic({ root: './' }))
	.onError((err, c) => isApi(c) ? jsonErr(err, c) : htmlErr(err, c))
	.notFound((c) => isApi(c) ? jsonNotFound(c) : htmlNotFound(c))
	.route(cfg.path.api, api)
	.route('/', web)
