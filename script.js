const PER_CREDIT_FEE = 5525;
const SEMESTER_FEE = 6500;
const FIRST_TIME_RETAKE_RATE = 0.5;
const NON_FIRST_TIME_RETAKE_RATE = 1;
const INSTALLMENT_1_RATE = 0.4;
const INSTALLMENT_2_RATE = 0.3;
const THEME_STORAGE_KEY = "installment-theme";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const form = document.getElementById("calculatorForm");
const themeToggle = document.getElementById("themeToggle");

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
  discountAmount: document.getElementById("discountAmount"),
  netTotalPayable: document.getElementById("netTotalPayable"),
  firstInstallment: document.getElementById("firstInstallment"),
  secondInstallment: document.getElementById("secondInstallment"),
  thirdInstallment: document.getElementById("thirdInstallment"),
  appliedDiscountBadge: document.getElementById("appliedDiscountBadge"),
  perCreditRateText: document.getElementById("perCreditRateText"),
  results: document.getElementById("results"),
};

const currencyFieldKeys = [
  "grossTotal",
  "discountAmount",
  "netTotalPayable",
  "firstInstallment",
  "secondInstallment",
  "thirdInstallment",
];

const animatedValues = new Map();
const animationHandles = new Map();

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

function setPlaceholderResults() {
  stopNumberAnimations();

  const placeholder = "\u09F3 \u2014";
  currencyFieldKeys.forEach((fieldKey) => {
    resultFields[fieldKey].textContent = placeholder;
    animatedValues.delete(fieldKey);
  });

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
    "retakeFirstCredit"
  );
  const isRetakeNonFirstCreditsValid = validateCredit(
    retakeNonFirstCredits,
    "retakeNonFirstCredit"
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

  const newCourseFee = newCredits * PER_CREDIT_FEE;
  const retakeFirstFee =
    retakeFirstCredits * PER_CREDIT_FEE * FIRST_TIME_RETAKE_RATE;
  const retakeNonFirstFee =
    retakeNonFirstCredits * PER_CREDIT_FEE * NON_FIRST_TIME_RETAKE_RATE;

  const grossTotal = newCourseFee + retakeFirstFee + retakeNonFirstFee;

  const { type: appliedType, appliedPercent } = resolveAppliedDiscountType(
    scholarshipPercent,
    waiverPercent
  );

  const discountAmount = grossTotal * (appliedPercent / 100);
  const netTotalPayable = grossTotal - discountAmount + SEMESTER_FEE;

  const roundedNetTotal = roundToTwo(netTotalPayable);
  const firstInstallment = roundToTwo(netTotalPayable * INSTALLMENT_1_RATE);
  const secondInstallment = roundToTwo(netTotalPayable * INSTALLMENT_2_RATE);
  const thirdInstallment = roundToTwo(
    roundedNetTotal - firstInstallment - secondInstallment
  );

  setCurrencyText("grossTotal", grossTotal, animate);
  setCurrencyText("discountAmount", discountAmount, animate);
  setCurrencyText("netTotalPayable", netTotalPayable, animate);
  setCurrencyText("firstInstallment", firstInstallment, animate);
  setCurrencyText("secondInstallment", secondInstallment, animate);
  setCurrencyText("thirdInstallment", thirdInstallment, animate);

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

function initializeStaticTexts() {
  resultFields.perCreditRateText.textContent = `Per-credit rate: ${formatBDT(PER_CREDIT_FEE)}`;
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // Ignore storage restrictions in private modes.
  }
}

function initializeTheme() {
  let storedTheme = "light";

  try {
    const fromStorage = localStorage.getItem(THEME_STORAGE_KEY);
    if (fromStorage === "dark" || fromStorage === "light") {
      storedTheme = fromStorage;
    }
  } catch {
    storedTheme = "light";
  }

  applyTheme(storedTheme);
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

initializeTheme();
initializeStaticTexts();
calculateAndRender({ animate: false });
