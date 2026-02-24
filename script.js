const DEFAULT_SETTINGS = Object.freeze({
  perCreditFee: 5525,
  semesterFee: 6500,
  firstTimeRetakeRate: 0.5,
  nonFirstTimeRetakeRate: 1,
  installmentRates: [0.4, 0.3, 0.3],
});

const THEME_STORAGE_KEY = "installment-theme";
const SETTINGS_STORAGE_KEY = "installment-settings-v1";
const MAX_INSTALLMENTS = 8;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
const form = document.getElementById("calculatorForm");
const themeToggle = document.getElementById("themeToggle");
const settingsToggle = document.getElementById("settingsToggle");
const settingsModal = document.getElementById("settingsModal");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const settingsForm = document.getElementById("settingsForm");
const settingsCancel = document.getElementById("settingsCancel");
const settingsClose = document.getElementById("settingsClose");
const settingsReset = document.getElementById("settingsReset");
const settingsError = document.getElementById("settingsError");
const installmentPercentFields = document.getElementById(
  "installmentPercentFields",
);
const retakeFirstHint = document.getElementById("retakeFirstHint");
const retakeNonFirstHint = document.getElementById("retakeNonFirstHint");

const settingsInputs = {
  perCreditFee: document.getElementById("settingPerCreditFee"),
  semesterFee: document.getElementById("settingSemesterFee"),
  firstTimeRetakeRate: document.getElementById("settingRetakeFirstRate"),
  nonFirstTimeRetakeRate: document.getElementById("settingRetakeNonFirstRate"),
  installmentCount: document.getElementById("settingInstallmentCount"),
};

const fields = {
  newCredit: document.getElementById("newCredit"),
  retakeFirstCredit: document.getElementById("retakeFirstCredit"),
  retakeNonFirstCredit: document.getElementById("retakeNonFirstCredit"),
  scl: document.getElementById("scl"),
  waiver: document.getElementById("waiver"),
};

const errorFields = {
  newCredit: document.getElementById("newCreditError"),
  retakeFirstCredit: document.getElementById("retakeFirstCreditError"),
  retakeNonFirstCredit: document.getElementById("retakeNonFirstCreditError"),
  scl: document.getElementById("sclError"),
  waiver: document.getElementById("waiverError"),
};

const resultFields = {
  grossTotal: document.getElementById("grossTotal"),
  semesterFee: document.getElementById("semesterFee"),
  totalWithoutDiscount: document.getElementById("totalWithoutDiscount"),
  discountAmount: document.getElementById("discountAmount"),
  netTotalPayable: document.getElementById("netTotalPayable"),
  appliedDiscountBadge: document.getElementById("appliedDiscountBadge"),
  perCreditRateText: document.getElementById("perCreditRateText"),
  installmentRows: document.getElementById("installmentRows"),
  results: document.getElementById("results"),
};

const currencyFieldKeys = [
  "grossTotal",
  "semesterFee",
  "totalWithoutDiscount",
  "discountAmount",
  "netTotalPayable",
];

let calculatorSettings = loadStoredSettings();

const animatedValues = new Map();
const animationHandles = new Map();

