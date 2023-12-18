<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import InputText from '$lib/components/InputText.svelte';
	import InputNumber from '../InputNumber.svelte';
	import Select from '$lib/components/Select.svelte';
	import Autocomplate from '$lib/components/Autocomplate.svelte';
	import { enhance, applyAction } from '$app/forms';
	import type { errorInputAddTransferDialogType } from '$lib/types/error-input-types';
	import type { SelectType } from '$lib/types';

	let viewModal = false;
	let viewToast = false;
	let errors: errorInputAddTransferDialogType = {};
	let loadingTransfer = false;

	let transferStatus = 'notIssued';
	$: isSelected = transferStatus !== 'notIssued';
	const transferMethodEnumItems: SelectType[] = [
		{
			title: 'Не выбрано',
			value: 'notSelected',
			selected: true
		},
		{
			title: 'Товар деньги',
			value: 'moneyProduct',
			selected: false
		},
		{
			title: 'Деньги',
			value: 'money',
			selected: false
		}
	];

	const transferStatusEnumItems: SelectType[] = [
		{
			title: 'Не выдан',
			value: 'notIssued',
			selected: true
		},
		{
			title: 'Выдан',
			value: 'issued',
			selected: false
		},
		{
			title: 'Отменен',
			value: 'cancel',
			selected: false
		},
		{
			title: 'Возврат',
			value: 'return',
			selected: false
		},
		{
			title: 'Вопрос',
			value: 'question',
			selected: false
		}
	];

	const createTransfer: SubmitFunction = () => {
		loadingTransfer = true;
		return async ({ result, formElement }) => {
			loadingTransfer = false;
			console.log('result', result);
			if (result.type === 'success') {
				formElement.reset();
				await invalidateAll();
				viewToast = true;
			} else if (result.type === 'failure') {
				if (result?.data?.errors) {
					errors = result?.data?.errors;
					console.log('errors', errors);
				}
				await applyAction(result);
			}
		};
	};
</script>

<button class="btn btn-square btn-outline" on:click={() => (viewModal = true)}>
	<svg viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"
		><path
			d="M526.507431 109.121602c-231.868047 0-419.788888 187.920841-419.788887 419.788888s187.920841 419.788888 419.788887 419.788888 419.788888-187.920841 419.788888-419.788888S758.375478 109.121602 526.507431 109.121602zM778.381173 545.702209H543.29915v233.967012h-33.583438V545.702209H275.7487v-33.583438h233.967012V277.036748h33.583438v235.082023H778.381173v33.583438z"
			fill="#98C4D8"
		/><path
			d="M492.923993 75.538164c-231.868047 0-419.788888 187.920841-419.788888 419.788887s187.920841 419.788888 419.788888 419.788888 419.788888-187.920841 419.788887-419.788888S724.792039 75.538164 492.923993 75.538164zM744.797735 512.118771H509.715712v233.967011h-33.583439V512.118771H242.166285v-33.583439h233.967012V243.453309h33.583439v235.082023H744.797735v33.583439z"
			fill="#EFD9A0"
		/><path
			d="M268.480057 288.159806a30.213832 64.203753 55.515 1 0 105.843026-72.703105 30.213832 64.203753 55.515 1 0-105.843026 72.703105Z"
			fill="#FEFEFE"
		/><path
			d="M203.600369 393.818901a20.142896 35.2493 55.515 1 0 58.110194-39.915635 20.142896 35.2493 55.515 1 0-58.110194 39.915635Z"
			fill="#FEFEFE"
		/></svg
	>
</button>

<dialog class="modal modal-middle" class:modal-open={viewModal}>
	<div class="modal-box">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-5 top-6"
				on:click|preventDefault={() => (viewModal = false)}>✕</button
			>
		</form>
		<h3 class="font-bold text-lg">Добавления записи</h3>

		{#if viewToast}
			<div class="toast toast-center toast-middle">
				<div class="alert alert-success">
					<span>Message sent successfully.</span>
				</div>
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
					on:click|preventDefault|stopPropagation={() => (viewToast = false)}>✕</button
				>
			</div>
		{/if}

		<form
			method="POST"
			class="form-control w-full max-w-xl"
			action="?/create"
			use:enhance={createTransfer}
		>
			<Autocomplate
				name="clientCodeId"
				url="/api/codes"
				placeholder="Click to view list"
				label="Код"
				bind:errors
			/>

			<Autocomplate
				name="transferRecipientId"
				url="/api/recipients"
				placeholder="Click to view list"
				label="Получатель"
				bind:errors
			/>

			<InputNumber label="Сумма" name="sum" bind:errors />

			<InputNumber label="Комиссия %" placeholder="For default 1%" name="commission" bind:errors />

			<Select label="Метод" name="method" items={transferMethodEnumItems} bind:errors />

			<Select
				label="Статус"
				name="status"
				items={transferStatusEnumItems}
				bind:errors
				bind:selectedItem={transferStatus}
			/>

			{#if isSelected}
				<input name="dateIssued" class="input input-bordered" type="date" />
			{/if}

			<InputText label="Примечания" name="notation" type="text" bind:errors />

			<button class="btn bg-primary">
				<span class="loading-dots" class:loading={loadingTransfer}></span>
				Send
			</button>
		</form>
	</div>
</dialog>
