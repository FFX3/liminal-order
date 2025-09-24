// src/lib/auth/initEsi.js
import { esiStore } from "$lib/stores/esi";
import { parseJwt, extractCharacterInfo, extractExpiration, getAccessTokenFromEsiTokenData } from "$lib/auth/utils"; 

/**
 * Initialize ESI state from URL hash (after SSO redirect)
 * and persist token in localStorage.
 */
export function initEsi() {
  const hash = window.location.hash; // e.g. "#esiTokenData=..."
  if (!hash) return;

  const match = hash.match(/esiTokenData=(.*)/);
  if (!match) return;

  try {
    const esiTokenData = decodeURIComponent(match[1]);

    const parsed = parseJwt(esiTokenData);
    esiStore.setCharacterAuth(
      getAccessTokenFromEsiTokenData(esiTokenData), 
      extractCharacterInfo(parsed),
      extractExpiration(parsed)
    );

    localStorage.setItem("esiTokenData", esiTokenData);

    // Optional: clean URL
    history.replaceState({}, "", window.location.pathname);
  } catch (err) {
    console.error("Failed to initialize ESI from hash", err);
  }
}

/**
 * Restore ESI state from localStorage (called on app startup)
 */
export function restoreEsi() {
  const stored = localStorage.getItem("esiTokenData");
  if (!stored) return;

  try {
    const parsed = parseJwt(stored);
    const character = extractCharacterInfo(parsed);
    esiStore.setCharacterAuth(
      getAccessTokenFromEsiTokenData(stored), 
      extractCharacterInfo(parsed),
      extractExpiration(parsed)
    );
  } catch (err) {
    console.error("Failed to restore ESI from localStorage", err);
  }
}