import React from "react";
import { Card, Field, NumberInput, TextInput } from "./UI.jsx";
import { CONFIDENCE_TIERS } from "../lib/calculations.js";

// Parameters that require instrumental methods (AAS/ICP, GC, HPLC) — entered by hand.
const MANUAL = [
  { id: "esters",        label: "Esters (as ethyl acetate)",   unit: "mg/L",  method: "GC" },
  { id: "aldehydes",     label: "Aldehydes (as acetaldehyde)", unit: "mg/L",  method: "GC" },
  { id: "higherAlcohol", label: "Higher Alcohol (as amyl)",    unit: "mg/L",  method: "GC" },
  { id: "methanol",      label: "Methyl Alcohol",              unit: "% v/v", method: "GC" },
  { id: "arsenic",       label: "Arsenic",                     unit: "mg/L",  method: "AAS/ICP" },
  { id: "copper",        label: "Copper",                      unit: "mg/L",  method: "AAS/ICP" },
  { id: "iron",          label: "Iron",                        unit: "mg/L",  method: "AAS/ICP" },
  { id: "lead",          label: "Lead",                        unit: "mg/L",  method: "AAS/ICP" },
  { id: "cadmium",       label: "Cadmium",                     unit: "mg/L",  method: "AAS/ICP" },
  { id: "ochratoxin",    label: "Ochratoxin A",                unit: "µg/kg", method: "HPLC" },
];

export default function ManualTab({ matrix, setMatrixEntry }) {
  return (
    <div>
      <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
        These parameters cannot be derived from Brix/SG/pH — they require lab
        instruments. Enter NABL / in-house instrument results here, tag each as
        <b> Measured</b> or <b> Predicted</b>, and set a confidence level. Blank
        fields appear as <b>“No Data”</b> in the compliance matrix (never invented).
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {MANUAL.map((p) => {
          const entry = matrix[p.id] || {};
          return (
            <Card key={p.id} title={p.label} subtitle={`Typical method: ${p.method}`}>
              <div className="grid grid-cols-2 gap-3">
                <Field label={`Result (${p.unit})`}>
                  <NumberInput
                    value={entry.value ?? ""}
                    onChange={(v) => setMatrixEntry(p.id, { value: v })}
                    placeholder="—"
                  />
                </Field>
                <Field label="Data status">
                  <select
                    value={entry.dataStatus ?? "Measured"}
                    onChange={(e) => setMatrixEntry(p.id, { dataStatus: e.target.value })}
                    className="w-full mt-1 rounded-lg border border-stone-300 px-2 py-2 text-sm bg-white
                               focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none"
                  >
                    <option>Measured</option>
                    <option>Predicted</option>
                  </select>
                </Field>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3">
                <Field label="Confidence level">
                  <select
                    value={entry.confidence ?? 100}
                    onChange={(e) => setMatrixEntry(p.id, { confidence: Number(e.target.value) })}
                    className="w-full mt-1 rounded-lg border border-stone-300 px-2 py-2 text-sm bg-white
                               focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none"
                  >
                    {CONFIDENCE_TIERS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Source / method / citation">
                  <TextInput
                    value={entry.source ?? ""}
                    onChange={(v) => setMatrixEntry(p.id, { source: v })}
                    placeholder="NABL cert. no. / batch ref / paper citation"
                  />
                </Field>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
