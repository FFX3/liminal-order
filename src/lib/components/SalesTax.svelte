<script>
  import { salesTaxStore } from "$lib/stores/salesTax";

  
  /** @typedef {Object} Props
   * @property {string} character_id 
   */

  /** @type Props*/
  let {
    character_id
  } = $props();

  const salesTaxSlice = salesTaxStore.select({ character_id });
</script>

{#if $salesTaxSlice.loading}
  <p>Loading orders…</p>
{:else if $salesTaxSlice.error}
  <p>Error: {$salesTaxSlice.error.message}</p>
{:else if $salesTaxSlice.data}
  <p>{$salesTaxSlice.data.salesTax * 100}%</p>
{/if}
