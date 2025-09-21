// src/lib/stores/esi.js
import { writable } from "svelte/store";

/**
 * @typedef {Object} Character
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} EsiState
 * @property {Character | null} character
 * @property {string | null} jwt
 */

function createEsiStore() {
  /** @type {import("svelte/store").Writable<EsiState>} */
  const { subscribe, set } = writable({
    character: null,
    jwt: null
  });

  return {
    subscribe,

    /**
     * @param {string} jwt
     * @param {Character} character
     */
    setAuth(jwt, character) {
      set({ jwt, character });
    },

    clearAuth() {
      set({ jwt: null, character: null });
    }
  };
}

export const esiStore = createEsiStore();
