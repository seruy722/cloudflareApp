<script lang="ts">
	import DialogAddTransferRecipient from './dialogs/DialogAddTransferRecipient.svelte';
	export let errors: any;

	type Item = {
		id: number;
		title: string;
	};

	let items: Item[] = [];
	export let url: string = '';
	export let name: string = '';
	export let selectedItem = {};
	export let placeholder: string = '';
	export let label: string;
	let loading = false;
	let inputVal = '';
	let num: any = null;
	let title = '';
	let viewModalAddRecipient = false;

	function onItemClicked(item: Item) {
		if (document.activeElement) {
			// @ts-ignore
			document.activeElement.blur();
		}
		selectedItem = item;
		inputVal = '';
		title = item.title;
		num = item.id;
	}

	$: filteredItems = items.filter(function (item) {
		return item.title.toLowerCase().includes(inputVal.toLowerCase());
	});

	async function loadItems() {
		if (!items.length) {
			loading = true;
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});

			items = await response.json();
			loading = false;
		}
	}
</script>

<DialogAddTransferRecipient bind:viewModal={viewModalAddRecipient} />

<div class="dropdown" on:click={loadItems}>
	<label class="form-control">
		<!-- <div class="label">
			<span class="label-text">{placeholder} {title}</span>
		</div>
		<input class="input input-bordered" class:input-error={!!errors[name]} bind:value={inputVal} />
		<input type="hidden" step="any" {name} bind:value={num} />
		<span class="text-red-500 text-xs">{errors[name] || ''}</span> -->
		<div class="label">
			<span class="label-text">{label}</span>
		</div>
		<input type="hidden" {name} bind:value={num} />
		<div class="join">
			<span
				class="join-item inline-flex items-center min-h-10 border border-1 border-base-900 bg-teal-400"
				>{title}</span
			>
			<input
				class="input input-bordered join-item w-full"
				class:input-error={!!errors[name]}
				bind:value={inputVal}
				{placeholder}
			/>
		</div>
		<span class="text-red-500 text-xs">{errors[name] || ''}</span>
	</label>
	<ul
		tabindex="0"
		class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto"
	>
		{#each filteredItems as item}
			<li>
				<a on:click|preventDefault={() => onItemClicked(item)}>{item.title}</a>
			</li>
		{/each}

		{#if loading}
			<span class="loading loading-dots loading-sm"></span>
		{/if}

		{#if !filteredItems.length && !loading}
			<button type="button" class="btn" on:click={() => (viewModalAddRecipient = true)}
				>Добавить</button
			>
		{/if}
	</ul>
</div>
