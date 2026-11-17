(function () {
  "use strict";
  function calc() {
    const x1 = Number(document.getElementById("p1-x").value), y1 = Number(document.getElementById("p1-y").value);
    document.getElementById("p1-res").textContent = ((x1 / 100) * y1).toFixed(2).replace(/\.00$/, "");
    const x2 = Number(document.getElementById("p2-x").value), y2 = Number(document.getElementById("p2-y").value);
    document.getElementById("p2-res").textContent = y2 ? ((x2 / y2) * 100).toFixed(2).replace(/\.00$/, "") + "%" : "-";
    const x3 = Number(document.getElementById("p3-x").value), y3 = Number(document.getElementById("p3-y").value);
    if (x3) {
      const ch = ((y3 - x3) / x3) * 100;
      document.getElementById("p3-res").textContent = (ch > 0 ? "+" : "") + ch.toFixed(2).replace(/\.00$/, "") + "%";
    } else {
      document.getElementById("p3-res").textContent = "-";
    }
  }
  document.querySelectorAll("input[type=number]").forEach((el) => el.addEventListener("input", calc));
  calc();
})();
