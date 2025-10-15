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
    
    /** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<import("$lib/stores/stationInfo").Response>>} */
    let selectedStationInfo = readable({ data: null, loading: false, error: null })

    /** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<number>>} */
    let standingsWithOwner = readable({ data: 0, loading: false, error: null })

    /** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<import("$lib/stores/corporationInfo").Response>>} */
    let ownerCorporationInfo = readable({ data: null, loading: false, error: null })

    /** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<number>>} */
    let factionId = readable({ data: null, loading: false, error: null })

    /** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<number>>} */
    let standingsWithOwnerFaction = readable({ data: 0, loading: false, error: null })
    
    if(inputs.station_id){
        selectedStationInfo = stationInfoStore.select({ station_id: inputs.station_id });

        standingsWithOwner = derived(
            [selectedStationInfo],
            ([$selectedStationInfo], set) => {
                // If station info is loading, we're loading
                if ($selectedStationInfo.loading) {
                    set({ data: null, loading: true, error: null });
                    return;
                }

                // If station info has error, propagate it
                if ($selectedStationInfo.error) {
                    set({ data: null, loading: false, error: $selectedStationInfo.error });
                    return;
                }

                const ownerId = $selectedStationInfo.data?.owner ?? null;

                if (!characterId || !ownerId) {
                    set({ data: 0, loading: false, error: null });
                    return;
                }

                const standings = standingsStore.select({ character_id: characterId });

                const unsub = standings.subscribe((slice) => {
                    if (slice.loading) {
                        set({ data: null, loading: true, error: null });
                        return;
                    }
                    
                    if (slice.error) {
                        set({ data: null, loading: false, error: slice.error });
                        return;
                    }

                    const factions = slice.data ?? [];
                    const record = factions.find((f) => f.from_id === ownerId);
                    set({ data: record?.standing ?? 0, loading: false, error: null });
                });

                return () => unsub();
            }
        );

        ownerCorporationInfo = derived(
            [selectedStationInfo],
            ([$selectedStationInfo], set) => {
                // If station info is loading, we're loading
                if ($selectedStationInfo.loading) {
                    set({ data: null, loading: true, error: null });
                    return;
                }

                // If station info has error, propagate it
                if ($selectedStationInfo.error) {
                    set({ data: null, loading: false, error: $selectedStationInfo.error });
                    return;
                }

                const ownerId = $selectedStationInfo.data?.owner ?? null;

                if (!characterId || !ownerId) {
                    set({ data: null, loading: false, error: null });
                    return;
                }

                const unsub = corporationsStore.select({ corporation_id: ownerId }).subscribe((slice) => {
                    if (slice.loading) {
                        set({ data: null, loading: true, error: null });
                        return;
                    }
                    
                    if (slice.error) {
                        set({ data: null, loading: false, error: slice.error });
                        return;
                    }

                    set({ data: slice.data, loading: false, error: null });
                });

                return () => unsub();
            }
        );

        factionId = derived(
            [ownerCorporationInfo],
            ([$ownerCorporationInfo], set) => {
                // If corporation info is loading, we're loading
                if ($ownerCorporationInfo.loading) {
                    set({ data: null, loading: true, error: null });
                    return;
                }

                // If corporation info has error, propagate it
                if ($ownerCorporationInfo.error) {
                    set({ data: null, loading: false, error: $ownerCorporationInfo.error });
                    return;
                }

                const ownerName = $ownerCorporationInfo.data?.name ?? null;

                if (!ownerName) {
                    set({ data: null, loading: false, error: null });
                    return;
                }

                let factionName = getFactionNameByCorpName(ownerName)

                if (!factionName) {
                    set({ data: null, loading: false, error: null });
                    return;
                }

                const unsub = bulkNamesToIdStore.select([factionName]).subscribe((slice) => {
                    if (slice.loading) {
                        set({ data: null, loading: true, error: null });
                        return;
                    }
                    
                    if (slice.error) {
                        set({ data: null, loading: false, error: slice.error });
                        return;
                    }

                    const factionId = slice.data?.factions?.[0]?.id ?? null;
                    set({ data: factionId, loading: false, error: null });
                });

                return () => unsub();
            }
        );

        standingsWithOwnerFaction = derived(
            [factionId],
            ([$factionId], set) => {
                // If faction ID is loading, we're loading
                if ($factionId.loading) {
                    set({ data: null, loading: true, error: null });
                    return;
                }

                // If faction ID has error, propagate it
                if ($factionId.error) {
                    set({ data: null, loading: false, error: $factionId.error });
                    return;
                }

                if (!characterId || !$factionId.data) {
                    set({ data: 0, loading: false, error: null });
                    return;
                }

                const standings = standingsStore.select({ character_id: characterId });

                const unsub = standings.subscribe((slice) => {
                    if (slice.loading) {
                        set({ data: null, loading: true, error: null });
                        return;
                    }
                    
                    if (slice.error) {
                        set({ data: null, loading: false, error: slice.error });
                        return;
                    }

                    const standings = slice.data ?? [];
                    const record = standings.find((f) => f.from_id === $factionId.data);
                    set({ data: record?.standing ?? 0, loading: false, error: null });
                });

                return () => unsub();
            }
        );
    }

	/** @type {import("svelte/store").Readable<import("./createEsiEndpointStore").SliceState<number>>} */
	let brokerRelationsLevel = derived(esiStore, ($esiStore, set) => {
		if(!characterId) {
			set({ data: null, loading: false, error: null });
			return
		}

		const skills = skillsStore.select({ character_id: characterId });

		const unsub = skills.subscribe((slice) => {
            if (slice.loading) {
                set({ data: null, loading: true, error: null });
                return;
            }
            
            if (slice.error) {
                set({ data: null, loading: false, error: slice.error });
                return;
            }

			const level = slice.data?.skills.find(skill=>skill.skill_id == BROKER_RELATIONS)?.active_skill_level;
			set({ data: level ?? 0, loading: false, error: null });
		});

		return () => unsub();
	})

	// 3%-(0.3%*BrokerRelationsLevel)-(0.03%*FactionStanding)-(0.02%*CorpStanding)

	let brokerFee = derived(
		[brokerRelationsLevel, standingsWithOwnerFaction, standingsWithOwner], 
		([$brokerRelationsLevel, $standingsWithOwnerFaction, $standingsWithOwner])=> {
            // If any dependency is loading, we're loading
            if ($brokerRelationsLevel.loading || $standingsWithOwnerFaction.loading || $standingsWithOwner.loading) {
                return { data: null, loading: true, error: null };
            }

            // If any dependency has an error, propagate the first error
            const error = $brokerRelationsLevel.error || $standingsWithOwnerFaction.error || $standingsWithOwner.error;
            if (error) {
                return { data: null, loading: false, error };
            }

			// 3%-(0.3%*BrokerRelationsLevel)-(0.03%*FactionStanding)-(0.02%*CorpStanding)
            const fee = ((3-(0.3 * Number($brokerRelationsLevel.data ?? 0)))
				- (0.03 * Number($standingsWithOwnerFaction.data ?? 0))
				- (0.02 * Number($standingsWithOwner.data ?? 0))) / 100;
			
            return { data: fee, loading: false, error: null };
		}
    )

    return derived(
        [brokerRelationsLevel, standingsWithOwnerFaction, standingsWithOwner, brokerFee], 
        ([$brokerRelationsLevel, $standingsWithOwnerFaction, $standingsWithOwner, $brokerFee])=> {
        // If broker fee is loading, the whole thing is loading
        if ($brokerFee.loading) {
            return { data: null, loading: true, error: null };
        }

        // If broker fee has error, propagate it
        if ($brokerFee.error) {
            return { data: null, loading: false, error: $brokerFee.error };
        }

        try {
            const data = {
                brokerFee: $brokerFee.data,
                brokerRelationsLevel: $brokerRelationsLevel.data,
                standingsWithOwner: $standingsWithOwner.data,
                standingsWithOwnerFaction: $standingsWithOwnerFaction.data
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