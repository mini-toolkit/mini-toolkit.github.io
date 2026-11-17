(function () {
  "use strict";
  const SENTENCES = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
    "Curabitur pretium tincidunt lacus, nulla gravida orci a odio.",
    "Nullam varius, turpis et commodo pharetra, est eros bibendum elit."
  ];
  const outEl = document.getElementById("lr-out");
  const stEl = document.getElementById("lr-status");
  function gen() {
    const n = Math.max(1, Math.min(20, Number(document.getElementById("lr-count").value) || 3));
    const type = document.getElementById("lr-type").value;
    if (type === "sentences") {
      outEl.value = Array.from({ length: n }, (_, i) => SENTENCES[i % SENTENCES.length]).join(" ");
    } else {
      outEl.value = Array.from({ length: n }, (_, i) => [0, 1, 2, 3].map((j) => SENTENCES[(i + j) % SENTENCES.length]).join(" ")).join("\n\n");
    }
  }
  document.getElementById("lr-gen").addEventListener("click", gen);
  document.getElementById("lr-copy").addEventListener("click", async () => {
    await navigator.clipboard.writeText(outEl.value);
    stEl.className = "status-bar show success";
    stEl.textContent = "Copied!";
  });
  gen();
})();
