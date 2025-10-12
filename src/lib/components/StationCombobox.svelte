<script>
  import { onMount } from "svelte";
  import { stations } from "$lib/staticInfo/stations";

  /** @type {number | null} */
  export let selected = null;
  let query = "";
  let open = false;
  /** @type {HTMLDivElement} */
  let container;

  onMount(() => {
    // @ts-ignore
    const handle = (e) => {
      if (!container.contains(e.target)) open = false;
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  });

  $: filtered = stations.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  /**
	 * @param {{ id: any; name: any; }} station
	 */
  function selectStation(station) {
    selected = station.id;
    query = station.name;
    open = false;
  }
</script>

<div class="relative w-full" bind:this={container}>
  <label
    for="station"
    class="block mb-2 text-sm font-medium text-zinc-300"
  >
    Select a station
  </label>

  <input
    id="station"
    spellcheck="false"
    class="p-2 border border-zinc-700 rounded w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600"
    placeholder="Type to search..."
    bind:value={query}
    on:focus={() => (open = true)}
    on:input={() => (open = true)}
  />

  {#if open && filtered.length > 0}
    <ul
      class="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded mt-1 max-h-48 overflow-auto shadow-lg"
    >
      {#each filtered as s}
        <li>
          <button
            class="w-full text-left px-3 py-1 text-zinc-200 hover:bg-zinc-800"
            on:click={() => selectStation(s)}
          >
            {s.name}
          </button>
        </li>
      {/each}
    </ul>
  {:else if open && query}
    <div
      class="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded mt-1 p-2 text-sm text-zinc-500"
    >
      No matches found
    </div>
  {/if}
</div>

<p class="mt-2 text-sm text-zinc-400">
  Selected: {selected ? stations.find((s) => s.id === selected)?.name : "none"}
</p>
