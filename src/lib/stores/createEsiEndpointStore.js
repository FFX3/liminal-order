import { derived, get, readable, writable } from "svelte/store";
import { esiStore } from "./esi";

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
 * A consumer function generates an ESI URL (and optionally a rate limit)
 * from user-provided inputs.
 *
 * @template I
 * @typedef {(inputs: I) => string} Consumer
 */

/**
 * @template I, T
 * @typedef {Object} EsiEndpointStore
 *
 * @property {(inputs: I) => import("svelte/store").Readable<SliceState<T>>} select
 *   Create a derived store (slice) for the given inputs. Automatically fetches if not cached.
 *
 * @property {(inputs: I) => Promise<void>} invalidate
 *   Force a fresh fetch for the given inputs, bypassing cache.
 *
 * @property {import("svelte/store").Readable<Record<string, SliceState<T>>>} state
 *   Subscribe to the full map of slices, keyed by internal storage key.
 */

/**
 * Create a new ESI endpoint store.
 *
 * @template I, T
 * @param {Consumer<I>} consumer - Function that builds ESI URL from inputs
 * @param {(json: any) => T} [transform] - Optional transform from raw JSON to T
 * @param {number} [cacheMinutes=60] - How long to keep items in cache
 * @returns {EsiEndpointStore<I, T>}
 */
export function createEsiEndpointStore(consumer, transform, cacheMinutes = 60) {
  /** @type {import("svelte/store").Writable<Record<string, SliceState<T>>>} */
  const store = writable({});
  
  /** @type {Set<string>} */
  const pendingFetches = new Set();

  /**
   * Internal fetch function
   * @param {I} inputs 
   * @param {boolean} [bypassCache=false]
   */
  const fetchIfNeeded = async (inputs, bypassCache = false) => {
    const key = consumer(inputs);
    
    // Prevent duplicate fetches
    if (pendingFetches.has(key)) return;
    
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
      const data = await fetchData(consumer, inputs, transform);
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
    select: (inputs) => {
      const key = consumer(inputs);
      
      // Trigger fetch if needed (but don't await it)
      const currentState = get(store)[key];
      if (!currentState && !pendingFetches.has(key)) {
        fetchIfNeeded(inputs);
      }
      
      return derived(store, $store => 
        $store[key] ?? { data: null, loading: false, error: null }
      );
    },

    invalidate: async (inputs) => {
      await fetchIfNeeded(inputs, true);
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
 * @returns {Promise<T>}
 */
async function fetchData(consumer, inputs, transform) {
  const { jwt } = get(esiStore);

  if (!jwt) {
    throw new Error("Trying to fetch with no session");
  }

  const url = `https://esi.evetech.net/latest${consumer(inputs)}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    
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