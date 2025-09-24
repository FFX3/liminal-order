/**
 * @param {string} token
 */
export function parseJwt(token) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

/**
 * @param {{ sub: string; name: string; }} parsedJWT
 * @returns {{ id: string, name: string }}
 */
export function extractCharacterInfo(parsedJWT) {
    return {
        id: parsedJWT.sub.split(":")[2],
        name: parsedJWT.name
    }
}

/**
 * @param {{ exp: number }} parsedJWT
 * @returns {number}
 */
export function extractExpiration(parsedJWT) {
    return parsedJWT.exp
}

/**
 * 
 * @param {string} esiTokenData 
 * @returns {string}
 */
export function getAccessTokenFromEsiTokenData(esiTokenData) {
    return JSON.parse(esiTokenData).access_token
}