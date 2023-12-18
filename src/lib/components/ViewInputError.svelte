<script lang="ts">
	export let error: string[] | undefined;
</script>

<div>{error || ''}</div>
