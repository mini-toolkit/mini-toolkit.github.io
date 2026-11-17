(function () {
  "use strict";
  const inEl = document.getElementById("he-in");
  const outEl = document.getElementById("he-out");
  const stEl = document.getElementById("he-status");
  document.getElementById("he-enc").addEventListener("click", () => {
    const div = document.createElement("div");
    div.textContent = inEl.value;
    outEl.value = div.innerHTML.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  });
  document.getElementById("he-dec").addEventListener("click", () => {
    const txt = document.createElement("textarea");
    txt.innerHTML = inEl.value;
    outEl.value = txt.value;
  });
  document.getElementById("he-copy").addEventListener("click", async () => {
    if (!outEl.value) return;
    await navigator.clipboard.writeText(outEl.value);
    stEl.className = "status-bar show success";
    stEl.textContent = "Copied!";
  });
})();
