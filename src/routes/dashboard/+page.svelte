<script>
	import { esiStore } from "$lib/stores/esi";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import StationCombobox from "$lib/components/StationCombobox.svelte";
	import { derived, get, writable } from "svelte/store";
	import { brokerFeeStore } from "$lib/stores/brokerFee";
	import Portrait from "$lib/components/Portrait.svelte";

	/** @type {import("svelte/store").Writable<number | null>} */
	let selectedStationId = writable(null)

	let active_character_id = $derived($esiStore.active_character_id)

	let brokerFeeInfo = derived([selectedStationId, esiStore], ([$selectedStationId, $esiStore])=> {
		return get(brokerFeeStore.select({
			character_id: $esiStore.active_character_id,
			station_id: $selectedStationId ?? undefined
		}))
	})

</script>

<LogoutButton />

{#if active_character_id }
	<p><Portrait character_id={active_character_id} size={64} /></p>
{/if}

<p>broker fee: {(Number($brokerFeeInfo.data?.brokerFee) * 100).toFixed(2)}%</p>

<StationCombobox bind:selected={$selectedStationId} />