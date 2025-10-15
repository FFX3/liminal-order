// https://evemaps.dotlan.net/npc

const input = `
Amarr EmpireAmarr Empire
Name	Home	Stations	Systems	Agents
24th Imperial Crusade	The Bleak LandsMapIesa	0	0	68
Amarr Certified News	Kor-AzorMapNakregde	0	0	36
Amarr Civil Service	DomainMapShuria	0	0	79
Amarr Constructions	DomainMapNererut	0	0	88
Amarr Navy	DomainMapSafizon	0	0	120
Amarr Templars	DomainMapAna	0	0	0
Amarr Trade Registry	DomainMapSukirah	0	0	99
Ametat Security	DomainMapSahdil	0	0	0
Ardishapur Family	DomainMapArdishapur Prime	0	0	32
Bragian Order	KadorMapKothe	0	0	0
Carthum Conglomerate	Tash-MurkonMapPimebeka	0	0	120
Civic Court	KadorMapDresi	0	0	98
Company of Marcher Lords	Tash-MurkonMapPaye	0	0	0
Court Chamberlain	DomainMapHedion	0	0	14
Ducia Foundry	DevoidMapLaddiaha	0	0	83
Emperor Family	DomainMapAmarr	0	0	83
Fraternity of St. Venefice	DomainMapEtav	0	0	0
Further Foodstuffs	DomainMapArdishapur Prime	0	0	23
Hedion University	Kor-AzorMapSehmy	0	0	28
Holdfast Syndicate	DevoidMapDihra	0	0	0
HZO Refinery	DomainMapBagodan	0	0	37
Imperial Academy	DomainMapChaven	0	0	42
Imperial Armaments	DomainMapPenirgman	0	0	126
Imperial Chancellor	DomainMapMikhir	0	0	33
Imperial Guard	The Bleak LandsMapSosala	0	0	0
Imperial Shipment	Kor-AzorMapLeva	0	0	117
Imperial War Reserves	DomainMapAkhragan	0	0	0
Inherent Implants	KadorMapAskonak	0	0	34
Joint Harvesting	Kor-AzorMapAmdonen	0	0	150
Kador Family	KadorMapKador Prime	0	0	38
Kameira Lodge	Tash-MurkonMapMimen	0	0	0
Kor-Azor Family	Kor-AzorMapKor-Azor Prime	0	0	35
Ministry of Assessment	KadorMapTurba	0	0	80
Ministry of Internal Order	DomainMapBashakru	0	0	83
Ministry of War	DomainMapAkhragan	0	0	108
Noble Appliances	KadorMapNordar	0	0	33
Nurtura	Tash-MurkonMapShesha	0	0	107
Paladin Survey Force	DomainMapCharra	0	0	0
Red and Silver Hand	DerelikMapTidacha	0	0	0
Royal Amarr Institute	Tash-MurkonMapEmrayur	0	0	30
Royal Uhlans	Tash-MurkonMapMarthia	0	0	0
Sarum Family	DomainMapSarum Prime	0	0	38
Shining Flame	DomainMapGosalav	0	0	0
Tal-Romon Legion	Tash-MurkonMapIro	0	0	0
Tash-Murkon Family	Tash-MurkonMapTash-Murkon Prime	0	0	40
Theology Council	DomainMapAvair	0	0	83
Viziam	Tash-MurkonMapBaviasi	0	0	32
Zoar and Sons	DevoidMapNakatre	0	0	101
Ammatar MandateAmmatar Mandate
Name	Home	Stations	Systems	Agents
Ammatar Consulate	DerelikMapTanoo	0	0	25
Ammatar Fleet	DerelikMapSasta	0	0	66
Nefantar Miner Association	DerelikMapYuzier	0	0	15
Angel CartelAngel Cartel
Name	Home	Stations	Systems	Agents
Archangels	CurseMapCL-85V	0	0	75
Dominations	CurseMapUtopia	0	0	32
Guardian Angels	FountainMapYZ-LQL	0	0	52
Malakim Zealots	CurseMapG-0Q86	0	0	0
Salvation Angels	CurseMapLitom	0	0	34
Blood Raider CovenantBlood Raider Covenant
Name	Home	Stations	Systems	Agents
Blood Raiders	DelveMapKFIE-Z	0	0	43
Caldari StateCaldari State
Name	Home	Stations	Systems	Agents
Caldari Business Tribunal	The ForgeMapMaurasi	0	0	150
Caldari Constructions	LonetrekMapPiak	0	0	82
Caldari Funds Unlimited	LonetrekMapLitiura	0	0	30
Caldari Navy	The ForgeMapPerimeter	0	0	156
Caldari Provisions	The CitadelMapHaatomo	0	0	75
Caldari Steel	The ForgeMapAbagawa	0	0	77
CBD Corporation	The CitadelMapMuvolailen	0	0	153
CBD Sell Division	The CitadelMapTasabeshi	0	0	32
Chief Executive Panel	The ForgeMapNew Caldari	0	0	37
Commando Perkone	The CitadelMapInoue	0	0	0
Corporate Police Force	The CitadelMapSuroken	0	0	87
Deep Core Mining Inc.	The CitadelMapPaara	0	0	33
Echelon Entertainment	LonetrekMapPassari	0	0	35
Expert Distribution	The ForgeMapLiekuri	0	0	162
Expert Housing	The ForgeMapNiyabainen	0	0	47
Expert Intervention	The ForgeMapVouskiaho	0	0	0
Home Guard	LonetrekMapNonni	0	0	66
House of Records	The ForgeMapNew Caldari	0	0	20
Hyasyoda Corporation	The CitadelMapSuroken	0	0	106
Ikomari-Onu Enforcement	LonetrekMapAtai	0	0	0
Intara Direct Action	LonetrekMapVuorrassi	0	0	0
Internal Security	The ForgeMapPoinen	0	0	17
Ishukone Corporation	LonetrekMapMalkalen	0	0	103
Ishukone Watch	LonetrekMapMalkalen	0	0	36
Isuuaya Tactical	The CitadelMapOshaima	0	0	0
Kaalakiota Corporation	LonetrekMapNonni	0	0	162
Kinsho Swords	The ForgeMapMastakomon	0	0	0
Kirkinen Risk Control	The ForgeMapPurjola	0	0	0
Lai Dai Corporation	LonetrekMapAirkio	0	0	85
Lai Dai Protection Service	LonetrekMapAirkio	0	0	31
Mercantile Club	The ForgeMapSirseshin	0	0	39
Minedrill	LonetrekMapKorama	0	0	56
Modern Finances	The ForgeMapGeras	0	0	46
Nugoeihuvi Corporation	The ForgeMapJosameto	0	0	118
Onikanabo Brigade	The ForgeMapVahunomi	0	0	0
Osmon Surveillance	The CitadelMapSaikanen	0	0	0
Peace and Order Unit	The ForgeMapSaisio	0	0	34
Perkone	The CitadelMapAnttiri	0	0	75
PKN Cryptographic	LonetrekMapAirkio	0	0	0
PKN Interstellar	LonetrekMapAirkio	0	0	0
Poksu Mineral Group	The ForgeMapHampinen	0	0	75
Prompt Delivery	The ForgeMapGekutami	0	0	38
Propel Dynamics	LonetrekMapOssa	0	0	34
Rapid Assembly	The CitadelMapPaara	0	0	50
School of Applied Knowledge	LonetrekMapTodaki	0	0	30
Science and Trade Institute	LonetrekMapAmsen	0	0	30
Seituoda Taskforce Command	LonetrekMapAutama	0	0	0
Spacelane Patrol	The CitadelMapMuvolailen	0	0	114
State and Region Bank	LonetrekMapAntiainen	0	0	32
State Military Stockpile	The ForgeMapPerimeter	0	0	0
State Peacekeepers	The CitadelMapIshomilken	0	0	0
State Protectorate	The ForgeMapJita	0	0	64
State War Academy	The ForgeMapKisogo	0	0	25
Storm Wind Strikeforce	The CitadelMapUsi	0	0	0
Sukuuvestaa Corporation	The ForgeMapSaisio	0	0	114
Top Down	LonetrekMapUmokka	0	0	24
Wiyrkomi Corporation	LonetrekMapDantumi	0	0	115
Wiyrkomi Peace Corps	LonetrekMapDantumi	0	0	22
Ytiri	LonetrekMapElonaya	0	0	75
Zainou	LonetrekMapIsseras	0	0	35
Zumari Force Projection	The ForgeMapSoshin	0	0	0
CONCORD AssemblyCONCORD Assembly
Name	Home	Stations	Systems	Agents
CONCORD	GenesisMapYulai	0	0	161
CONCORD Aerospace	GenesisMapYulai	0	0	0
DED	GenesisMapYulai	0	0	78
Directive Intelligence Agency	GenesisMapYulai	0	0	0
Independent Gaming Commission	GenesisMapYulai	0	0	0
Inner Circle	GenesisMapYulai	0	0	6
Project Discovery	GenesisMapYulai	0	0	0
Secure Commerce Commission	GenesisMapYulai	0	0	13
DriftersDrifters
Name	Home	Stations	Systems	Agents
Vigilant Tyrannos	GenesisMapNew Eden	0	0	0
EDENCOMEDENCOM
Name	Home	Stations	Systems	Agents
AEGIS	GenesisMapYulai	0	0	0
Gallente FederationGallente Federation
Name	Home	Stations	Systems	Agents
Algintal Core	Sinq LaisonMapJolia	0	0	0
Aliastra	Sinq LaisonMapAlillere	0	0	104
Allotek Industries	SolitudeMapElore	0	0	13
Astral Mining Inc.	Verge VendorMapAlentene	0	0	136
Bank of Luminaire	EssenceMapAlgogille	0	0	41
Center for Advanced Studies	Verge VendorMapCistuvaert	0	0	28
Chatelain Rapid Response	EveryshoreMapUphene	0	0	0
Chemal Tech	Sinq LaisonMapDoussivitte	0	0	83
Combined Harvest	SolitudeMapBoystin	0	0	82
Condotta Rouvenor	EssenceMapOmmare	0	0	0
CreoDron	EveryshoreMapCarirgnottin	0	0	121
Crux Special Tasks Group	PlacidMapAdacyne	0	0	0
Duvolle Laboratories	EveryshoreMapCarirgnottin	0	0	57
Edimmu Warfighters	EveryshoreMapOdixie	0	0	0
Egonics Inc.	EveryshoreMapUphene	0	0	32
Federal Administration	EssenceMapAlgogille	0	0	80
Federal Defense Union	PlacidMapAmoen	0	0	68
Federal Freight	EveryshoreMapLeremblompes	0	0	101
Federal Intelligence Office	EssenceMapRenyn	0	0	61
Federal Marines	EssenceMapFliet	0	0	0
Federal Navy Academy	EssenceMapDuripant	0	0	28
Federal Strategic Materiel	EssenceMapAlgogille	0	0	0
Federation Customs	EssenceMapLuminaire	0	0	102
Federation Navy	EssenceMapAlgogille	0	0	144
FedMart	PlacidMapOstingele	0	0	122
Garoun Investment Bank	EveryshoreMapLirsautton	0	0	40
Impetus	EveryshoreMapAtlanins	0	0	57
Kang Lo Directorate	EveryshoreMapTorvi	0	0	0
Mannar Focused Warfare	Sinq LaisonMapNey	0	0	0
Material Acquisition	SolitudeMapElore	0	0	88
Namtar Elite	Sinq LaisonMapCroleur	0	0	0
Ostrakon Agency	EssenceMapMesokel	0	0	0
Pend Insurance	PlacidMapOstingele	0	0	86
Poteque Pharmaceuticals	Verge VendorMapAlentene	0	0	63
President	Sinq LaisonMapParchanier	0	0	12
Quafe Company	EveryshoreMapLirsautton	0	0	157
Resheph Interstellar Strategy	Sinq LaisonMapDodenvale	0	0	0
Roden Shipyards	Verge VendorMapAlentene	0	0	93
Senate	EssenceMapVillore	0	0	15
Sinq Laison Gendarmes	Sinq LaisonMapEstene	0	0	0
Supreme Court	EveryshoreMapBereye	0	0	13
The Scope	PlacidMapOrvolle	0	0	63
TransStellar Shipping	Sinq LaisonMapDoussivitte	0	0	159
University of Caille	Sinq LaisonMapBourynes	0	0	34
Guristas PiratesGuristas Pirates
Name	Home	Stations	Systems	Agents
Commando Guri	VenalMapH-PA29	0	0	0
Guristas	VenalMap6NJ8-V	0	0	61
Guristas Production	VenalMapY-4CFK	0	0	9
Jove EmpireJove Empire
Name	Home	Stations	Systems	Agents
Academy of Aggressive Behaviour	J7HZ-FMapHD3-JK	0	0	0
Jove Navy	J7HZ-FMap54-VNO	0	0	31
Jovian Directorate	J7HZ-FMap54-VNO	0	0	64
Material Institute	J7HZ-FMapM-FDTD	0	0	0
Prosper	J7HZ-FMap54-VNO	0	0	20
Shapeset	J7HZ-FMapIAMZ-5	0	0	20
Khanid KingdomKhanid Kingdom
Name	Home	Stations	Systems	Agents
Khanid Innovation	KhanidMapKhanid Prime	0	0	6
Khanid Transport	KhanidMapKhanid Prime	0	0	21
Khanid Works	KhanidMapKhanid Prime	0	0	7
Royal Khanid Navy	KhanidMapKihtaled	0	0	55
Minmatar RepublicMinmatar Republic
Name	Home	Stations	Systems	Agents
Boundless Creation	MetropolisMapHagilur	0	0	35
Brutor Tribe	HeimatarMapRens	0	0	45
Brutor Vanguard	MetropolisMapKlaevik	0	0	0
Circle of Huskarl	MetropolisMapEgbonbet	0	0	0
Core Complexion Inc.	MetropolisMapAldagolf	0	0	157
Eifyr and Co.	MetropolisMapElgoi	0	0	15
Eyniletti Rangers	MetropolisMapAmo	0	0	0
Forty-Nine Fedayeen	HeimatarMapSist	0	0	0
Freedom Extension	MetropolisMapBei	0	0	150
Krullefor Organization	MetropolisMapGeffur	0	0	0
Krusual Covert Operators	HeimatarMapOffugen	0	0	0
Krusual Tribe	MetropolisMapHek	0	0	38
Mikramurka Shock Troop	MetropolisMapDantbeinn	0	0	0
Minmatar Mining Corporation	MetropolisMapHagilur	0	0	127
Native Freshfood	Molden HeathMapGelfiven	0	0	24
Nefantar Council	MetropolisMapIlluin	0	0	0
Pator Tech School	MetropolisMapRyddinjorn	0	0	27
Republic Command	MetropolisMapAuner	0	0	0
Republic Fleet	HeimatarMapPator	0	0	139
Republic Fleet Ordnance	HeimatarMapPator	0	0	0
Republic Justice Department	MetropolisMapArlulf	0	0	99
Republic Military School	HeimatarMapAmmold	0	0	32
Republic Parliament	MetropolisMapIlluin	0	0	81
Republic Security Services	HeimatarMapPator	0	0	126
Republic University	HeimatarMapHulm	0	0	29
Sanmatar Kelkoons	DerelikMapKasrasi	0	0	0
Sebiestor Field Sappers	MetropolisMapFreatlidur	0	0	0
Sebiestor Tribe	MetropolisMapEram	0	0	46
Seykal Expeditionary Group	HeimatarMapRokofur	0	0	0
Six Kin Development	HeimatarMapRens	0	0	34
Starkmanir Council	HeimatarMapAbudban	0	0	0
The Leisure Group	MetropolisMapYrmori	0	0	39
Tribal Liberation Force	MetropolisMapEbolfer	0	0	60
Tronhadar Free Guard	HeimatarMapJavrendei	0	0	0
Urban Management	HeimatarMapAbudban	0	0	27
Vherokior Combat Logistics	MetropolisMapEldjaerin	0	0	0
Vherokior Tribe	Molden HeathMapTeonusude	0	0	40
Mordu's Legion CommandMordu's Legion Command
Name	Home	Stations	Systems	Agents
Mordu's Legion	Pure BlindMap5ZXX-K	0	0	10
OREORE
Name	Home	Stations	Systems	Agents
Frostline Laboratories	Outer RingMap4C-B7X	0	0	0
ORE Technologies	Outer RingMap4C-B7X	0	0	0
Outer Ring Development	Outer RingMap4C-B7X	0	0	0
Outer Ring Excavations	Outer RingMap4C-B7X	0	0	21
Outer Ring Prospecting	Outer RingMap4C-B7X	0	0	0
Rogue DronesRogue Drones
Name	Home	Stations	Systems	Agents
Infested Regions Hiveminds	Map	0	0	0
Unshackled Overminds	Map	0	0	0
Sansha's NationSansha's Nation
Name	Home	Stations	Systems	Agents
True Creations	StainMap37S-KO	0	0	124
True Power	StainMap37S-KO	0	0	91
SerpentisSerpentis
Name	Home	Stations	Systems	Agents
Serpentis Corporation	FountainMapSerpentis Prime	0	0	66
Serpentis Inquest	FountainMapSerpentis Prime	0	0	16
Servant Sisters of EVEServant Sisters of EVE
Name	Home	Stations	Systems	Agents
Food Relief	Pure BlindMapX-7OMU	0	0	13
Sisters of EVE	Pure BlindMapX-7OMU	0	0	85
The Sanctuary	Pure BlindMapX-7OMU	0	0	10
The InterBusThe InterBus
Name	Home	Stations	Systems	Agents
Adaptive Provisioning	Map	0	0	0
Cromeaux Inc	Map	0	0	0
Inner Zone Shipping	PlacidMapOrvolle	0	0	12
InterBus	GenesisMapOurapheh	0	0	34
Interplanetary Media Network	Map	0	0	0
Paragon	Map	0	0	11
Vapor Sea Technologies	Map	0	0	0
Verity Enhancements	Map	0	0	0
Villore Sec Ops	EveryshoreMapHalle	0	0	0
Zero-G Research Firm	LonetrekMapAunenen	0	0	7
The Society of Conscious ThoughtThe Society of Conscious Thought
Name	Home	Stations	Systems	Agents
Genolution	HeimatarMapVullat	0	0	96
Impro	DomainMapClarelam	0	0	31
Society of Conscious Thought	GeminateMapFDZ4-A	0	0	14
X-Sense	LonetrekMapSaatuban	0	0	45
The SyndicateThe Syndicate
Name	Home	Stations	Systems	Agents
Intaki Bank	SyndicateMapX-BV98	0	0	28
Intaki Commerce	SyndicateMapF67E-Q	0	0	24
Intaki Space Police	SyndicateMapPoitot	0	0	41
Intaki Syndicate	SyndicateMapPoitot	0	0	73
Thukker TribeThukker Tribe
Name	Home	Stations	Systems	Agents
Thukker Council	Great WildlandsMapM-MD3B	0	0	0
Thukker Mix	Great WildlandsMapM-MD3B	0	0	65
Trust Partners	Great WildlandsMapM-MD3B	0	0	73
Triglavian CollectiveTriglavian Collective
Name	Home	Stations	Systems	Agents
Navka Overminds	Map	0	0	0
Perun Clade	PochvenMapKino	0	0	0
Svarog Clade	PochvenMapNiarja	0	0	0
The Convocation of Triglav	PochvenMapOtela	0	0	0
Veles Clade	PochvenMapArchee	0	0	0
Unknown Faction 0Unknown Faction 0
Name	Home	Stations	Systems	Agents
Doomheim	Map	0	0	0
Karybdis Infestation	Map	0	0	0
Pann's Peeps	Map	0	0	0
Polaris Bug Hunters	Map	0	0	0
Polaris Corporation	Map	0	0	0
Polaris Events	Map	0	0	0
Scylla Infestation	Map	0	0	0
Templis Dragonaurs	GenesisMapImya	0	0	0
The Equilibrium of Mankind	Map	0	0	0
Vimoksha Chorus	Map	0	0	0
Unknown Faction 500021Unknown Faction 500021
Name	Home	Stations	Systems	Agents
Ashes of Turnur	Map	0	0	0
Disciples of Purity	Map	0	0	0
Gallentia Primacy	Map	0	0	0
United Champions of Freedom	Map	0	0	0
Unknown Faction 500028Unknown Faction 500028
Name	Home	Stations	Systems	Agents
AIR Laboratories	Verge VendorMapCistuvaert	0	0	0
Unknown Faction 500029Unknown Faction 500029
Name	Home	Stations	Systems	Agents
Arkombine	MetropolisMapEurgrana	0	0	0
Deathless Custodians	Yasna ZakhMapZarzakh	0	0	0
Deathless Wraiths	Yasna ZakhMapZarzakh	0	0	0
Hrada-Oki Caravan	Yasna ZakhMapZarzakh	0	0	0
Satori-Horigu Epistemics	Yasna ZakhMapZarzakh	0	0	0
`;

