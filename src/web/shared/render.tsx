import { type Context } from '@hono/hono'
import { type FC } from '@hono/hono/jsx'

import { Page } from './layout/page.tsx'

/**
 * HTMX-aware render helper.
 *
 * - Direct request → renders inside `<Page>` layout.
 * - HTMX request → renders `content` without layout.
 * - HTMX request with matching `HX-Target` → renders matching fragment only.
 *
 * @param c - Hono request context.
 * @param targets - Page component and optional named fragments.
 */
export function render(c: Context, targets: {
	page: FC
	fragments?: Record<string, FC>
}) {
	const isHtmx = !!c.req.header('HX-Request')
	const target = c.req.header('HX-Target')

	if (isHtmx && target && targets.fragments?.[target]) {
		const Fragment = targets.fragments[target]
		return c.html(<Fragment />)
	}

	const Content = targets.page

	return c.html(
		isHtmx ? <Content /> : (
			<Page>
				<Content />
			</Page>
		),
	)
}
