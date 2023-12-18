<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<input type="checkbox" value="dark" class="toggle theme-controller" />
<div>UserID - {data.user.userId}</div>
<div>Email - {data.user.email}</div>
