<script>
	import Portrait from "$lib/components/Portrait.svelte";
	import { skillsStore } from "$lib/stores/skills";
	import { supabase } from "$lib/supabaseClient";
	import { writable } from "svelte/store";

    /** @type {{ character: import("$lib/stores/esi").CharacterAuth }} */
    let { character } = $props()

    /** @type {import("svelte/store").Writable<{ loading: boolean, error: string | null }>}*/
    let skillsSyncStatus = writable({ loading: false, error: null, })

    function syncSkills() {
        skillsSyncStatus.set({ loading: true, error: null })
        skillsStore.select({ character_id: character.character_id }, character.character_id).subscribe((v=>{
            if(v.data) {
                console.log(v.data.skills.map(skill=>skill.skill_id))
                let skills = v.data.skills
                supabase.rpc('get_my_owners').then(res=>console.log(JSON.stringify(res)))
                supabase
                    .schema('esi')
                    .from('Character')
                    .update({ skills })
                    .eq('id', character.character_id)
                    .then(res=>res.error 
                        ? skillsSyncStatus.set({ loading: false, error: res.error.message }) 
                        : skillsSyncStatus.set({ loading: false, error: null }));
            }
        }))
    }

    
</script>

<div class="flex flex-row my-4">
    <Portrait character_id={character.character_id} size={64} />
    <div class="bg-slate-600 p-4 rounded ml-2">
        {#if $skillsSyncStatus.loading}
            <span>...loading</span>
        {:else}
            <button onclick={syncSkills}>Sync Skills</button>
        {/if}
        {#if $skillsSyncStatus.error}
            <span class="text-red-500">{$skillsSyncStatus.error}</span>
        {/if}
    </div>
</div>