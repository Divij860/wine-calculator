import React from "react";
import { Card, Field, TextInput } from "./UI.jsx";

export default function BatchTab({ batch, setBatch }) {
  const set = (k) => (v) => setBatch({ ...batch, [k]: v });
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Batch Identity" accent>
        <div className="space-y-3">
          <Field label="Product / Wine Name">
            <TextInput value={batch.product} onChange={set("product")} placeholder="Carrot Wine — Batch CW-001" />
          </Field>
          <Field label="Fruit / Vegetable Type">
            <TextInput value={batch.fruit} onChange={set("fruit")} placeholder="Carrot (Daucus carota)" />
          </Field>
          <Field label="Batch / Lot No.">
            <TextInput value={batch.lot} onChange={set("lot")} placeholder="CW-2026-001" />
          </Field>
        </div>
      </Card>

      <Card title="Fermentation Timeline" accent>
        <div className="space-y-3">
          <Field label="Fermentation Start Date">
            <TextInput value={batch.startDate} onChange={set("startDate")} placeholder="2026-07-01" />
          </Field>
          <Field label="Current Day of Fermentation">
            <TextInput value={batch.day} onChange={set("day")} placeholder="e.g. 9" />
          </Field>
          <Field label="Analyst / QC Officer">
            <TextInput value={batch.analyst} onChange={set("analyst")} placeholder="Your name" />
          </Field>
        </div>
      </Card>

      <div className="md:col-span-2">
        <Card title="Notes & Observations">
          <textarea
            value={batch.notes}
            onChange={(e) => set("notes")(e.target.value)}
            placeholder="Yeast strain, nutrient additions, temperature control, sensory notes, NABL certificate refs…"
            rows={4}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800
                       focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none bg-white
                       placeholder:text-stone-300"
          />
        </Card>
      </div>
    </div>
  );
}
