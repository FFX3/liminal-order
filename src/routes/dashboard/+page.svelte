<script>
	//import OpenOrders from "$lib/components/OpenOrders.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import { esiStore } from "$lib/stores/esi";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import SalesTax from "$lib/components/SalesTax.svelte";
	import EsiTokenInfo from "$lib/components/EsiTokenInfo.svelte";
	import StationCombobox from "$lib/components/StationCombobox.svelte";
	import { writable } from "svelte/store";

	const characterIds = esiStore.characterIds();

	let selectedStationId = writable(null)

</script>

<LogoutButton />

<br><br>
{$selectedStationId}
<StationCombobox bind:selected={$selectedStationId} />

<br><br>

{#each $characterIds as character_id }
	<Portrait size={64} character_id={character_id} />
	<SalesTax character_id={character_id} />
{/each}