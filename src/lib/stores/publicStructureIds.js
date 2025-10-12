// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-markets.read_character_orders.v1 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<void, number[]>} */
export const publicStructureIdsStore = createEsiEndpointStore(
    'public_structure_ids',
    ()=>({ uri: `universe/structures`}),
    undefined,
    20
);
