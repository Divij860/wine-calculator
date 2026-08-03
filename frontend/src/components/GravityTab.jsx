import React, { useState } from "react";
import { Card, Field, NumberInput, Result, Button, StatusBadge } from "./UI.jsx";
import * as calc from "../lib/calculations.js";

const f = calc.fmt;

export default function GravityTab({ pushToMatrix }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <BrixSGConverter />
      <TempCorrection />
      <ABVCalculator pushToMatrix={pushToMatrix} />
      <StoichAndAttenuation />
      <SugarExtract pushToMatrix={pushToMatrix} />
    </div>
  );
}

function BrixSGConverter() {
  const [brix, setBrix] = useState("");
  const [sg, setSg] = useState("");
  return (
    <Card title="Brix ↔ Specific Gravity" subtitle="Two-way converter (20°C reference)" accent>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Degrees Brix">
          <NumberInput value={brix} onChange={setBrix} placeholder="e.g. 22" suffix="°Bx" />
        </Field>
        <Field label="Specific Gravity">
          <NumberInput value={sg} onChange={setSg} placeholder="e.g. 1.092" />
        </Field>
      </div>
      <div className="mt-4">
        <Result label="Brix → SG" value={f(calc.brixToSG(brix), 4)} />
        <Result label="SG → Brix" value={f(calc.sgToBrix(sg), 2)} unit="°Bx" />
      </div>
    </Card>
  );
}

function TempCorrection() {
  const [sg, setSg] = useState("");
  const [temp, setTemp] = useState("");
  const [cal, setCal] = useState("20");
  const corrected = calc.hydrometerTempCorrection(sg, temp, cal);
  return (
    <Card title="Hydrometer Temperature Correction" subtitle="Corrects SG for sample vs calibration temp" accent>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Measured SG">
          <NumberInput value={sg} onChange={setSg} placeholder="1.010" />
        </Field>
        <Field label="Sample Temp">
          <NumberInput value={temp} onChange={setTemp} placeholder="28" suffix="°C" />
        </Field>
        <Field label="Calib. Temp">
          <NumberInput value={cal} onChange={setCal} suffix="°C" />
        </Field>
      </div>
      <div className="mt-4">
        <Result label="Corrected SG" value={f(corrected, 4)} big />
      </div>
    </Card>
  );
}

function ABVCalculator({ pushToMatrix }) {
  const [og, setOg] = useState("");
  const [fg, setFg] = useState("");
  const simple = calc.abvSimple(og, fg);
  const accurate = calc.abvAccurate(og, fg);
  return (
    <Card title="Alcohol by Volume (ABV)" subtitle="From Original & Final Gravity" accent>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Original Gravity (OG)">
          <NumberInput value={og} onChange={setOg} placeholder="1.092" />
        </Field>
        <Field label="Final Gravity (FG)">
          <NumberInput value={fg} onChange={setFg} placeholder="0.996" />
        </Field>
      </div>
      <div className="mt-4">
        <Result label="ABV (simple ×131.25)" value={f(simple)} unit="% v/v" />
        <Result label="ABV (non-linear est.)" value={f(accurate)} unit="% v/v" big />
      </div>
      <div className="mt-3">
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("ethylAlcohol", {
              value: accurate !== null ? accurate.toFixed(2) : "",
              dataStatus: "Measured",
              confidence: 100,
              source: "Calculated from OG/FG (hydrometer)",
            })
          }
        >
          → Send Ethyl Alcohol to Matrix
        </Button>
      </div>
    </Card>
  );
}

function StoichAndAttenuation() {
  const [startBrix, setStartBrix] = useState("");
  const [endBrix, setEndBrix] = useState("");
  const [abv, setAbv] = useState("");
  const check = calc.stoichCheck(startBrix, endBrix, abv);
  const og = calc.brixToSG(startBrix);
  const fg = calc.brixToSG(endBrix);
  const atten = og && fg ? calc.apparentAttenuation(og, fg) : null;
  return (
    <Card
      title="Stoichiometric Cross-Check"
      subtitle="ΔBrix vs measured ABV · flags >10% variance"
      accent
    >
      <div className="grid grid-cols-3 gap-3">
        <Field label="Start Brix">
          <NumberInput value={startBrix} onChange={setStartBrix} placeholder="22" suffix="°Bx" />
        </Field>
        <Field label="Current Brix">
          <NumberInput value={endBrix} onChange={setEndBrix} placeholder="6" suffix="°Bx" />
        </Field>
        <Field label="Meter ABV">
          <NumberInput value={abv} onChange={setAbv} placeholder="8.5" suffix="%" />
        </Field>
      </div>
      {check && (
        <div className="mt-4">
          <Result label="ΔBrix" value={f(check.deltaBrix)} unit="°Bx" />
          <Result
            label="Expected ABV range (×0.55–0.60)"
            value={`${f(check.expectedLow)} – ${f(check.expectedHigh)}`}
            unit="%"
          />
          <Result label="Variance vs measured" value={f(check.variancePct, 1)} unit="%" />
          <Result label="Apparent attenuation" value={f(atten, 1)} unit="%" />
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-stone-500">Verdict:</span>
            <StatusBadge status={check.flag} />
          </div>
        </div>
      )}
    </Card>
  );
}

function SugarExtract({ pushToMatrix }) {
  const [initialBrix, setInitialBrix] = useState("");
  const [finalBrix, setFinalBrix] = useState("");
  const [finalSG, setFinalSG] = useState("");
  const totalSugar = calc.sugarGperL(initialBrix);
  const residualSugar = calc.sugarGperL(finalBrix, finalSG);
  const extract = calc.residualExtract(finalBrix, finalSG);
  return (
    <Card
      title="Sugar & Residual Extract"
      subtitle="Estimates from Brix / SG (proxy — confirm by reference method)"
      accent
    >
      <div className="grid grid-cols-3 gap-3">
        <Field label="Initial Brix">
          <NumberInput value={initialBrix} onChange={setInitialBrix} placeholder="22" suffix="°Bx" />
        </Field>
        <Field label="Final Brix">
          <NumberInput value={finalBrix} onChange={setFinalBrix} placeholder="6" suffix="°Bx" />
        </Field>
        <Field label="Final SG (opt.)">
          <NumberInput value={finalSG} onChange={setFinalSG} placeholder="0.996" />
        </Field>
      </div>
      <div className="mt-4">
        <Result label="Total sugar (initial)" value={f(totalSugar, 1)} unit="g/L" />
        <Result label="Residual sugar (final)" value={f(residualSugar, 1)} unit="g/L" big />
        <Result label="Residual extract (est.)" value={f(extract, 1)} unit="g/L" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("totalSugar", {
              value: residualSugar !== null ? residualSugar.toFixed(1) : "",
              dataStatus: "Predicted",
              confidence: 60,
              source: "Estimated from final Brix — confirm by Lane–Eynon",
            })
          }
        >
          → Send Sugar
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("residualExtract", {
              value: extract !== null ? extract.toFixed(1) : "",
              dataStatus: "Predicted",
              confidence: 50,
              source: "Estimated from final Brix — confirm by dry-extract density",
            })
          }
        >
          → Send Extract
        </Button>
      </div>
    </Card>
  );
}
