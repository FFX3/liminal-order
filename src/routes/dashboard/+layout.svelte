<script>
  import { onMount } from "svelte";
	import { initEsi, restoreEsi } from "$lib/auth/initEsi";

  let { children } = $props()

  onMount(() => {
    initEsi()
    restoreEsi()
  });
</script>

{@render children()}
