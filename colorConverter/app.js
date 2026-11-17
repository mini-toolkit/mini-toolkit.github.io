(function () {
  "use strict";
  const picker = document.getElementById("cc-picker");
  const hexEl = document.getElementById("cc-hex");
  const swatch = document.getElementById("cc-swatch");
  const outHex = document.getElementById("cc-out-hex");
  const outRgb = document.getElementById("cc-out-rgb");
  const outHsl = document.getElementById("cc-out-hsl");

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function applyHex(hex) {
    const clean = hex.trim().replace(/^#/, "");
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return;
    const norm = "#" + clean.toUpperCase();
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const [h, s, l] = rgbToHsl(r, g, b);
    picker.value = norm;
    swatch.style.background = norm;
    outHex.textContent = norm;
    outRgb.textContent = `rgb(${r}, ${g}, ${b})`;
    outHsl.textContent = `hsl(${h}, ${s}%, ${l}%)`;
  }

  picker.addEventListener("input", () => { hexEl.value = picker.value.toUpperCase(); applyHex(picker.value); });
  hexEl.addEventListener("input", () => applyHex(hexEl.value));
  applyHex("#2563EB");
})();
