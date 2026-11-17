(function () {
  "use strict";

  const inputEl = document.getElementById("tc-input");
  const encoder = new TextEncoder();

  inputEl.addEventListener("input", () => {
    const val = inputEl.value;
    const trimmed = val.trim();
    document.getElementById("tc-with-space").textContent = val.length;
    document.getElementById("tc-no-space").textContent = val.replace(/\s/g, "").length;
    document.getElementById("tc-words").textContent = trimmed ? trimmed.split(/\s+/).length : 0;
    document.getElementById("tc-bytes").textContent = encoder.encode(val).length;
  });
})();
