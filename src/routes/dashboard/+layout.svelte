<script>
  import { onMount } from "svelte";
	import { initEsi, restoreEsi } from "$lib/auth/initEsi";
	import { esiStore } from "$lib/stores/esi";

  let { children } = $props()

  onMount(() => {
    initEsi()
    restoreEsi()
  });
</script>

{#if $esiStore.jwt}
  {@render children()}
{/if}