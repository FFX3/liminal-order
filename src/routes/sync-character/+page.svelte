<script>
	import { esiStore } from "$lib/stores/esi";
	import SyncCharacterCard from "./SyncCharacterCard.svelte";

    $esiStore.characters
</script>

{#each Object.values($esiStore.characters) as character }
    <SyncCharacterCard character={character} />
{/each}