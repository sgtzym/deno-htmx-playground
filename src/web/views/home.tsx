interface HomeProps {}

export function Home({}: HomeProps) {
	return (
		<>
			<h1>Deno HTXM Template</h1>
			<p>
				Build server-rendered web apps with{' '}
				<a href='https://deno.com' target='_blank'>Deno</a>{' '}
				🦕 – using SQLite, Hono, HTMX, and Alpine.
			</p>
		</>
	)
}
