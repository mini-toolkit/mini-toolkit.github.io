(function () {
  "use strict";
  const inEl = document.getElementById("ue-input");
  const outEl = document.getElementById("ue-output");
  const stEl = document.getElementById("ue-status");
  function show(type, msg) { stEl.className = "status-bar show " + type; stEl.textContent = msg; }
  document.getElementById("ue-encode").addEventListener("click", () => {
    try { outEl.value = encodeURIComponent(inEl.value); show("success", "Encoded successfully."); }
    catch (e) { show("error", e.message); }
  });
  document.getElementById("ue-decode").addEventListener("click", () => {
    try { outEl.value = decodeURIComponent(inEl.value.trim()); show("success", "Decoded successfully."); }
    catch { show("error", "Invalid percent-encoded URL string."); }
  });
  document.getElementById("ue-copy").addEventListener("click", async () => {
    if (!outEl.value) return;
    await navigator.clipboard.writeText(outEl.value);
    show("success", "Copied!");
  });
  document.getElementById("ue-clear").addEventListener("click", () => {
    inEl.value = ""; outEl.value = ""; stEl.className = "status-bar";
  });
})();
