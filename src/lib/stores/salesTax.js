// src/lib/stores/taxRate.js
import { derived } from "svelte/store";
import { skillsStore } from "./skills";

/**
 * @typedef {Object} TaxRateInput
 * @property {string} character_id
 */

const ACCOUNTING_SKILL_ID = 16622;

/**
 * Calculate tax rates based on character skills
 * @param {import("./skills").SkillLookupResponse} skillsData
 * @returns {{ salesTax: number }}}
 */
function calculateTaxRate(skillsData) {
  // Find relevant skills
  const accounting = skillsData.skills.find(
    s => s.skill_id === ACCOUNTING_SKILL_ID
  );

  const baseSalesTax = 0.075; // 7.5%

  const accountingMultiplier = 1 - ((accounting?.active_skill_level || 0) * 0.11);

  const salesTax = parseFloat((baseSalesTax * accountingMultiplier).toFixed(4));
  return { salesTax };
}

/**
 * Create a tax rate store for a specific character
 * @param {TaxRateInput} inputs
 * @param {string} [character_id] - Optional character ID, uses inputs.character_id if not provided
 * @returns {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<{ salesTax: number }>>}
 */
export function selectTaxRate(inputs, character_id) {
  // Use provided character_id or fall back to inputs.character_id
  const charId = character_id || inputs.character_id;
  const skillsSlice = skillsStore.select(inputs, charId);
  
  return derived(skillsSlice, $skills => {
    // Pass through loading state
    if ($skills.loading) {
      return { data: null, loading: true, error: null };
    }
    
    // Pass through errors
    if ($skills.error) {
      return { data: null, loading: false, error: $skills.error };
    }
    
    // If no data yet, return empty state
    if (!$skills.data) {
      return { data: null, loading: false, error: null };
    }
    
    // Compute tax rate
    try {
      const data = calculateTaxRate($skills.data);
      return { data, loading: false, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      return { data: null, loading: false, error };
    }
  });
}

// Export as store-like object for consistency with other stores
export const salesTaxStore = {
  select: selectTaxRate
};