// src/lib/stores/orders.js
import { createEsiEndpointStore } from "./createEsiEndpointStore";

/* Requires: esi-skills.read_skills.v1 */

/**
 * @typedef {Object} SkillLookupResponse
 * @property {Skill[]} skills
 * @property {number} total_sp
 * @property {number} unallocated_sp
 */

/**
 * @typedef {Object} Skill
 * @property {number} active_skill_level
 * @property {number} skill_id
 * @property {number} skillpoints_in_skill
 * @property {number} trained_skill_level
 */

/** @typedef {Object} OrderInput
 * @property {number} character_id
 */

/** @type {import("$lib/stores/createEsiEndpointStore").EsiEndpointStore<OrderInput, SkillLookupResponse>} */
export const skillsStore = createEsiEndpointStore(
    'skills',
    (input)=>({ uri: `characters/${input.character_id}/skills` }),
    undefined,
    20
);
