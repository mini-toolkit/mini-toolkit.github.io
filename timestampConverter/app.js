(function () {
  "use strict";
  const numEl = document.getElementById("ts-num");
  const isoEl = document.getElementById("ts-iso");
  const dateOut = document.getElementById("ts-date-out");
  const numOut = document.getElementById("ts-num-out");

  function fromTs() {
    const raw = Number(numEl.value.trim());
    if (!Number.isFinite(raw)) { dateOut.textContent = "Invalid timestamp"; return; }
    const ms = Math.abs(raw) < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    if (isNaN(d.getTime())) { dateOut.textContent = "Invalid date"; return; }
    dateOut.textContent = `UTC:   ${d.toUTCString()}\nISO:   ${d.toISOString()}\nLocal: ${d.toLocaleString()}`;
  }

  function fromDate() {
    const d = new Date(isoEl.value);
    if (isNaN(d.getTime())) { numOut.textContent = "Invalid date"; return; }
    numOut.textContent = `Seconds:      ${Math.floor(d.getTime() / 1000)}\nMilliseconds: ${d.getTime()}`;
  }

  function setNow() {
    const now = new Date();
    numEl.value = String(Math.floor(now.getTime() / 1000));
    const pad = (n) => String(n).padStart(2, "0");
    isoEl.value = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    fromTs();
    fromDate();
  }

  numEl.addEventListener("input", fromTs);
  isoEl.addEventListener("input", fromDate);
  document.getElementById("ts-now").addEventListener("click", setNow);
  setNow();
})();
