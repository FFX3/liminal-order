<script>
	import { goto } from "$app/navigation";
	import { clearAllStoredCharacters } from "$lib/auth/initEsi";
	import { ordersStore } from "$lib/stores/orders";

    async function logout() {
        clearAllStoredCharacters()
        ordersStore.clearCache()
        await goto("/");
    }
</script>

<button on:click={logout}>
    Logout
</button>