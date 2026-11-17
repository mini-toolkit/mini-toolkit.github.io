(function () {
  "use strict";
  let totalSec = 25 * 60, remain = totalSec, timer = null;
  const disp = document.getElementById("pm-display");
  function render() {
    const m = String(Math.floor(remain / 60)).padStart(2, "0");
    const s = String(remain % 60).padStart(2, "0");
    disp.textContent = `${m}:${s}`;
  }
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.start();
      setTimeout(() => osc.stop(), 350);
    } catch {}
  }
  document.querySelectorAll("[data-min]").forEach((btn) => {
    btn.addEventListener("click", () => {
      clearInterval(timer); timer = null;
      totalSec = Number(btn.dataset.min) * 60;
      remain = totalSec;
      render();
    });
  });
  document.getElementById("pm-start").addEventListener("click", () => {
    if (timer) return;
    timer = setInterval(() => {
      if (remain > 0) { remain--; render(); }
      else { clearInterval(timer); timer = null; beep(); }
    }, 1000);
  });
  document.getElementById("pm-pause").addEventListener("click", () => { clearInterval(timer); timer = null; });
  document.getElementById("pm-reset").addEventListener("click", () => { clearInterval(timer); timer = null; remain = totalSec; render(); });
  render();
})();
