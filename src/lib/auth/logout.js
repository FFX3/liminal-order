
import { goto } from "$app/navigation";
import { clearAllStoredCharacters } from "$lib/auth/initEsi";
import { ordersStore } from "$lib/stores/orders";
import { supabase } from "$lib/supabaseClient";

export function logout() {
    clearAllStoredCharacters()
    ordersStore.clearCache()
    supabase.auth.signOut()
    window.location.reload()
}
