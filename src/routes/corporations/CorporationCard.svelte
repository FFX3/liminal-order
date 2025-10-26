<script>
	import CorporationIcon from "$lib/components/CorporationIcon.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import { supabase } from "$lib/supabaseClient";
	import MembersCard from "./MembersCard.svelte";

    let { corporation } = $props()
    
    const membersQuery = await supabase
        .schema('esi').from('CharacterSharedInfo').select('id,skills')
        .eq('corporation_id', $corporation.data.corporation_id)
</script>
{#if !$corporation.loading}
<div class="m-5 bg-neutral-900 rounded-lg p-2">
    <div class="flex flex-horizontal items-center bg-neutral-800 rounded m-2">
        <div class="rounded overflow-clip m-4"><CorporationIcon size={64} corporation_id={$corporation.data.corporation_id} /></div>
        <div class="h-10 p-2">{$corporation.data.name}</div>
    </div>
    <div class="mt-4 m-2 flex gap-8 flex-wrap">
        {#if membersQuery.error}
            <pre>{JSON.stringify(membersQuery.error, null, 2)}</pre>
        {:else}
            {#each membersQuery.data as memberData }
                <MembersCard memberData={memberData} />    
            {/each} 
        {/if}
    </div>
</div>
{/if}