function cloneSettings(settings) {
  return {
    perCreditFee: settings.perCreditFee,
    semesterFee: settings.semesterFee,
    firstTimeRetakeRate: settings.firstTimeRetakeRate,
    nonFirstTimeRetakeRate: settings.nonFirstTimeRetakeRate,
    installmentRates: [...settings.installmentRates],
  };
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseOrZero(rawValue) {
  const normalized = rawValue.trim();
  if (normalized === "") {
    return 0;
  }
  return Number(normalized);
}

function formatBDT(value) {
  const normalized = Math.abs(value) < 0.005 ? 0 : roundToTwo(value);
  return `\u09F3 ${currencyFormatter.format(normalized)}`;
}

function formatPercent(value) {
  return percentFormatter.format(roundToTwo(value));
}

function parseDisplayedCurrency(text) {
  const numericOnly = text.replace(/[^\d.-]/g, "");
  if (numericOnly === "" || numericOnly === "-" || numericOnly === ".") {
    return null;
  }
  const parsed = Number(numericOnly);
  return Number.isFinite(parsed) ? parsed : null;
}

function setFieldError(fieldName, message) {
  const input = fields[fieldName];
  const error = errorFields[fieldName];

  error.textContent = message;
  input.classList.toggle("input-error", message !== "");
}

function clearAllFieldErrors() {
  Object.keys(fields).forEach((fieldName) => {
    setFieldError(fieldName, "");
  });
}

function validateCredit(value, fieldName) {
  if (!Number.isFinite(value)) {
    setFieldError(fieldName, "Enter a valid number.");
    return false;
  }

  if (value < 0) {
    setFieldError(fieldName, "Credits must be 0 or more.");
    return false;
  }

  setFieldError(fieldName, "");
  return true;
}

function validatePercent(value, fieldName) {
  if (!Number.isFinite(value)) {
    setFieldError(fieldName, "Enter a valid percentage.");
    return false;
  }

  if (value < 0 || value > 100) {
    setFieldError(fieldName, "Percentage must be between 0 and 100.");
    return false;
  }

  setFieldError(fieldName, "");
  return true;
}

function stopNumberAnimations() {
  animationHandles.forEach((handle) => {
    cancelAnimationFrame(handle);
  });
  animationHandles.clear();
}

function setCurrencyText(fieldKey, nextValue, animate = true) {
  const element = resultFields[fieldKey];
  const targetValue = roundToTwo(nextValue);

  if (!animate || prefersReducedMotion.matches) {
    element.textContent = formatBDT(targetValue);
    animatedValues.set(fieldKey, targetValue);
    return;
  }

  const activeHandle = animationHandles.get(fieldKey);
  if (activeHandle) {
    cancelAnimationFrame(activeHandle);
  }

  const fromDisplay = parseDisplayedCurrency(element.textContent);
  const fromValue = fromDisplay ?? animatedValues.get(fieldKey) ?? targetValue;

  if (Math.abs(fromValue - targetValue) < 0.005) {
    element.textContent = formatBDT(targetValue);
    animatedValues.set(fieldKey, targetValue);
    return;
  }

  const duration = 500;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = fromValue + (targetValue - fromValue) * eased;

    element.textContent = formatBDT(current);

    if (progress < 1) {
      const nextHandle = requestAnimationFrame(tick);
      animationHandles.set(fieldKey, nextHandle);
      return;
    }

    animatedValues.set(fieldKey, targetValue);
    animationHandles.delete(fieldKey);
    element.textContent = formatBDT(targetValue);
  }

  const handle = requestAnimationFrame(tick);
  animationHandles.set(fieldKey, handle);
}

function setAppliedDiscountBadge(type, percent) {
  const badge = resultFields.appliedDiscountBadge;
  badge.classList.remove("badge--scholarship", "badge--waiver", "badge--none");

  if (type === "scholarship") {
    badge.classList.add("badge--scholarship");
    badge.textContent = `Applied: Scholarship ${formatPercent(percent)}%`;
    return;
  }

  if (type === "waiver") {
    badge.classList.add("badge--waiver");
    badge.textContent = `Applied: Waiver ${formatPercent(percent)}%`;
    return;
  }

  badge.classList.add("badge--none");
  badge.textContent = "Applied: None (0%)";
}

function resolveAppliedDiscountType(scholarshipPercent, waiverPercent) {
  const appliedPercent = Math.max(scholarshipPercent, waiverPercent);

  if (appliedPercent === 0) {
    return {
      type: "none",
      appliedPercent: 0,
    };
  }

  if (scholarshipPercent >= waiverPercent) {
    return {
      type: "scholarship",
      appliedPercent,
    };
  }

  return {
    type: "waiver",
    appliedPercent,
  };
}

function splitInstallmentAmounts(total, rates) {
  const roundedTotal = roundToTwo(total);
  const amounts = [];
  let allocated = 0;

  for (let index = 0; index < rates.length; index += 1) {
    if (index === rates.length - 1) {
      amounts.push(roundToTwo(roundedTotal - allocated));
      continue;
    }

    const amount = roundToTwo(roundedTotal * rates[index]);
    amounts.push(amount);
    allocated += amount;
  }

  return amounts;
}

