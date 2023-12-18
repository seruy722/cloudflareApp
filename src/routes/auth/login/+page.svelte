<script lang="ts">
	import { getRouterPath } from '$lib/settings';
	import type { errorInputAuthType } from '$lib/types/error-input-types';
	import { enhance, applyAction } from '$app/forms';
	import ViewInputError from '$lib/components/ViewInputError.svelte';
	import { goto } from '$app/navigation';

	let errors: errorInputAuthType = {};
</script>

<form
	method="POST"
	class="form-control w-full max-w-xl space-y-1"
	use:enhance={() => {
		return async ({ result }) => {
			console.log('result', result);
			if (result.type === 'failure') {
				if (result?.data?.errors) {
					errors = result?.data?.errors;
					console.log('errors', errors);
				}
				await applyAction(result);
			} else if (result.type === 'redirect') {
				goto(result.location);
			}
		};
	}}
>
	<input
		type="email"
		name="email"
		placeholder="Enter email"
		class="input input-bordered"
		class:input-error={errors?.email}
		required
		maxlength="50"
		minlength="3"
	/>
	<ViewInputError error={errors?.email} />
	<input
		type="password"
		name="password"
		placeholder="Enter password"
		class="input input-bordered"
		class:input-error={errors?.password}
		required
		maxlength="191"
	/>
	<ViewInputError error={errors?.password} />
	<button class="btn self-center" type="submit">Login</button>
</form>
<p>Don't have an account? <a href={getRouterPath('register')} class="btn-link">Register</a></p>
