interface LoginProps {}

export function Login() {
	return (
		<div class='min-h-screen flex items-center justify-center'>
			<div class='card bg-base-100 shadow-xl w-full max-w-sm'>
				<div class='card-body gap-4'>
					<h1 class='card-title text-2xl'>Login</h1>
					<form method='post' action='/login' class='flex flex-col gap-3'>
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
							<legend class='fieldset-legend'>Password</legend>
							<input
								type='password'
								name='password'
								placeholder='Password'
								required
								class='input w-full' />
						</fieldset>
						<button type='submit' class='btn btn-primary w-full'>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
