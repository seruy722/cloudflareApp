<script lang="ts">
	import type { SelectType } from '$lib/types';

	export let label: string;
	export let name: string;
	export let errors: any;
	export let items: SelectType[];
	export let selectedItem = '';

	function selectItem(event: Event) {
		const target = event.target as HTMLFormElement;
		selectedItem = target.value;
	}
</script>

<label class="form-control">
	<div class="label">
		<span class="label-text">{label}</span>
	</div>
	<select
		{name}
		class="select select-bordered"
		class:select-error={!!errors[name]}
		on:change={selectItem}
	>
		{#each items as item}
			<option value={item.value} selected={item.selected}>{item.title}</option>
		{/each}
	</select>
	<span class="text-red-500 text-xs">{errors[name] || ''}</span>
</label>
