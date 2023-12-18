<script lang="ts">
	import { getRouterPath } from '$lib/settings';
	import { enhance, applyAction } from '$app/forms';
	import { goto } from '$app/navigation';
	import ViewInputError from '$lib/components/ViewInputError.svelte';
	import type { errorInputAuthType } from '$lib/types/error-input-types';

	let errors: errorInputAuthType = {};
	let loading = false;
	console.log('errors', errors);
</script>

<form
	method="POST"
	class="form-control w-full max-w-xl space-y-3"
	use:enhance={() => {
		loading = true;
		return async ({ result }) => {
			console.log('result', result);
			loading = false;
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
		type="text"
		name="username"
		placeholder="Enter username"
		class="input input-bordered"
		class:input-error={errors?.username}
		maxlength="191"
	/>
	<ViewInputError error={errors?.username} />
	<input
		type="email"
		name="email"
		placeholder="Enter email"
		class="input input-bordered"
		class:input-error={errors?.email}
		required
		maxlength="191"
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
	<button class="btn self-center" type="submit">
		<span class="loading-spinner" class:loading></span>
		Register
	</button>
</form>
<p>Have an account? <a href={getRouterPath('login')} class="btn-link">login</a></p>
