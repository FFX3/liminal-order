import { writable, get } from "svelte/store";
import { esiStore } from "./esi";

/**
 * @template T
 * @param {string} endpoint - ESI URL template, e.g. "/characters/{id}/orders/"
 * @param {(json: any) => T} [transform] - optional function to massage raw JSON
 * @param {number} [cacheMinutes] - optional expiration time in minutes
 * @returns {{
 *   subscribe: import("svelte/store").Readable<{ data: T | null, loading: boolean, error: Error | null }>["subscribe"],
 *   fetchData: () => Promise<void>
 * }}
 */
export function createEsiEndpointStore(endpoint, transform, cacheMinutes = 60) {
  /** @type {import("svelte/store").Writable<{ data: T | null, loading: boolean, error: Error | null }>} */
  const store = writable({ data: null, loading: false, error: null });

  // Generate a localStorage key unique to this endpoint
  const storageKey = `esiCache:${endpoint}`;

  function loadCache() {
    if (!cacheMinutes) return null;
    try {
      const raw = localStorage.getItem(storageKey);
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
   * @param {T} data
   */
  function saveCache(data) {
    if (!cacheMinutes) return;
    const expiration = Date.now() + cacheMinutes * 60 * 1000;
    localStorage.setItem(storageKey, JSON.stringify({ data, expiration }));
  }

  /** Fetch data from ESI */
  async function fetchData() {
    const { jwt, character } = get(esiStore);
    if (!jwt || !character) {
      store.set({ data: null, loading: false, error: null });
      return;
    }

    // Load cache first
    const cached = loadCache();
    if (cached) {
      store.set({ data: cached, loading: false, error: null });
      return;
    }

    store.set({ data: null, loading: true, error: null });

    try {
      const url = endpoint.replace("{id}", character.id);
      const res = await fetch(`https://esi.evetech.net/latest${url}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (!res.ok) throw new Error(`ESI request failed: ${res.status}`);

      /** @type {T} */
      let json = await res.json();
      if (transform) json = transform(json);

      store.set({ data: json, loading: false, error: null });
      saveCache(json);
    } catch (err) {
      store.set({ data: null, loading: false, error: /** @type {Error} */ (err) });
    }
  }

  // Auto-fetch when auth changes
  esiStore.subscribe(() => fetchData());

  return {
    subscribe: store.subscribe,
    fetchData
  };
}
