<script>
  import { portraitStore } from "$lib/stores/portrait";
	import { derived } from "svelte/store";

  /** @typedef {Object} Props
   * @property {64 | 128 | 256 | 512} size 
   * @property {number} character_id 
   */

  /** @type Props*/
  let { character_id, size } = $props();

  /** @typedef {"px64x64" | "px128x128" | "px256x256" | "px512x512"} PortraitKey */
  /** @type {Record<64 | 128 | 256 | 512, PortraitKey>} */
  const keyMapping = {
    128: "px128x128",
    256: "px256x256",
    512: "px512x512",
    64: "px64x64"
  };

  /** @type {import("$lib/stores/createEsiEndpointStore").SliceState<
   *    import("$lib/stores/portrait").PortraitUrls
   *  >} 
   */
  let portraitSlice = $state({ data: null, loading: true, error: null });

  $effect(() => {
    const store = portraitStore.select({ character_id });
    const unsubscribe = store.subscribe(value => {
      portraitSlice = value;
    });
    
    return unsubscribe;
  });

</script>

{#if portraitSlice.loading}
  <div style="width: {size}px; height: {size}px"></div>
{:else if portraitSlice.error}
  <div style="width: {size}px; height: {size}px">
    <p>Something went wrong: {portraitSlice.error.message}</p>
  </div>
{:else if portraitSlice.data}
  <div style="width: {size}; height: ${size}">
    <img
      src={portraitSlice.data[keyMapping[size]]}
      alt="Character portrait"
      width={size}
      height={size}
    />
  </div>
{/if}
