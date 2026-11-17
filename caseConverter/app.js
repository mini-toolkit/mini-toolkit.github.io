(function () {
  "use strict";
  const txt = document.getElementById("case-text");
  const st = document.getElementById("case-status");
  function words(s) { return s.replace(/([a-z])([A-Z])/g, "$1 $2").trim().split(/[\s_-]+/).filter(Boolean); }
  document.querySelectorAll("[data-case]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.case;
      const v = txt.value;
      if (mode === "upper") txt.value = v.toUpperCase();
      else if (mode === "lower") txt.value = v.toLowerCase();
      else if (mode === "title") txt.value = v.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
      else if (mode === "camel") txt.value = words(v).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
      else if (mode === "snake") txt.value = words(v).map((w) => w.toLowerCase()).join("_");
      else if (mode === "kebab") txt.value = words(v).map((w) => w.toLowerCase()).join("-");
    });
  });
  document.getElementById("cc-copy").addEventListener("click", async () => {
    await navigator.clipboard.writeText(txt.value);
    st.className = "status-bar show success";
    st.textContent = "Copied!";
  });
})();
