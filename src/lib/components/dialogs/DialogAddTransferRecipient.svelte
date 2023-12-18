<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import InputText from '$lib/components/InputText.svelte';
	import type { errorInputRecipientType } from '$lib/types/error-input-types';
	import type { SubmitFunction } from '@sveltejs/kit';

	let errors: errorInputRecipientType = {};

	export let viewModal = false;
	let loadingRecipient = false;

	const createRecipient: SubmitFunction = () => {
		loadingRecipient = true;
		return async ({ result, formElement }) => {
			console.log('result', result);
			loadingRecipient = false;
			if (result.type === 'success') {
				errors = {};
				formElement.reset();
				await applyAction(result);
			}
			if (result.type === 'failure') {
				if (result?.data?.errors) {
					errors = result?.data?.errors;
					console.log('errors', errors);
				}
			}
		};
	};
</script>

<dialog class="modal" class:modal-open={viewModal}>
	<div class="modal-box">
		<form method="dialog">
			<button
				on:click|preventDefault={() => (viewModal = false)}
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
			>
		</form>
		<h3 class="font-bold text-lg">Добавление получателя</h3>
		<form
			method="POST"
			class="form-control w-full max-w-xl"
			action="/transfers?/createRecipient"
			use:enhance={createRecipient}
		>
			<InputText label="Имя получателя" name="name" type="text" bind:errors />

			<InputText label="Телефон получателя" name="phone" type="tel" bind:errors />

			<button class="btn bg-primary">
				<span class="loading-dots" class:loading={loadingRecipient}></span>
				Send
			</button>
		</form>
	</div>
</dialog>
