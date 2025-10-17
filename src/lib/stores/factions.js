// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/**
 * @typedef {Object} Response
 * @property {number} corporation_id
 * @property {string} description'
 * @property {number} faction_id
 * @property {boolean} is_unique
 * @property {number} militia_corporation_id
 * @property {string} name
 * @property {number} size_factor
 * @property {number} solar_system_id
 * @property {number} station_count
 * @property {number} station_system_count
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<void, Response[]>} */
export const factionsStore = createEsiEndpointStore(
    'factions',
    ()=>({ uri: `universe/factions` }),
    undefined,
    20,
    false
);
