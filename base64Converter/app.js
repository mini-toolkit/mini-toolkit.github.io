(function () {
  "use strict";

  const inputEl = document.getElementById("b64-input");
  const outputEl = document.getElementById("b64-output");
  const statusEl = document.getElementById("b64-status");

  function showStatus(type, msg) {
    statusEl.className = "status-bar show " + type;
    statusEl.textContent = msg;
  }

  document.getElementById("b64-encode").addEventListener("click", () => {
    try {
      const bytes = new TextEncoder().encode(inputEl.value);
      let binary = "";
      bytes.forEach((b) => {
        binary += String.fromCharCode(b);
      });
      outputEl.value = btoa(binary);
      showStatus("success", "Base64로 인코딩했습니다.");
    } catch (err) {
      showStatus("error", "인코딩 오류: " + err.message);
    }
  });

  document.getElementById("b64-decode").addEventListener("click", () => {
    try {
      const binary = atob(inputEl.value.trim());
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      outputEl.value = new TextDecoder().decode(bytes);
      showStatus("success", "원본 텍스트로 디코딩했습니다.");
    } catch {
      showStatus("error", "유효하지 않은 Base64 문자열입니다.");
    }
  });

  document.getElementById("b64-clear").addEventListener("click", () => {
    inputEl.value = "";
    outputEl.value = "";
    statusEl.className = "status-bar";
  });
})();
