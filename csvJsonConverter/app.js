(function () {
  "use strict";
  const inEl = document.getElementById("cj-in");
  const outEl = document.getElementById("cj-out");
  const stEl = document.getElementById("cj-status");
  function show(t, m) { stEl.className = "status-bar show " + t; stEl.textContent = m; }

  function parseCsvRow(line) {
    const res = []; let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { if (q && line[i+1] === '"') { cur += '"'; i++; } else q = !q; }
      else if (c === "," && !q) { res.push(cur); cur = ""; }
      else cur += c;
    }
    res.push(cur);
    return res;
  }

  document.getElementById("cj-to-json").addEventListener("click", () => {
    try {
      const lines = inEl.value.trim().split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) throw new Error("Need header and at least one row.");
      const headers = parseCsvRow(lines[0]);
      const data = lines.slice(1).map((line) => {
        const vals = parseCsvRow(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h.trim()] = vals[i] ?? ""; });
        return obj;
      });
      outEl.value = JSON.stringify(data, null, 2);
      show("success", `Converted ${data.length} rows to JSON.`);
    } catch (e) { show("error", e.message); }
  });

  document.getElementById("cj-to-csv").addEventListener("click", () => {
    try {
      const arr = JSON.parse(inEl.value);
      if (!Array.isArray(arr) || arr.length === 0) throw new Error("JSON must be a non-empty array of objects.");
      const keys = Object.keys(arr[0]);
      const esc = (v) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
      const rows = [keys.map(esc).join(",")].concat(arr.map((o) => keys.map((k) => esc(o[k])).join(",")));
      outEl.value = rows.join("\n");
      show("success", `Converted ${arr.length} objects to CSV.`);
    } catch (e) { show("error", e.message); }
  });

  document.getElementById("cj-copy").addEventListener("click", async () => {
    if (!outEl.value) return;
    await navigator.clipboard.writeText(outEl.value);
    show("success", "Copied!");
  });
})();
