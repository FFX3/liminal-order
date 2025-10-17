// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-industry.read_character_jobs.v1 */

/**
 * @typedef {Job[]} Response
 */

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
 */

/** @typedef {Object} Input
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const characterIndustryJobsStore = createEsiEndpointStore(
    'character_industry_jobs',
    (input)=>({ uri: `characters/${input.character_id}/industry/jobs`, character_id: input.character_id }),
    undefined,
    20
);
