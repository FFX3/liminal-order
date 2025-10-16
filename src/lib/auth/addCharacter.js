import { supabase } from '$lib/supabaseClient';

const CLIENT_ID = "72743549513a4d14a7a37102d468ae0c";
const REDIRECT_URI = "https://wwubrvsbuhzlpymjgjvw.supabase.co/functions/v1/eve-sso-login";

const SCOPES = [
  "esi-skills.read_skills.v1",
  "esi-markets.read_character_orders.v1",
  "esi-characters.read_standings.v1"
].join(" ");

/**
 * Start the EVE SSO flow to add a character
 */
export async function addCharacter() {
  const { data: { session } } = await supabase.auth.getSession();
  
  const state = JSON.stringify({
    app_url: window.location.origin,
    existing_token: session?.access_token || null,
    return_url: window.location.origin + window.location.pathname + window.location.search
  });

  const authUrl = `https://login.eveonline.com/v2/oauth/authorize/?` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `client_id=${CLIENT_ID}&` +
    `state=${encodeURIComponent(state)}&` +
    `scope=${encodeURI(SCOPES)}`;

  window.location.href = authUrl;
}