(function () {
  "use strict";
  const inEl = document.getElementById("jwt-in");
  const stEl = document.getElementById("jwt-status");
  const hEl = document.getElementById("jwt-header");
  const pEl = document.getElementById("jwt-payload");

  function b64urlDecode(str) {
    const pad = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (str.length % 4)) % 4);
    const bin = atob(pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  inEl.addEventListener("input", () => {
    const raw = inEl.value.trim();
    if (!raw) { hEl.textContent = ""; pEl.textContent = ""; stEl.className = "status-bar"; return; }
    try {
      const parts = raw.split(".");
      if (parts.length < 2) throw new Error("Invalid JWT format.");
      const header = JSON.parse(b64urlDecode(parts[0]));
      const payload = JSON.parse(b64urlDecode(parts[1]));
      hEl.textContent = JSON.stringify(header, null, 2);
      pEl.textContent = JSON.stringify(payload, null, 2);
      let msg = "Decoded successfully.";
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        msg += ` | exp: ${expDate.toLocaleString()} (${Date.now() > payload.exp * 1000 ? "Expired" : "Valid"})`;
      }
      stEl.className = "status-bar show success";
      stEl.textContent = msg;
    } catch (e) {
      stEl.className = "status-bar show error";
      stEl.textContent = e.message;
      hEl.textContent = ""; pEl.textContent = "";
    }
  });
})();
