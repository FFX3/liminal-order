<script>
	import { affiliationsStore } from "$lib/stores/affiliations";
	import { characterIndustryJobsStore } from "$lib/stores/characterIndustryJobs";
	import { esiStore } from "$lib/stores/esi";
	import { derived } from "svelte/store";
    
    let character_ids = esiStore.characterIds()

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
        $character_ids.forEach(id=>{
            let unsub = characterIndustryJobsStore.select({ character_id: id }).subscribe(v=>{
                console.log(v)
                slice.data.push({
                    character_id: id,
                    jobs: v.data,
                    error: v.error
                })
            })
            unsubscribers.push(unsub)
        })

        const unsub = ()=>{
            unsubscribers.forEach(v=>v())
        }
        slice.loading = false
        set(slice)

        return unsub
    })

</script>

<pre>
affiliations
{JSON.stringify($affiliations.data, null, 2)}

corporation_ids
{JSON.stringify(corporation_ids)}

</pre>
{#each $characterJobsPerCharacter.data as characterJobList }
    <pre>
{JSON.stringify(characterJobList, null, 2)}
    </pre>
{/each}