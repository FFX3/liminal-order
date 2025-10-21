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
        console.log("reduce", corporationAlreadyInArray, value.corporation_id)
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
    let characterJobsPerCharacter = derived([character_ids], ([$character_ids], set)=>{
        /**
		 * @type {import("svelte/store").Unsubscriber[]}
		 */
        let unsubscribers = []
        /**
         * @type {{
         *     data: {
         *         character_id: number;
         *         jobs: import("$lib/stores/characterIndustryJobs").Response | null
         *         error: Error | null
         *     }[]
         *     loading: boolean,
         *  }}
         */
        let slice = { data: [], loading: true }

        /**
		 * @param {number} character_id
		 * @param {{ data: import("$lib/stores/characterIndustryJobs").Response | null; error: Error | null; }} value
		 */
        function updateCharacter(character_id, value) {
			const idx = slice.data.findIndex(d => d.character_id === character_id);
			if (idx >= 0) {
				slice.data[idx] = { character_id, jobs: value.data, error: value.error };
			} else {
				slice.data.push({ character_id, jobs: value.data, error: value.error });
			}
			set({ ...slice });
		}

        $character_ids.forEach(id=>{
            let unsub = characterIndustryJobsStore
                .select({ character_id: id })
                .subscribe(v => updateCharacter(id, v))
            unsubscribers.push(unsub)
        })

        const unsub = ()=>{
            unsubscribers.forEach(v=>v())
        }
        slice.loading = false
        set(slice)

        return unsub
    })

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
    let corporationJobsPerCharacter = derived([affiliationsStore.select({ character_ids: $character_ids })], ([$affiliations], set)=>{
        /**
		 * @type {import("svelte/store").Unsubscriber[]}
		 */
        let unsubscribers = []
        /**
         * @type {{
         *     data: {
         *         character_id: number;
         *         corporation_id: number;
         *         jobs: import("$lib/stores/characterIndustryJobs").Response | null
         *         error: Error | null
         *     }[]
         *     loading: boolean,
         *  }}
         */
        let slice = { data: [], loading: true }

        /**
		 * @param {{ character_id: number, corporation_id: number }} character_id
		 * @param {{ data: import("$lib/stores/characterIndustryJobs").Response | null; error: Error | null; }} value
		 */
        function updateCharacter({ character_id, corporation_id}, value) {
			const idx = slice.data.findIndex(d => d.character_id === character_id);
			if (idx >= 0) {
				slice.data[idx] = { character_id, corporation_id, jobs: value.data, error: value.error };
			} else {
				slice.data.push({ character_id, corporation_id, jobs: value.data, error: value.error  });
			}
			set({ ...slice });
		}
        $affiliations.data?.forEach(affiliation=>{
            let unsub = corporationIndustryJobsStore
                .select({ 
                    character_id: affiliation.character_id,
                    corporation_id: affiliation.corporation_id
                })
                .subscribe(v => updateCharacter({ 
                    character_id: affiliation.character_id,
                    corporation_id: affiliation.corporation_id
                }, v))
            unsubscribers.push(unsub)
        })

        const unsub = ()=>{
            unsubscribers.forEach(v=>v())
        }
        slice.loading = false
        set(slice)

        return unsub
    })

    $character_ids.forEach(id=>{
        jobQuery.subscribeToJobSlice(characterIndustryJobsStore.select({ character_id: id }))
    })

    $affiliations.data?.forEach(affiliation=>{
        jobQuery.subscribeToJobSlice(corporationIndustryJobsStore.select({ 
            character_id: affiliation.character_id,
            corporation_id: affiliation.corporation_id
        }))
    })

    let jobListPerInstaller = jobQuery.getJobListPerInstaller()

</script>

{#each Object.entries($jobListPerInstaller) as [character_id, jobs] }
<Portrait size={64} character_id={parseInt(character_id)} />
<h2>{get(characterPublicInfoStore.select({ character_id: parseInt(character_id)})).data?.name}</h2>
    {#if jobs}
        <Gantt data={jobs.map(job=>({ 
            name: job.job_id.toString(),
            start: new Date(job.start_date),
            end: new Date(job.end_date)
        }))} />
    {/if}
{/each}

<!-- {#each $corporationJobsPerCharacter.data as corporationJobList }
<div class="flex flex-horizontal">
    <CorporationIcon size={64} corporation_id={corporationJobList.corporation_id} />
    <Portrait size={64} character_id={corporationJobList.character_id} />
</div>
    {#if corporationJobList.jobs}
        <Gantt data={corporationJobList.jobs.map(job=>({ 
            name: job.job_id.toString(),
            start: new Date(job.start_date),
            end: new Date(job.end_date)
        }))} />
    {/if}
{/each}

{#each $characterJobsPerCharacter.data as characterJobList }
<Portrait size={64} character_id={characterJobList.character_id} />
<h2>{characters[characterJobList.character_id].character.name}</h2>
    {#if characterJobList.jobs}
        
        <Gantt data={characterJobList.jobs.map(job=>({ 
            name: job.job_id.toString(),
            start: new Date(job.start_date),
            end: new Date(job.end_date)
        }))} />
    {/if}
{/each} -->