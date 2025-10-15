// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/**
 * @typedef {Object} Response
 * @property {number} alliance_id
 * @property {number} ceo_id
 * @property {number} creator_id
 * @property {string} date_founded
 * @property {string} description
 * @property {number} faction_id
 * @property {number} home_station_id
 * @property {number} member_count
 * @property {string} name
 * @property {number} shares
 * @property {number} tax_rate
 * @property {string} ticker
 * @property {string} url
 * @property {boolean} war_eligible
 */

/** @typedef {Object} Input
 * @property {number} corporation_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const corporationsStore = createEsiEndpointStore(
    'corporations',
    (input)=>({ uri: `corporations/${input.corporation_id}` }),
    undefined,
    20,
    false
);
