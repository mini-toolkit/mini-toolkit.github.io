(function () {
  "use strict";
  const w1 = document.getElementById("ar-w1"), h1 = document.getElementById("ar-h1");
  const w2 = document.getElementById("ar-w2"), h2 = document.getElementById("ar-h2");
  const ratioEl = document.getElementById("ar-ratio");
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function updateRatio() {
    const a = Math.round(Number(w1.value)), b = Math.round(Number(h1.value));
    if (a > 0 && b > 0) {
      const g = gcd(a, b);
      ratioEl.textContent = `${a / g}:${b / g}`;
    }
  }
  w1.addEventListener("input", () => { updateRatio(); h2.value = Math.round((Number(w2.value) * Number(h1.value)) / (Number(w1.value) || 1)); });
  h1.addEventListener("input", () => { updateRatio(); h2.value = Math.round((Number(w2.value) * Number(h1.value)) / (Number(w1.value) || 1)); });
  w2.addEventListener("input", () => { h2.value = Math.round((Number(w2.value) * Number(h1.value)) / (Number(w1.value) || 1)); });
  h2.addEventListener("input", () => { w2.value = Math.round((Number(h2.value) * Number(w1.value)) / (Number(h1.value) || 1)); });
  updateRatio();
})();
