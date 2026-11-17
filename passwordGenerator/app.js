(function () {
  "use strict";
  const lenEl = document.getElementById("pg-len");
  const upperEl = document.getElementById("pg-upper");
  const lowerEl = document.getElementById("pg-lower");
  const numEl = document.getElementById("pg-num");
  const symEl = document.getElementById("pg-sym");
  const outEl = document.getElementById("pg-output");
  const stEl = document.getElementById("pg-status");

  function generate() {
    let chars = "";
    if (upperEl.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowerEl.checked) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numEl.checked) chars += "0123456789";
    if (symEl.checked) chars += "!@#$%^&*()-_=+[]{};:,.<>?";
    if (!chars) {
      outEl.textContent = "";
      stEl.className = "status-bar show error";
      stEl.textContent = "Select at least one character set.";
      return;
    }
    const len = Math.max(4, Math.min(128, Number(lenEl.value) || 16));
    const arr = crypto.getRandomValues(new Uint32Array(len));
    let res = "";
    for (let i = 0; i < len; i++) res += chars[arr[i] % chars.length];
    outEl.textContent = res;
    stEl.className = "status-bar show success";
    stEl.textContent = len >= 14 ? "Strength: Strong" : len >= 10 ? "Strength: Medium" : "Strength: Weak";
  }

  document.getElementById("pg-gen").addEventListener("click", generate);
  document.getElementById("pg-copy").addEventListener("click", async () => {
    if (!outEl.textContent) return;
    await navigator.clipboard.writeText(outEl.textContent);
    stEl.className = "status-bar show success";
    stEl.textContent = "Copied!";
  });
  generate();
})();
