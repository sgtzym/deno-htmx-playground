import { copy } from '@std/fs'

import { ensureDir } from '~lib/utils.ts'

const npmPath = `${Deno.cwd()}/node_modules`
const jsPath = `${Deno.cwd()}/public/js`

await ensureDir(jsPath)

await copy(
	`${npmPath}/htmx.org/dist/htmx.min.js`,
	`${jsPath}/htmx.min.js`,
	{ overwrite: true },
)

await copy(
	`${npmPath}/alpinejs/dist/cdn.min.js`,
	`${jsPath}/alpine.min.js`,
	{ overwrite: true },
)
