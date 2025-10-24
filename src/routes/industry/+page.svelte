<script>
	import CorporationIcon from "$lib/components/CorporationIcon.svelte";
	import Gantt from "$lib/components/Gantt.svelte";
	import Portrait from "$lib/components/Portrait.svelte";
	import { affiliationsStore } from "$lib/stores/affiliations";
	import { characterIndustryJobsStore } from "$lib/stores/characterIndustryJobs";
	import { characterPublicInfoStore } from "$lib/stores/characterPublicInfo";
	import { corporationIndustryJobsStore } from "$lib/stores/corporationIndustryJobs";
	import { esiStore } from "$lib/stores/esi";
	import { JobQuerier } from "$lib/stores/models/IndustryJobQuerier";
	import { derived, get } from "svelte/store";
    
    let jobQuery = new JobQuerier()

    let character_ids = esiStore.characterIds()
    let characters = $esiStore.characters

    let affiliations = $derived(affiliationsStore.select({ character_ids: $character_ids }))

    let corporation_ids = $derived($affiliations.data?.reduce((carry, value)=>{
        let corporationAlreadyInArray = carry.some((id)=>id == value.corporation_id)
        if(!corporationAlreadyInArray) {
            carry.push(value.corporation_id)
        }
        return carry
    }, /** @type {number[]} */ ([])))

    /**
     * @type {import("svelte/store").Readable<
     * {
     *      data: {
     *          character_id: number
     *          jobs: import("$lib/stores/characterIndustryJobs").Response | null,
     *          error: Error | null
     *      }[]
     *      loading: boolean,
     *  }>}
     */

    /**
     * @type {import("svelte/store").Readable<
     * {
     *      data: {
     *          character_id: number
     *          corporation_id: number;
     *          jobs: import("$lib/stores/characterIndustryJobs").Response | null,
     *          error: Error | null
     *      }[]
     *      loading: boolean,
     *  }>}
     */

    $character_ids.forEach(id=>{
        jobQuery.subscribeToJobSlice(characterIndustryJobsStore.select({ character_id: id }, id))
    })

    $affiliations.data?.forEach(affiliation=>{
        jobQuery.subscribeToJobSlice(corporationIndustryJobsStore.select({ 
            character_id: affiliation.character_id,
            corporation_id: affiliation.corporation_id
        }, affiliation.character_id))
    })

    let jobListPerInstaller = jobQuery.getJobListPerInstaller((job)=>$character_ids.includes(job.installer_id))

    let jobListPerInstallerFlattened = Object.values($jobListPerInstaller).flat()

</script>

{#if jobListPerInstallerFlattened}
    <Gantt data={jobListPerInstallerFlattened.map(job=>({ 
        name: job.job_id.toString(),
        start: new Date(job.start_date),
        end: new Date(job.end_date)
    }))} />
{/if}

<!-- {#each Object.entries($jobListPerInstaller) as [character_id, jobs] }
<Portrait size={64} character_id={parseInt(character_id)} />
<h2>{get(characterPublicInfoStore.select({ character_id: parseInt(character_id)})).data?.name}</h2>
    {#if jobs}
        <Gantt data={jobs.map(job=>({ 
            name: job.job_id.toString(),
            start: new Date(job.start_date),
            end: new Date(job.end_date)
        }))} />
    {/if}
{/each} -->