<script>
  import { ordersStore } from "$lib/stores/orders";
</script>

{#if $ordersStore.loading}
  <p>Loading orders…</p>
{:else if $ordersStore.error}
  <p>Error: {$ordersStore.error.message}</p>
{:else if $ordersStore.data}
  <table>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Buy?</th>
        <th>Escrow</th>
      </tr>
    </thead>
    <tbody>
      {#each $ordersStore.data as order}
        <tr>
          <td>{order.order_id}</td>
          <td>{order.is_buy_order ? "Yes" : "No"}</td>
          <td>{order.escrow}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
