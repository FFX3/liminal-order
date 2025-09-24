// src/lib/auth/initEsi.js
import { esiStore } from "$lib/stores/esi";
import { parseJwt, extractCharacterInfo, extractExpiration, getAccessTokenFromEsiTokenData, getRefreshTokenFromEsiTokenData } from "$lib/auth/utils";

const STORAGE_KEY = "esiCharacters";

/**
 * @typedef {Object} StoredCharacterAuth
 * @property {string} esiTokenData - Raw ESI token data
 * @property {import("$lib/stores/esi").Character} character
 * @property {number} expires_at
 */

/**
 * Initialize ESI state from URL hash (after SSO redirect)
 * and persist token in localStorage with other characters.
 */
export function initEsi() {
  const hash = window.location.hash; // e.g. "#esiTokenData=..."
  if (!hash) return;

  const match = hash.match(/esiTokenData=(.*)/);
  if (!match) return;

  try {
    const esiTokenData = decodeURIComponent(match[1]);
    const parsed = parseJwt(esiTokenData);
    const character = extractCharacterInfo(parsed);
    const expiresAt = extractExpiration(parsed);
    const jwt = getAccessTokenFromEsiTokenData(esiTokenData);

    // Add to store
    esiStore.setCharacterAuth(jwt, character, expiresAt);

    // Persist to localStorage with other characters
    saveCharacterToStorage(character.id, {
      esiTokenData,
      character,
      expires_at: expiresAt
    });

    // Optional: clean URL
    history.replaceState({}, "", window.location.pathname);
    
    console.log(`Successfully authenticated character: ${character.name}`);
  } catch (err) {
    console.error("Failed to initialize ESI from hash", err);
  }
}

/**
 * Restore all ESI characters from localStorage (called on app startup)
 */
export async function restoreEsi() {
  const stored = getStoredCharacters();
  const now = Date.now() / 1000;
  
  let restoredCount = 0;
  let expiredCount = 0;

  for (const [characterId, authData] of Object.entries(stored)) {
    let esiTokenData = authData.esiTokenData
    try {
      // Check if token is expired
      if (authData.expires_at <= now) {
        const refresh_token = getRefreshTokenFromEsiTokenData(authData.esiTokenData)
        const client_id = "72743549513a4d14a7a37102d468ae0c"
        const res = await fetch(`https://wwubrvsbuhzlpymjgjvw.supabase.co/functions/v1/refresh-token/?client_id=${client_id}&refresh_token=${refresh_token}`)
        esiTokenData = (await res.json()).esiTokenData
      }

      // Restore to store
      const jwt = getAccessTokenFromEsiTokenData(authData.esiTokenData);
      esiStore.setCharacterAuth(jwt, authData.character, authData.expires_at);
      restoredCount++;
    } catch (err) {
      console.error(`Failed to restore character ${characterId}:`, err);
      removeCharacterFromStorage(characterId);
    }
  }

  if (restoredCount > 0) {
    console.log(`Restored ${restoredCount} character(s) from storage`);
  }
  if (expiredCount > 0) {
    console.log(`Removed ${expiredCount} expired character(s)`);
  }
}

/**
 * Manually remove a character's authentication
 * @param {string} characterId 
 */
export function removeCharacterAuth(characterId) {
  esiStore.removeCharacterAuth(characterId);
  removeCharacterFromStorage(characterId);
}

/**
 * Get all stored characters
 * @returns {Record<string, StoredCharacterAuth>}
 */
function getStoredCharacters() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (err) {
    console.error("Failed to parse stored characters:", err);
    return {};
  }
}

/**
 * Save a character's auth data to localStorage
 * @param {string} characterId 
 * @param {StoredCharacterAuth} authData 
 */
function saveCharacterToStorage(characterId, authData) {
  try {
    const stored = getStoredCharacters();
    stored[characterId] = authData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (err) {
    console.error("Failed to save character to storage:", err);
  }
}

/**
 * Remove a character from localStorage
 * @param {string} characterId 
 */
function removeCharacterFromStorage(characterId) {
  try {
    const stored = getStoredCharacters();
    delete stored[characterId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (err) {
    console.error("Failed to remove character from storage:", err);
  }
}

/**
 * Clear all stored character data
 */
export function clearAllStoredCharacters() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    esiStore.clearAll();
    console.log("Cleared all stored character data");
  } catch (err) {
    console.error("Failed to clear stored characters:", err);
  }
}

/**
 * Get list of stored character info (for UI display)
 * @returns {Array<{character: import("$lib/stores/esi").Character, expires_at: number, isExpired: boolean}>}
 */
export function getStoredCharacterList() {
  const stored = getStoredCharacters();
  const now = Date.now() / 1000;
  
  return Object.values(stored).map(authData => ({
    character: authData.character,
    expires_at: authData.expires_at,
    isExpired: authData.expires_at <= now
  }));
}