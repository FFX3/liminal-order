// src/lib/auth/initEsi.js
import { esiStore } from "$lib/stores/esi";
import { supabase } from "$lib/supabaseClient";
import { parseJwt, extractCharacterInfo, extractExpiration, getAccessTokenFromEsiTokenData, getRefreshTokenFromEsiTokenData } from "$lib/auth/utils";

const STORAGE_KEY = "esiCharacters";



/**
 * Initialize ESI state from URL hash (after SSO redirect)
 * and persist token in localStorage with other characters.
 * Also sets the Supabase session.
 */
export async function initEsi() {
  const hash = window.location.hash; // e.g. "#esiTokenData=..."
  if (!hash) return;

  const match = hash.match(/esiTokenData=(.*)/);
  if (!match) return;

  try {
    const esiTokenData = decodeURIComponent(match[1]);
    const authData = JSON.parse(esiTokenData);
    console.log(authData);
    
    // Handle Supabase session
    if (authData.supabase_session) {
      const { error } = await supabase.auth.setSession({
        access_token: authData.supabase_session.access_token,
        refresh_token: authData.supabase_session.refresh_token
      });

      if (error) {
        console.error('Failed to set Supabase session:', error);
      } else {
        console.log('Supabase session established');
      }
    }
    
    // Handle ESI token
    const access_token = authData.esiData.access_token;
    const refresh_token = authData.esiData.refresh_token;
    const parsedJWT = parseJwt(access_token);
    const character = extractCharacterInfo(parsedJWT);
    const expires_at = extractExpiration(parsedJWT);

    const characterAuth = { access_token, character, expires_at, refresh_token, owner_hash: character.owner, character_id: character.id }

    // Add to store
    esiStore.setCharacterAuth(characterAuth);

    // Persist to localStorage with other characters
    saveCharacterToStorage(characterAuth);

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

  for (const [characterId, characterAuthData] of Object.entries(stored)) {
    try {
      // Check if token is expired
      if (characterAuthData.expires_at <= now) {
        console.log(`refreshing for char:${characterId}`);
        const client_id = "72743549513a4d14a7a37102d468ae0c";
        console.log("refresh token", characterAuthData.refresh_token)
        const res = await fetch(`https://wwubrvsbuhzlpymjgjvw.supabase.co/functions/v1/refresh-token/?client_id=${client_id}&refresh_token=${characterAuthData.refresh_token}`);
        console.log("refresh response", res)
        const esiResponse = (await res.json()).esiResponse;
        console.log("esiTokenData", esiResponse)
        if(esiResponse.error) {
          console.log(esiResponse.error_description)
        } else {
          const parsedJWT = parseJwt(esiResponse.access_token)
          const expires_at = extractExpiration(parsedJWT)
          const newCharacterAuthData = {
            ...characterAuthData,
            access_token: esiResponse.access_token,
            refresh_token: esiResponse.refresh_token,
            expires_at
          }
          saveCharacterToStorage(newCharacterAuthData);
          esiStore.setCharacterAuth(newCharacterAuthData);
        }
      } else {
        esiStore.setCharacterAuth(characterAuthData);
      }

      restoredCount++;
    } catch (err) {
      console.error(`Failed to restore character ${characterId}:`, err);
      //removeCharacterFromStorage(characterId);
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
 * @param {number} characterId 
 */
export function removeCharacterAuth(characterId) {
  esiStore.removeCharacterAuth(characterId);
  removeCharacterFromStorage(characterId);
}

/**
 * Get all stored characters
 * @returns {Record<string, import("$lib/stores/esi").CharacterAuth>}
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
 * @param {import("$lib/stores/esi").CharacterAuth} authData 
 */
function saveCharacterToStorage(authData) {
  try {
    const stored = getStoredCharacters();
    stored[authData.character.id] = authData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch (err) {
    console.error("Failed to save character to storage:", err);
  }
}

/**
 * Remove a character from localStorage
 * @param {number} characterId 
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
export async function clearAllStoredCharacters() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    esiStore.clearAll();
    await supabase.auth.signOut();
    console.log("Cleared all stored character data and signed out");
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