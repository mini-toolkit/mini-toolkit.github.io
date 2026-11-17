(function () {
  "use strict";
  const aEl = document.getElementById("df-a");
  const bEl = document.getElementById("df-b");
  const outEl = document.getElementById("df-out");
  function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function compare() {
    const a = aEl.value.split("\n");
    const b = bEl.value.split("\n");
    const max = Math.max(a.length, b.length);
    const html = [];
    for (let i = 0; i < max; i++) {
      const la = a[i], lb = b[i];
      if (la === lb) {
        html.push(`<div>  ${esc(la ?? "")}</div>`);
      } else {
        if (la !== undefined) html.push(`<div style="background:#fee2e2;color:#991b1b;">- ${esc(la)}</div>`);
        if (lb !== undefined) html.push(`<div style="background:#dcfce7;color:#166534;">+ ${esc(lb)}</div>`);
      }
    }
    outEl.innerHTML = html.join("");
  }
  document.getElementById("df-run").addEventListener("click", compare);
  document.getElementById("df-clear").addEventListener("click", () => { aEl.value = ""; bEl.value = ""; outEl.innerHTML = ""; });
})();
