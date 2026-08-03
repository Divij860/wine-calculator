// ============================================================================
//  FRUIT WINE ANALYTICAL CALCULATION ENGINE
//  All functions are PURE. Add new calculations here — the UI just imports them.
//  References: OIV Compendium of methods, IS:3752, standard enology texts.
// ============================================================================

/** Safe number parse: returns null for empty / invalid input. */
export function num(x) {
  if (x === "" || x === null || x === undefined) return null;
  const n = parseFloat(x);
  return Number.isNaN(n) ? null : n;
}

/** Format a number for display. Returns "—" when null. */
export function fmt(x, digits = 2) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  return Number(x).toFixed(digits);
}

// ---------------------------------------------------------------------------
//  1. BRIX  <->  SPECIFIC GRAVITY
// ---------------------------------------------------------------------------

/** Degrees Brix -> Specific Gravity (20°C reference). */
export function brixToSG(brix) {
  const b = num(brix);
  if (b === null) return null;
  return 1 + b / (258.6 - (b / 258.2) * 227.1);
}

/** Specific Gravity -> Degrees Brix (standard cubic approximation). */
export function sgToBrix(sg) {
  const s = num(sg);
  if (s === null) return null;
  return ((182.4601 * s - 775.6821) * s + 1262.7794) * s - 669.5622;
}

// ---------------------------------------------------------------------------
//  2. HYDROMETER TEMPERATURE CORRECTION
//     Inputs in °C; the canonical polynomial works in °F, converted internally.
// ---------------------------------------------------------------------------

export function hydrometerTempCorrection(measuredSG, sampleTempC, calibTempC = 20) {
  const sg = num(measuredSG);
  const t = num(sampleTempC);
  const c = num(calibTempC);
  if (sg === null || t === null || c === null) return null;
  const cToF = (x) => (x * 9) / 5 + 32;
  const poly = (f) =>
    1.00130346 -
    0.000134722124 * f +
    0.00000204052596 * f * f -
    0.00000000232820948 * f * f * f;
  return sg * (poly(cToF(t)) / poly(cToF(c)));
}

// ---------------------------------------------------------------------------
//  3. ALCOHOL BY VOLUME (ABV)
// ---------------------------------------------------------------------------

/** Simple linear estimate: (OG − FG) × 131.25 */
export function abvSimple(og, fg) {
  const o = num(og);
  const f = num(fg);
  if (o === null || f === null) return null;
  return (o - f) * 131.25;
}

/** More accurate (non-linear) estimate for higher-gravity musts. */
export function abvAccurate(og, fg) {
  const o = num(og);
  const f = num(fg);
  if (o === null || f === null || 1.775 - o === 0) return null;
  return ((76.08 * (o - f)) / (1.775 - o)) * (f / 0.794);
}

/** Potential / expected ABV from a Brix drop. factor: 0.55–0.60 typical. */
export function potentialABVfromBrix(startBrix, endBrix, factor = 0.575) {
  const s = num(startBrix);
  const e = num(endBrix);
  const fac = num(factor);
  if (s === null || e === null || fac === null) return null;
  return (s - e) * fac;
}

// ---------------------------------------------------------------------------
//  4. STOICHIOMETRIC CROSS-CHECK  (ΔBrix vs measured ABV)
//     Flags "Data Inconsistency" when variance > 10%.
// ---------------------------------------------------------------------------

export function stoichCheck(
  startBrix,
  endBrix,
  measuredABV,
  factorLow = 0.55,
  factorHigh = 0.6
) {
  const s = num(startBrix);
  const e = num(endBrix);
  const m = num(measuredABV);
  if (s === null || e === null || m === null) return null;
  const dBrix = s - e;
  const mid = dBrix * ((factorLow + factorHigh) / 2);
  const variance = mid === 0 ? null : (Math.abs(m - mid) / mid) * 100;
  return {
    deltaBrix: dBrix,
    expectedLow: dBrix * factorLow,
    expectedHigh: dBrix * factorHigh,
    expectedMid: mid,
    measuredABV: m,
    variancePct: variance,
    flag: variance !== null && variance > 10 ? "DATA INCONSISTENCY" : "CONSISTENT",
  };
}

