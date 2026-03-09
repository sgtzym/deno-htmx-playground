import { type User } from '~entities/user.ts'

import { UserList } from './list.tsx'

interface UserListPageProps {
	users: Omit<User, 'password'>[]
}

export function UserListPage({ users }: UserListPageProps) {
	return (
		<>
			<h1>Users</h1>

			<div class='grid grid-cols-[auto_1fr] gap-12 items-start'>
				<section>
					<h2>Add User</h2>
					<form
						method='post'
						hx-post='/users'
						hx-target='#user-list'
						hx-swap='innerHTML'
						hx-push-url='false'
						hx-on-htmx-after-request='this.reset()'
						class='not-prose flex flex-col gap-2'>
						<fieldset class='fieldset'>
							<legend class='fieldset-legend'>Name</legend>
							<input
								type='text'
								name='name'
								placeholder='Name'
								required
								class='input w-full' />
						</fieldset>
						<fieldset class='fieldset'>
							<legend class='fieldset-legend'>Email</legend>
							<input
								type='email'
								name='email'
								placeholder='Email'
								required
								class='input w-full' />
						</fieldset>
						<fieldset class='fieldset'>
							<legend class='fieldset-legend'>Password</legend>
							<input
								type='password'
								name='password'
								placeholder='Password'
								required
								class='input w-full' />
						</fieldset>
						<fieldset class='fieldset'>
							<legend class='fieldset-legend'>Alias</legend>
							<input
								type='text'
								name='alias'
								placeholder='Alias'
								class='input w-full' />
							<p class='label'>Optional</p>
						</fieldset>
						<button type='submit' class='btn btn-primary'>Add User</button>
					</form>
				</section>

				<section>
					<h2>Registered Users</h2>
					<div id='user-list'>
						<UserList users={users} />
					</div>
				</section>
			</div>
		</>
	)
}
