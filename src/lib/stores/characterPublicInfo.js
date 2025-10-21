// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/**
 * @typedef {Object} Response
 * @property {number} alliance_id
 * @property {string} birthday
 * @property {number} bloodline_id
 * @property {number} corporation_id
 * @property {string} description
 * @property {number} faction_id,
 * @property {"female" | "male"} gender
 * @property {string} number
 * @property {number} race_id
 * @property {number} security_status
 * @property {string} title
 * @property {string} name
 */

/** @typedef {Object} Input
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const characterPublicInfoStore = createEsiEndpointStore(
    'characterPublicInfo',
    (input)=>({ uri: `characters/${input.character_id}` }),
    undefined,
    20,
    false
);