/** Apparent attenuation (% of sugar fermented). */
export function apparentAttenuation(og, fg) {
  const o = num(og);
  const f = num(fg);
  if (o === null || f === null || o - 1 === 0) return null;
  return ((o - f) / (o - 1)) * 100;
}

// ---------------------------------------------------------------------------
//  5. SUGAR & EXTRACT
//     Brix is g sucrose / 100 g solution -> g/L via density (SG ≈ g/mL).
// ---------------------------------------------------------------------------

export function sugarGperL(brix, sg) {
  const b = num(brix);
  if (b === null) return null;
  const density = num(sg) ?? brixToSG(b);
  if (density === null) return null;
  return b * density * 10;
}

/** Residual extract estimate from final (apparent) Brix. Rough proxy. */
export function residualExtract(finalBrix, finalSG) {
  const b = num(finalBrix);
  if (b === null) return null;
  const density = num(finalSG) ?? brixToSG(b);
  if (density === null) return null;
  return b * density * 10;
}

// ---------------------------------------------------------------------------
//  6. TITRATION CALCULATIONS
//     Generic acid:  g/L = (V_titrant × N × EqWt) / V_sample(mL)
//     Tartaric EqWt = 75 (MW 150, diprotic)
//     Acetic  EqWt = 60 (MW 60,  monoprotic)
// ---------------------------------------------------------------------------

export function totalAcidityTartaric(vNaOH, nNaOH, sampleMl) {
  const v = num(vNaOH);
  const n = num(nNaOH);
  const s = num(sampleMl);
  if (v === null || n === null || s === null || s === 0) return null;
  return (v * n * 75) / s;
}

export function volatileAcidityAcetic(vNaOH, nNaOH, sampleMl) {
  const v = num(vNaOH);
  const n = num(nNaOH);
  const s = num(sampleMl);
  if (v === null || n === null || s === null || s === 0) return null;
  return (v * n * 60) / s;
}

/** Total SO₂ (mg/L) — Ripper iodometric titration. SO₂ EqWt = 32. */
export function totalSO2(vIodine, nIodine, sampleMl) {
  const v = num(vIodine);
  const n = num(nIodine);
  const s = num(sampleMl);
  if (v === null || n === null || s === null || s === 0) return null;
  return (v * n * 32 * 1000) / s;
}

/** Generic titratable-acid helper for any acid (supply equivalent weight). */
export function acidByTitration(vTitrant, normality, sampleMl, eqWeight) {
  const v = num(vTitrant);
  const n = num(normality);
  const s = num(sampleMl);
  const eq = num(eqWeight);
  if (v === null || n === null || s === null || s === 0 || eq === null) return null;
  return (v * n * eq) / s;
}

// ---------------------------------------------------------------------------
//  7. COMPLIANCE EVALUATOR
//     Returns Pass / Fail / At Risk / No Data against a {min,max} limit.
//     "At Risk" = within 10% of a boundary (early-warning buffer).
// ---------------------------------------------------------------------------

export function evaluate(value, limit = {}) {
  const v = num(value);
  const { min, max } = limit;
  if (v === null) return "No Data";
  if (min !== null && min !== undefined && v < min) return "Fail";
  if (max !== null && max !== undefined && v > max) return "Fail";
  if (max !== null && max !== undefined && v > max * 0.9) return "At Risk";
  if (min !== null && min !== undefined && v < min * 1.1) return "At Risk";
  if ((min === null || min === undefined) && (max === null || max === undefined))
    return "No Limit Set";
  return "Pass";
}

// ---------------------------------------------------------------------------
//  8. CONFIDENCE RUBRIC (from the analysis protocol)
// ---------------------------------------------------------------------------

export const CONFIDENCE_TIERS = [
  { label: "90%+ — Identical matrix, ≥5 historical batches", value: 90 },
  { label: "70–89% — Comparable fruit family, 3–4 data points", value: 80 },
  { label: "50–69% — Generalized published research only", value: 60 },
  { label: "≤50% — Fewer than 2 supporting data points", value: 50 },
  { label: "Measured — Lab confirmed (100%)", value: 100 },
];
