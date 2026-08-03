import React, { useState } from "react";
import { StatusBadge, Button } from "./UI.jsx";
import { PARAMETERS } from "../lib/limits.js";
import { evaluate, num } from "../lib/calculations.js";

export default function ComplianceTab({ batch, matrix, setMatrixEntry, limits, setLimits }) {
  const [editLimits, setEditLimits] = useState(false);

  const rows = PARAMETERS.map((p) => {
    const entry = matrix[p.id] || {};
    const limit = limits[p.id] || {};
    const status = evaluate(entry.value, limit);
    return { ...p, entry, limit, status };
  });

  const limitText = (l) => {
    const lo = l.min !== null && l.min !== undefined ? l.min : null;
    const hi = l.max !== null && l.max !== undefined ? l.max : null;
    if (lo !== null && hi !== null) return `${lo} – ${hi}`;
    if (hi !== null) return `≤ ${hi}`;
    if (lo !== null) return `≥ ${lo}`;
    return "not set";
  };

  const exportCSV = () => {
    const header = [
      "Parameter",
      "Data Status",
      "Value",
      "Unit",
      "FSSAI Limit",
      "Compliance",
      "Confidence %",
      "Source",
    ];
    const lines = rows.map((r) =>
      [
        r.label,
        r.entry.dataStatus || "",
        r.entry.value ?? "",
        r.unit,
        limitText(r.limit),
        r.status,
        r.entry.confidence ?? "",
        (r.entry.source || "").replace(/,/g, ";"),
      ].join(",")
    );
    const meta = `Product,${batch.product || ""}\nBatch,${batch.lot || ""}\nDate,${new Date().toISOString().slice(0, 10)}\n\n`;
    const csv = meta + header.join(",") + "\n" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-matrix-${batch.lot || "batch"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const counts = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex flex-wrap items-center gap-3">
        <SummaryPill label="Pass" n={counts.Pass || 0} tone="emerald" />
        <SummaryPill label="At Risk" n={counts["At Risk"] || 0} tone="amber" />
        <SummaryPill label="Fail" n={counts.Fail || 0} tone="red" />
        <SummaryPill label="No Data" n={(counts["No Data"] || 0) + (counts["No Limit Set"] || 0)} tone="stone" />
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" onClick={() => setEditLimits((e) => !e)}>
            {editLimits ? "Done editing limits" : "Edit FSSAI limits"}
          </Button>
          <Button variant="primary" onClick={exportCSV}>
            ⬇ Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-wine-50 border border-wine-100 px-4 py-2.5 text-[11px] text-wine-800">
        ⚠ Default limits are starter values. Verify & lock every threshold against the
        current FSSAI (Alcoholic Beverages) Regulations gazette and IS:3752 before using
        any Pass/Fail result for a legal compliance decision.
      </div>

      {/* Matrix table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-left text-[11px] uppercase tracking-wide text-stone-500">
              <th className="px-4 py-3 font-semibold">Parameter</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3 font-semibold text-right">Value</th>
              <th className="px-3 py-3 font-semibold">FSSAI Limit</th>
              <th className="px-3 py-3 font-semibold">Compliance</th>
              <th className="px-3 py-3 font-semibold text-right">Conf.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50/60">
                <td className="px-4 py-2.5">
                  <div className="font-medium text-stone-800">{r.label}</div>
                  <div className="text-[11px] text-stone-400">{r.note}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={`text-[11px] font-medium ${
                      r.entry.dataStatus === "Measured"
                        ? "text-emerald-600"
                        : r.entry.dataStatus === "Predicted"
                        ? "text-amber-600"
                        : "text-stone-400"
                    }`}
                  >
                    {r.entry.dataStatus || "—"}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums text-stone-800">
                  {r.entry.value !== undefined && r.entry.value !== "" ? (
                    <>
                      {r.entry.value}
                      <span className="text-stone-400 text-xs ml-1">{r.unit}</span>
                    </>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  {editLimits ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={r.limit.min ?? ""}
                        placeholder="min"
                        onChange={(e) =>
                          setLimits({
                            ...limits,
                            [r.id]: { ...r.limit, min: num(e.target.value) },
                          })
                        }
                        className="w-16 rounded border border-stone-300 px-1.5 py-1 text-xs"
                      />
                      <span className="text-stone-300">–</span>
                      <input
                        type="number"
                        value={r.limit.max ?? ""}
                        placeholder="max"
                        onChange={(e) =>
                          setLimits({
                            ...limits,
                            [r.id]: { ...r.limit, max: num(e.target.value) },
                          })
                        }
                        className="w-16 rounded border border-stone-300 px-1.5 py-1 text-xs"
                      />
                    </div>
                  ) : (
                    <span className="text-stone-600 font-mono text-xs">
                      {limitText(r.limit)} <span className="text-stone-400">{r.unit}</span>
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-xs text-stone-600">
                  {r.entry.confidence !== undefined && r.entry.value ? `${r.entry.confidence}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryPill({ label, n, tone }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
    stone: "bg-stone-50 text-stone-500 border-stone-200",
  };
  return (
    <div className={`rounded-lg border px-3 py-1.5 ${tones[tone]}`}>
      <span className="text-lg font-bold tabular-nums">{n}</span>
      <span className="text-xs ml-1.5">{label}</span>
    </div>
  );
}
