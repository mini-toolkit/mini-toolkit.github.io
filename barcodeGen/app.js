(() => {
  'use strict';

  // ---------- Utilities ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  let toastTimer = null;
  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function sanitizeFilename(raw, fallback) {
    const cleaned = (raw || '').trim().replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40);
    return cleaned || fallback;
  }

  function bindColorPair(colorInput, hexInput, onChange) {
    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value.toLowerCase();
      onChange();
    });
    hexInput.addEventListener('input', () => {
      const val = hexInput.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        colorInput.value = val;
        onChange();
      }
    });
    hexInput.addEventListener('blur', () => {
      hexInput.value = colorInput.value.toLowerCase();
    });
  }

  async function copyCanvasToClipboard(canvas) {
    if (!navigator.clipboard || !window.ClipboardItem) {
      showToast('이 브라우저에서는 이미지 복사를 지원하지 않습니다. PNG 저장을 이용해주세요.');
      return;
    }
    try {
      const blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Blob 생성 실패'))), 'image/png')
      );
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('클립보드에 이미지가 복사되었습니다.');
    } catch {
      showToast('이미지 복사에 실패했습니다. PNG 저장을 이용해주세요.');
    }
  }

  // ---------- Tabs ----------
  $$('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      $$('.tab-btn').forEach((b) => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', String(active));
      });
      $$('.tab-panel').forEach((panel) => {
        const active = panel.id === targetId;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    });
  });

  // ---------- Barcode Generator ----------
  const FORMAT_META = {
    CODE128: { sample: 'Example 1234', hint: 'ASCII 문자 전체 지원 (자동 모드 전환). FNC1은 \\F 로 입력' },
    CODE128A: { sample: 'EXAMPLE1234', hint: '대문자, 숫자, 제어 문자만 지원' },
    CODE128B: { sample: 'Example 1234', hint: '대/소문자, 숫자, 기호 지원' },
    CODE128C: { sample: '12345678', hint: '짝수 자리수의 숫자만 지원 (예: 8자리)' },
    EAN13: { sample: '8801234567893', hint: '숫자 12자리 또는 체크섬 포함 13자리' },
    EAN8: { sample: '12345670', hint: '숫자 7자리 또는 체크섬 포함 8자리' },
    UPC: { sample: '012345678905', hint: '숫자 11자리 또는 체크섬 포함 12자리 (UPC-A)' },
    CODE39: { sample: 'CODE-39', hint: '대문자(A-Z), 숫자(0-9), 기호(- . $ / + % 공백)' },
    ITF14: { sample: '12345678901231', hint: '숫자 13자리 또는 체크섬 포함 14자리' },
    ITF: { sample: '12345678', hint: '짝수 자리수의 숫자만 지원' },
    MSI: { sample: '123456', hint: '숫자만 지원' },
    MSI10: { sample: '123456', hint: '숫자만 지원 (Mod 10 체크섬 자동 추가)' },
    MSI11: { sample: '123456', hint: '숫자만 지원 (Mod 11 체크섬 자동 추가)' },
    MSI1010: { sample: '123456', hint: '숫자만 지원 (이중 Mod 10 체크섬)' },
    MSI1110: { sample: '123456', hint: '숫자만 지원 (Mod 11 + Mod 10 체크섬)' },
    pharmacode: { sample: '1234', hint: '3 ~ 131070 사이의 정수만 지원' }
  };

  const barcodeState = {
    displayValue: true,
    textPosition: 'bottom',
    textAlign: 'center',
    fontOptions: new Set()
  };

  const barcodeSvg = $('#barcodeSvg');
  const barcodeInvalid = $('#barcodeInvalid');
  const barcodeHint = $('#barcodeHint');
  const userInput = $('#userInput');
  const barcodeType = $('#barcodeType');
  const formatHelper = $('#formatHelper');
  const fontOptionsGroup = $('#fontOptionsGroup');

  function setBarcodeActionDisabled(disabled) {
    $('#saveBarcodePng').disabled = disabled;
    $('#saveBarcodeSvg').disabled = disabled;
    $('#copyBarcodeImg').disabled = disabled;
  }

  function updateFormatHelper() {
    const meta = FORMAT_META[barcodeType.value];
    formatHelper.textContent = meta ? meta.hint : '';
  }

  function renderBarcode() {
    const raw = userInput.value;
    const format = barcodeType.value;

    if (!raw.trim()) {
      barcodeSvg.style.display = 'none';
      barcodeInvalid.hidden = false;
      barcodeHint.textContent = '바코드로 변환할 데이터를 입력해주세요.';
      setBarcodeActionDisabled(true);
      return;
    }

    // Convert \F to FNC1 character (\xCF) for CODE128 variants
    const isCode128 = format.startsWith('CODE128');
    const hasFnc1 = isCode128 && raw.includes('\\F');
    const encodedValue = isCode128 ? raw.replace(/\\F/g, '\xCF') : raw;

    const options = {
      format,
      width: Number($('#bar-width').value),
      height: Number($('#bar-height').value),
      margin: Number($('#bar-margin').value),
      background: $('#background-color').value,
      lineColor: $('#line-color').value,
      displayValue: barcodeState.displayValue,
      textPosition: barcodeState.textPosition,
      textAlign: barcodeState.textAlign,
      font: $('#font').value,
      fontOptions: Array.from(barcodeState.fontOptions).join(' '),
      fontSize: Number($('#bar-fontSize').value),
      textMargin: Number($('#bar-text-margin').value)
    };

    if (hasFnc1) {
      options.text = raw.replace(/\\F/g, ' ');
    }

    try {
      barcodeSvg.innerHTML = '';
      JsBarcode(barcodeSvg, encodedValue, options);
      barcodeSvg.style.display = 'block';
      barcodeInvalid.hidden = true;
      setBarcodeActionDisabled(false);
    } catch {
      barcodeSvg.style.display = 'none';
      barcodeInvalid.hidden = false;
      const meta = FORMAT_META[format];
      barcodeHint.textContent = meta ? `형식 안내: ${meta.hint}` : '';
      setBarcodeActionDisabled(true);
    }
  }

  function svgToCanvas(svgElement) {
    return new Promise((resolve, reject) => {
      const serializer = new XMLSerializer();
      let svgStr = serializer.serializeToString(svgElement);
      if (!svgStr.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const rect = svgElement.getBoundingClientRect();
      const width = Number(svgElement.getAttribute('width')) || Math.ceil(rect.width) || 300;
      const height = Number(svgElement.getAttribute('height')) || Math.ceil(rect.height) || 150;

      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  userInput.addEventListener('input', renderBarcode);
  barcodeType.addEventListener('change', () => {
    updateFormatHelper();
    renderBarcode();
  });

  $('#insertSampleBtn').addEventListener('click', () => {
    const meta = FORMAT_META[barcodeType.value];
    if (meta) {
      userInput.value = meta.sample;
      renderBarcode();
    }
  });

  [
    ['bar-width', 'bar-width-display'],
    ['bar-height', 'bar-height-display'],
    ['bar-margin', 'bar-margin-display'],
    ['bar-fontSize', 'bar-fontSize-display'],
    ['bar-text-margin', 'bar-text-margin-display']
  ].forEach(([inputId, displayId]) => {
    const input = $(`#${inputId}`);
    const display = $(`#${displayId}`);
    input.addEventListener('input', () => {
      display.textContent = input.value;
      renderBarcode();
    });
  });

  bindColorPair($('#background-color'), $('#background-color-hex'), renderBarcode);
  bindColorPair($('#line-color'), $('#line-color-hex'), renderBarcode);

  $$('.display-text').forEach((btn) => {
    btn.addEventListener('click', () => {
      barcodeState.displayValue = btn.dataset.value === 'true';
      $$('.display-text').forEach((b) => b.classList.toggle('active', b === btn));
      fontOptionsGroup.hidden = !barcodeState.displayValue;
      renderBarcode();
    });
  });

  $$('.text-position').forEach((btn) => {
    btn.addEventListener('click', () => {
      barcodeState.textPosition = btn.dataset.value;
      $$('.text-position').forEach((b) => b.classList.toggle('active', b === btn));
      renderBarcode();
    });
  });

  $$('.text-align').forEach((btn) => {
    btn.addEventListener('click', () => {
      barcodeState.textAlign = btn.dataset.value;
      $$('.text-align').forEach((b) => b.classList.toggle('active', b === btn));
      renderBarcode();
    });
  });

  $('#font').addEventListener('change', renderBarcode);

  $$('.font-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      if (barcodeState.fontOptions.has(val)) {
        barcodeState.fontOptions.delete(val);
        btn.classList.remove('active');
      } else {
        barcodeState.fontOptions.add(val);
        btn.classList.add('active');
      }
      renderBarcode();
    });
  });

  $('#saveBarcodePng').addEventListener('click', async () => {
    try {
      const canvas = await svgToCanvas(barcodeSvg);
      canvas.toBlob((blob) => {
        if (blob) {
          const name = sanitizeFilename(userInput.value, 'barcode');
          downloadBlob(blob, `${barcodeType.value}_${name}.png`);
        }
      }, 'image/png');
    } catch {
      showToast('PNG 변환 중 오류가 발생했습니다.');
    }
  });

  $('#saveBarcodeSvg').addEventListener('click', () => {
    const serializer = new XMLSerializer();
    let svgStr = serializer.serializeToString(barcodeSvg);
    if (!svgStr.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const name = sanitizeFilename(userInput.value, 'barcode');
    downloadBlob(blob, `${barcodeType.value}_${name}.svg`);
  });

  $('#copyBarcodeImg').addEventListener('click', async () => {
    try {
      const canvas = await svgToCanvas(barcodeSvg);
      await copyCanvasToClipboard(canvas);
    } catch {
      showToast('이미지 복사에 실패했습니다.');
    }
  });

  // ---------- QR Code Generator ----------
  if (typeof qrcode !== 'undefined' && qrcode.stringToBytesFuncs && qrcode.stringToBytesFuncs['UTF-8']) {
    qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  }

  const qrText = $('#qr-text');
  const qrCanvas = $('#qrcodeCanvas');
  const qrInvalid = $('#qrcodeInvalid');
  const qrHint = $('#qrcodeHint');
  let lastQrModel = null;

  function setQrActionDisabled(disabled) {
    $('#saveQrcodePng').disabled = disabled;
    $('#saveQrcodeSvg').disabled = disabled;
    $('#copyQrcodeImg').disabled = disabled;
  }

  // ----- QR text label state -----
  const qrState = {
    textPosition: 'bottom',
    textAlign: 'center',
    fontOptions: new Set()
  };
  let lastQrLayout = null;

  const QR_MAX_BYTES = { L: 2953, M: 2331, Q: 1663, H: 1273 };
  const ECC_ORDER = ['H', 'Q', 'M', 'L'];

  function escapeXml(s) {
    return s.replace(/[<>&"']/g, (ch) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[ch]));
  }

  /** Wrap text to fit maxWidth (handles CJK without spaces by char-level breaking). */
  function wrapText(ctx, text, maxWidth, maxLines) {
    const lines = [];
    const paragraphs = text.split(/\r?\n/);
    for (const para of paragraphs) {
      let current = '';
      for (const ch of Array.from(para)) {
        const test = current + ch;
        if (ctx.measureText(test).width > maxWidth && current) {
          // Prefer breaking at the last space if there is one
          const sp = current.lastIndexOf(' ');
          if (sp > 0 && ch !== ' ') {
            lines.push(current.slice(0, sp));
            current = current.slice(sp + 1) + ch;
          } else {
            lines.push(current);
            current = ch === ' ' ? '' : ch;
          }
        } else {
          current = test;
        }
      }
      lines.push(current);
    }

    if (lines.length > maxLines) {
      const kept = lines.slice(0, maxLines);
      let last = kept[maxLines - 1];
      while (last && ctx.measureText(last + '…').width > maxWidth) {
        last = Array.from(last).slice(0, -1).join('');
      }
      kept[maxLines - 1] = last + '…';
      return kept;
    }
    return lines;
  }

  function getQrSettings() {
    const fontStyle = qrState.fontOptions.has('italic') ? 'italic ' : '';
    const fontWeight = qrState.fontOptions.has('bold') ? 'bold ' : '';
    const fontSize = Number($('#qr-fontSize').value);
    const fontFamily = $('#qr-font').value;
    return {
      size: Number($('#qr-size').value),
      marginModules: Number($('#qr-margin').value),
      ecc: $('#qr-ecc').value,
      bgColor: $('#qr-background-color').value,
      fgColor: $('#qr-code-color').value,
      fontSize,
      fontFamily,
      fontStyle: fontStyle.trim(),
      fontWeight: fontWeight.trim(),
      fontCss: `${fontStyle}${fontWeight}${fontSize}px ${fontFamily}`,
      textMargin: Number($('#qr-text-margin').value),
      maxLines: Number($('#qr-max-lines').value)
    };
  }

  /** Compute full image layout: QR area + optional text block. */
  function computeQrLayout(qr, s, labelText) {
    const count = qr.getModuleCount();
    const cellSize = s.size / (count + s.marginModules * 2);
    const quietPx = s.marginModules * cellSize;

    let lines = [];
    let extra = 0; // extra height added for the text block
    const lineHeight = Math.round(s.fontSize * 1.25);
    // Padding between text and the image edge / sides (at least 8px)
    const sidePad = Math.max(quietPx, 8);

    if (labelText) {
      const measureCtx = document.createElement('canvas').getContext('2d');
      measureCtx.font = s.fontCss;
      lines = wrapText(measureCtx, labelText, s.size - sidePad * 2, s.maxLines);
      // Text sits inside the QR quiet zone, then extends the image as needed
      extra = Math.max(0, lines.length * lineHeight + s.textMargin + sidePad - quietPx);
    }

    const isTop = qrState.textPosition === 'top';
    const qrOffsetY = isTop ? extra : 0;
    const textTop = isTop
      ? extra - (lines.length * lineHeight + s.textMargin - quietPx)
      : s.size - quietPx + s.textMargin;

    let textX;
    let anchor;
    if (qrState.textAlign === 'left') {
      textX = sidePad;
      anchor = 'start';
    } else if (qrState.textAlign === 'right') {
      textX = s.size - sidePad;
      anchor = 'end';
    } else {
      textX = s.size / 2;
      anchor = 'middle';
    }

    return {
      count,
      cellSize,
      width: s.size,
      height: Math.ceil(s.size + extra),
      qrOffsetY,
      lines,
      lineHeight,
      textTop,
      textX,
      anchor
    };
  }

  function renderQRCode() {
    const text = qrText.value;
    if (!text.trim()) {
      qrCanvas.style.display = 'none';
      qrInvalid.hidden = false;
      qrHint.textContent = 'QR코드로 변환할 텍스트나 URL을 입력해주세요.';
      lastQrModel = null;
      lastQrLayout = null;
      setQrActionDisabled(true);
      return;
    }

    const s = getQrSettings();
    const byteLen = qrcode.stringToBytes(text).length;

    try {
      // Try selected level first, then fall back to lower levels automatically
      const candidates = [s.ecc, ...ECC_ORDER.slice(ECC_ORDER.indexOf(s.ecc) + 1)];
      let qr = null;
      let usedEcc = null;
      for (const level of candidates) {
        try {
          const q = qrcode(0, level);
          q.addData(text);
          q.make();
          qr = q;
          usedEcc = level;
          break;
        } catch {
          /* try next lower level */
        }
      }
      if (!qr) {
        throw new Error(`overflow:${byteLen}`);
      }
      if (usedEcc !== s.ecc) {
        showToast(`데이터가 길어 오류 복원 수준을 ${s.ecc} → ${usedEcc}(으)로 자동 조정했습니다.`);
      }
      lastQrModel = qr;

      const labelText = $('#qr-label').value.trim();
      const L = computeQrLayout(qr, s, labelText);
      lastQrLayout = L;

      qrCanvas.width = L.width;
      qrCanvas.height = L.height;
      const ctx = qrCanvas.getContext('2d');
      ctx.fillStyle = s.bgColor;
      ctx.fillRect(0, 0, L.width, L.height);

      ctx.fillStyle = s.fgColor;
      const m = s.marginModules;
      for (let r = 0; r < L.count; r++) {
        for (let c = 0; c < L.count; c++) {
          if (qr.isDark(r, c)) {
            const x = Math.floor((c + m) * L.cellSize);
            const y = Math.floor((r + m) * L.cellSize);
            const w = Math.ceil((c + m + 1) * L.cellSize) - x;
            const h = Math.ceil((r + m + 1) * L.cellSize) - y;
            ctx.fillRect(x, y + L.qrOffsetY, w, h);
          }
        }
      }

      if (L.lines.length) {
        ctx.font = s.fontCss;
        ctx.textBaseline = 'top';
        ctx.textAlign = L.anchor === 'start' ? 'left' : L.anchor === 'end' ? 'right' : 'center';
        L.lines.forEach((line, i) => {
          ctx.fillText(line, L.textX, L.textTop + i * L.lineHeight);
        });
      }

      qrCanvas.style.display = 'block';
      qrInvalid.hidden = true;
      setQrActionDisabled(false);
    } catch {
      qrCanvas.style.display = 'none';
      qrInvalid.hidden = false;
      qrHint.textContent = `데이터가 너무 깁니다. 현재 ${byteLen.toLocaleString()} bytes / 최대 ${QR_MAX_BYTES.L.toLocaleString()} bytes (한글은 1자당 3 bytes)`;
      lastQrModel = null;
      lastQrLayout = null;
      setQrActionDisabled(true);
    }
  }

  qrText.addEventListener('input', renderQRCode);
  $('#qr-btn').addEventListener('click', renderQRCode);
  $('#qr-ecc').addEventListener('change', renderQRCode);
  $('#qr-font').addEventListener('change', renderQRCode);
  $('#qr-label').addEventListener('input', renderQRCode);

  [
    ['qr-size', 'qr-size-display'],
    ['qr-margin', 'qr-margin-display'],
    ['qr-fontSize', 'qr-fontSize-display'],
    ['qr-text-margin', 'qr-text-margin-display'],
    ['qr-max-lines', 'qr-max-lines-display']
  ].forEach(([inputId, displayId]) => {
    const input = $(`#${inputId}`);
    const display = $(`#${displayId}`);
    input.addEventListener('input', () => {
      display.textContent = input.value;
      renderQRCode();
    });
  });

  bindColorPair($('#qr-background-color'), $('#qr-background-color-hex'), renderQRCode);
  bindColorPair($('#qr-code-color'), $('#qr-code-color-hex'), renderQRCode);

  $$('.qr-text-position').forEach((btn) => {
    btn.addEventListener('click', () => {
      qrState.textPosition = btn.dataset.value;
      $$('.qr-text-position').forEach((b) => b.classList.toggle('active', b === btn));
      renderQRCode();
    });
  });

  $$('.qr-text-align').forEach((btn) => {
    btn.addEventListener('click', () => {
      qrState.textAlign = btn.dataset.value;
      $$('.qr-text-align').forEach((b) => b.classList.toggle('active', b === btn));
      renderQRCode();
    });
  });

  $$('.qr-font-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value;
      if (qrState.fontOptions.has(val)) {
        qrState.fontOptions.delete(val);
        btn.classList.remove('active');
      } else {
        qrState.fontOptions.add(val);
        btn.classList.add('active');
      }
      renderQRCode();
    });
  });

  $('#saveQrcodePng').addEventListener('click', () => {
    qrCanvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, `qrcode_${sanitizeFilename(qrText.value, 'qr')}.png`);
      }
    }, 'image/png');
  });

  $('#saveQrcodeSvg').addEventListener('click', () => {
    if (!lastQrModel || !lastQrLayout) return;
    const s = getQrSettings();
    const L = lastQrLayout;
    const m = s.marginModules;

    const rects = [];
    for (let r = 0; r < L.count; r++) {
      for (let c = 0; c < L.count; c++) {
        if (lastQrModel.isDark(r, c)) {
          rects.push(`<rect x="${c + m}" y="${r + m}" width="1" height="1"/>`);
        }
      }
    }

    const textEls = L.lines.map((line, i) => {
      // SVG text y is the baseline; approximate top-baseline offset as 0.8em
      const y = (L.textTop + i * L.lineHeight + s.fontSize * 0.8).toFixed(2);
      return `<text x="${L.textX.toFixed(2)}" y="${y}" text-anchor="${L.anchor}">${escapeXml(line)}</text>`;
    });

    const fontAttrs = [
      `font-family="${s.fontFamily}"`,
      `font-size="${s.fontSize}"`,
      s.fontWeight ? `font-weight="${s.fontWeight}"` : '',
      s.fontStyle ? `font-style="${s.fontStyle}"` : ''
    ].filter(Boolean).join(' ');

    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${L.width} ${L.height}" width="${L.width}" height="${L.height}">`,
      `<rect width="${L.width}" height="${L.height}" fill="${s.bgColor}"/>`,
      `<g fill="${s.fgColor}" shape-rendering="crispEdges" transform="translate(0 ${L.qrOffsetY}) scale(${L.cellSize})">`,
      ...rects,
      `</g>`,
      textEls.length ? `<g fill="${s.fgColor}" ${fontAttrs}>${textEls.join('')}</g>` : '',
      `</svg>`
    ].join('');

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    downloadBlob(blob, `qrcode_${sanitizeFilename(qrText.value, 'qr')}.svg`);
  });

  $('#copyQrcodeImg').addEventListener('click', () => copyCanvasToClipboard(qrCanvas));

  // ---------- Initial Render ----------
  updateFormatHelper();
  renderBarcode();
  renderQRCode();
})();
