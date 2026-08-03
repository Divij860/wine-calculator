import React from "react";

export function Card({ title, subtitle, children, accent }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-stone-100 bg-stone-50/60">
          <h3 className="font-display text-[15px] font-semibold text-stone-800 flex items-center gap-2">
            {accent && <span className="w-1.5 h-1.5 rounded-full bg-wine-600" />}
            {title}
          </h3>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-stone-600">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-stone-400 mt-0.5">{hint}</span>}
    </label>
  );
}

export function NumberInput({ value, onChange, placeholder, step = "any", suffix }) {
  return (
    <div className="relative mt-1">
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800
                   focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none
                   bg-white placeholder:text-stone-300"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-800
                 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none bg-white
                 placeholder:text-stone-300"
    />
  );
}

export function Result({ label, value, unit, big }) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-dashed border-stone-100 last:border-0">
      <span className="text-xs text-stone-500">{label}</span>
      <span className={`font-mono tabular-nums text-stone-900 ${big ? "text-lg font-semibold" : "text-sm"}`}>
        {value}
        {unit && value !== "—" && <span className="text-stone-400 text-xs ml-1">{unit}</span>}
      </span>
    </div>
  );
}

export function Button({ children, onClick, variant = "primary", size = "sm" }) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm" };
  const variants = {
    primary: "bg-wine-700 text-white hover:bg-wine-800",
    ghost: "bg-stone-100 text-stone-700 hover:bg-stone-200",
    outline: "border border-wine-600 text-wine-700 hover:bg-wine-50",
  };
  return (
    <button onClick={onClick} className={`${base} ${sizes[size]} ${variants[variant]}`}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Fail: "bg-red-100 text-red-700 border-red-200",
    "At Risk": "bg-amber-100 text-amber-700 border-amber-200",
    "No Data": "bg-stone-100 text-stone-500 border-stone-200",
    "No Limit Set": "bg-stone-100 text-stone-400 border-stone-200",
    CONSISTENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "DATA INCONSISTENCY": "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
        map[status] || "bg-stone-100 text-stone-500 border-stone-200"
      }`}
    >
      {status}
    </span>
  );
}
