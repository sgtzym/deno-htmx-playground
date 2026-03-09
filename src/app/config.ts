import { load } from '@std/dotenv'

import { env } from '~lib/env.ts'

type DenoEnv = 'dev' | 'test' | 'prod'

await load({ export: true })

const denoEnv = env('DENO_ENV', String, 'dev') as DenoEnv

export default {
	hostname: env('HOST', String, '0.0.0.0'),
	port: env('PORT', Number, 8000),
	path: {
		api: '/api/v1',
		db: env('DB_PATH', String, `${Deno.cwd()}/app.db`),
	},
	debug: env('DEBUG', Boolean, false),
	isTest: denoEnv === 'test',
	isDev: denoEnv === 'dev',
	isProd: denoEnv === 'prod',
} as const
