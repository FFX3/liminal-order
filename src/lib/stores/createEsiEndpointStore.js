import { derived, get, writable } from "svelte/store";
import { esiStore } from "./esi";
import { deleteWithPrefix } from "$lib/auth/utils";

// --- Shared slice state ---
/**
 * @template T
 * @typedef {Object} SliceState
 * @property {T | null} data
 * @property {boolean} loading
 * @property {Error | null} error
 */

// --- Consumer function ---
/**
 * A consumer function generates an ESI URL from user-provided inputs.
 * For character-specific endpoints, inputs should include character_id.
 *
 * @template I
 * @typedef {(inputs: I) => string} Consumer
 */

/**
 * @template I, T
 * @typedef {Object} EsiEndpointStore
 *
 * @property {(inputs: I, character_id?: string) => import("svelte/store").Readable<SliceState<T>>} select
 *   Create a derived store (slice) for the given inputs. Automatically fetches if not cached.
 *   If character_id is provided, uses that character's JWT. Otherwise uses active character.
 *
 * @property {(inputs: I, character_id?: string) => Promise<void>} invalidate
 *   Force a fresh fetch for the given inputs, bypassing cache.
 *
 * @property {import("svelte/store").Readable<Record<string, SliceState<T>>>} state
 *   Subscribe to the full map of slices, keyed by internal storage key.
 * 
 * @property {()=>void} clearCache
 *   Clears cached data
 */

/**
 * Create a new ESI endpoint store that supports multiple characters.
 *
 * @template I, T
 * @param {string} store_key
 * @param {Consumer<I>} consumer - Function that builds ESI URL from inputs
 * @param {(json: any) => T} [transform] - Optional transform from raw JSON to T
 * @param {number} [cacheMinutes=60] - How long to keep items in cache
 * @param {boolean} [requiresAuth=true] - Whether this endpoint requires authentication
 * @returns {EsiEndpointStore<I, T>}
 */
export function createEsiEndpointStore(store_key, consumer, transform, cacheMinutes = 60, requiresAuth = true) {
  /** @type {import("svelte/store").Writable<Record<string, SliceState<T>>>} */
  const store = writable({});
  
  /** @type {Set<string>} */
  const pendingFetches = new Set();

  /**
   * Generate cache key including character_id for character-specific data
   * @param {I} inputs
   */
  const getCacheKey = (inputs) => {
    const uri = consumer(inputs);
    return `${store_key}:${uri}`
  };

  /**
   * Internal fetch function
   * @param {I} inputs 
   * @param {string} [character_id]
   * @param {boolean} [bypassCache=false]
   */
  const fetchIfNeeded = async (inputs, character_id, bypassCache = false) => {
    const key = getCacheKey(inputs);

    console.log("fetching with char id", character_id)
    
    // Prevent duplicate fetches
    if (pendingFetches.has(key)) return;

    // Determine which character's JWT to use
    let jwt;
    if (requiresAuth) {
      if (character_id) {
        jwt = esiStore.getJwtForCharacter(character_id);
      } else {
        jwt = esiStore.getActiveJwt();
        // Get the active character ID for caching
        const esiState = get(esiStore);
        character_id = esiState.active_character_id ?? undefined;
      }

      if (!jwt) {
        const errorMsg = character_id 
          ? `No valid JWT for character ${character_id}`
          : "No active character or valid JWT";
        
        store.update(prev => {
          prev[key] = { data: null, loading: false, error: new Error(errorMsg) };
          return prev;
        });
        return;
      }
    }
    
    // Check cache first (unless bypassing)
    if (!bypassCache) {
      const cached = loadCache(key);
      if (cached) {
        store.update(prev => {
          prev[key] = { data: cached, loading: false, error: null };
          return prev;
        });
        return;
      }
    }

    // Set loading state
    store.update(prev => {
      prev[key] = { data: null, loading: true, error: null };
      return prev;
    });

    pendingFetches.add(key);

    try {
      const data = await fetchData(consumer, inputs, transform, jwt);
      store.update(prev => {
        prev[key] = { data, loading: false, error: null };
        return prev;
      });
      saveCache(key, cacheMinutes, data);
    } catch (error) {
      store.update(prev => {
        prev[key] = { data: null, loading: false, error: /** @type {Error} */ (error) };
        return prev;
      });
    } finally {
      pendingFetches.delete(key);
    }
  };

  return {
    select: (inputs, character_id) => {
      const key = getCacheKey(inputs);
      
      // Trigger fetch if needed (but don't await it)
      const currentState = get(store)[key];
      if (!currentState && !pendingFetches.has(key)) {
        fetchIfNeeded(inputs, character_id);
      }
      
      return derived(store, $store => 
        $store[key] ?? { data: null, loading: false, error: null }
      );
    },

    invalidate: async (inputs, character_id) => {
      await fetchIfNeeded(inputs, character_id, true);
    },

    clearCache() {
      deleteWithPrefix(store_key)
      store.set({});
    },

    state: { subscribe: store.subscribe }
  };
}

/**
 * Internal fetch function
 *
 * @template I, T
 * @param {Consumer<I>} consumer - Function that builds ESI URL from inputs
 * @param {I} inputs
 * @param {(json: any) => T} [transform] - Optional transform from raw JSON to T
 * @param {string} [jwt] - JWT token for authentication
 * @returns {Promise<T>}
 */
async function fetchData(consumer, inputs, transform, jwt) {
  const url = `https://esi.evetech.net/latest${consumer(inputs)}`;

  try {
    const headers = new Headers();
    if (jwt) {
      headers.set("Authorization", `Bearer ${jwt}`)
    }

    const res = await fetch(url, { headers });
    
    if (!res.ok) {
      throw new Error(`ESI request failed: ${res.status}`);
    }

    /** @type {T} */
    let json = await res.json();
    if (transform) json = transform(json);

    return json;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Error fetching ${url}: ${errorMessage}`);
  }
}

/**
 * @template T
 * @param {string} key
 * @returns { T | null }
 */
function loadCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const now = Date.now();
    if (parsed.expiration > now) return parsed.data;
  } catch (_) {
    // ignore parsing errors
  }
  return null;
}

/**
 * @template T
 * @param {string} key
 * @param {number | null} cacheMinutes
 * @param { T } data
 */
function saveCache(key, cacheMinutes, data) {
  if (!cacheMinutes) return;
  const expiration = Date.now() + cacheMinutes * 60 * 1000;
  localStorage.setItem(key, JSON.stringify({ data, expiration }));
}