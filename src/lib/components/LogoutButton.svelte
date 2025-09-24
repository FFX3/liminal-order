<script>
	import { goto } from "$app/navigation";
	import { clearAllStoredCharacters } from "$lib/auth/initEsi";
	import { esiStore } from "$lib/stores/esi";
	import { ordersStore } from "$lib/stores/orders";
	import OpenOrders from "./OpenOrders.svelte";

    async function logout() {
        clearAllStoredCharacters()
        ordersStore.clearCache()
        await goto("/");
    }
</script>

<button on:click={logout}>
    Logout
</button>