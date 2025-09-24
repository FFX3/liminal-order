export function getModuleName(defaultName = "unknown") {
  try {
    // ESM case (browser or Node ESM)
    if (typeof import.meta != undefined && import.meta.url) {
      //@ts-ignore
      return import.meta.url.split("/").pop().replace(/\.[^/.]+$/, "");
    }
  } catch (_) {}

  try {
    // CommonJS (Node)
    if (typeof __filename !== "undefined") {
      const path = require("path");
      return path.basename(__filename, path.extname(__filename));
    }
  } catch (_) {}

  return defaultName;
}

const moduleName = getModuleName("fallback");