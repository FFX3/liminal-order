import { createEsiEndpointStore } from "./createEsiEndpointStore";

/**
 * @typedef {Object} Affiliation
 * @property {number} alliance_id
 * @property {number} character_id
 * @property {number} corporation_id
 * @property {number} faction_id
 */


/**
 * @typedef {Affiliation[]} Response
 */

/** @typedef {Object} Input
 * @property {number[]} character_ids
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const affiliationsStore = createEsiEndpointStore(
    'affiliations',
    (input)=>({ uri: `characters/affiliation`, body: input.character_ids }),
    undefined,
    20,
    false,
    "POST"
);
