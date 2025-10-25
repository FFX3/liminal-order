<script>
	import { affiliationsStore } from "$lib/stores/affiliations";
	import { corporationsStore } from "$lib/stores/corporationInfo";
    import { esiStore } from "$lib/stores/esi";
	import CorporationCard from "./CorporationCard.svelte";

    let character_ids = esiStore.characterIds()
    let affiliations = $derived(affiliationsStore.select({ character_ids: $character_ids }))
    let corporation_ids = [...new Set($affiliations.data.map(a=>a.corporation_id))]
    let corporations = corporation_ids.map(id=>{
        return corporationsStore.select({ corporation_id: id })
    })

</script>
{#each corporations as corporation }
    <CorporationCard corporation={corporation} />
{/each}
