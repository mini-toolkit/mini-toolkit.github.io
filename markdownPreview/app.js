(function () {
  "use strict";
  const inEl = document.getElementById("md-in");
  const outEl = document.getElementById("md-out");
  const stEl = document.getElementById("md-status");

  function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }
  function renderMd(md) {
    return md.split(/\r?\n/).map((line) => {
      if (line.startsWith("### ")) return `<h3>${inline(line.slice(4))}</h3>`;
      if (line.startsWith("## ")) return `<h2>${inline(line.slice(3))}</h2>`;
      if (line.startsWith("# ")) return `<h1>${inline(line.slice(2))}</h1>`;
      if (line.startsWith("> ")) return `<blockquote>${inline(line.slice(2))}</blockquote>`;
      if (/^[-*] /.test(line)) return `<p>• ${inline(line.slice(2))}</p>`;
      if (!line.trim()) return "";
      return `<p>${inline(line)}</p>`;
    }).join("\n");
  }
  function update() { outEl.innerHTML = renderMd(inEl.value); }
  inEl.addEventListener("input", update);
  document.getElementById("md-copy-html").addEventListener("click", async () => {
    await navigator.clipboard.writeText(outEl.innerHTML);
    stEl.className = "status-bar show success";
    stEl.textContent = "HTML copied!";
  });
  document.getElementById("md-clear").addEventListener("click", () => { inEl.value = ""; update(); });
  update();
})();
