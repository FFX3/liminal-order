<script>
	import Portrait from "$lib/components/Portrait.svelte";

    let { memberData } = $props()

</script>

<div class="flex flex-horizontal items-center">
    <div><Portrait character_id={memberData.id} size={64} /></div>
    <div class="h-10 p-2">name</div>
</div>