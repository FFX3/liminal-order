<script>
	import { esiStore } from "$lib/stores/esi";
	import LogoutButton from "$lib/components/LogoutButton.svelte";
	import StationCombobox from "$lib/components/StationCombobox.svelte";
	import { writable } from "svelte/store";
	import { brokerFeeStore } from "$lib/stores/brokerFee";
	import Portrait from "$lib/components/Portrait.svelte";

	/** @type {import("svelte/store").Writable<number | null>} */
	let selectedStationId = writable(null)

	let active_character_id = $derived($esiStore.active_character_id)

	/** @type {import("$lib/stores/createEsiEndpointStore").SliceState<import("$lib/stores/brokerFee").BrokerFeeInfo>} */
	let brokerFeeInfo = $state({ data: null, loading: true, error: null });

	$effect(() => {
		/** @type {import("svelte/store").Readable<import("$lib/stores/createEsiEndpointStore").SliceState<import("$lib/stores/brokerFee").BrokerFeeInfo>>} */
		const store = brokerFeeStore.select({
			character_id: $esiStore.active_character_id,
			station_id: $selectedStationId ?? undefined
		});
		
		const unsubscribe = store.subscribe(value => {
			brokerFeeInfo = value;
		});
		
		return unsubscribe;
	});

</script>

<LogoutButton />

{#if active_character_id }
	<p><Portrait character_id={active_character_id} size={64} /></p>
{/if}

{#if brokerFeeInfo.loading}
	<p>Loading broker fee...</p>
{:else if brokerFeeInfo.error}
	<p>Error loading broker fee: {brokerFeeInfo.error.message}</p>
{:else if brokerFeeInfo.data}
	<p>broker fee: {(Number(brokerFeeInfo.data.brokerFee) * 100).toFixed(2)}%</p>
{/if}

<StationCombobox bind:selected={$selectedStationId} />