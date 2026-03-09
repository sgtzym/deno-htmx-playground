import { HtmlEscapedString } from '@hono/hono/utils/html'

export type Content = HtmlEscapedString | Promise<HtmlEscapedString>

interface ShellProps {
	title: string
	children?: Content
}

export function Shell({ title, children }: ShellProps) {
	return (
		<html data-theme='light'>
			<head>
				<meta charset='UTF-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				<title>{title}</title>
				<link rel='icon' type='image/x-icon' href='/public/favicon.ico' />
				<link rel='stylesheet' href='/public/app.css' />
				<script src='/public/js/htmx.min.js'></script>
				<script src='/public/js/alpine.min.js' defer></script>
			</head>
			<body>{children}</body>
		</html>
	)
}
