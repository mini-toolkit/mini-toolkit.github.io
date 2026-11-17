(function () {
  "use strict";
  const inEl = document.getElementById("hg-input");
  async function digest(algo, text) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  async function update() {
    const val = inEl.value;
    document.getElementById("hg-sha1").textContent = await digest("SHA-1", val);
    document.getElementById("hg-sha256").textContent = await digest("SHA-256", val);
    document.getElementById("hg-sha384").textContent = await digest("SHA-384", val);
    document.getElementById("hg-sha512").textContent = await digest("SHA-512", val);
  }
  inEl.addEventListener("input", update);
  update();
})();
