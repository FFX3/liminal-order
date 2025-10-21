<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initEsi, restoreEsi } from '$lib/auth/initEsi';
	import { onMount } from 'svelte';
	import EsiTokenInfo from "$lib/components/EsiTokenInfo.svelte";
	import { writable } from 'svelte/store';
	import { addCharacter } from '$lib/auth/addCharacter';
	import { supabase } from '$lib/supabaseClient';
	import { esiStore } from '$lib/stores/esi';

	let isAuthMissing = writable({ data: true, loading: true, error: "" })

	onMount(async () => {
		await initEsi();
		await restoreEsi();
		let { data: session } = await supabase.auth.getSession()
		if(!session){
			isAuthMissing.set({ data: true, loading: false, error: "No supabase session" })
		} else if(!$esiStore.active_character_id) {
			isAuthMissing.set({ data: true, loading: false, error: "No active character" })
		} else {
			isAuthMissing.set({ data: false, loading: false, error: "" })
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $isAuthMissing.loading }
	<p>loading...</p>
{:else if $isAuthMissing.data}
<div class="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <main class="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
    <div class="flex gap-4 items-center flex-col sm:flex-row">
		<button
			type="button"
			class="cursor-pointer"
			onclick={addCharacter}>
			<img
				src="/eve-sso-login-white-large.png"
				alt="ESI Login"
				width={270}
				height={45}
			/>
		</button>
    </div>
    </main>
</div>
{:else}
{@render children?.()}
<div class="h-10"></div> <!-- Padding for EsiTokenInfo Component -->
<EsiTokenInfo />
{/if}