/**
 * @typedef {Object} Job
 * @property {number} activity_id
 * @property {number} blueprint_id
 * @property {number} blueprint_location_id
 * @property {number} blueprint_type_id
 * @property {number} completed_character_id
 * @property {string} completed_date
 * @property {number} cost
 * @property {number} duration
 * @property {string} end_date
 * @property {number} facility_id
 * @property {number} installer_id
 * @property {number} job_id
 * @property {number} output_location_id
 * @property {number} licensed_runs
 * @property {string} pause_date
 * @property {number} probability
 * @property {number} product_type_id
 * @property {number} runs
 * @property {string} start_date
 * @property {number} station_id
 * @property {string} status
 * @property {number} successful_runs
 * @property {number | undefined} corporation_id
 * @property {number[]} factory_managers
 */

import { derived, get, readable, writable } from "svelte/store";

export class JobQuerier {
    /** @private @type {import("svelte/store").Writable<Job[]>}*/
    jobList = writable([])

    /** @private @type {import("svelte/store").Unsubscriber[]}*/
    unsubscribers = []

    /**
     * @param {import("svelte/store").Writable<Job[]>} writableJobList
     * @returns {import("svelte/store").Readable<Job[]>}
     */
    static getReadableFromWritableJobList(writableJobList) {
        return derived(
            writableJobList, 
            ($writableJobList=>$writableJobList)
        )
    }

    getJobList() {
        return JobQuerier.getReadableFromWritableJobList(this.jobList)
    }

    /** 
     *  @returns {import("svelte/store").Readable<Record<number, Job[]>>}
     */
    getJobListPerInstaller() {
        return readable(
            /** @type {Record<number, Job[]>} */ ({}), 
            ((set) => {
                let unsubscribe = JobQuerier.getReadableFromWritableJobList(this.jobList).subscribe((value)=>{
                    set(value.reduce((carry, job)=>{
                        let installerJobList = carry[job.installer_id] ?? []
                        installerJobList.push(job)
                        carry[job.installer_id] = installerJobList
                        return carry
                    }, /** @type {Record<number, Job[]>} */({})))
                })
                return unsubscribe
            })
        )
    }

    /** 
     *  @returns {import("svelte/store").Readable<Record<number, Job[]>>}
     */
    getJobListPerCorporation() {
        return readable(
            /** @type {Record<number, Job[]>} */ ({}), 
            ((set) => {
                let unsubscribe = JobQuerier.getReadableFromWritableJobList(this.jobList).subscribe((value)=>{
                    set(value.reduce((carry, job)=>{
                        let { corporation_id } = job
                        if(!corporation_id) { return carry }
                        let installerJobList = carry[corporation_id] ?? []
                        installerJobList.push(job)
                        carry[corporation_id] = installerJobList
                        return carry
                    }, /** @type {Record<number, Job[]>} */({})))
                })
                return unsubscribe
            })
        )
    }

    unsubscribe() {
        this.unsubscribers.forEach(f=>f())
    }
    
    /** @param {Job[]} jobs  */
    addJobs(jobs) {
        let currentJobsSlice = get(this.jobList)
        let newJobs = jobs.filter(job=>!currentJobsSlice.some(cj=>cj.job_id == job.job_id))
        this.jobList.set([...currentJobsSlice, ...newJobs])

        console.log("input", jobs)
        console.log("currentSlice", jobs)
        console.log("filtered", [...currentJobsSlice, ...newJobs])
        console.log("newSlice", get(this.jobList))
    }

    /** @param {import("svelte/store").Readable<{ data: Job[] | null, loading: boolean, error: Error | null}>} slice */
    subscribeToJobSlice(slice) {
        let unsubscribe = slice.subscribe((value)=>{
            console.log(value)
            if(value.data) {
                this.addJobs(value.data)
            }
        })
        this.unsubscribers.push(unsubscribe)
    }
}