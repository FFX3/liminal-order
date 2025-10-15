<script>
	import { esiStore } from "$lib/stores/esi"
	import Portrait from "./Portrait.svelte"
	import { writable } from "svelte/store"

	let collapsed = writable(true)

	// access store data
	$: tokens = Object.values($esiStore.characters)
	$: activeCharacterId = $esiStore.active_character_id
	$: activeCharacter = activeCharacterId
		? $esiStore.characters[activeCharacterId].character
		: undefined

	/**
	 * @param {number | undefined} id
	 */
	function setActive(id) {
		esiStore.setActiveCharacter(id)
	}
</script>

<!-- Panel -->
<div class="fixed bottom-0 left-0 right-0 bg-neutral-900 text-gray-200 border-t border-neutral-700">
	<!-- Header / Toggle -->
	<button
        type="button"
		class="w-full text-left flex items-center justify-between px-3 py-2 cursor-pointer select-none bg-neutral-800 hover:bg-neutral-700"
		on:click={() => ($collapsed = !$collapsed)}
	>
		<div class="font-semibold text-sm">
			ESI Debug Panel {activeCharacter ? `— ${activeCharacter.name}` : ""}
		</div>
		<div class="text-xs text-gray-400">{$collapsed ? "▲" : "▼"}</div>
	</button>

	<!-- Content -->
	{#if !$collapsed}
		<div class="max-h-72 overflow-y-auto p-3 space-y-3">
			{#each tokens as token}
				<button
					class={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
						token.character.id === activeCharacterId
							? "bg-indigo-600/30 border border-indigo-500"
							: "hover:bg-neutral-800 border border-neutral-800"
					}`}
					on:click={() => setActive(token.character.id)}
				>
					<Portrait character_id={token.character.id} size={64} />
					<div>
						<div
							class={`font-semibold ${
								token.character.id === activeCharacterId
									? "text-indigo-400"
									: "text-gray-300"
							}`}
						>
							{token.character.name}
						</div>
						<div class="text-xs text-gray-500">
							ID: {token.character.id}
						</div>
						<div class="text-xs text-gray-500">
							Expires: {new Date(token.expires_at * 1000).toLocaleString()}
						</div>
					</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
