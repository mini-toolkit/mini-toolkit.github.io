(function () {
  "use strict";
  function calc() {
    const p = Number(document.getElementById("ln-amt").value);
    const r = Number(document.getElementById("ln-rate").value) / 100 / 12;
    const n = Number(document.getElementById("ln-months").value);
    if (p <= 0 || n <= 0) return;
    const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const tot = emi * n;
    const fmt = (v) => Math.round(v).toLocaleString();
    document.getElementById("ln-emi").textContent = fmt(emi);
    document.getElementById("ln-int").textContent = fmt(tot - p);
    document.getElementById("ln-tot").textContent = fmt(tot);
  }
  ["ln-amt", "ln-rate", "ln-months"].forEach((id) => document.getElementById(id).addEventListener("input", calc));
  calc();
})();