function renderInstallmentRows(values, usePlaceholder = false) {
  resultFields.installmentRows.innerHTML = "";
  const placeholder = "\u09F3 \u2014";

  calculatorSettings.installmentRates.forEach((rate, index) => {
    const row = document.createElement("div");
    row.className = "summary-row";

    const label = document.createElement("span");
    label.className = "result-label label";
    label.textContent = `Installment ${index + 1} (${formatPercent(rate * 100)}%)`;

    const value = document.createElement("span");
    value.className = "result-value value";
    value.textContent = usePlaceholder
      ? placeholder
      : formatBDT(values[index] ?? 0);

    row.append(label, value);
    resultFields.installmentRows.append(row);
  });
}

function setPlaceholderResults() {
  stopNumberAnimations();

  const placeholder = "\u09F3 \u2014";
  currencyFieldKeys.forEach((fieldKey) => {
    resultFields[fieldKey].textContent = placeholder;
    animatedValues.delete(fieldKey);
  });

  renderInstallmentRows([], true);
  setAppliedDiscountBadge("none", 0);
}

function readAndValidateInputs() {
  clearAllFieldErrors();

  const newCredits = parseOrZero(fields.newCredit.value);
  const retakeFirstCredits = parseOrZero(fields.retakeFirstCredit.value);
  const retakeNonFirstCredits = parseOrZero(fields.retakeNonFirstCredit.value);
  const scholarshipPercent = parseOrZero(fields.scl.value);
  const waiverPercent = parseOrZero(fields.waiver.value);

  const isNewCreditsValid = validateCredit(newCredits, "newCredit");
  const isRetakeFirstCreditsValid = validateCredit(
    retakeFirstCredits,
    "retakeFirstCredit",
  );
  const isRetakeNonFirstCreditsValid = validateCredit(
    retakeNonFirstCredits,
    "retakeNonFirstCredit",
  );
  const isScholarshipValid = validatePercent(scholarshipPercent, "scl");
  const isWaiverValid = validatePercent(waiverPercent, "waiver");

  const isValid =
    isNewCreditsValid &&
    isRetakeFirstCreditsValid &&
    isRetakeNonFirstCreditsValid &&
    isScholarshipValid &&
    isWaiverValid;

  return {
    isValid,
    values: {
      newCredits,
      retakeFirstCredits,
      retakeNonFirstCredits,
      scholarshipPercent,
      waiverPercent,
    },
  };
}

function renderCalculatedResults(values, animate = true) {
  const {
    newCredits,
    retakeFirstCredits,
    retakeNonFirstCredits,
    scholarshipPercent,
    waiverPercent,
  } = values;

  const newCourseFee = newCredits * calculatorSettings.perCreditFee;
  const retakeFirstFee =
    retakeFirstCredits *
    calculatorSettings.perCreditFee *
    calculatorSettings.firstTimeRetakeRate;
  const retakeNonFirstFee =
    retakeNonFirstCredits *
    calculatorSettings.perCreditFee *
    calculatorSettings.nonFirstTimeRetakeRate;

  const grossTotal = newCourseFee + retakeFirstFee + retakeNonFirstFee;
  const semesterFee = calculatorSettings.semesterFee;
  const totalWithoutDiscount = grossTotal + semesterFee;

  const { type: appliedType, appliedPercent } = resolveAppliedDiscountType(
    scholarshipPercent,
    waiverPercent,
  );

  const discountAmount = grossTotal * (appliedPercent / 100);
  const netTotalPayable = totalWithoutDiscount - discountAmount;
  const installments = splitInstallmentAmounts(
    netTotalPayable,
    calculatorSettings.installmentRates,
  );

  setCurrencyText("grossTotal", grossTotal, animate);
  setCurrencyText("semesterFee", semesterFee, animate);
  setCurrencyText("totalWithoutDiscount", totalWithoutDiscount, animate);
  setCurrencyText("discountAmount", discountAmount, animate);
  setCurrencyText("netTotalPayable", netTotalPayable, animate);
  renderInstallmentRows(installments);

  setAppliedDiscountBadge(appliedType, appliedPercent);

  if (!prefersReducedMotion.matches) {
    resultFields.results.classList.remove("is-updating");
    requestAnimationFrame(() => {
      resultFields.results.classList.add("is-updating");
    });
  }
}

