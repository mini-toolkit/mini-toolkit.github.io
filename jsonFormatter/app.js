(function () {
  "use strict";

  const inputEl = document.getElementById("jf-input");
  const outputEl = document.getElementById("jf-output");
  const indentEl = document.getElementById("jf-indent");
  const statusEl = document.getElementById("jf-status");

  function setStatus(type, msg) {
    statusEl.className = "status-bar show " + type;
    statusEl.textContent = msg;
  }

  function processJson(minify) {
    const raw = inputEl.value.trim();
    if (!raw) {
      outputEl.value = "";
      setStatus("error", "JSON 문자열을 먼저 입력해 주세요.");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const spaces = minify ? 0 : Number(indentEl.value);
      outputEl.value = JSON.stringify(parsed, null, spaces);
      setStatus("success", minify ? "유효한 JSON입니다. 한 줄로 압축했습니다." : "유효한 JSON입니다. 깔끔하게 정렬했습니다.");
    } catch (err) {
      setStatus("error", "JSON 문법 오류: " + err.message);
    }
  }

  document.getElementById("jf-format").addEventListener("click", () => processJson(false));
  document.getElementById("jf-minify").addEventListener("click", () => processJson(true));
  document.getElementById("jf-sample").addEventListener("click", () => {
    inputEl.value = '{"project":"mini-toolkit","version":1.0,"features":["SPA","JSON Formatter","Markdown Blog"],"author":{"support":"coffee"}}';
    processJson(false);
  });
  document.getElementById("jf-copy").addEventListener("click", async () => {
    if (!outputEl.value) {
      setStatus("error", "복사할 결과가 없습니다.");
      return;
    }
    try {
      await navigator.clipboard.writeText(outputEl.value);
      setStatus("success", "클립보드에 복사되었습니다.");
    } catch {
      outputEl.select();
      setStatus("error", "자동 복사에 실패했습니다. 출력창을 직접 복사해 주세요.");
    }
  });
  document.getElementById("jf-clear").addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    statusEl.className = "status-bar";
  });
})();
