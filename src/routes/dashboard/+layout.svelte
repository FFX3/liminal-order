<script>
  import { onMount } from "svelte";
	import { initEsi, restoreEsi } from "$lib/auth/initEsi";
	import { esiStore } from "$lib/stores/esi";
	import EsiTokenInfo from "$lib/components/EsiTokenInfo.svelte";

  let { children } = $props()

  onMount(() => {
    initEsi()
    restoreEsi()
  });
</script>

{#if $esiStore.active_character_id}
  {@render children()}
{/if}
<EsiTokenInfo />