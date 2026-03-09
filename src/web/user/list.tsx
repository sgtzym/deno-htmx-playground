import type { SafeUser } from '~entities/user.ts'

interface UserListProps {
	users: SafeUser[]
}

export function UserList({ users }: UserListProps) {
	return (
		<ul class='list bg-base-100 rounded-box shadow-md'>
			{users.map((u) => (
				<li key={u.systemId} class='list-row'>
					<div class='list-col-grow'>
						<p class='font-medium'>{u.name}</p>
						<p class='text-sm text-base-content/60'>{u.email}</p>
					</div>
				</li>
			))}
		</ul>
	)
}
