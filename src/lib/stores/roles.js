// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-characters.read_corporation_roles.v1 */

/**
 * @typedef {Job[]} Response
 */

/**
 * @typedef {Object} Job
 * @property {string[]} roles
 * @property {string[]} roles_at_base
 * @property {string[]} roles_at_hq
 * @property {string[]} roles_at_other
 */

/** @typedef {Object} Input
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const characterIndustryJobsStore = createEsiEndpointStore(
    'roles',
    (input)=>({ uri: `characters/${input.character_id}/roles`, character_id: input.character_id }),
    undefined,
    20
);
