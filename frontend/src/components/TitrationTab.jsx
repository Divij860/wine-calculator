import React, { useState } from "react";
import { Card, Field, NumberInput, Result, Button } from "./UI.jsx";
import * as calc from "../lib/calculations.js";

const f = calc.fmt;

export default function TitrationTab({ pushToMatrix }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <TotalAcidity pushToMatrix={pushToMatrix} />
      <VolatileAcidity pushToMatrix={pushToMatrix} />
      <SO2 pushToMatrix={pushToMatrix} />
      <GenericAcid />
    </div>
  );
}

function TitrationInputs({ v, setV, n, setN, s, setS, titrant = "NaOH" }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Field label={`Titrant vol.`} hint={titrant}>
        <NumberInput value={v} onChange={setV} placeholder="7.5" suffix="mL" />
      </Field>
      <Field label="Normality (N)">
        <NumberInput value={n} onChange={setN} placeholder="0.1" suffix="N" />
      </Field>
      <Field label="Sample vol.">
        <NumberInput value={s} onChange={setS} placeholder="10" suffix="mL" />
      </Field>
    </div>
  );
}

function TotalAcidity({ pushToMatrix }) {
  const [v, setV] = useState("");
  const [n, setN] = useState("0.1");
  const [s, setS] = useState("10");
  const result = calc.totalAcidityTartaric(v, n, s);
  return (
    <Card title="Total Acidity — as Tartaric" subtitle="Alkaline titration · EqWt 75" accent>
      <TitrationInputs v={v} setV={setV} n={n} setN={setN} s={s} setS={setS} />
      <div className="mt-4">
        <Result label="Total acidity" value={f(result, 2)} unit="g/L tartaric" big />
      </div>
      <div className="mt-3">
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("totalAcid", {
              value: result !== null ? result.toFixed(2) : "",
              dataStatus: "Measured",
              confidence: 100,
              source: "Alkaline titration (NaOH), as tartaric",
            })
          }
        >
          → Send to Matrix
        </Button>
      </div>
    </Card>
  );
}

function VolatileAcidity({ pushToMatrix }) {
  const [v, setV] = useState("");
  const [n, setN] = useState("0.1");
  const [s, setS] = useState("10");
  const result = calc.volatileAcidityAcetic(v, n, s);
  return (
    <Card
      title="Volatile Acidity — as Acetic"
      subtitle="Steam distillate titration · EqWt 60"
      accent
    >
      <TitrationInputs v={v} setV={setV} n={n} setN={setN} s={s} setS={setS} />
      <div className="mt-4">
        <Result label="Volatile acidity" value={f(result, 3)} unit="g/L acetic" big />
      </div>
      <div className="mt-3">
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("volatileAcid", {
              value: result !== null ? result.toFixed(3) : "",
              dataStatus: "Measured",
              confidence: 100,
              source: "Steam distillation + titration, as acetic",
            })
          }
        >
          → Send to Matrix
        </Button>
      </div>
    </Card>
  );
}

function SO2({ pushToMatrix }) {
  const [v, setV] = useState("");
  const [n, setN] = useState("0.02");
  const [s, setS] = useState("50");
  const result = calc.totalSO2(v, n, s);
  return (
    <Card title="Total SO₂ — Ripper Method" subtitle="Iodometric titration · EqWt 32" accent>
      <TitrationInputs v={v} setV={setV} n={n} setN={setN} s={s} setS={setS} titrant="Iodine" />
      <div className="mt-4">
        <Result label="Total SO₂" value={f(result, 1)} unit="mg/L" big />
      </div>
      <div className="mt-3">
        <Button
          variant="outline"
          onClick={() =>
            pushToMatrix("totalSO2", {
              value: result !== null ? result.toFixed(1) : "",
              dataStatus: "Measured",
              confidence: 100,
              source: "Ripper iodometric titration",
            })
          }
        >
          → Send to Matrix
        </Button>
      </div>
    </Card>
  );
}

function GenericAcid() {
  const [v, setV] = useState("");
  const [n, setN] = useState("0.1");
  const [s, setS] = useState("10");
  const [eq, setEq] = useState("");
  const result = calc.acidByTitration(v, n, s, eq);
  return (
    <Card
      title="Generic Acid by Titration"
      subtitle="For any acid — supply its equivalent weight"
    >
      <TitrationInputs v={v} setV={setV} n={n} setN={setN} s={s} setS={setS} />
      <div className="mt-3">
        <Field label="Equivalent weight of acid" hint="Tartaric 75 · Acetic 60 · Citric 64 · Malic 67">
          <NumberInput value={eq} onChange={setEq} placeholder="75" />
        </Field>
      </div>
      <div className="mt-4">
        <Result label="Concentration" value={f(result, 3)} unit="g/L" big />
      </div>
    </Card>
  );
}
