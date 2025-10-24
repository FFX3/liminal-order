// src/lib/stores/esi.js
import { extractCharacterInfo, extractExpiration, parseJwt } from "$lib/auth/utils";
import { derived, get, writable } from "svelte/store";

/**
 * @typedef {Object} Character
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} CharacterAuth
 * @property {Character} character
 * @property {string} access_token
 * @property {number} expires_at - Unix timestamp when JWT expires
 * @property {string} refresh_token
 * @property {string} owner_hash
 * @property {number} character_id
 */

/**
 * @typedef {Object} EsiState
 * @property {Record<number, CharacterAuth>} characters - Map of character_id -> auth data
 * @property {number | undefined} active_character_id - Currently selected character
 */

function createEsiStore() {
  /** @type {import("svelte/store").Writable<EsiState>} */
  const { subscribe, update, set } = writable({
    characters: {},
    active_character_id: undefined
  });

  return {
        /**
     * Upsert all characters to Supabase
     * @param {import('@supabase/supabase-js').SupabaseClient} supabase
     * @returns {Promise<{success: number[], failed: number[]}>}
     */

    subscribe,

    /** Helper to get all authenticated character IDs */
    characterIds() {
      return derived({ subscribe }, $state=>{
        return Object.keys($state.characters).map(id=>Number(id))
      })
    },

    /**
     * Add or update authentication for a character
     * @param {CharacterAuth} characterAuth
     */
    setCharacterAuth(characterAuth) {
      update(state => ({
        ...state,
        characters: {
          ...state.characters,
          [characterAuth.character_id]: characterAuth
        },
        active_character_id: state.active_character_id ?? characterAuth.character_id
      }));
    },

    /**
     * Remove a character's authentication
     * @param {number} character_id
     */
    removeCharacterAuth(character_id) {
      update(state => {
        const newCharacters = { ...state.characters };
        delete newCharacters[character_id];
        
        // If removing active character, switch to another one or null
        const newActiveId = state.active_character_id === character_id
          ? Object.keys(newCharacters)[0] || undefined
          : state.active_character_id;

        return {
          characters: newCharacters,
          active_character_id: Number(newActiveId)
        };
      });
    },

    /**
     * Set the active character
     * @param {number | undefined} character_id
     */
    setActiveCharacter(character_id) {
      update(state => ({
        ...state,
        active_character_id: character_id
      }));
    },

    /**
     * Get JWT for a specific character
     * @param {number} character_id
     * @returns {string | null}
     */
    getJwtForCharacter(character_id) {
      const state = get({ subscribe });
      const auth = state.characters[character_id];
      
      // Check if JWT is expired
      if (auth) {
        
        return auth.access_token;
      }
      return null;
    },

    /**
     * Get JWT for the active character
     * @returns {string | null}
     */
    getActiveJwt() {
      const state = get({ subscribe });
      if (!state.active_character_id) return null;
      return this.getJwtForCharacter(state.active_character_id);
    },

    /**
     * Clear all authentication data
     */
    clearAll() {
      set({ characters: {}, active_character_id: undefined });
    }
  };
}

export const esiStore = createEsiStore();