const lines = input.split('\n').map(l => l.trim()).filter(Boolean);

/**
 * @typedef {Object} Corporation
 * @property {string} name
 * @property {string} home
 * @property {string | null} system
 * @property {number} stations
 * @property {number} systems
 * @property {number} agents
 */

/**
 * @typedef {Object} Faction
 * @property {string} faction
 * @property {Corporation[]} corporations
 */

/** @type {Faction[]} */
const factions = [];

let currentFaction = /** @type {Faction | null} */ (null);

for (const line of lines) {
  if (!line.includes('\t') && !line.startsWith('Name')) {
    const factionName = line.replace(/(.+)\1/, '$1').trim();
    currentFaction = {
      faction: factionName,
      /** @type {Corporation[]} */
      corporations: [],
    };
    factions.push(currentFaction);
    continue;
  }

  if (line.startsWith('Name')) continue;

  const cols = line.split('\t');
  if (cols.length < 5) continue;

  const [name, homeMap, stations, systems, agents] = cols;
  const match = homeMap.match(/^(.*)Map(.*)$/);
  const home = match?.[1] ?? homeMap;
  const system = match?.[2] ?? null;

  currentFaction?.corporations.push({
    name: name.trim(),
    home: home.trim(),
    system: system?.trim() ?? null,
    stations: Number(stations) || 0,
    systems: Number(systems) || 0,
    agents: Number(agents) || 0,
  });
}

/** @param {string} name  */
export function getFactionNameByCorpName(name) {
  return factions.find(f => f.corporations.some(c => c.name === name))?.faction ?? null;
}
