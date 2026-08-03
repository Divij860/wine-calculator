import React, { useState, useEffect, useCallback } from "react";
import BatchTab from "./components/BatchTab.jsx";
import GravityTab from "./components/GravityTab.jsx";
import TitrationTab from "./components/TitrationTab.jsx";
import ManualTab from "./components/ManualTab.jsx";
import ComplianceTab from "./components/ComplianceTab.jsx";
import FermentationTab from "./components/FermentationTab.jsx";
import { buildDefaultLimits } from "./lib/limits.js";
import { api } from "./lib/api.js";

const TABS = [
  { id: "batch", label: "Batch Info" },
  { id: "ferment", label: "Fermentation Log" },
  { id: "gravity", label: "Gravity & Alcohol" },
  { id: "titration", label: "Titration Lab" },
  { id: "manual", label: "Instrument Values" },
  { id: "compliance", label: "Compliance Matrix" },
];

const STORAGE_KEY = "fruit-wine-analyzer-v2";
const emptyBatch = {
  product: "",
  fruit: "Carrot (Daucus carota)",
  lot: "",
  startDate: "",
  day: "",
  analyst: "",
  notes: "",
};

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return null;
}

export default function App() {
  const saved = loadLocal();
  const [tab, setTab] = useState("batch");
  const [batch, setBatch] = useState(saved?.batch || emptyBatch);
  const [matrix, setMatrix] = useState(saved?.matrix || {});
  const [limits, setLimits] = useState(saved?.limits || buildDefaultLimits());

  const [batchId, setBatchId] = useState(saved?.batchId || null);
  const [batches, setBatches] = useState([]);
  const [online, setOnline] = useState(false);
  const [status, setStatus] = useState("");

  // Local autosave (offline safety net).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ batch, matrix, limits, batchId }));
    } catch (e) {
      /* ignore */
    }
  }, [batch, matrix, limits, batchId]);

  const refreshBatches = useCallback(async () => {
    try {
      const list = await api.listBatches();
      setBatches(list);
      setOnline(true);
    } catch (e) {
      setOnline(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await api.health();
        setOnline(true);
        refreshBatches();
      } catch (e) {
        setOnline(false);
      }
    })();
  }, [refreshBatches]);

  const setMatrixEntry = (id, patch) =>
    setMatrix((m) => ({ ...m, [id]: { ...(m[id] || {}), ...patch } }));

  const pushToMatrix = (id, entry) => {
    setMatrixEntry(id, entry);
    setTab("compliance");
  };

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 3000);
  };

  const saveToCloud = async () => {
    if (!batch.product) return flash("⚠ Add a product name first.");
    try {
      const payload = { ...batch, matrix, limits };
      const doc = batchId
        ? await api.updateBatch(batchId, payload)
        : await api.createBatch(payload);
      setBatchId(doc._id);
      await refreshBatches();
      flash("✅ Saved to cloud.");
    } catch (e) {
      flash(`❌ ${e.message}`);
    }
  };

  const loadFromCloud = async (id) => {
    if (!id) return;
    try {
      const doc = await api.getBatch(id);
      const { _id, matrix: m, limits: l, createdAt, updatedAt, __v, ...info } = doc;
      setBatch({ ...emptyBatch, ...info });
      setMatrix(m || {});
      setLimits({ ...buildDefaultLimits(), ...(l || {}) });
      setBatchId(_id);
      flash("📂 Batch loaded.");
    } catch (e) {
      flash(`❌ ${e.message}`);
    }
  };

  const newBatch = () => {
    setBatch(emptyBatch);
    setMatrix({});
    setLimits(buildDefaultLimits());
    setBatchId(null);
    setTab("batch");
    flash("📝 New blank batch.");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-wine-800 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
            🍷
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold leading-tight tracking-tight">
              Fruit Wine Compliance Analyzer
            </h1>
            <p className="text-[11px] text-wine-100/80 font-sans">
              FSSAI · IS:3752 · OIV — analytical calculation &amp; compliance suite
            </p>
          </div>
          <span
            className={`text-[11px] px-2 py-1 rounded-full border ${
              online
                ? "bg-emerald-500/20 border-emerald-300/40 text-emerald-100"
                : "bg-white/10 border-white/20 text-white/70"
            }`}
          >
            {online ? "● Cloud connected" : "○ Offline"}
          </span>
        </div>

        {/* Cloud bar */}
        <div className="max-w-6xl mx-auto px-4 pb-3 flex flex-wrap items-center gap-2">
          <select
            value={batchId || ""}
            onChange={(e) => loadFromCloud(e.target.value)}
            disabled={!online}
            className="text-xs rounded-lg bg-white/10 border border-white/20 text-white px-2.5 py-1.5
                       outline-none disabled:opacity-50 [&>option]:text-stone-800"
          >
            <option value="">{online ? "Load saved batch…" : "Cloud offline"}</option>
            {batches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.product} {b.lot ? `(${b.lot})` : ""}
              </option>
            ))}
          </select>
          <button
            onClick={saveToCloud}
            disabled={!online}
            className="text-xs rounded-lg bg-white text-wine-800 font-medium px-3 py-1.5
                       hover:bg-wine-50 transition-colors disabled:opacity-50"
          >
            {batchId ? "⬆ Update cloud" : "⬆ Save to cloud"}
          </button>
          <button
            onClick={newBatch}
            className="text-xs rounded-lg bg-white/10 border border-white/20 text-white px-3 py-1.5
                       hover:bg-white/20 transition-colors"
          >
            + New batch
          </button>
          {batchId && (
            <span className="text-[11px] text-wine-100/70 font-mono">id: {batchId.slice(-6)}</span>
          )}
          {status && (
            <span className="ml-auto text-[11px] bg-white/10 rounded-full px-3 py-1">{status}</span>
          )}
        </div>

        {/* Tabs */}
        <nav className="bg-wine-900/40">
          <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-white text-white"
                    : "border-transparent text-wine-100/70 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === "batch" && <BatchTab batch={batch} setBatch={setBatch} />}
        {tab === "ferment" && <FermentationTab batchId={batchId} online={online} />}
        {tab === "gravity" && <GravityTab pushToMatrix={pushToMatrix} />}
        {tab === "titration" && <TitrationTab pushToMatrix={pushToMatrix} />}
        {tab === "manual" && <ManualTab matrix={matrix} setMatrixEntry={setMatrixEntry} />}
        {tab === "compliance" && (
          <ComplianceTab
            batch={batch}
            matrix={matrix}
            setMatrixEntry={setMatrixEntry}
            limits={limits}
            setLimits={setLimits}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-[11px] text-stone-400">
        Data auto-saves locally in this browser and syncs to MongoDB when the API is
        running. Always verify statutory limits against the current FSSAI gazette before
        signing off compliance; predicted values must be confirmed by accredited reference methods.
      </footer>
    </div>
  );
}
