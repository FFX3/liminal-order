<script>
	import { esiStore } from "$lib/stores/esi";
  import { ordersStore } from "$lib/stores/orders";

  
  /** @typedef {Object} Props
   * @property {string} character_id 
   */

  /** @type Props*/
  let {
    character_id
  } = $props();

  const ordersSlice = ordersStore.select({ character_id }, character_id);
</script>

{#if $ordersSlice.loading}
  <p>Loading orders…</p>
{:else if $ordersSlice.error}
  <p>Error: {$ordersSlice.error.message}</p>
{:else if $ordersSlice.data}
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Buy?</th>
        <th>Escrow</th>
      </tr>
    </thead>
    <tbody>
      {#each $ordersSlice.data as order}
        <tr>
          <td>{order.order_id}</td>
          <td>{order.is_buy_order ? "Yes" : "No"}</td>
          <td>{order.escrow}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
