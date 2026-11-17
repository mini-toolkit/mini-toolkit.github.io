(function () {
  "use strict";

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const pageSizeEl = document.getElementById("pageSize");
  const orientationEl = document.getElementById("orientation");
  const marginMmEl = document.getElementById("marginMm");
  const fileNameEl = document.getElementById("fileName");
  const addMoreBtn = document.getElementById("addMoreBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const convertBtn = document.getElementById("convertBtn");
  const imageCountLabel = document.getElementById("imageCountLabel");
  const statusEl = document.getElementById("pdfStatus");
  const imageListEl = document.getElementById("imageList");

  /** @type {Array<{ id: string, file: File, url: string, width: number, height: number }>} */
  let items = [];

  function setStatus(type, msg) {
    if (!msg) {
      statusEl.className = "status-bar";
      statusEl.textContent = "";
      return;
    }
    statusEl.className = "status-bar show " + type;
    statusEl.textContent = msg;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function loadImageMeta(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file,
          url,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(file.name + " 이미지를 읽을 수 없습니다."));
      };
      img.src = url;
    });
  }

  async function addFiles(fileList) {
    const imageFiles = Array.from(fileList || []).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setStatus("error", "이미지 파일(PNG, JPG, WebP, GIF 등)만 추가할 수 있습니다.");
      return;
    }

    setStatus("", "");
    const loaded = [];
    for (const file of imageFiles) {
      try {
        loaded.push(await loadImageMeta(file));
      } catch (err) {
        setStatus("error", err.message);
      }
    }

    if (loaded.length > 0) {
      items = items.concat(loaded);
      renderList();
    }
  }

  function removeItem(index) {
    const [removed] = items.splice(index, 1);
    if (removed) URL.revokeObjectURL(removed.url);
    renderList();
  }

  function moveItem(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const temp = items[index];
    items[index] = items[target];
    items[target] = temp;
    renderList();
  }

  function clearAll() {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    items = [];
    setStatus("", "");
    renderList();
  }

  function renderList() {
    imageListEl.innerHTML = "";
    imageCountLabel.textContent = `선택된 이미지: ${items.length}장`;
    const hasItems = items.length > 0;
    clearAllBtn.disabled = !hasItems;
    convertBtn.disabled = !hasItems;

    items.forEach((item, idx) => {
      const li = document.createElement("li");
      li.className = "image-item";

      const order = document.createElement("span");
      order.className = "image-order";
      order.textContent = String(idx + 1);

      const thumb = document.createElement("img");
      thumb.className = "image-thumb";
      thumb.src = item.url;
      thumb.alt = item.file.name;

      const meta = document.createElement("div");
      meta.className = "image-meta";
      const nameEl = document.createElement("div");
      nameEl.className = "image-name";
      nameEl.textContent = item.file.name;
      const infoEl = document.createElement("div");
      infoEl.className = "image-info";
      infoEl.textContent = `${item.width} × ${item.height}px · ${formatBytes(item.file.size)}`;
      meta.append(nameEl, infoEl);

      const controls = document.createElement("div");
      controls.className = "image-controls";

      const upBtn = document.createElement("button");
      upBtn.type = "button";
      upBtn.className = "icon-btn";
      upBtn.title = "위로 이동";
      upBtn.textContent = "↑";
      upBtn.disabled = idx === 0;
      upBtn.addEventListener("click", () => moveItem(idx, -1));

      const downBtn = document.createElement("button");
      downBtn.type = "button";
      downBtn.className = "icon-btn";
      downBtn.title = "아래로 이동";
      downBtn.textContent = "↓";
      downBtn.disabled = idx === items.length - 1;
      downBtn.addEventListener("click", () => moveItem(idx, 1));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "icon-btn danger";
      delBtn.title = "삭제";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => removeItem(idx));

      controls.append(upBtn, downBtn, delBtn);
      li.append(order, thumb, meta, controls);
      imageListEl.appendChild(li);
    });
  }

  function renderToJpegDataUrl(item) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = item.width;
        canvas.height = item.height;
        const ctx = canvas.getContext("2d");
        // 투명 배경 PNG/WebP가 PDF에서 검게 보이지 않도록 흰 배경 채움
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.onerror = () => reject(new Error(item.file.name + " 변환 중 오류가 발생했습니다."));
      img.src = item.url;
    });
  }

  function getPageOrientation(item, setting) {
    if (setting === "portrait" || setting === "landscape") return setting;
    return item.width > item.height ? "landscape" : "portrait";
  }

  async function convertToPdf() {
    if (items.length === 0) return;
    if (!window.jspdf || !window.jspdf.jsPDF) {
      setStatus("error", "PDF 라이브러리를 불러오지 못했습니다. 페이지를 새로고침해 주세요.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const pageSize = pageSizeEl.value;
    const orientationSetting = orientationEl.value;
    const margin = Number(marginMmEl.value) || 0;
    const rawName = (fileNameEl.value || "").trim() || "images.pdf";
    const outputName = rawName.toLowerCase().endsWith(".pdf") ? rawName : rawName + ".pdf";

    convertBtn.disabled = true;
    convertBtn.textContent = "PDF 생성 중...";
    setStatus("", "");

    try {
      let doc = null;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const jpegData = await renderToJpegDataUrl(item);

        if (pageSize === "fit") {
          // 1px ≈ 0.264583mm (96 DPI 기준)
          const pxToMm = 25.4 / 96;
          const imgWmm = Math.max(10, item.width * pxToMm);
          const imgHmm = Math.max(10, item.height * pxToMm);
          const pageW = imgWmm + margin * 2;
          const pageH = imgHmm + margin * 2;
          const orient = pageW > pageH ? "landscape" : "portrait";

          if (i === 0) {
            doc = new jsPDF({ orientation: orient, unit: "mm", format: [pageW, pageH] });
          } else {
            doc.addPage([pageW, pageH], orient);
          }
          doc.addImage(jpegData, "JPEG", margin, margin, imgWmm, imgHmm, undefined, "FAST");
        } else {
          const orient = getPageOrientation(item, orientationSetting);
          if (i === 0) {
            doc = new jsPDF({ orientation: orient, unit: "mm", format: pageSize });
          } else {
            doc.addPage(pageSize, orient);
          }

          const pageW = doc.internal.pageSize.getWidth();
          const pageH = doc.internal.pageSize.getHeight();
          const maxW = Math.max(10, pageW - margin * 2);
          const maxH = Math.max(10, pageH - margin * 2);
          const ratio = Math.min(maxW / item.width, maxH / item.height);
          const drawW = item.width * ratio;
          const drawH = item.height * ratio;
          const x = (pageW - drawW) / 2;
          const y = (pageH - drawH) / 2;

          doc.addImage(jpegData, "JPEG", x, y, drawW, drawH, undefined, "FAST");
        }
      }

      doc.save(outputName);
      setStatus("success", `${items.length}장의 이미지를 "${outputName}" 파일로 저장했습니다.`);
    } catch (err) {
      setStatus("error", "PDF 생성 실패: " + err.message);
    } finally {
      convertBtn.disabled = items.length === 0;
      convertBtn.textContent = "PDF 다운로드";
    }
  }

  // Events
  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("is-dragover");
  });
  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("is-dragover");
  });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-dragover");
    addFiles(e.dataTransfer.files);
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      addFiles(fileInput.files);
      fileInput.value = "";
    }
  });

  pageSizeEl.addEventListener("change", () => {
    orientationEl.disabled = pageSizeEl.value === "fit";
  });

  addMoreBtn.addEventListener("click", () => fileInput.click());
  clearAllBtn.addEventListener("click", clearAll);
  convertBtn.addEventListener("click", convertToPdf);
})();
