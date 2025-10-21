<script>
	import { corporationIconStore } from "$lib/stores/corporationIcons";

  /** @typedef {Object} Props
   * @property {64 | 128 | 256 } size 
   * @property {number} corporation_id
   */

  /** @type Props*/
  let { corporation_id, size } = $props();

  /** @typedef {"px64x64" | "px128x128" | "px256x256"} PortraitKey */
  /** @type {Record<64 | 128 | 256 , PortraitKey>} */
  const keyMapping = {
    128: "px128x128",
    256: "px256x256",
    64: "px64x64"
  };

  /** @type {import("$lib/stores/createEsiEndpointStore").SliceState<
   *    import("$lib/stores/corporationIcons").IconUrls
   *  >} 
   */
  let iconSlice = $state({ data: null, loading: true, error: null });

  $effect(() => {
    const store = corporationIconStore.select({ corporation_id });
    const unsubscribe = store.subscribe(value => {
      iconSlice = value;
    });
    
    return unsubscribe;
  });

</script>

{#if iconSlice.loading}
  <div style="width: {size}px; height: {size}px"></div>
{:else if iconSlice.error}
  <div style="width: {size}px; height: {size}px">
    <p>Something went wrong: {iconSlice.error.message}</p>
  </div>
{:else if iconSlice.data}
  <div style="width: {size}; height: ${size}">
    <img
      src={iconSlice.data[keyMapping[size]]}
      alt="Character portrait"
      width={size}
      height={size}
    />
  </div>
{/if}
