(function () {
  "use strict";
  const ZONES = [
    ["UTC", "UTC"],
    ["New York", "America/New_York"],
    ["London", "Europe/London"],
    ["Paris", "Europe/Paris"],
    ["New Delhi", "Asia/Kolkata"],
    ["Beijing / Shanghai", "Asia/Shanghai"],
    ["Seoul", "Asia/Seoul"],
    ["Tokyo", "Asia/Tokyo"]
  ];
  const dtEl = document.getElementById("tz-dt");
  const grid = document.getElementById("tz-grid");
  function render() {
    const d = dtEl.value ? new Date(dtEl.value) : new Date();
    if (isNaN(d.getTime())) return;
    grid.innerHTML = ZONES.map(([label, tz]) => {
      const str = d.toLocaleString("en-GB", { timeZone: tz, hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      return `<div class="stat-box"><div class="stat-label">${label} (${tz})</div><div class="stat-value" style="font-size:1.05rem;margin-top:4px;">${str}</div></div>`;
    }).join("");
  }
  function setNow() {
    const n = new Date(), p = (v) => String(v).padStart(2, "0");
    dtEl.value = `${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
    render();
  }
  dtEl.addEventListener("input", render);
  document.getElementById("tz-now").addEventListener("click", setNow);
  setNow();
})();
