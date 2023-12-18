<script lang="ts">
	import type { PageData } from './$types';
	import DialogAddTransfer from '$lib/components/dialogs/DialogAddTransfer.svelte';
	export let data: PageData;

	let selectedValues = new Set();

	function clickTableRow(event: Event) {
		const target = event.target as HTMLFormElement;
		console.log('event', event);
		// console.log('selectedValues', selectedValues);
		if (target.nodeName === 'INPUT' && target.checked) {
			selectedValues.add(target.value);
		} else if (target.nodeName === 'INPUT' && !target.checked) {
			selectedValues.delete(target.value);
		}
		console.log('selectedValues', selectedValues.entries());
	}

	const selectDeselectAllTableChechbox = (event: Event) => {
		const target = event.target as HTMLFormElement;
		const elements: NodeListOf<HTMLFormElement> = document.querySelectorAll(
			'table>tbody>tr>td>label>input[type=checkbox]'
		);
		console.log('elements', elements);
		if (target.checked) {
			for (let elem of elements) {
				elem.checked = true;
				selectedValues.add(elem.value);
			}
			console.log('selectedValues_2', selectedValues.entries());
		} else if (!target.checked) {
			for (let elem of elements) {
				elem.checked = false;
			}
			selectedValues.clear();
		}
	};
</script>

<DialogAddTransfer />

<div class="overflow-x-auto">
	<table class="table table-xs">
		<thead>
			<tr>
				<th>
					<label>
						<input type="checkbox" class="checkbox" on:change={selectDeselectAllTableChechbox} />
					</label>
				</th>
				<th>Клиент</th>
				<th>Получатель</th>
				<th>Телефон получателя</th>
				<th>Метод</th>
				<th>Оплачено</th>
				<th>Статус</th>
				<th>Пользователь</th>
				<th>Сумма</th>
				<th>Дата добавления</th>
				<th>Дата выдачи</th>
				<th>Примечания</th>
			</tr>
		</thead>
		<tbody>
			{#each data.transfers as transfer}
				<tr class="hover" on:click={clickTableRow}>
					<td>
						<label>
							<input type="checkbox" class="checkbox" value={transfer.id} />
						</label>
					</td>
					<td>{transfer.clientCode.code}</td>
					<td>{transfer.recipient.name}</td>
					<td>{transfer.recipient.phone}</td>
					<td>{transfer.method}</td>
					<td>{transfer.paid}</td>
					<td>{transfer.status}</td>
					<td>{transfer.user.username}</td>
					<td>{transfer.sum}</td>
					<td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
					<td>{transfer.dateIssued ? new Date(transfer.dateIssued).toLocaleDateString() : ''}</td>
					<td>{transfer.notation}</td>
				</tr>
			{/each}
		</tbody>
		<!-- <tfoot>
			<tr>
				<th></th>
				<th>Name</th>
				<th>Job</th>
				<th>company</th>
				<th>location</th>
				<th>Last Login</th>
				<th>Favorite Color</th>
			</tr>
		</tfoot> -->
	</table>
</div>
