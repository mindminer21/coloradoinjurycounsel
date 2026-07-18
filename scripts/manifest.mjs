// Generates docs/05-page-manifest.csv + content/briefs/*.json
// 100 keywords selected by opportunity = commercial value × demand / difficulty
// Clusters ensure structural diversity (anti-doorway): geo, case-type, value-calc, injury, law-context, mountain
import fs from 'fs'; import path from 'path';

const rows = [
// [slug, keyword, cluster, intent, demand(1-10), difficulty(1-10), value(1-10), angle]
// ——— A. Denver metro case-type (highest commercial density) ———
["denver-car-accident-lawyer","denver car accident lawyer","geo-casetype","hire",10,9,10,"I-25/I-70 corridor crash dynamics; Denver County court context; insurer tactics after metro crashes"],
["denver-personal-injury-lawyer","denver personal injury lawyer","geo-casetype","hire",9,9,10,"full-spectrum PI triage in Denver; when a case justifies counsel; Whiteford platform depth"],
["denver-truck-accident-lawyer","denver truck accident lawyer","geo-casetype","hire",7,8,10,"commercial carriers on I-70/I-76; federal motor carrier rules; evidence preservation letters"],
["denver-motorcycle-accident-lawyer","denver motorcycle accident lawyer","geo-casetype","hire",6,7,9,"bias against riders; helmet law nuance (CO adults not required); lane visibility crashes on Federal/Colfax"],
["denver-pedestrian-accident-lawyer","denver pedestrian accident lawyer","geo-casetype","hire",5,6,9,"Vision Zero context; crosswalk right-of-way; hit-rate on Colfax/Federal corridors"],
["denver-bicycle-accident-lawyer","denver bicycle accident attorney","geo-casetype","hire",5,6,9,"bike-lane network growth; dooring; 3-foot passing law CRS 42-4-1003"],
["denver-wrongful-death-attorney","denver wrongful death attorney","geo-casetype","hire",5,7,10,"who may file under CO wrongful death act incl. 2025 sibling expansion; $2.125M cap context"],
["denver-slip-and-fall-lawyer","denver slip and fall lawyer","geo-casetype","hire",5,6,8,"CO Premises Liability Act framework; invitee/licensee/trespasser; winter ice cases"],
["denver-dog-bite-lawyer","denver dog bite lawyer","geo-casetype","hire",4,5,8,"CO strict liability dog bite statute for serious bodily injury; economic vs noneconomic recovery"],
["denver-uber-lyft-accident-lawyer","uber accident lawyer denver","geo-casetype","hire",4,5,9,"rideshare insurance periods (app off/on/en route); $1M policy layers"],
["denver-drunk-driving-victim-lawyer","denver drunk driving accident victim lawyer","geo-casetype","hire",4,5,9,"DUI victim claims; punitive damages availability; dram shop limits in CO"],
["denver-hit-and-run-lawyer","denver hit and run accident lawyer","geo-casetype","hire",4,5,8,"UM coverage as lifeline; Medina alerts; police report timelines"],
["denver-catastrophic-injury-lawyer","denver catastrophic injury lawyer","geo-casetype","hire",3,6,10,"life-care planning; economic damages uncapped; coordination with specialists"],
["denver-brain-injury-lawyer","denver brain injury lawyer","geo-casetype","hire",4,6,10,"TBI proof problems; imaging vs symptoms; neuropsych evaluations"],
["denver-spinal-cord-injury-lawyer","denver spinal cord injury attorney","geo-casetype","hire",3,6,10,"lifetime cost modeling; Craig Hospital proximity; uncapped economic losses"],
["denver-construction-accident-lawyer","denver construction accident lawyer","geo-casetype","hire",3,5,9,"third-party claims beyond workers comp; site safety rules; scaffolding/equipment defendants"],
["denver-premises-liability-lawyer","denver premises liability attorney","geo-casetype","hire",3,5,8,"CPLA deep-dive; negligent security; landlord duties"],
["denver-bus-accident-lawyer","denver bus accident lawyer","geo-casetype","hire",3,4,8,"RTD claims + CGIA notice deadlines (182 days); private carriers"],
["denver-rear-end-accident-lawyer","rear end collision lawyer denver","geo-casetype","hire",3,4,8,"presumption dynamics; whiplash proof; low-property-damage myth"],
["denver-uninsured-motorist-lawyer","uninsured motorist claim lawyer denver","geo-casetype","hire",3,4,9,"UM/UIM stacking rules; bad-faith setup; CO mandatory offer of UM"],
// ——— B. Statewide Colorado case-type ———
["colorado-car-accident-lawyer","colorado car accident lawyer","state-casetype","hire",9,8,10,"statewide venue differences; 3-yr motor vehicle SOL vs 2-yr general; comparative negligence 50% bar"],
["colorado-personal-injury-lawyer","colorado personal injury attorney","state-casetype","hire",8,8,10,"what changed in 2025 (caps); choosing counsel; contingency basics"],
["colorado-truck-accident-lawyer","colorado truck accident lawyer","state-casetype","hire",6,7,10,"mountain grades + runaway ramps; chain law violations; broker/shipper liability"],
["colorado-motorcycle-accident-lawyer","colorado motorcycle accident lawyer","state-casetype","hire",5,6,9,"canyon rides; gravel/road-condition claims vs govt immunity notice"],
["colorado-wrongful-death-lawyer","colorado wrongful death lawyer","state-casetype","hire",5,7,10,"two-year window structure; heir priority year one/two; caps + felonious killing exception"],
["colorado-semi-truck-accident-lawyer","semi truck accident lawyer colorado","state-casetype","hire",4,6,10,"ELD/black box data; I-70 mountain corridor wrecks; spoliation letters day one"],
["colorado-dog-bite-lawyer","colorado dog bite law attorney","state-casetype","hire",4,5,8,"CRS 13-21-124 strict liability scope; one-bite vs negligence routes"],
["colorado-slip-and-fall-lawyer","colorado slip and fall attorney","state-casetype","hire",4,5,8,"CPLA as exclusive remedy; ski-town sidewalk ice; notice of dangerous condition"],
["colorado-pedestrian-accident-lawyer","colorado pedestrian accident attorney","state-casetype","hire",4,5,9,"rural highway fatalities; crosswalk statutes; insurance layers"],
["colorado-bicycle-accident-lawyer","colorado bicycle accident lawyer","state-casetype","hire",3,5,8,"CDOT bike routes; Safety Stop law (2022); mountain-road descents"],
["colorado-rideshare-accident-lawyer","rideshare accident lawyer colorado","state-casetype","hire",3,4,9,"TNC statute insurance tiers; claims vs both apps and drivers"],
["colorado-catastrophic-injury-lawyer","catastrophic injury lawyer colorado","state-casetype","hire",3,6,10,"uncapped economic damages; structured settlements; team approach"],
["colorado-burn-injury-lawyer","burn injury lawyer colorado","state-casetype","hire",2,4,9,"product + premises origins; scarring as noneconomic driver; life-care costs"],
["colorado-nursing-home-abuse-lawyer","colorado nursing home abuse lawyer","state-casetype","hire",3,5,9,"neglect signs; arbitration clause pushback; survival vs wrongful death claims"],
["colorado-product-liability-lawyer","colorado product liability lawyer","state-casetype","hire",2,5,9,"strict liability elements; auto-defect crossover; preservation of the product"],
["colorado-e-scooter-accident-lawyer","e-scooter accident lawyer colorado","state-casetype","hire",2,3,7,"scooter-share T&Cs; helmet factors; sidewalk rules by city"],
["colorado-hit-and-run-victim-lawyer","hit and run victim compensation colorado","state-casetype","hire",3,4,8,"UM claims; crime victim compensation program interplay"],
["colorado-distracted-driving-lawyer","distracted driving accident lawyer colorado","state-casetype","hire",2,4,8,"2025 hands-free law leverage; phone records discovery"],
["colorado-icy-road-accident-lawyer","icy road accident lawyer colorado","state-casetype","hire",2,3,8,"weather ≠ automatic defense; speed-for-conditions statute; chain/traction laws"],
["colorado-t-bone-accident-lawyer","t-bone accident lawyer colorado","state-casetype","hire",2,3,8,"intersection fault proof; signal-timing evidence; side-impact injury severity"],
["colorado-rollover-accident-lawyer","rollover accident attorney colorado","state-casetype","hire",2,3,9,"SUV stability; roof-crush defect angle; mountain shoulder drop-offs"],
["colorado-work-injury-third-party-lawyer","third party work injury lawyer colorado","state-casetype","hire",2,4,9,"beyond workers comp: subcontractors, drivers, equipment makers; comp lien handling"],
["colorado-oilfield-accident-lawyer","oilfield injury lawyer colorado","state-casetype","hire",2,3,9,"Weld County energy corridor; contractor webs; OSHA evidence"],
["colorado-amputation-injury-lawyer","amputation injury lawyer colorado","state-casetype","hire",1,3,10,"prosthetic lifetime costs; vocational loss; catastrophic band"],
["colorado-whiplash-injury-lawyer","whiplash injury claim colorado","state-casetype","hire",3,4,7,"soft-tissue skepticism; treatment gaps; documentation playbook"],
// ——— C. Other Colorado metros ———
["colorado-springs-car-accident-lawyer","colorado springs car accident lawyer","metro","hire",7,7,10,"I-25 Gap history; military family considerations (SCRA); El Paso County courts"],
["colorado-springs-personal-injury-lawyer","colorado springs personal injury lawyer","metro","hire",6,7,10,"Springs growth = crash growth; local venue notes"],
["colorado-springs-motorcycle-accident-lawyer","motorcycle accident lawyer colorado springs","metro","hire",3,5,9,"front-range canyon rides; military rider community"],
["aurora-car-accident-lawyer","aurora car accident lawyer","metro","hire",5,6,9,"Colfax/225 corridors; Arapahoe & Adams county split venue"],
["aurora-personal-injury-lawyer","aurora personal injury lawyer","metro","hire",4,6,9,"diverse community access; interpreter-friendly process"],
["fort-collins-car-accident-lawyer","fort collins car accident lawyer","metro","hire",4,5,9,"I-25 north corridor; CSU student drivers; Larimer county"],
["fort-collins-personal-injury-lawyer","fort collins personal injury lawyer","metro","hire",3,5,9,"NoCo growth; bike-heavy city crash mix"],
["boulder-personal-injury-lawyer","boulder personal injury lawyer","metro","hire",4,6,9,"cyclist capital; open-space trail incidents; Boulder county juries"],
["boulder-bicycle-accident-lawyer","boulder bicycle accident lawyer","metro","hire",3,4,9,"US-36 bikeway; peloton crashes; door-zone cases"],
["lakewood-car-accident-lawyer","lakewood car accident lawyer","metro","hire",3,4,8,"6th Ave/Colfax corridors; Jeffco courts"],
["pueblo-car-accident-lawyer","pueblo car accident lawyer","metro","hire",3,4,8,"I-25 south; steel-city workforce injuries"],
["pueblo-personal-injury-lawyer","pueblo personal injury lawyer","metro","hire",2,4,8,"Pueblo county jury landscape; access to Front Range specialists"],
["grand-junction-car-accident-lawyer","grand junction car accident lawyer","metro","hire",3,4,8,"I-70 western slope; Mesa county; rural EMS transport times"],
["grand-junction-personal-injury-lawyer","grand junction personal injury lawyer","metro","hire",2,4,8,"western slope venue; energy + ag work injury crossover"],
["greeley-car-accident-lawyer","greeley car accident lawyer","metro","hire",3,4,8,"US-85 truck traffic; Weld county oil corridor"],
["longmont-car-accident-lawyer","longmont car accident lawyer","metro","hire",2,3,8,"Diagonal Highway; Boulder county filings"],
["thornton-car-accident-lawyer","thornton car accident lawyer","metro","hire",2,3,8,"I-25 north metro; Adams county"],
["westminster-car-accident-lawyer","westminster car accident lawyer","metro","hire",2,3,8,"US-36 corridor; mixed Jeffco/Adams venue"],
["arvada-car-accident-lawyer","arvada car accident lawyer","metro","hire",2,3,8,"Wadsworth corridor; Jeffco"],
["castle-rock-car-accident-lawyer","castle rock car accident lawyer","metro","hire",2,3,8,"I-25 Douglas county; commuter crash patterns"],
// ——— D. Mountain / ski ———
["colorado-ski-accident-lawyer","colorado ski accident lawyer","mountain","hire",4,5,9,"Ski Safety Act duties + inherent risk limits; collision vs avalanche vs lift claims"],
["vail-ski-accident-lawyer","vail ski accident lawyer","mountain","hire",2,4,9,"Eagle county; resort waiver limits; skier collision fault rules"],
["breckenridge-ski-accident-lawyer","breckenridge ski accident lawyer","mountain","hire",2,3,9,"Summit county; terrain-park injuries; season-pass waivers"],
["colorado-snowboard-accident-lawyer","snowboard accident lawyer colorado","mountain","hire",1,3,8,"park features; uphill-downhill right of way"],
["colorado-ski-lift-accident-lawyer","ski lift accident lawyer colorado","mountain","hire",1,3,9,"common-carrier-like duties; Tramway Board; loading/unloading claims"],
["i-70-mountain-corridor-accident-lawyer","i-70 accident lawyer colorado","mountain","hire",2,3,9,"Eisenhower–Floyd Hill; chain law; runaway trucks; multi-car pileups"],
["colorado-snowmobile-accident-lawyer","snowmobile accident lawyer colorado","mountain","hire",1,2,8,"backcountry outfitter waivers; trail right-of-way"],
["aspen-injury-lawyer","aspen personal injury lawyer","mountain","hire",1,3,9,"Pitkin county; resort + short-term-rental premises claims"],
// ——— E. Case-value / calculator (estimator feeders) ———
["car-accident-settlement-calculator-colorado","car accident settlement calculator colorado","value","tool",5,4,10,"how ranges actually form; why calculators mislead; interactive estimator as honest alternative"],
["what-is-my-case-worth-colorado","what is my personal injury case worth colorado","value","tool",4,4,10,"drivers of value; economic vs noneconomic; role of the 2025 caps"],
["average-car-accident-settlement-colorado","average car accident settlement colorado","value","tool",5,5,9,"why averages deceive; ranges by severity band; timing of offers"],
["colorado-pain-and-suffering-calculator","pain and suffering calculator colorado","value","tool",3,4,9,"multiplier vs per-diem methods; $1.5M cap context; proof that moves the number"],
["average-truck-accident-settlement-colorado","average semi truck accident settlement colorado","value","tool",2,3,10,"policy-limit realities; layered coverage; catastrophic bands"],
["average-motorcycle-accident-settlement-colorado","average motorcycle accident settlement colorado","value","tool",2,3,9,"bias discount problem; gear/injury documentation"],
["whiplash-settlement-amount-colorado","whiplash settlement amounts colorado","value","tool",3,4,8,"soft-tissue ranges; treatment-gap traps; MMI timing"],
["herniated-disc-settlement-colorado","herniated disc settlement colorado","value","tool",2,3,9,"imaging + injections + surgery tiers; preexisting-condition defense"],
["broken-bone-settlement-colorado","broken bone accident settlement colorado","value","tool",2,3,8,"fracture classes; hardware; healing complications"],
["tbi-settlement-value-colorado","tbi settlement value colorado","value","tool",2,4,10,"mild vs severe TBI valuation; lifetime cognitive care"],
["wrongful-death-settlement-colorado","average wrongful death settlement colorado","value","tool",2,4,10,"2025 cap $2.125M context; who recovers; solatium option"],
["slip-and-fall-settlement-colorado","slip and fall settlement amounts colorado","value","tool",2,3,8,"premises act limits; comparative fault haircuts"],
["dog-bite-settlement-colorado","dog bite settlement colorado","value","tool",2,3,8,"strict-liability economic recovery; scarring value"],
["car-accident-claim-timeline-colorado","how long does a car accident settlement take in colorado","value","tool",3,3,8,"phases with realistic clocks; when patience adds value"],
["should-i-accept-first-settlement-offer-colorado","should i accept the first settlement offer colorado","value","tool",2,3,9,"insurer playbook; release finality; counter strategy"],
// ——— F. Law-context money terms ———
["colorado-personal-injury-laws-2025","new colorado personal injury laws 2025","law","research",3,4,8,"HB24-1472 explained from primary sources; what it means for claim value"],
["colorado-noneconomic-damages-cap","colorado noneconomic damages cap 1.5 million","law","research",2,3,8,"cap mechanics; filed-date trigger; inflation adjustments from 2028"],
["colorado-statute-of-limitations-car-accident","colorado car accident statute of limitations","law","research",4,4,8,"3-yr motor vehicle vs 2-yr general; discovery rule; minors tolling; CGIA 182-day trap"],
["colorado-comparative-negligence","colorado comparative negligence 50 percent rule","law","research",2,3,8,"modified comparative bar; adjuster fault-shifting tactics"],
["colorado-wrongful-death-statute","colorado wrongful death statute who can sue","law","research",2,4,9,"CRS 13-21-201 order of heirs; 2025 sibling addition; caps + exceptions"],
["colorado-car-insurance-minimums","colorado minimum car insurance and injury claims","law","research",3,3,8,"25/50/15 limits; why UM/UIM matters; MedPay $5k default offer"],
["colorado-dram-shop-law","colorado dram shop law bar liability","law","research",1,3,8,"willfully serving visibly intoxicated; $150k-ish cap context (verify current); notice"],
["colorado-governmental-immunity-injury-claims","suing the government for injury colorado CGIA","law","research",1,3,8,"182-day notice; waived immunity categories; damage caps vs private claims"],
// remaining high-intent fill to 100
["denver-taxi-delivery-accident-lawyer","delivery truck accident lawyer denver","geo-casetype","hire",2,3,9,"Amazon/FedEx contractor webs; app-based driver coverage gaps"],
["colorado-train-accident-lawyer","train accident lawyer colorado","state-casetype","hire",1,3,9,"FELA vs passenger claims; crossing design; light-rail (RTD) notice"],
["colorado-atv-accident-lawyer","atv accident lawyer colorado","mountain","hire",1,2,8,"OHV trail rules; rental waivers; rollover engineering"],
["colorado-daycare-injury-lawyer","daycare injury lawyer colorado","state-casetype","hire",1,3,9,"licensing standards; supervision ratios; reporting duties"],
];