function calculateAndRender(options = {}) {
  const { animate = true } = options;
  const inputState = readAndValidateInputs();

  if (!inputState.isValid) {
    setPlaceholderResults();
    return;
  }

  renderCalculatedResults(inputState.values, animate);
}

function toInputString(value) {
  return String(roundToTwo(value));
}

function initializeStaticTexts() {
  resultFields.perCreditRateText.textContent = `Per-credit rate: ${formatBDT(calculatorSettings.perCreditFee)}`;
  retakeFirstHint.textContent = `Payable rate: ${formatPercent(calculatorSettings.firstTimeRetakeRate * 100)}%`;
  retakeNonFirstHint.textContent = `Payable rate: ${formatPercent(calculatorSettings.nonFirstTimeRetakeRate * 100)}%`;
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // Ignore storage restrictions in private modes.
  }
}

function initializeTheme() {
  let storedTheme = "dark";

  try {
    const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
    if (fromStorage === "dark" || fromStorage === "light") {
      storedTheme = fromStorage;
    }
  } catch {
    storedTheme = "dark";
  }

  applyTheme(storedTheme);
}

function buildEvenInstallmentPercents(count) {
  const safeCount = Math.max(1, Math.min(MAX_INSTALLMENTS, count));
  const percentages = [];
  const evenlySplit = roundToTwo(100 / safeCount);
  let allocated = 0;

  for (let index = 0; index < safeCount; index += 1) {
    if (index === safeCount - 1) {
      percentages.push(roundToTwo(100 - allocated));
      continue;
    }

    percentages.push(evenlySplit);
    allocated += evenlySplit;
  }

  return percentages;
}

function renderInstallmentPercentInputs(percentages) {
  installmentPercentFields.innerHTML = "";

  percentages.forEach((percentage, index) => {
    const label = document.createElement("label");
    label.textContent = `Installment ${index + 1}`;

    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.step = "0.01";
    input.value = toInputString(percentage);
    input.setAttribute("data-installment-rate", String(index));

    label.append(input);
    installmentPercentFields.append(label);
  });
}

function readInstallmentPercentInputs() {
  return Array.from(
    installmentPercentFields.querySelectorAll("[data-installment-rate]"),
    (input) => Number(input.value),
  );
}

function resizeInstallmentPercentages(currentPercentages, count) {
  const safeCount = Math.max(1, Math.min(MAX_INSTALLMENTS, count));
  const current = currentPercentages.filter((value) => Number.isFinite(value));

  if (current.length === safeCount) {
    return current.map((value) => roundToTwo(value));
  }

  if (current.length === 0) {
    return buildEvenInstallmentPercents(safeCount);
  }

  const currentSum = current.reduce((sum, value) => sum + value, 0);
  if (currentSum <= 0 || currentSum > 100.5) {
    return buildEvenInstallmentPercents(safeCount);
  }

  if (current.length > safeCount) {
    const trimmed = current
      .slice(0, safeCount)
      .map((value) => roundToTwo(value));
    const sumWithoutLast = trimmed
      .slice(0, trimmed.length - 1)
      .reduce((sum, value) => sum + value, 0);
    trimmed[trimmed.length - 1] = roundToTwo(100 - sumWithoutLast);
    return trimmed;
  }

  const result = current.map((value) => roundToTwo(value));
  const remaining = 100 - result.reduce((sum, value) => sum + value, 0);
  const extraCount = safeCount - result.length;

  if (remaining <= 0) {
    return buildEvenInstallmentPercents(safeCount);
  }

  const extra = roundToTwo(remaining / extraCount);
  for (let index = 0; index < extraCount; index += 1) {
    result.push(extra);
  }

  const sumWithoutLast = result
    .slice(0, result.length - 1)
    .reduce((sum, value) => sum + value, 0);
  result[result.length - 1] = roundToTwo(100 - sumWithoutLast);

  return result;
}

