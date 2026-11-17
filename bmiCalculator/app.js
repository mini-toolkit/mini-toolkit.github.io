(function () {
  "use strict";
  const hEl = document.getElementById("bmi-h");
  const wEl = document.getElementById("bmi-w");
  const ageEl = document.getElementById("bmi-age");
  function calc() {
    const h = Number(hEl.value), w = Number(wEl.value), age = Number(ageEl.value) || 30;
    if (h <= 0 || w <= 0) return;
    const bmi = w / ((h / 100) ** 2);
    const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
    const bmr = 10 * w + 6.25 * h - 5 * age + 5;
    document.getElementById("bmi-val").textContent = bmi.toFixed(1);
    document.getElementById("bmi-cat").textContent = "BMI (" + cat + ")";
    document.getElementById("bmi-bmr").textContent = Math.round(bmr);
    document.getElementById("bmi-tdee").textContent = Math.round(bmr * 1.45);
  }
  [hEl, wEl, ageEl].forEach((el) => el.addEventListener("input", calc));
  calc();
})();