if (rows.length !== 100) { console.error(`ROW COUNT ${rows.length} != 100`); process.exit(1); }
const slugs = new Set(rows.map(r=>r[0])); if (slugs.size!==100){console.error("dup slugs");process.exit(1);}

const csv = ["slug,keyword,cluster,intent,demand,difficulty,value,opportunity,status,angle"];
const briefs = [];
for (const [slug,kw,cluster,intent,d,kd,v,angle] of rows) {
  const opp = Math.round((v*d/kd)*10)/10;
  csv.push([slug,`"${kw}"`,cluster,intent,d,kd,v,opp,"planned",`"${angle.replace(/"/g,"'")}"`].join(","));
  briefs.push({slug,keyword:kw,cluster,intent,demand:d,difficulty:kd,value:v,opportunity:opp,angle});
}
fs.mkdirSync(path.join(import.meta.dirname,"../docs"),{recursive:true});
fs.mkdirSync(path.join(import.meta.dirname,"../content/briefs"),{recursive:true});
fs.writeFileSync(path.join(import.meta.dirname,"../docs/05-page-manifest.csv"), csv.join("\n"));
fs.writeFileSync(path.join(import.meta.dirname,"../content/briefs/all-briefs.json"), JSON.stringify(briefs,null,1));
console.log("manifest written:", briefs.length, "pages; clusters:", [...new Set(briefs.map(b=>b.cluster))].join(","));
