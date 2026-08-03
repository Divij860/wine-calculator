import React, { useEffect, useState } from "react";
import { Card, Field, NumberInput, Button } from "./UI.jsx";
import { api } from "../lib/api.js";
import * as calc from "../lib/calculations.js";

const f = calc.fmt;

export default function FermentationTab({ batchId, online }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    day: "",
    date: "",
    brix: "",
    ph: "",
    temperature: "",
    abv: "",
    note: "",
  });

  const load = async () => {
    if (!batchId) return;
    setLoading(true);
    setError("");
    try {
      setLogs(await api.getLogs(batchId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  const set = (k) => (v) => setForm((s) => ({ ...s, [k]: v }));

  const sgFromBrix = calc.brixToSG(form.brix);

  const submit = async () => {
    setError("");
    try {
      const payload = {
        day: calc.num(form.day),
        date: form.date,
        brix: calc.num(form.brix),
        sg: sgFromBrix,
        ph: calc.num(form.ph),
        temperature: calc.num(form.temperature),
        abv: calc.num(form.abv),
        note: form.note,
      };
      await api.addLog(batchId, payload);
      setForm({ day: "", date: "", brix: "", ph: "", temperature: "", abv: "", note: "" });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (logId) => {
    try {
      await api.deleteLog(batchId, logId);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!batchId) {
    return (
      <div className="rounded-xl bg-white border border-stone-200 p-8 text-center">
        <p className="text-stone-600 text-sm">
          Save this batch to the cloud first (top bar → <b>Save to cloud</b>) to start
          logging daily fermentation readings.
        </p>
        {!online && (
          <p className="text-amber-600 text-xs mt-2">
            Backend appears offline — start the API server to enable cloud features.
          </p>
        )}
      </div>
    );
  }

  const maxBrix = Math.max(1, ...logs.map((l) => l.brix || 0));

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-1">
        <Card title="Add Daily Reading" accent>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Day">
              <NumberInput value={form.day} onChange={set("day")} placeholder="9" />
            </Field>
            <Field label="Date">
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date")(e.target.value)}
                className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white
                           focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none"
              />
            </Field>
            <Field label="Brix" hint={`SG auto: ${f(sgFromBrix, 4)}`}>
              <NumberInput value={form.brix} onChange={set("brix")} placeholder="6" suffix="°Bx" />
            </Field>
            <Field label="pH">
              <NumberInput value={form.ph} onChange={set("ph")} placeholder="3.6" />
            </Field>
            <Field label="Temp">
              <NumberInput value={form.temperature} onChange={set("temperature")} placeholder="24" suffix="°C" />
            </Field>
            <Field label="ABV meter">
              <NumberInput value={form.abv} onChange={set("abv")} placeholder="8.5" suffix="%" />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Note">
              <input
                type="text"
                value={form.note}
                onChange={(e) => set("note")(e.target.value)}
                placeholder="Observations…"
                className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2 text-sm bg-white
                           focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Button variant="primary" size="md" onClick={submit}>
              + Save reading
            </Button>
          </div>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <Card title="Brix Trend" subtitle="Sugar depletion over the ferment">
          {logs.length === 0 ? (
            <p className="text-sm text-stone-400">No readings yet.</p>
          ) : (
            <div className="flex items-end gap-2 h-32 pt-2">
              {logs.map((l) => (
                <div key={l._id} className="flex-1 flex flex-col items-center justify-end">
                  <span className="text-[10px] text-stone-500 mb-1">{f(l.brix, 0)}</span>
                  <div
                    className="w-full bg-wine-600 rounded-t"
                    style={{ height: `${((l.brix || 0) / maxBrix) * 100}%`, minHeight: "2px" }}
                  />
                  <span className="text-[10px] text-stone-400 mt-1">D{l.day ?? "—"}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Reading History" subtitle={loading ? "Loading…" : `${logs.length} record(s)`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase text-stone-400 border-b border-stone-100">
                  <th className="py-2 pr-3">Day</th>
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3 text-right">Brix</th>
                  <th className="py-2 pr-3 text-right">SG</th>
                  <th className="py-2 pr-3 text-right">pH</th>
                  <th className="py-2 pr-3 text-right">°C</th>
                  <th className="py-2 pr-3 text-right">ABV</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logs.map((l) => (
                  <tr key={l._id} className="hover:bg-stone-50/60">
                    <td className="py-2 pr-3 font-medium">{l.day ?? "—"}</td>
                    <td className="py-2 pr-3 text-stone-500">{l.date || "—"}</td>
                    <td className="py-2 pr-3 text-right font-mono">{f(l.brix, 1)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{f(l.sg, 4)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{f(l.ph, 2)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{f(l.temperature, 1)}</td>
                    <td className="py-2 pr-3 text-right font-mono">{f(l.abv, 2)}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => remove(l._id)}
                        className="text-[11px] text-stone-400 hover:text-red-600"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
