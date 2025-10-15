// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-characters.read_standings.v1 */

/**
 * @typedef {Object} Response
 * @property {number} from_id
 * @property {"agent" | "npc_corp" | "faction"} from_type'
 * @property {number} standing
 */

/** @typedef {Object} Input
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, Response[]>} */
export const standingsStore = createEsiEndpointStore(
    'standings',
    (input)=>({ uri: `characters/${input.character_id}/standings` }),
    undefined,
    20
);
