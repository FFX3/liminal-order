// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<string[], { 
 *   agents: { id: number, name: string }[]
 *   alliances: { id: number, name: string }[] 
 *   characters: { id: number, name: string }[] 
 *   constellations: { id: number, name: string }[] 
 *   corporations: { id: number, name: string }[] 
 *   inventory_types: { id: number, name: string }[] 
 *   regions: { id: number, name: string }[] 
 *   systems: { id: number, name: string }[]
 *   stations: { id: number, name: string }[] 
 *   factions: { id: number, name: string }[] 
 * }>} */
export const bulkNamesToIdStore = createEsiEndpointStore(
    'bulkNamesToIds',
    (input)=>({ uri: `universe/ids`, body: input }),
    undefined,
    20,
    false,
    'POST'
);
