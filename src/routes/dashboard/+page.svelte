<script>
	//import OpenOrders from "$lib/components/OpenOrders.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import Orders from "$lib/components/OpenOrders.svelte"
	import { esiStore } from "$lib/stores/esi";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import SalesTax from "$lib/components/SalesTax.svelte";

	const characterIds = esiStore.characterIds();

	//const nicCharId = "95788602"
	const tempest = "2114712844"
	const tzu = "96501810"
	const hang = "97187939"
</script>

<LogoutButton />

<br><br>

{#each $characterIds as character_id }
	<Portrait size={64} character_id={character_id} />
	<SalesTax character_id={character_id} />
{/each}