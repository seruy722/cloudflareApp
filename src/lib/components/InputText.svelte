<script lang="ts">
	export let label: string;
	export let type: string;
	export let name: string;
	export let placeholder: string = '';
	export let errors: any;
</script>

<label class="form-control">
	<div class="label">
		<span class="label-text">{label}</span>
	</div>
	<input
		{type}
		{name}
		{placeholder}
		class="input input-bordered"
		class:input-error={!!errors[name]}
	/>
	<span class="text-red-500 text-xs">{errors[name] || ''}</span>
</label>
