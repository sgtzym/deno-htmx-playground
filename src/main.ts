import cfg from '~app/config.ts'
import db from '~app/db.ts'
import { app } from '~app/index.ts'

const { hostname, port } = cfg

Deno.serve({ hostname, port }, app.fetch)

Deno.addSignalListener('SIGINT', () => {
	db.close()
	Deno.exit()
})
