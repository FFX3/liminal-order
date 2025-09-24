// src/lib/stores/orders.js
import { getModuleName } from "$lib/utils";
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

/** @typedef {Object} OrderInput
 * @property {string} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<OrderInput, Order[]>} */
export const ordersStore = createEsiEndpointStore(
    'orders',
    (input)=>`/characters/${input.character_id}/orders/`,
    undefined,
    20
);
