// src/lib/stores/portrait.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/** @typedef {Object} PortraitUrls
 * @property {string} px64x64
 * @property {string} px128x128
 * @property {string} px256x256
 * @property {string} px512x512
 */

/** @typedef {Object} PortraitInput
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<PortraitInput, PortraitUrls>} */
export const portraitStore = createEsiEndpointStore(
    'portraits',
    (input)=>({ uri: `characters/${input.character_id}/portrait` }),
    undefined,
    60 * 24,
    false
);
