<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initEsi, restoreEsi } from '$lib/auth/initEsi';
	import { onMount } from 'svelte';
	import EsiTokenInfo from "$lib/components/EsiTokenInfo.svelte";
	import { get, writable } from 'svelte/store';
	import { addCharacter } from '$lib/auth/addCharacter';
	import { supabase } from '$lib/supabaseClient';
	import { esiStore } from '$lib/stores/esi';
	import { affiliationsStore } from '$lib/stores/affiliations';

	let isAuthMissing = writable({ data: true, loading: true, error: "" })

	let character_ids = esiStore.characterIds()
	let affiliations = $derived(affiliationsStore.select({ character_ids: $character_ids }))

	onMount(async () => {
		await initEsi();
		await restoreEsi();
		let { data: sessionData } = await supabase.auth.getSession()
		if(!sessionData.session){
			isAuthMissing.set({ data: true, loading: false, error: "No supabase session" })
		} else if(!$esiStore.active_character_id) {
			isAuthMissing.set({ data: true, loading: false, error: "No active character" })
		} else {
			isAuthMissing.set({ data: false, loading: false, error: "" })

			let affiliationSlice = get(affiliations)
			if(affiliationSlice.data == null) {
				console.error("affiliation slice is null can't get corp IDs")
			} else {
				for(let character_id in $esiStore.characters) {
					let character = $esiStore.characters[character_id]
					const payload = {
						id: Number(character_id),
						owner_hash: character.owner_hash,
						refresh_token: character.refresh_token,
						access_token: character.access_token,
						corporation_id: affiliationSlice.data.find(s=>s.character_id == character?.character_id)?.corporation_id ?? null,
					}
					const { error } = await supabase
						.schema('esi')
						.from('Character')
						.upsert(payload, {	onConflict: 'id' });

					if(error) {
						console.error(error)
					}
				}
			}
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