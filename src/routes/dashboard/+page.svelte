<script>
	//import OpenOrders from "$lib/components/OpenOrders.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import { esiStore } from "$lib/stores/esi";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import SalesTax from "$lib/components/SalesTax.svelte";
	import StationCombobox from "$lib/components/StationCombobox.svelte";
	import { derived, get, writable } from "svelte/store";
	import { stationInfoStore } from "$lib/stores/stationInfo";
	import { standingsStore } from "$lib/stores/standings";
	import { skillsStore } from "$lib/stores/skills";
	import { getFactionNameByCorpName } from "$lib/staticInfo/npcCorpFactions";
	import { corporationsStore } from "$lib/stores/corporationInfo";
	import { bulkNamesToIdStore } from "$lib/stores/bulkNamesToIds";
	import { brokerFeeStore } from "$lib/stores/brokerFee";

	const characterIds = esiStore.characterIds();

	/** @type {import("svelte/store").Writable<number | null>} */
	let selectedStationId = writable(null)
	
	let brokerFeeInfo = derived(selectedStationId, ($selectedStationId)=> {
		return get(brokerFeeStore.select({
			character_id: $esiStore.active_character_id,
			station_id: $selectedStationId ?? undefined
		}))
	})

</script>

<LogoutButton />

<br><br>

<p>broker fee: {(Number($brokerFeeInfo.data?.brokerFee) * 100).toFixed(2)}%</p>

<StationCombobox bind:selected={$selectedStationId} />

<br><br>

{#each $characterIds as character_id }
	<Portrait size={64} character_id={character_id} />
	<SalesTax character_id={character_id} />
{/each}