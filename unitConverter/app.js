(function () {
  "use strict";
  const UNITS = {
    length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
    weight: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.02834952 },
    data: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
    temp: { C: 1, F: 1, K: 1 }
  };
  const catEl = document.getElementById("uc-cat");
  const fromEl = document.getElementById("uc-from");
  const toEl = document.getElementById("uc-to");
  const valEl = document.getElementById("uc-val");
  const resEl = document.getElementById("uc-res");
  function populate() {
    const keys = Object.keys(UNITS[catEl.value]);
    fromEl.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join("");
    toEl.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join("");
    if (keys.length > 1) toEl.selectedIndex = 1;
    calc();
  }
  function calc() {
    const cat = catEl.value, f = fromEl.value, t = toEl.value, v = Number(valEl.value);
    if (!Number.isFinite(v)) { resEl.textContent = "-"; return; }
    let out;
    if (cat === "temp") {
      let c = f === "C" ? v : f === "F" ? (v - 32) * 5 / 9 : v - 273.15;
      out = t === "C" ? c : t === "F" ? c * 9 / 5 + 32 : c + 273.15;
    } else {
      out = (v * UNITS[cat][f]) / UNITS[cat][t];
    }
    resEl.textContent = Number(out.toPrecision(8)).toString() + " " + t;
  }
  catEl.addEventListener("change", populate);
  [fromEl, toEl, valEl].forEach((el) => el.addEventListener("input", calc));
  populate();
})();
