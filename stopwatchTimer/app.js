(function () {
  "use strict";
  let elapsed = 0, startAt = 0, raf = null, laps = [];
  const disp = document.getElementById("sw-display");
  const lapsEl = document.getElementById("sw-laps");
  function fmt(ms) {
    const m = String(Math.floor(ms / 60000)).padStart(2, "0");
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    const cs = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
    return `${m}:${s}.${cs}`;
  }
  function tick() {
    disp.textContent = fmt(elapsed + (performance.now() - startAt));
    raf = requestAnimationFrame(tick);
  }
  document.getElementById("sw-start").addEventListener("click", (e) => {
    if (raf) {
      cancelAnimationFrame(raf); raf = null;
      elapsed += performance.now() - startAt;
      e.target.textContent = "Start";
    } else {
      startAt = performance.now();
      raf = requestAnimationFrame(tick);
      e.target.textContent = "Stop";
    }
  });
  document.getElementById("sw-lap").addEventListener("click", () => {
    const cur = raf ? elapsed + (performance.now() - startAt) : elapsed;
    laps.unshift(`Lap ${laps.length + 1}: ${fmt(cur)}`);
    lapsEl.textContent = laps.join("\n");
  });
  document.getElementById("sw-reset").addEventListener("click", () => {
    cancelAnimationFrame(raf); raf = null; elapsed = 0; laps = [];
    disp.textContent = "00:00.00"; lapsEl.textContent = "";
    document.getElementById("sw-start").textContent = "Start";
  });
})();
