(function () {
  "use strict";
  const sEl = document.getElementById("ag-start");
  const eEl = document.getElementById("ag-end");
  eEl.value = new Date().toISOString().slice(0, 10);
  function calc() {
    const s = new Date(sEl.value), e = new Date(eEl.value);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) {
      document.getElementById("ag-ymd").textContent = "-";
      document.getElementById("ag-days").textContent = "-";
      return;
    }
    let y = e.getFullYear() - s.getFullYear();
    let m = e.getMonth() - s.getMonth();
    let d = e.getDate() - s.getDate();
    if (d < 0) {
      m--;
      d += new Date(e.getFullYear(), e.getMonth(), 0).getDate();
    }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((e - s) / 86400000);
    document.getElementById("ag-ymd").textContent = `${y}y ${m}m ${d}d`;
    document.getElementById("ag-days").textContent = days.toLocaleString();
  }
  [sEl, eEl].forEach((el) => el.addEventListener("input", calc));
  calc();
})();
