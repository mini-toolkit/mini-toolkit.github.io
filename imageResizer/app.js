(function () {
  "use strict";
  const fileEl = document.getElementById("ir-file");
  const wEl = document.getElementById("ir-w");
  const hEl = document.getElementById("ir-h");
  const qEl = document.getElementById("ir-q");
  const fmtEl = document.getElementById("ir-fmt");
  const lockEl = document.getElementById("ir-lock");
  const preview = document.getElementById("ir-preview");
  const stEl = document.getElementById("ir-status");
  let loadedImg = null;
  let ratio = 1;

  fileEl.addEventListener("change", () => {
    const f = fileEl.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      loadedImg = img;
      ratio = img.naturalWidth / img.naturalHeight;
      wEl.value = img.naturalWidth;
      hEl.value = img.naturalHeight;
      preview.src = url;
      preview.style.display = "inline-block";
      stEl.className = "status-bar show success";
      stEl.textContent = `Loaded: ${img.naturalWidth} × ${img.naturalHeight}px`;
    };
    img.src = url;
  });

  wEl.addEventListener("input", () => {
    if (lockEl.checked && ratio) hEl.value = Math.max(1, Math.round(Number(wEl.value) / ratio));
  });
  hEl.addEventListener("input", () => {
    if (lockEl.checked && ratio) wEl.value = Math.max(1, Math.round(Number(hEl.value) * ratio));
  });

  document.getElementById("ir-dl").addEventListener("click", () => {
    if (!loadedImg) {
      stEl.className = "status-bar show error";
      stEl.textContent = "Please choose an image first.";
      return;
    }
    const w = Math.max(1, Number(wEl.value) || loadedImg.naturalWidth);
    const h = Math.max(1, Number(hEl.value) || loadedImg.naturalHeight);
    const q = Math.min(1, Math.max(0.1, Number(qEl.value) || 0.85));
    const fmt = fmtEl.value;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(loadedImg, 0, 0, w, h);
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      const ext = fmt.split("/")[1];
      a.download = `resized.${ext}`;
      a.click();
      stEl.className = "status-bar show success";
      stEl.textContent = `Downloaded ${w} × ${h}px (${(blob.size / 1024).toFixed(1)} KB)`;
    }, fmt, q);
  });
})();
