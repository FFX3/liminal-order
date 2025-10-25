<script>
	import CorporationIcon from "$lib/components/CorporationIcon.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import { supabase } from "$lib/supabaseClient";
	import MembersCard from "./MembersCard.svelte";

    let { corporation } = $props()
    
    const membersQuery = await supabase
        .schema('esi').from('CharacterSharedInfo').select('id')
        .eq('corporation_id', $corporation.data.corporation_id)
</script>
{#if !$corporation.loading}
<div class="m-5 bg-slate-600 rounded-xl p-4">
    <div class="flex flex-horizontal items-center">
        <div><CorporationIcon size={64} corporation_id={$corporation.data.corporation_id} /></div>
        <div class="h-10 p-2">{$corporation.data.name}</div>
    </div>
    {#if membersQuery.error}
        <pre>{JSON.stringify(membersQuery.error, null, 2)}</pre>
    {:else}
        {#each membersQuery.data as memberData }
            <MembersCard memberData={memberData} />            
        {/each} 
    {/if}
</div>
{/if}
