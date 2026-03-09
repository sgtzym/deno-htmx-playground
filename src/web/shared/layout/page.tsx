import { Child } from '@hono/hono/jsx'

import { Shell } from './shell.tsx'
import { Sidebar } from './sidebar.tsx'

interface PageProps {
	title?: string
	children?: Child
}

export function Page({ title, children, ...rest }: PageProps) {
	return (
		<Shell title={title ?? ''}>
			<div class='drawer lg:drawer-open'>
				<input id='forSidebar' type='checkbox' class='drawer-toggle' />

				<main id='content' class='drawer-content p-6 prose max-w-none' {...rest}>
					{children}
				</main>

				<div class='drawer-side'>
					<Sidebar refId='forSidebar' />
				</div>
			</div>
		</Shell>
	)
}

interface ErrorPageProps {
	title?: string
	error: string
	status: number
}

export function ErrorPage({ title, status, error }: ErrorPageProps) {
	return (
		<Shell title={title ?? `Error ${status}`}>
			<main id='content' class='p-6 prose max-w-none'>
				<h1>Something went wrong</h1>
				<p>{error}</p>
				<a href='/'>Go back</a>
			</main>
		</Shell>
	)
}
