(function () {
  "use strict";
  const countEl = document.getElementById("ug-count");
  const upperEl = document.getElementById("ug-upper");
  const noHyphenEl = document.getElementById("ug-nohyphen");
  const outEl = document.getElementById("ug-output");
  const stEl = document.getElementById("ug-status");

  function uuidv4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
  }

  function generate() {
    const n = Math.max(1, Math.min(100, Number(countEl.value) || 5));
    const list = [];
    for (let i = 0; i < n; i++) {
      let id = uuidv4();
      if (noHyphenEl.checked) id = id.replace(/-/g, "");
      if (upperEl.checked) id = id.toUpperCase();
      list.push(id);
    }
    outEl.value = list.join("\n");
  }

  document.getElementById("ug-gen").addEventListener("click", generate);
  document.getElementById("ug-copy").addEventListener("click", async () => {
    if (!outEl.value) return;
    await navigator.clipboard.writeText(outEl.value);
    stEl.className = "status-bar show success";
    stEl.textContent = "Copied!";
  });
  generate();
})();
