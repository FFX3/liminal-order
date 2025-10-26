<script>
	import Portrait from "$lib/components/Portrait.svelte";
	import { convertToPyfaFormat } from "$lib/staticInfo/pyfaSkillExport";
	import { skillIdToName } from "$lib/staticInfo/skillsIdNameMap";
	import { characterPublicInfoStore } from "$lib/stores/characterPublicInfo";

    let { memberData } = $props()

    let characterInfoSlice = characterPublicInfoStore.select({ character_id: memberData.id })

async function exportClipToClipError() {
    let pyfaFormat = convertToPyfaFormat(memberData.skills)
    const type = "text/plain";
    const clipboardItemData = {
        [type]: pyfaFormat,
    };
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
    console.log(pyfaFormat)
}
</script>

<div class="p-4 bg-neutral-800 rounded hover:bg-neutral-700">
    <div class="flex flex-horizontal items-center">
        <div class="rounded overflow-clip"><Portrait character_id={memberData.id} size={64} /></div>
        <div class="h-10 p-2">{$characterInfoSlice.data?.name}</div>
    </div>
    <button onclick={exportClipToClipError} class="bg-indigo-600/30 cursor-pointer mt-4 hover:bg-indigo-500/30 border-indigo-500 p-4 w-xs rounded">
        Export skill to pyfa
    </button>
</div>