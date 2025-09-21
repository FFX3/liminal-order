<script>
  import { portraitStore } from "$lib/stores/portrait";

  /** @type {{size: 64 | 128 | 256 | 512}} */
  let { size } = $props();

  /** @typedef {"px64x64" | "px128x128" | "px256x256" | "px512x512"} PortraitKey */
  /** @type {Record<64 | 128 | 256 | 512, PortraitKey>} */
  const keyMapping = {
    128: "px128x128",
    256: "px256x256",
    512: "px512x512",
    64: "px64x64"
  };
</script>

{#if $portraitStore.loading}
  <div style="width: {size}px; height: {size}px"></div>
{:else if $portraitStore.error}
  <div style="width: {size}px; height: {size}px">
    <p>Something went wrong: {$portraitStore.error.message}</p>
  </div>
{:else if $portraitStore.data}
  <img
    src={$portraitStore.data[keyMapping[size]]}
    alt="Character portrait"
    width={size}
    height={size}
  />
{/if}
