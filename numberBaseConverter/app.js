(function () {
  "use strict";
  const fields = { dec: 10, hex: 16, bin: 2, oct: 8 };
  Object.entries(fields).forEach(([key, base]) => {
    const el = document.getElementById("nb-" + key);
    el.addEventListener("input", () => {
      const val = parseInt(el.value.trim(), base);
      if (isNaN(val)) return;
      Object.entries(fields).forEach(([k2, b2]) => {
        if (k2 !== key) document.getElementById("nb-" + k2).value = val.toString(b2).toUpperCase();
      });
    });
  });
})();
