export interface NavItem {
	href: string
	label: string
	icon?: string
}

interface SidebarProps {
	refId: string
}

export function Sidebar({ refId }: SidebarProps) {
	const navItems: NavItem[] = [
		{
			href: '/',
			label: 'Home',
			icon: '🏠',
		},
		{
			href: '/users',
			label: 'Users',
			icon: '🧟',
		},
	]

	return (
		<aside class='flex flex-col min-h-full w-64 bg-base-200 is-drawer-close:w-14 overflow-hidden transition-[width] duration-300'>
			<header class='flex items-center gap-2 p-2 overflow-hidden whitespace-nowrap'>
				<label htmlFor={refId} class='btn btn-square btn-ghost shrink-0'>🍔</label>
				<span class='is-drawer-close:hidden'>
					<strong>Deno HTMX Template</strong>
				</span>
			</header>
			<nav class='flex-1'>
				<ul class='menu w-full'>
					{navItems.map((item) => (
						<li>
							<a
								href={item.href}
								hx-get={item.href}
								hx-target='#content'
								hx-push-url='true'>
								<span>{item.icon}</span>
								<span class='is-drawer-close:hidden'>{item.label}</span>
							</a>
						</li>
					))}
				</ul>
			</nav>
		</aside>
	)
}
