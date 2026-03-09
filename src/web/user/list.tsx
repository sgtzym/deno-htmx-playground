import { type User } from '~entities/user.ts'

interface UserListProps {
	users: Omit<User, 'password'>[]
}

export function UserList({ users }: UserListProps) {
	return (
		<ul class='list'>
			{users.map((u) => (
				<li key={u.id} class='list-row'>
					<div class='list-col-grow'>
						<p class='font-medium'>{u.name}</p>
						<p class='text-sm'>{u.email}</p>
					</div>
				</li>
			))}
		</ul>
	)
}
