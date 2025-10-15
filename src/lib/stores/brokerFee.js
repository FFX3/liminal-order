// src/lib/stores/taxRate.js
import { derived, get, readable } from "svelte/store";
import { skillsStore } from "./skills";
import { esiStore } from "$lib/stores/esi";
import { stationInfoStore } from "$lib/stores/stationInfo";
import { standingsStore } from "$lib/stores/standings";
import { getFactionNameByCorpName } from "$lib/staticInfo/npcCorpFactions";
import { corporationsStore } from "$lib/stores/corporationInfo";
import { bulkNamesToIdStore } from "$lib/stores/bulkNamesToIds";

/**
 * @typedef {Object} Input
 * @property {number} [station_id]
 * @property {number} [character_id]
 */

const BROKER_RELATIONS = 3446

/**
 * @typedef {Object} BrokerFeeInfo
 * @property {number | null} brokerFee
 * @property {number | null} brokerRelationsLevel
 * @property {number | null} standingsWithOwner
 * @property {number | null} standingsWithOwnerFaction
 */

/**
 * Create a tax rate store for a specific character
 * @param {Input} inputs
 * @param {number} [character_id] - Optional character ID, uses inputs.character_id if not provided
 * @returns {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<BrokerFeeInfo>>}
 */
export function selectBrokerFee(inputs, character_id) {
    const characterId = character_id || inputs.character_id;
    /** @type {import("svelte/store").Readable<import("$lib/stores/stationInfo").Response | null>} */
    let selectedStationInfo = readable(null)

    /** @type {import("svelte/store").Readable<number | null>} */
    let standingsWithOwner = readable(null)

    /** @type {import("svelte/store").Readable<import("$lib/stores/corporationInfo").Response | null>} */
    let ownerCorporationInfo = readable(null)

    /** @type {import("svelte/store").Readable<number | null>} */
    let factionId = readable(null)

    /** @type {import("svelte/store").Readable<number | null>} */
    let standingsWithOwnerFaction = readable(null)
    
    if(inputs.station_id){
        selectedStationInfo = derived(stationInfoStore.select({ station_id: inputs.station_id }), (slice)=> {
            return slice.data
        })

        standingsWithOwner = derived(
            [selectedStationInfo],
            ([$selectedStationInfo], set) => {
                const ownerId = $selectedStationInfo?.owner ?? null;

                if (!characterId || !ownerId) {
                    set(0);
                    return;
                }

                const standings = standingsStore.select({ character_id: characterId });

                const unsub = standings.subscribe((slice) => {
                    const factions = slice?.data ?? [];
                    const record = factions.find((f) => f.from_id === ownerId);
                    set(record?.standing ?? 0);
                });

                return () => unsub();
            }
        );

        ownerCorporationInfo = derived(
            [selectedStationInfo],
            ([$selectedStationInfo], set) => {
                const ownerId = $selectedStationInfo?.owner ?? null;

                if (!characterId || !ownerId) {
                    set(null);
                    return;
                }

                const unsub = corporationsStore.select({ corporation_id: ownerId }).subscribe((slice) => {
                    if (slice?.data) {
                        set(slice.data);
                    } else if (slice === null) {
                        set(null);
                    }
                });

                return () => unsub();
            }
        );

        factionId = derived(
            [ownerCorporationInfo],
            ([$ownerCorporationInfo], set) => {
                const ownerName = $ownerCorporationInfo?.name ?? null;

                if (!ownerName) {
                    set(null);
                    return;
                }

                let factionName = getFactionNameByCorpName(ownerName)

                if (!factionName) {
                    set(null);
                    return;
                }

                const unsub = bulkNamesToIdStore.select([factionName]).subscribe((slice) => {
                    if (slice?.data) {
                        set(slice.data.factions[0].id);
                    } else if (slice === null) {
                        set(null);
                    }
                });

                return () => unsub();
            }
        );

        standingsWithOwnerFaction = derived(
            [factionId],
            ([$factionId], set) => {
                if (!characterId || !$factionId) {
                    set(0);
                    return;
                }

                const standings = standingsStore.select({ character_id: characterId });

                const unsub = standings.subscribe((slice) => {
                    const standings = slice?.data ?? [];
                    console.log($factionId, standings)
                    const record = standings.find((f) => f.from_id === $factionId)
                    set(record?.standing ?? 0);
                });

                return () => unsub();
            }
        );
    }

	/** @type {import("svelte/store").Readable<number | null>} */
	let brokerRelationsLevel = derived(esiStore, ($esiStore, set) => {
		if(!characterId) {
			set(null)
			return
		}

		const skills = skillsStore.select({ character_id: characterId });

		const unsub = skills.subscribe((slice) => {
			const level = slice.data?.skills.find(skill=>skill.skill_id == BROKER_RELATIONS)?.active_skill_level;
			set(level ?? 0);
		});

		return () => unsub();
	})

	// 3%-(0.3%*BrokerRelationsLevel)-(0.03%*FactionStanding)-(0.02%*CorpStanding)

	let brokerFee = derived(
		[brokerRelationsLevel, standingsWithOwnerFaction, standingsWithOwner], 
		([$brokerRelationsLevel, $standingsWithOwnerFaction, $standingsWithOwner])=> {
			// 3%-(0.3%*BrokerRelationsLevel)-(0.03%*FactionStanding)-(0.02%*CorpStanding)
			return ((3-(0.3 * Number($brokerRelationsLevel)))
				- (0.03 * Number($standingsWithOwnerFaction))
				- (0.02 * Number($standingsWithOwner))) / 100
		}
    )

    console.log(get(brokerRelationsLevel), get(standingsWithOwnerFaction), get(standingsWithOwner), get(brokerFee))
    // thers a bug, try "Doril I - Archangels Assembly Plant" with jade
    return derived(
        [brokerRelationsLevel, standingsWithOwnerFaction, standingsWithOwner, brokerFee], 
        ([$brokerRelationsLevel, $standingsWithOwnerFaction, $standingsWithOwner, $brokerFee])=> {
        // Compute tax rate
        try {
            const data = {
                brokerFee: $brokerFee,
                brokerRelationsLevel: $brokerRelationsLevel,
                standingsWithOwner: $standingsWithOwner,
                standingsWithOwnerFaction: $standingsWithOwnerFaction
            };
            return { data, loading: false, error: null };
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            return { data: null, loading: false, error };
        }
    });
}

// Export as store-like object for consistency with other stores
export const brokerFeeStore = {
  select: selectBrokerFee
};