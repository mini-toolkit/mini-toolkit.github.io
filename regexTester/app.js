(function () {
  "use strict";
  const patEl = document.getElementById("rx-pat");
  const flagsEl = document.getElementById("rx-flags");
  const textEl = document.getElementById("rx-text");
  const stEl = document.getElementById("rx-status");
  const outEl = document.getElementById("rx-out");

  function test() {
    try {
      const re = new RegExp(patEl.value, flagsEl.value);
      const matches = [...textEl.value.matchAll(new RegExp(patEl.value, flagsEl.value.includes("g") ? flagsEl.value : flagsEl.value + "g"))];
      stEl.className = "status-bar show success";
      stEl.textContent = `Matches found: ${matches.length}`;
      outEl.textContent = matches.length
        ? matches.map((m, i) => `#${i + 1} [index ${m.index}]: ${m[0]}`).join("\n")
        : "No matches.";
      void re;
    } catch (e) {
      stEl.className = "status-bar show error";
      stEl.textContent = "Invalid Regex: " + e.message;
      outEl.textContent = "";
    }
  }
  [patEl, flagsEl, textEl].forEach((el) => el.addEventListener("input", test));
  test();
})();