function setSettingsError(message) {
  settingsError.textContent = message;
}

function populateSettingsForm(settings) {
  settingsInputs.perCreditFee.value = toInputString(settings.perCreditFee);
  settingsInputs.semesterFee.value = toInputString(settings.semesterFee);
  settingsInputs.firstTimeRetakeRate.value = toInputString(
    settings.firstTimeRetakeRate * 100,
  );
  settingsInputs.nonFirstTimeRetakeRate.value = toInputString(
    settings.nonFirstTimeRetakeRate * 100,
  );
  settingsInputs.installmentCount.value = String(
    settings.installmentRates.length,
  );

  const percents = settings.installmentRates.map((rate) =>
    roundToTwo(rate * 100),
  );
  renderInstallmentPercentInputs(percents);
  setSettingsError("");
}

function openSettingsModal() {
  populateSettingsForm(calculatorSettings);
  settingsModal.hidden = false;
  settingsToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("modal-open");
  settingsInputs.perCreditFee.focus();
}

function closeSettingsModal() {
  settingsModal.hidden = true;
  settingsToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("modal-open");
  setSettingsError("");
}

function validateSettingsCandidate(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const perCreditFee = Number(candidate.perCreditFee);
  const semesterFee = Number(candidate.semesterFee);
  const firstTimeRetakeRate = Number(candidate.firstTimeRetakeRate);
  const nonFirstTimeRetakeRate = Number(candidate.nonFirstTimeRetakeRate);
  const rawInstallmentRates = Array.isArray(candidate.installmentRates)
    ? candidate.installmentRates.map((value) => Number(value))
    : [];

  if (
    !Number.isFinite(perCreditFee) ||
    perCreditFee < 0 ||
    !Number.isFinite(semesterFee) ||
    semesterFee < 0 ||
    !Number.isFinite(firstTimeRetakeRate) ||
    firstTimeRetakeRate < 0 ||
    firstTimeRetakeRate > 1 ||
    !Number.isFinite(nonFirstTimeRetakeRate) ||
    nonFirstTimeRetakeRate < 0 ||
    nonFirstTimeRetakeRate > 1 ||
    rawInstallmentRates.length === 0 ||
    rawInstallmentRates.length > MAX_INSTALLMENTS
  ) {
    return null;
  }

  const hasInvalidRate = rawInstallmentRates.some(
    (value) => !Number.isFinite(value) || value < 0,
  );
  if (hasInvalidRate) {
    return null;
  }

  const rateSum = rawInstallmentRates.reduce((sum, value) => sum + value, 0);
  if (rateSum <= 0) {
    return null;
  }

  const normalizedRates = rawInstallmentRates.map((value) => value / rateSum);

  return {
    perCreditFee: roundToTwo(perCreditFee),
    semesterFee: roundToTwo(semesterFee),
    firstTimeRetakeRate,
    nonFirstTimeRetakeRate,
    installmentRates: normalizedRates,
  };
}

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return cloneSettings(DEFAULT_SETTINGS);
    }

    const parsed = JSON.parse(raw);
    const validated = validateSettingsCandidate(parsed);
    if (validated) {
      return validated;
    }
  } catch {
    // Fall back to defaults.
  }

  return cloneSettings(DEFAULT_SETTINGS);
}

function persistSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage restrictions in private modes.
  }
}

function applyCalculatorSettings(settings, options = {}) {
  const { persist = true, animate = true } = options;
  calculatorSettings = cloneSettings(settings);

  if (persist) {
    persistSettings(calculatorSettings);
  }

  initializeStaticTexts();
  calculateAndRender({ animate });
}

