// ============================================================================
//  DEFAULT REGULATORY LIMITS  (EDITABLE IN-APP)
//
//  ⚠ IMPORTANT: These are STARTER defaults only. Some cells are intentionally
//  left blank (null) where a single universal FSSAI number should NOT be
//  assumed for fruit wine. VERIFY & LOCK every limit against the current
//  FSSAI (Alcoholic Beverages) Regulations gazette + IS:3752 before you use
//  any Pass/Fail result for a legal compliance decision. The app lets you
//  edit every limit on the Compliance tab.
// ============================================================================

export const PARAMETERS = [
  { id: "ethylAlcohol",    label: "Ethyl Alcohol Content",            unit: "% v/v",  min: 8,    max: 15,   note: "Depends on declared wine style/category." },
  { id: "totalSugar",      label: "Total Sugar Content",              unit: "g/L",    min: null, max: null, note: "Dry vs sweet — set per product declaration." },
  { id: "residualExtract", label: "Residual Extract",                 unit: "g/L",    min: null, max: null, note: "Set minimum per IS:3752 category." },
  { id: "volatileAcid",    label: "Volatile Acid (as acetic acid)",   unit: "g/L",    min: null, max: 1.5,  note: "Common wine ceiling ~1.5 g/L — verify." },
  { id: "totalAcid",       label: "Total Acids (as tartaric acid)",   unit: "g/L",    min: null, max: null, note: "Typical range 4–9 g/L — set target band." },
  { id: "esters",          label: "Esters (as ethyl acetate)",        unit: "mg/L",   min: null, max: null, note: "Requires GC — set limit per spec." },
  { id: "aldehydes",       label: "Aldehydes (as acetaldehyde)",      unit: "mg/L",   min: null, max: null, note: "Requires GC — set limit per spec." },
  { id: "arsenic",         label: "Arsenic",                          unit: "mg/L",   min: null, max: 0.2,  note: "Common contaminant ceiling — verify." },
  { id: "copper",          label: "Copper",                           unit: "mg/L",   min: null, max: 5,    note: "Verify against current contaminant regs." },
  { id: "iron",            label: "Iron",                             unit: "mg/L",   min: null, max: null, note: "Set per spec/IS:3752." },
  { id: "lead",            label: "Lead",                             unit: "mg/L",   min: null, max: 0.2,  note: "Heavy-metal ceiling — verify." },
  { id: "higherAlcohol",   label: "Higher Alcohol (as amyl alcohol)", unit: "mg/L",   min: null, max: null, note: "Requires GC — set limit per spec." },
  { id: "methanol",        label: "Methyl Alcohol",                   unit: "% v/v",  min: null, max: null, note: "Fruit wines run higher (pectin) — verify limit." },
  { id: "cadmium",         label: "Cadmium",                          unit: "mg/L",   min: null, max: 1.5,  note: "Heavy-metal ceiling — verify." },
  { id: "ochratoxin",      label: "Ochratoxin A",                     unit: "µg/kg",  min: null, max: 2,    note: "Mycotoxin ceiling — verify (HPLC)." },
  { id: "totalSO2",        label: "Total SO₂",                        unit: "mg/L",   min: null, max: 200,  note: "Common wine ceiling ~200 mg/L — verify." },
];

/** Build the initial editable-limits object keyed by parameter id. */
export function buildDefaultLimits() {
  const out = {};
  for (const p of PARAMETERS) out[p.id] = { min: p.min, max: p.max };
  return out;
}
