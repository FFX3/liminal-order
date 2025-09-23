<script>
	//import OpenOrders from "$lib/components/OpenOrders.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import Orders from "$lib/components/OpenOrders.svelte"
	import { esiStore } from "$lib/stores/esi";
</script>

{#if $esiStore.character }
	<Portrait size={64} character_id={$esiStore.character.id} />
	<Orders character_id={$esiStore.character.id} />
{/if}

<Portrait size={64} character_id={"96501810"} /> <!-- Endo Tzu -->