function collectSettingsFromForm() {
  const perCreditFee = Number(settingsInputs.perCreditFee.value);
  const semesterFee = Number(settingsInputs.semesterFee.value);
  const firstTimeRetakePercent = Number(
    settingsInputs.firstTimeRetakeRate.value,
  );
  const nonFirstTimeRetakePercent = Number(
    settingsInputs.nonFirstTimeRetakeRate.value,
  );
  const installmentCount = Number(settingsInputs.installmentCount.value);
  const installmentPercents = readInstallmentPercentInputs();

  if (!Number.isFinite(perCreditFee) || perCreditFee < 0) {
    return { error: "Per-credit rate must be 0 or more." };
  }

  if (!Number.isFinite(semesterFee) || semesterFee < 0) {
    return { error: "Semester fee must be 0 or more." };
  }

  if (
    !Number.isInteger(installmentCount) ||
    installmentCount < 1 ||
    installmentCount > MAX_INSTALLMENTS
  ) {
    return {
      error: `Number of installments must be an integer between 1 and ${MAX_INSTALLMENTS}.`,
    };
  }

  if (installmentPercents.length !== installmentCount) {
    return {
      error: "Installment percentage fields are out of sync. Re-check count.",
    };
  }

  if (
    !Number.isFinite(firstTimeRetakePercent) ||
    firstTimeRetakePercent < 0 ||
    firstTimeRetakePercent > 100
  ) {
    return {
      error: "Retake first-time payable rate must be between 0 and 100.",
    };
  }

  if (
    !Number.isFinite(nonFirstTimeRetakePercent) ||
    nonFirstTimeRetakePercent < 0 ||
    nonFirstTimeRetakePercent > 100
  ) {
    return {
      error: "Retake not first-time payable rate must be between 0 and 100.",
    };
  }

  const hasInvalidInstallment = installmentPercents.some(
    (value) => !Number.isFinite(value) || value < 0 || value > 100,
  );
  if (hasInvalidInstallment) {
    return { error: "Each installment percentage must be between 0 and 100." };
  }

  const installmentTotal = roundToTwo(
    installmentPercents.reduce((sum, value) => sum + value, 0),
  );
  if (Math.abs(installmentTotal - 100) > 0.01) {
    return { error: "Installment percentages must add up to exactly 100." };
  }

  const normalizedInstallmentRates = installmentPercents.map(
    (value) => value / 100,
  );
  const normalized = validateSettingsCandidate({
    perCreditFee,
    semesterFee,
    firstTimeRetakeRate: firstTimeRetakePercent / 100,
    nonFirstTimeRetakeRate: nonFirstTimeRetakePercent / 100,
    installmentRates: normalizedInstallmentRates,
  });

  if (!normalized) {
    return { error: "Unable to save settings. Please verify all values." };
  }

  return { settings: normalized };
}

Object.values(fields).forEach((input) => {
  input.addEventListener("input", () => calculateAndRender());
  input.addEventListener("change", () => calculateAndRender());
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-dark")
      ? "light"
      : "dark";
    applyTheme(nextTheme);
  });
}

if (settingsToggle) {
  settingsToggle.addEventListener("click", () => {
    if (settingsModal.hidden) {
      openSettingsModal();
      return;
    }
    closeSettingsModal();
  });
}

if (settingsForm) {
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = collectSettingsFromForm();

    if (result.error) {
      setSettingsError(result.error);
      return;
    }

    applyCalculatorSettings(result.settings, { persist: true, animate: false });
    closeSettingsModal();
  });
}

if (settingsInputs.installmentCount) {
  settingsInputs.installmentCount.addEventListener("change", () => {
    const count = Number(settingsInputs.installmentCount.value);
    if (!Number.isInteger(count) || count < 1 || count > MAX_INSTALLMENTS) {
      return;
    }

    const current = readInstallmentPercentInputs();
    const resized = resizeInstallmentPercentages(current, count);
    renderInstallmentPercentInputs(resized);
  });
}

if (settingsBackdrop) {
  settingsBackdrop.addEventListener("click", closeSettingsModal);
}

if (settingsCancel) {
  settingsCancel.addEventListener("click", closeSettingsModal);
}

if (settingsClose) {
  settingsClose.addEventListener("click", closeSettingsModal);
}

if (settingsReset) {
  settingsReset.addEventListener("click", () => {
    populateSettingsForm(DEFAULT_SETTINGS);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && settingsModal && !settingsModal.hidden) {
    closeSettingsModal();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

initializeTheme();
initializeStaticTexts();
renderInstallmentRows([], true);
calculateAndRender({ animate: false });
