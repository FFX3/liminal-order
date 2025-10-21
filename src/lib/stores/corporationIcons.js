import { createEsiEndpointStore } from "./createEsiEndpointStore";

/** @typedef {Object} IconUrls
 * @property {string} px64x64
 * @property {string} px128x128
 * @property {string} px256x256
 */

/** @typedef {Object} Input
 * @property {number} corporation_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<Input, IconUrls>} */
export const corporationIconStore = createEsiEndpointStore(
    'corporation_icons',
    (input)=>({ uri: `corporations/${input.corporation_id}/icons` }),
    undefined,
    60 * 24,
    false
);
