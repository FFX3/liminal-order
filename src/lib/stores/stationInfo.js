// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/** @typedef {Object} Input
 * @property {number} station_id
 * /

/** @typedef {Object} Response
 * @property {number} max_dockable_ship_volume
 * @property {string} name
 * @property {number} office_rental_cost
 * @property {number} owner
 * @property {{ x: number, y: number, z: number }} position
 * @property {number} race_id
 * @property {number} reprocessing_efficiency
 * @property {number} reprocessing_stations_take
 * @property {string} services
 * @property {number} station_id
 * @property {number} system_id
 * @property {number} duration
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response>} */
export const stationInfoStore = createEsiEndpointStore(
    'stations',
    (input)=>({ uri: `universe/stations/${input.station_id}` }),
    undefined,
    20
);
