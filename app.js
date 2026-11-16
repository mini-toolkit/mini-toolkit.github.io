(() => {
  'use strict';

  const AFTERNOON_SHIFT = { start: '19:00', end: '04:00', breakMin: 60 };
  const STORAGE_KEY = 'coupang_contract_wage_calc_v2';
  const OT_STORAGE_KEY = 'coupang_contract_ot_v1';
  const SETTINGS_KEY = 'coupang_contract_settings_v6';

  const BRUSH_LABELS = {
    afternoon: '오후조',
    leave: '연차',
    public_holiday: '공휴',
    special: '특근',
    ot: '연장',
    late: '지각',
    early: '조퇴',
    off: '휴무'
  };

  function parseRecord(raw) {
    if (!raw) return { type: 'afternoon', hours: 0 };
    if (raw === 'holiday') return { type: 'special', hours: 0 };
    if (raw.includes(':')) {
      const [type, h] = raw.split(':');
      return { type, hours: Math.max(0, Number(h) || 0) };
    }
    return { type: raw, hours: 0 };
  }

  // ==================== 유틸리티 ====================
  function formatNum(amount) {
    return Math.round(amount).toLocaleString('ko-KR');
  }

  function formatKRW(amount) {
    return `${formatNum(amount)}원`;
  }

  function formatHours(hours) {
    const totalMin = Math.round(hours * 60);
    if (totalMin === 0) return '0시간';
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h === 0) return `${m}분`;
    if (m === 0) return `${h}시간`;
    return `${h}시간 ${m}분`;
  }

  function formatShortTag(hours) {
    const totalMin = Math.round(hours * 60);
    if (totalMin > 0 && totalMin % 60 === 0) return `${totalMin / 60}h`;
    return `${totalMin}분`;
  }

  function parseTimeToMinutes(timeStr) {
    const [h, m] = (timeStr || '00:00').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function calcOverlapMinutes(aStart, aEnd, bStart, bEnd) {
    return Math.max(0, Math.min(aEnd, bEnd) - Math.max(aStart, bStart));
  }

  /**
   * 1일 근무시간(정규, 야간) 계산
   */
  function computeShiftHours(startStr, endStr, breakMin) {
    const startMin = parseTimeToMinutes(startStr);
    let endMin = parseTimeToMinutes(endStr);
    if (endMin <= startMin) {
      endMin += 1440;
    }

    const totalElapsedMin = endMin - startMin;
    const safeBreakMin = Math.min(Math.max(0, breakMin), totalElapsedMin);
    const workedMin = Math.max(0, totalElapsedMin - safeBreakMin);

    const nightWindows = [
      [0, 360],
      [1320, 1800],
      [2760, 3240]
    ];
    let rawNightMin = 0;
    for (const [wStart, wEnd] of nightWindows) {
      rawNightMin += calcOverlapMinutes(startMin, endMin, wStart, wEnd);
    }

    // 쿠팡 오후조(19:00~04:00) 휴게시간 1시간은 야간시간대(22:00~04:00)에 포함되므로 6시간 - 1시간 = 5시간
    const paidNightMin = Math.max(0, rawNightMin - safeBreakMin);

    return {
      regularHours: Math.min(8, workedMin / 60),
      nightHours: paidNightMin / 60
    };
  }

  /**
   * 계약직 4대보험(2026년 요율) 및 근로소득세(간이세액 추정) 계산
   */
  function calculateContractTaxes(grossPay, pensionBaseOverride) {
    if (grossPay <= 0) {
      return {
        totalTax: 0,
        items: [
          { label: '소득세', amount: 0 },
          { label: '주민세', amount: 0 },
          { label: '건강보험', amount: 0 },
          { label: '장기요양보험', amount: 0 },
          { label: '국민연금', amount: 0 },
          { label: '고용보험', amount: 0 }
        ]
      };
    }

    const pensionBase = pensionBaseOverride > 0 ? pensionBaseOverride : grossPay;
    const pension = Math.floor((pensionBase * 0.0475) / 10) * 10;
    const health = Math.floor((grossPay * 0.03595) / 10) * 10;
    const longTermCare = Math.floor((health * 0.1314) / 10) * 10;
    const empInsurance = Math.floor((grossPay * 0.009) / 10) * 10;

    // 국세청 근로소득 간이세액표 산식 (공제대상가족 1인, 2만원 구간 중간값 기준)
    const bracketGross = grossPay >= 1060000
      ? Math.floor(grossPay / 20000) * 20000 + 10000
      : grossPay;
    const annualGross = bracketGross * 12;
    let earnedDed = 0;
    if (annualGross <= 5000000) earnedDed = annualGross * 0.7;
    else if (annualGross <= 15000000) earnedDed = 3500000 + (annualGross - 5000000) * 0.4;
    else if (annualGross <= 45000000) earnedDed = 7500000 + (annualGross - 15000000) * 0.15;
    else if (annualGross <= 100000000) earnedDed = 12000000 + (annualGross - 45000000) * 0.05;
    else earnedDed = Math.min(20000000, 14750000 + (annualGross - 100000000) * 0.02);

    let specialDed = 0;
    if (annualGross <= 30000000) specialDed = 3100000 + annualGross * 0.04;
    else if (annualGross <= 45000000) specialDed = 3100000 + annualGross * 0.04 - (annualGross - 30000000) * 0.05;
    else if (annualGross <= 70000000) specialDed = 3100000 + annualGross * 0.015;
    else specialDed = 3100000 + annualGross * 0.005;

    const tablePensionAnnual = annualGross * 0.045;
    const taxBase = Math.max(0, annualGross - earnedDed - 1500000 - tablePensionAnnual - specialDed);

    let calcTax = 0;
    if (taxBase <= 14000000) calcTax = taxBase * 0.06;
    else if (taxBase <= 50000000) calcTax = 840000 + (taxBase - 14000000) * 0.15;
    else if (taxBase <= 88000000) calcTax = 6240000 + (taxBase - 50000000) * 0.24;
    else calcTax = 15360000 + (taxBase - 88000000) * 0.35;

    const rawCredit = calcTax <= 1300000 ? calcTax * 0.55 : 715000 + (calcTax - 1300000) * 0.3;
    let creditLimit = 740000;
    if (annualGross > 33000000 && annualGross <= 70000000) {
      creditLimit = 660000;
    } else if (annualGross > 70000000) {
      creditLimit = 500000;
    }
    const taxCredit = Math.min(rawCredit, creditLimit);

    let incomeTax = Math.floor(Math.max(0, (calcTax - taxCredit) / 12) / 10) * 10;
    if (incomeTax < 1000) incomeTax = 0;
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;

    const items = [
      { label: '소득세', amount: incomeTax },
      { label: '주민세', amount: localTax },
      { label: '건강보험', amount: health },
      { label: '장기요양보험', amount: longTermCare },
      { label: '국민연금', amount: pension },
      { label: '고용보험', amount: empInsurance }
    ];

    const totalTax = pension + health + longTermCare + empInsurance + incomeTax + localTax;
    return { totalTax, items };
  }

  // ==================== 상태 & 저장 ====================
  const now = new Date();
  let calYear = now.getFullYear();
  let calMonth = 2; // 3월
  let activeBrush = 'off';

  let calRecords = {};
  let otRecords = {};
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) calRecords = JSON.parse(saved) || {};
    const savedOt = localStorage.getItem(OT_STORAGE_KEY);
    if (savedOt) otRecords = JSON.parse(savedOt) || {};
  } catch {
    calRecords = {};
    otRecords = {};
  }

  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calRecords));
      localStorage.setItem(OT_STORAGE_KEY, JSON.stringify(otRecords));
    } catch {
      // ignore storage quota errors
    }
  }

  const cEls = {
    monthTitle: document.getElementById('cal-month-title'),
    prevBtn: document.getElementById('btn-prev-month'),
    nextBtn: document.getElementById('btn-next-month'),
    clearBtn: document.getElementById('btn-clear-month'),
    brushBtns: document.querySelectorAll('#cal-brush-options .brush-btn'),
    brushHoursWrap: document.getElementById('brush-hours-wrap'),
    brushHoursInput: document.getElementById('brush-hours-input'),
    grid: document.getElementById('cal-grid'),
    hourlyWage: document.getElementById('cal-hourly-wage'),
    forkliftPay: document.getElementById('cal-forklift-pay'),
    attendanceBonus: document.getElementById('cal-attendance-bonus'),
    overtimeHours: document.getElementById('cal-overtime-hours'),
    lateHours: document.getElementById('cal-late-hours'),
    earlyHours: document.getElementById('cal-early-hours'),
    prorateDays: document.getElementById('cal-prorate-days'),
    cashbackPay: document.getElementById('cal-cashback-pay'),
    pensionBase: document.getElementById('cal-pension-base'),
    workDaysBadge: document.getElementById('cal-work-days-badge'),
    ordinaryWageBadge: document.getElementById('cal-ordinary-wage-badge'),
    netPay: document.getElementById('cal-net-pay'),
    grossPay: document.getElementById('cal-gross-pay'),
    totalTax: document.getElementById('cal-total-tax'),
    payslipTbody: document.getElementById('payslip-tbody'),
    metaDays: document.getElementById('cal-meta-days'),
    metaHolidayHours: document.getElementById('cal-meta-holiday-hours'),
    metaNightHours: document.getElementById('cal-meta-night-hours')
  };

  function saveSettings() {
    try {
      const data = {
        calYear,
        calMonth,
        activeBrush,
        brushHours: cEls.brushHoursInput.value,
        calHourlyWage: cEls.hourlyWage.value,
        calForkliftPay: cEls.forkliftPay.value,
        calAttendanceBonus: cEls.attendanceBonus.value,
        calOvertimeHours: cEls.overtimeHours.value,
        calLateHours: cEls.lateHours.value,
        calEarlyHours: cEls.earlyHours.value,
        calProrateDays: cEls.prorateDays.value,
        calCashbackPay: cEls.cashbackPay.value,
        calPensionBase: cEls.pensionBase.value
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    } catch {
      // ignore storage quota errors
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!data) return;

      if (typeof data.calYear === 'number') calYear = data.calYear;
      if (typeof data.calMonth === 'number') calMonth = data.calMonth;
      if (data.activeBrush && BRUSH_LABELS[data.activeBrush]) {
        activeBrush = data.activeBrush;
        cEls.brushBtns.forEach((b) => b.classList.toggle('active', b.dataset.brush === activeBrush));
        cEls.brushHoursWrap.classList.toggle(
          'hidden',
          activeBrush !== 'late' && activeBrush !== 'early' && activeBrush !== 'ot'
        );
      }
      if (data.brushHours !== undefined) cEls.brushHoursInput.value = data.brushHours;
      if (data.calHourlyWage !== undefined) cEls.hourlyWage.value = data.calHourlyWage;
      if (data.calForkliftPay !== undefined) cEls.forkliftPay.value = data.calForkliftPay;
      if (data.calAttendanceBonus !== undefined) cEls.attendanceBonus.value = data.calAttendanceBonus;
      if (data.calOvertimeHours !== undefined) cEls.overtimeHours.value = data.calOvertimeHours;
      if (data.calLateHours !== undefined) cEls.lateHours.value = data.calLateHours;
      if (data.calEarlyHours !== undefined) cEls.earlyHours.value = data.calEarlyHours;
      if (data.calProrateDays !== undefined) cEls.prorateDays.value = data.calProrateDays;
      if (data.calCashbackPay !== undefined) cEls.cashbackPay.value = data.calCashbackPay;
      if (data.calPensionBase !== undefined) cEls.pensionBase.value = data.calPensionBase;
    } catch {
      // ignore parse errors
    }
  }

  function getDateKey(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  // ==================== 렌더링 & 계산 ====================
  function renderCalendar() {
    cEls.monthTitle.textContent = `${calYear}년 ${calMonth + 1}월`;
    cEls.grid.innerHTML = '';

    const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-cell empty';
      cEls.grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dow = new Date(calYear, calMonth, day).getDay();
      const key = getDateKey(calYear, calMonth, day);
      const { type: shiftType, hours: shiftHours } = parseRecord(calRecords[key]);

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      if (dow === 0) cell.classList.add('sun');
      if (dow === 6) cell.classList.add('sat');
      if (shiftType === 'off') cell.classList.add('is-off');

      const numEl = document.createElement('div');
      numEl.className = 'cal-day-num';
      numEl.textContent = day;
      cell.appendChild(numEl);

      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'cal-tags';

      if (BRUSH_LABELS[shiftType]) {
        const tag = document.createElement('div');
        tag.className = `cal-tag ${shiftType}`;
        tag.textContent = (shiftType === 'late' || shiftType === 'early') && shiftHours > 0
          ? `${BRUSH_LABELS[shiftType]} ${formatShortTag(shiftHours)}`
          : BRUSH_LABELS[shiftType];
        tagsWrap.appendChild(tag);
      }

      const dayOt = Number(otRecords[key]) || 0;
      if (dayOt > 0 && shiftType !== 'off' && shiftType !== 'leave') {
        const otTag = document.createElement('div');
        otTag.className = 'cal-tag ot';
        otTag.textContent = `+연장 ${formatShortTag(dayOt)}`;
        tagsWrap.appendChild(otTag);
      }

      cell.appendChild(tagsWrap);

      cell.addEventListener('click', () => {
        const mins = Math.max(1, Math.min(480, Math.round(Number(cEls.brushHoursInput.value) || 10)));
        const h = mins / 60;
        if (activeBrush === 'ot') {
          if (shiftType === 'off' || shiftType === 'leave') return;
          if (Math.round((otRecords[key] || 0) * 60) === mins) {
            delete otRecords[key];
          } else {
            otRecords[key] = h;
          }
        } else if (activeBrush === 'afternoon') {
          delete calRecords[key];
        } else if (activeBrush === 'late' || activeBrush === 'early') {
          const val = `${activeBrush}:${h}`;
          const prev = parseRecord(calRecords[key]);
          if (prev.type === activeBrush && Math.round(prev.hours * 60) === mins) {
            delete calRecords[key];
          } else {
            calRecords[key] = val;
          }
        } else if (calRecords[key] === activeBrush) {
          delete calRecords[key];
        } else {
          calRecords[key] = activeBrush;
          if (activeBrush === 'off' || activeBrush === 'leave') {
            delete otRecords[key];
          }
        }
        saveRecords();
        renderCalendar();
        updateCalendarSummary();
      });

      cEls.grid.appendChild(cell);
    }
  }

  function renderPayslipTable(payRows, taxItems, grossPay, totalTax) {
    const tbody = cEls.payslipTbody;
    tbody.innerHTML = '';

    const rowCount = Math.max(payRows.length, taxItems.length);

    for (let i = 0; i < rowCount; i++) {
      const tr = document.createElement('tr');
      const pay = payRows[i];
      const tax = taxItems[i];

      if (pay) {
        if (pay.catRowSpan > 0) {
          const catTd = document.createElement('td');
          catTd.className = 'cat-cell';
          catTd.rowSpan = pay.catRowSpan;
          catTd.innerHTML = pay.category;
          tr.appendChild(catTd);
        }
        const itemTd = document.createElement('td');
        itemTd.className = 'item-cell';
        itemTd.textContent = pay.label;
        const amtTd = document.createElement('td');
        amtTd.className = 'amt-cell';
        if (pay.amount < 0) amtTd.classList.add('text-danger');
        amtTd.textContent = formatNum(pay.amount);
        tr.append(itemTd, amtTd);
      } else {
        const emptyCat = document.createElement('td');
        const emptyItem = document.createElement('td');
        const emptyAmt = document.createElement('td');
        tr.append(emptyCat, emptyItem, emptyAmt);
      }

      if (tax) {
        const taxItemTd = document.createElement('td');
        taxItemTd.className = 'item-cell';
        taxItemTd.textContent = tax.label;
        const taxAmtTd = document.createElement('td');
        taxAmtTd.className = 'amt-cell';
        taxAmtTd.textContent = formatNum(tax.amount);
        tr.append(taxItemTd, taxAmtTd);
      } else {
        const emptyTaxItem = document.createElement('td');
        const emptyTaxAmt = document.createElement('td');
        tr.append(emptyTaxItem, emptyTaxAmt);
      }

      tbody.appendChild(tr);
    }

    // 합계 행
    const totalTr = document.createElement('tr');
    totalTr.className = 'total-row';
    const payTotalLabel = document.createElement('td');
    payTotalLabel.colSpan = 2;
    payTotalLabel.style.textAlign = 'center';
    payTotalLabel.textContent = '지급 합계';
    const payTotalAmt = document.createElement('td');
    payTotalAmt.className = 'amt-cell';
    payTotalAmt.textContent = formatNum(grossPay);

    const taxTotalLabel = document.createElement('td');
    taxTotalLabel.style.textAlign = 'center';
    taxTotalLabel.textContent = '공제 합계';
    const taxTotalAmt = document.createElement('td');
    taxTotalAmt.className = 'amt-cell text-danger';
    taxTotalAmt.textContent = formatNum(totalTax);

    totalTr.append(payTotalLabel, payTotalAmt, taxTotalLabel, taxTotalAmt);
    tbody.appendChild(totalTr);
  }

  function updateCalendarSummary() {
    const BASE_MONTHLY_HOURS = 209;
    const hourlyWage = Math.max(0, Number(cEls.hourlyWage.value) || 0);
    const forkliftPay = Math.max(0, Number(cEls.forkliftPay.value) || 0);
    const attendanceBonus = Math.max(0, Number(cEls.attendanceBonus.value) || 0);
    const extraOtHours = Math.max(0, Number(cEls.overtimeHours.value) || 0);
    const manualLateHours = Math.max(0, Number(cEls.lateHours.value) || 0);
    const manualEarlyHours = Math.max(0, Number(cEls.earlyHours.value) || 0);

    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const rawProrate = Number(cEls.prorateDays.value);
    const prorateDays = rawProrate > 0 ? Math.min(daysInMonth, Math.max(1, rawProrate)) : daysInMonth;

    const shift = computeShiftHours(AFTERNOON_SHIFT.start, AFTERNOON_SHIFT.end, AFTERNOON_SHIFT.breakMin);

    let workDays = 0;
    let leaveDays = 0;
    let publicHolidayDays = 0;
    let specialDays = 0;
    let calLateHours = 0;
    let calEarlyHours = 0;
    let weekdayOtHours = 0;
    let holidayOtHours = 0;
    let totalNightHours = 0;
    let totalPublicHolidayHours = 0;
    let totalSpecialHours = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const key = getDateKey(calYear, calMonth, day);
      const { type, hours } = parseRecord(calRecords[key]);
      if (type === 'off') continue;

      if (type === 'leave') {
        leaveDays += 1;
      } else {
        workDays += 1;
        if (type === 'late') {
          calLateHours += hours;
          // 오후조(19~04): 19~22시(3시간)는 비야간, 3시간 초과분만 야간시간 차감
          const nightLost = Math.max(0, hours - 3);
          totalNightHours += Math.max(0, shift.nightHours - nightLost);
        } else if (type === 'early') {
          calEarlyHours += hours;
          // 오후조(19~04): 04시 기준 역산은 모두 야간시간대(22~04)에 포함
          totalNightHours += Math.max(0, shift.nightHours - hours);
        } else {
          totalNightHours += shift.nightHours;
        }

        if (type === 'public_holiday') {
          publicHolidayDays += 1;
          totalPublicHolidayHours += shift.regularHours;
        } else if (type === 'special') {
          specialDays += 1;
          totalSpecialHours += shift.regularHours;
        }

        // 일별 연장근무 (04:00 이후 연장은 04~06시 최대 2시간까지 야간수당 추가)
        const dayOt = Number(otRecords[key]) || 0;
        if (dayOt > 0) {
          if (type === 'public_holiday' || type === 'special') {
            holidayOtHours += dayOt;
          } else {
            weekdayOtHours += dayOt;
          }
          totalNightHours += Math.min(2, dayOt);
        }
      }
    }

    const totalCalOtHours = weekdayOtHours + holidayOtHours;
    const totalOtHours = totalCalOtHours + extraOtHours;
    const totalLateHours = calLateHours + manualLateHours;
    const totalEarlyHours = calEarlyHours + manualEarlyHours;
    const totalDeductHours = totalLateHours + totalEarlyHours;

    const fullBasePay = Math.round(BASE_MONTHLY_HOURS * hourlyWage);
    const prorateRatio = prorateDays < daysInMonth ? prorateDays / daysInMonth : 1;

    const basePay = Math.round(fullBasePay * prorateRatio);
    const actualForkliftPay = Math.round(forkliftPay * prorateRatio);
    const actualAttendanceBonus = Math.round(attendanceBonus * prorateRatio);

    // 통상시급 = (기본급 + 지게차수당 + 만근보너스) / 209
    const ordinaryHourlyWage = Math.round((fullBasePay + forkliftPay + attendanceBonus) / BASE_MONTHLY_HOURS);

    // 수당은 10원 단위 반올림, 근태공제는 10원 미만 절사
    const round10 = (v) => Math.round(v / 10) * 10;
    const floor10 = (v) => Math.floor(v / 10) * 10;
    const totalHolidayDays = publicHolidayDays + specialDays;
    const totalHolidayWorkHours = totalPublicHolidayHours + totalSpecialHours + holidayOtHours;
    const holidayPay = round10(totalHolidayWorkHours * ordinaryHourlyWage * 1.5);
    const holidayOtAddPay = round10(holidayOtHours * ordinaryHourlyWage * 0.5);
    const nightPay = round10(totalNightHours * ordinaryHourlyWage * 0.5);
    const weekdayOtTotalHours = weekdayOtHours + extraOtHours;
    const otPay = round10(weekdayOtTotalHours * ordinaryHourlyWage * 1.5);
    const lateDeduct = -floor10(totalLateHours * ordinaryHourlyWage);
    const earlyDeduct = -floor10(totalEarlyHours * ordinaryHourlyWage);
    const totalDeductPay = lateDeduct + earlyDeduct;
    const cashbackPay = Math.max(0, Number(cEls.cashbackPay.value) || 0);

    const grossPay = Math.max(
      0,
      basePay + actualForkliftPay + actualAttendanceBonus + holidayPay + holidayOtAddPay + nightPay + otPay + totalDeductPay + cashbackPay
    );

    const pensionBase = Math.max(0, Number(cEls.pensionBase.value) || 0);
    const taxResult = calculateContractTaxes(grossPay, pensionBase);
    const taxItems = [...taxResult.items];
    let totalTax = taxResult.totalTax;
    if (cashbackPay > 0) {
      taxItems.push({ label: '캐쉬백프로그램공제', amount: cashbackPay });
      totalTax += cashbackPay;
    }
    const netPay = Math.max(0, grossPay - totalTax);

    const badgeParts = [`${workDays}일 근무`];
    if (leaveDays > 0) badgeParts.push(`연차 ${leaveDays}일`);
    if (publicHolidayDays > 0) badgeParts.push(`공휴 ${publicHolidayDays}일`);
    if (specialDays > 0) badgeParts.push(`특근 ${specialDays}일`);
    if (totalOtHours > 0) badgeParts.push(`연장 ${formatHours(totalOtHours)}`);
    if (totalLateHours > 0) badgeParts.push(`지각 ${formatHours(totalLateHours)}`);
    if (totalEarlyHours > 0) badgeParts.push(`조퇴 ${formatHours(totalEarlyHours)}`);
    cEls.workDaysBadge.textContent = badgeParts.join(' · ');
    cEls.ordinaryWageBadge.textContent = `통상시급 ${formatKRW(ordinaryHourlyWage)}`;

    cEls.netPay.textContent = formatKRW(netPay);
    cEls.grossPay.textContent = formatKRW(grossPay);
    cEls.totalTax.textContent = `-${formatKRW(totalTax)}`;

    // 지급내역 행 구성 (명세서 레이아웃 동일: 휴일근로수당 / 휴일연장근로 가산수당 / 야간근로 가산수당)
    const irregularRows = [
      {
        label: totalHolidayDays > 0 ? `휴일근로수당 (${formatHours(totalHolidayWorkHours)})` : '휴일근로수당',
        amount: holidayPay
      }
    ];
    if (holidayOtAddPay > 0) {
      irregularRows.push({
        label: `휴일연장근로 가산수당 (${formatHours(holidayOtHours)})`,
        amount: holidayOtAddPay
      });
    }
    if (otPay > 0) {
      irregularRows.push({
        label: `연장근로수당 (${formatHours(weekdayOtTotalHours)})`,
        amount: otPay
      });
    }
    irregularRows.push({ label: `야간근로 가산수당 (${formatHours(totalNightHours)})`, amount: nightPay });
    if (totalLateHours > 0) {
      irregularRows.push({ label: `근태공제 (지각 ${formatHours(totalLateHours)})`, amount: lateDeduct });
    }
    if (totalEarlyHours > 0) {
      irregularRows.push({ label: `근태공제 (조퇴 ${formatHours(totalEarlyHours)})`, amount: earlyDeduct });
    }

    const payRows = [
      { category: '정기적지급', catRowSpan: 2, label: '기본급', amount: basePay },
      { category: '정기적지급', catRowSpan: 0, label: '지게차수당', amount: actualForkliftPay }
    ];

    irregularRows.forEach((row, idx) => {
      payRows.push({
        category: '부정기적지급<br>인센티브<br>기타지급',
        catRowSpan: idx === 0 ? irregularRows.length : 0,
        label: row.label,
        amount: row.amount
      });
    });

    payRows.push({ category: '정기적지급', catRowSpan: 1, label: '만근보너스', amount: actualAttendanceBonus });
    if (cashbackPay > 0) {
      payRows.push({
        category: '부정기적지급<br>인센티브<br>기타지급',
        catRowSpan: 1,
        label: '캐쉬백프로그램',
        amount: cashbackPay
      });
    }

    renderPayslipTable(payRows, taxItems, grossPay, totalTax);

    cEls.metaDays.textContent = `${daysInMonth}일 / ${prorateDays}일`;
    cEls.metaHolidayHours.textContent = formatHours(totalHolidayWorkHours);
    cEls.metaNightHours.textContent = formatHours(totalNightHours);
  }

  // ==================== 이벤트 ====================
  cEls.brushBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeBrush = btn.dataset.brush;
      cEls.brushBtns.forEach((b) => b.classList.toggle('active', b === btn));
      cEls.brushHoursWrap.classList.toggle(
        'hidden',
        activeBrush !== 'late' && activeBrush !== 'early' && activeBrush !== 'ot'
      );
      saveSettings();
    });
  });

  cEls.brushHoursInput.addEventListener('input', saveSettings);

  cEls.prevBtn.addEventListener('click', () => {
    calMonth -= 1;
    if (calMonth < 0) {
      calMonth = 11;
      calYear -= 1;
    }
    renderCalendar();
    updateCalendarSummary();
    saveSettings();
  });

  cEls.nextBtn.addEventListener('click', () => {
    calMonth += 1;
    if (calMonth > 11) {
      calMonth = 0;
      calYear += 1;
    }
    renderCalendar();
    updateCalendarSummary();
    saveSettings();
  });

  cEls.clearBtn.addEventListener('click', () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const k = getDateKey(calYear, calMonth, day);
      delete calRecords[k];
      delete otRecords[k];
    }
    saveRecords();
    renderCalendar();
    updateCalendarSummary();
  });

  [
    cEls.hourlyWage,
    cEls.forkliftPay,
    cEls.attendanceBonus,
    cEls.overtimeHours,
    cEls.lateHours,
    cEls.earlyHours,
    cEls.prorateDays,
    cEls.cashbackPay,
    cEls.pensionBase
  ].forEach((el) => {
    el.addEventListener('input', () => {
      updateCalendarSummary();
      saveSettings();
    });
  });

  // 초기 렌더링
  loadSettings();
  renderCalendar();
  updateCalendarSummary();
})();
