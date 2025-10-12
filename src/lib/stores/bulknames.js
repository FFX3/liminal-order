// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-markets.read_character_orders.v1 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<number[], { stations: { id: number, name: string } }>} */
export const bulkNamesStore = createEsiEndpointStore(
    'bulknames',
    (input)=>({ uri: `universe/names`, body: input }),
    undefined,
    20,
    false,
    'POST'
);
