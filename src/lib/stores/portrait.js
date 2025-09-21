// src/lib/stores/portrait.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/** @typedef {Object} PortraitUrls
 * @property {string} px64x64
 * @property {string} px128x128
 * @property {string} px256x256
 * @property {string} px512x512
 */

/** @type {ReturnType<typeof createEsiEndpointStore<PortraitUrls>>} */
export const portraitStore = createEsiEndpointStore("/characters/{id}/portrait/");
