import { Context, Hono } from '@hono/hono'
import { serveStatic } from '@hono/hono/deno'

import { api, web } from '~routes/index.tsx'

import cfg from './config.ts'
import { htmlErr, htmlNotFound, jsonErr, jsonNotFound } from './middleware/error_handler.ts'

const handleErr = (err: Error, c: Context) =>
	c.req.path.startsWith(cfg.path.api) ? jsonErr(err, c) : htmlErr(err, c)

const handleNotFound = (c: Context) =>
	c.req.path.startsWith(cfg.path.api) ? jsonNotFound(c) : htmlNotFound(c)

export const app = new Hono()
	.use(`/public/*`, serveStatic({ root: './' }))
	.onError(handleErr)
	.notFound(handleNotFound)
	.route(cfg.path.api, api)
	.route('/', web)
