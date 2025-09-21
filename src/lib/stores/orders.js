// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/**
 * @typedef {Object} Order
 * @property {number} duration
 * @property {number} escrow
 * @property {boolean} is_buy_order
 * @property {boolean} is_corporation
 * @property {string} issued
 * @property {number} location_id
 * @property {number} min_volume
 * @property {number} order_id
 * @property {number} price
 * @property {string} range
 * @property {number} region_id
 * @property {number} type_id
 * @property {number} volume_remain
 * @property {number} volume_total
 */

/** 
 * @type {{
 *   subscribe: import("svelte/store").Readable<{ data: Order[] | null, loading: boolean, error: Error | null }>["subscribe"],
 *   fetchData: () => Promise<void>
 * }}
 */

export const ordersStore = createEsiEndpointStore("/characters/{id}/orders/");
