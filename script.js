function formatMilestoneDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ─── Official UIU Academic Calendar Schedule Registry ────────────────────────
// UIU trimesters roll over ONLY once the official start date (Classes Begin) arrives.
// Before that start date arrives, the installment & refund dates remain on the current term!
const UIU_ACADEMIC_TERMS = Object.freeze({
  trimester: [
    {
      termId: "spring-2026",
      title: "Spring 2026",
      startDate: "2026-02-10",
      refund100Date: "2026-02-25",
      refund50Date: "2026-03-08",
      dueDateInst1: "2026-04-12",
      dueDateInst2: "2026-05-12",
      dueDateInst3: "2026-06-08",
      dueDateInst4: "",
    },
    {
      termId: "summer-2026",
      title: "Summer 2026",
      startDate: "2026-06-15",
      refund100Date: "2026-06-27",
      refund50Date: "2026-07-12",
      dueDateInst1: "2026-08-11",
      dueDateInst2: "2026-09-15",
      dueDateInst3: "2026-10-06",
      dueDateInst4: "",
    },
    {
      termId: "fall-2026",
      title: "Fall 2026",
      startDate: "2026-10-27", // Official UIU Fall 2026 classes began Oct 27, 2026
      refund100Date: "2026-10-31",
      refund50Date: "2026-11-09",
      dueDateInst1: "2026-11-22",
      dueDateInst2: "2026-12-15",
      dueDateInst3: "2027-01-13",
      dueDateInst4: "",
    },
    {
      termId: "spring-2027",
      title: "Spring 2027",
      startDate: "2027-02-09", // Official UIU Spring 2027 classes begin Feb 9, 2027
      refund100Date: "2027-02-24",
      refund50Date: "2027-03-07",
      dueDateInst1: "2027-04-11",
      dueDateInst2: "2027-05-11",
      dueDateInst3: "2027-06-08",
      dueDateInst4: "",
    },
    {
      termId: "summer-2027",
      title: "Summer 2027",
      startDate: "2027-06-15",
      refund100Date: "2027-06-27",
      refund50Date: "2027-07-12",
      dueDateInst1: "2027-08-10",
      dueDateInst2: "2027-09-14",
      dueDateInst3: "2027-10-05",
      dueDateInst4: "",
    },
    {
      termId: "fall-2027",
      title: "Fall 2027",
      startDate: "2027-10-26",
      refund100Date: "2027-10-31",
      refund50Date: "2027-11-09",
      dueDateInst1: "2027-11-21",
      dueDateInst2: "2027-12-14",
      dueDateInst3: "2028-01-12",
      dueDateInst4: "",
    },
  ],
  pharmacy: [
    {
      termId: "spring-2026-pharm",
      title: "Spring 2026",
      startDate: "2026-02-15",
      refund100Date: "2026-03-10",
      refund50Date: "2026-04-17",
      dueDateInst1: "2026-03-20",
      dueDateInst2: "2026-04-20",
      dueDateInst3: "2026-05-20",
      dueDateInst4: "2026-06-20",
    },
    {
      termId: "fall-2026-pharm",
      title: "Fall 2026",
      startDate: "2026-08-01",
      refund100Date: "2026-08-10",
      refund50Date: "2026-10-17",
      dueDateInst1: "2026-09-15",
      dueDateInst2: "2026-10-11",
      dueDateInst3: "2026-11-10",
      dueDateInst4: "2026-12-09",
    },
    {
      termId: "spring-2027-pharm",
      title: "Spring 2027",
      startDate: "2027-02-15",
      refund100Date: "2027-03-10",
      refund50Date: "2027-04-17",
      dueDateInst1: "2027-03-20",
      dueDateInst2: "2027-04-20",
      dueDateInst3: "2027-05-20",
      dueDateInst4: "2027-06-20",
    },
    {
      termId: "fall-2027-pharm",
      title: "Fall 2027",
      startDate: "2027-08-01",
      refund100Date: "2027-08-10",
      refund50Date: "2027-10-17",
      dueDateInst1: "2027-09-15",
      dueDateInst2: "2027-10-11",
      dueDateInst3: "2027-11-10",
      dueDateInst4: "2027-12-09",
    },
  ],
});

function getTermsListForProgram(program = "trimester", year) {
  const isPharm = program === "pharmacy";
  const baseList = [...UIU_ACADEMIC_TERMS[isPharm ? "pharmacy" : "trimester"]];
  const maxYear = baseList.reduce((m, t) => {
    const y = parseInt(t.startDate.slice(0, 4), 10);
    return y > m ? y : m;
  }, 2027);

  if (year > maxYear) {
    for (let y = maxYear + 1; y <= year; y++) {
      if (isPharm) {
        baseList.push(
          {
            termId: `spring-${y}-pharm`,
            title: `Spring ${y}`,
            startDate: `${y}-02-15`,
            refund100Date: `${y}-03-10`,
            refund50Date: `${y}-04-17`,
            dueDateInst1: `${y}-03-20`,
            dueDateInst2: `${y}-04-20`,
            dueDateInst3: `${y}-05-20`,
            dueDateInst4: `${y}-06-20`,
          },
          {
            termId: `fall-${y}-pharm`,
            title: `Fall ${y}`,
            startDate: `${y}-08-01`,
            refund100Date: `${y}-08-10`,
            refund50Date: `${y}-10-17`,
            dueDateInst1: `${y}-09-15`,
            dueDateInst2: `${y}-10-11`,
            dueDateInst3: `${y}-11-10`,
            dueDateInst4: `${y}-12-09`,
          }
        );
      } else {
        baseList.push(
          {
            termId: `spring-${y}`,
            title: `Spring ${y}`,
            startDate: `${y}-02-09`,
            refund100Date: `${y}-02-24`,
            refund50Date: `${y}-03-07`,
            dueDateInst1: `${y}-04-11`,
            dueDateInst2: `${y}-05-11`,
            dueDateInst3: `${y}-06-08`,
            dueDateInst4: "",
          },
          {
            termId: `summer-${y}`,
            title: `Summer ${y}`,
            startDate: `${y}-06-15`,
            refund100Date: `${y}-06-27`,
            refund50Date: `${y}-07-12`,
            dueDateInst1: `${y}-08-10`,
            dueDateInst2: `${y}-09-14`,
            dueDateInst3: `${y}-10-05`,
            dueDateInst4: "",
          },
          {
            termId: `fall-${y}`,
            title: `Fall ${y}`,
            startDate: `${y}-10-26`,
            refund100Date: `${y}-10-31`,
            refund50Date: `${y}-11-09`,
            dueDateInst1: `${y}-11-21`,
            dueDateInst2: `${y}-12-14`,
            dueDateInst3: `${y + 1}-01-12`,
            dueDateInst4: "",
          }
        );
      }
    }
  }
  return baseList.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

function getActiveAcademicTerm(program = "trimester", referenceDate = new Date()) {
  const currentYear = referenceDate.getFullYear();
  const allTerms = getTermsListForProgram(program, currentYear + 1);

  const yyyy = referenceDate.getFullYear();
  const mm = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const dd = String(referenceDate.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  // Only terms whose startDate <= today have started!
  // This guarantees: before the new trimester starts, dates do NOT update.
  const startedTerms = allTerms.filter((term) => term.startDate <= todayStr);

  if (startedTerms.length > 0) {
    const activeTerm = startedTerms[startedTerms.length - 1];
    const upcomingTerm = allTerms.find((term) => term.startDate > todayStr);
    return {
      ...activeTerm,
      nextTerm: upcomingTerm || null,
    };
  }

  return {
    ...allTerms[0],
    nextTerm: allTerms[1] || null,
  };
}

function buildDropWindowsForTerm(term) {
  const d100 = formatMilestoneDate(term.refund100Date);
  const d50 = formatMilestoneDate(term.refund50Date);
  return [
    { value: "100", label: `By ${d100} — 100% Adjustable Refund` },
    { value: "50", label: `By ${d50} — 50% Refund ('W' Grade)` },
    { value: "0", label: `After ${d50} — 0% Refund (No adjustment)` },
  ];
}

function getProgramProfile(programId, referenceDate = new Date()) {
  const isPharm = programId === "pharmacy";
  const activeTerm = getActiveAcademicTerm(isPharm ? "pharmacy" : "trimester", referenceDate);

  return {
    id: isPharm ? "pharmacy" : "trimester",
    name: isPharm ? "Bachelor of Pharmacy (B.Pharm)" : "Undergraduate Trimester",
    termLabel: `${isPharm ? "Semester" : "Trimester"}: ${activeTerm.title}`,
    semesterFeeLabel: isPharm ? "Semester Fee" : "Trimester Fee",
    perCreditFee: isPharm ? 6500 : 5525,
    semesterFee: isPharm ? 9750 : 6500,
    labFee: isPharm ? 5000 : 0,
    firstTimeRetakeRate: 0.5,
    nonFirstTimeRetakeRate: 1,
    defaultScholarshipPercent: 0,
    defaultWaiverPercent: 0,
    installmentRates: isPharm ? [0.25, 0.25, 0.25, 0.25] : [0.4, 0.3, 0.3],
    minCreditsForWaiver: 9,
    defaultPaidRegistration: isPharm ? 20000 : 0,
    transportFee: 4000,
    gymFee: 2000,
    lateFineInstallment: 500,
    lateRegistrationFine: 1000,
    termId: activeTerm.termId,
    trimesterTitle: isPharm ? `${activeTerm.title} (B.Pharm)` : activeTerm.title,
    dueDateInst1: activeTerm.dueDateInst1,
    dueDateInst2: activeTerm.dueDateInst2,
    dueDateInst3: activeTerm.dueDateInst3,
    dueDateInst4: activeTerm.dueDateInst4 || "",
    refund100Date: activeTerm.refund100Date,
    refund50Date: activeTerm.refund50Date,
    dropWindows: buildDropWindowsForTerm(activeTerm),
    activeTerm,
  };
}

const PROGRAM_PROFILES = {
  get trimester() {
    return getProgramProfile("trimester");
  },
  get pharmacy() {
    return getProgramProfile("pharmacy");
  },
};

const initialTrimProfile = getProgramProfile("trimester");

const DEFAULT_SETTINGS = Object.freeze({
  program: "trimester",
  perCreditFee: initialTrimProfile.perCreditFee,
  semesterFee: initialTrimProfile.semesterFee,
  labFee: initialTrimProfile.labFee,
  firstTimeRetakeRate: 0.5,
  nonFirstTimeRetakeRate: 1,
  defaultScholarshipPercent: 0,
  defaultWaiverPercent: 0,
  installmentRates: [...initialTrimProfile.installmentRates],
  minCreditsForWaiver: 9,
  defaultPaidRegistration: initialTrimProfile.defaultPaidRegistration,
  transportFee: initialTrimProfile.transportFee,
  gymFee: initialTrimProfile.gymFee,
  lateFineInstallment: initialTrimProfile.lateFineInstallment,
  lateRegistrationFine: initialTrimProfile.lateRegistrationFine,
  lastCalendarTermId: initialTrimProfile.termId,
  trimesterTitle: initialTrimProfile.trimesterTitle,
  dueDateInst1: initialTrimProfile.dueDateInst1,
  dueDateInst2: initialTrimProfile.dueDateInst2,
  dueDateInst3: initialTrimProfile.dueDateInst3,
  dueDateInst4: initialTrimProfile.dueDateInst4,
  refund100Date: initialTrimProfile.refund100Date,
  refund50Date: initialTrimProfile.refund50Date,
  installmentMode: "official",
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

// Program Switcher Elements
const programTrimesterBtn = document.getElementById("programTrimesterBtn");
const programPharmacyBtn = document.getElementById("programPharmacyBtn");

// Main Forms & Buttons
const form = document.getElementById("calculatorForm");
const themeToggle = document.getElementById("themeToggle");
const settingsToggle = document.getElementById("settingsToggle");
const headerResetBtn = document.getElementById("headerResetBtn");
const headerShareBtn = document.getElementById("headerShareBtn");
const headerVoucherBtn = document.getElementById("headerVoucherBtn");

// Settings Modal Elements
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

// Settings Inputs
const settingsInputs = {
  perCreditFee: document.getElementById("settingPerCreditFee"),
  semesterFee: document.getElementById("settingSemesterFee"),
  labFee: document.getElementById("settingLabFee"),
  firstTimeRetakeRate: document.getElementById("settingRetakeFirstRate"),
  nonFirstTimeRetakeRate: document.getElementById("settingRetakeNonFirstRate"),
  defaultScholarshipPercent: document.getElementById(
    "settingDefaultScholarship",
  ),
  defaultWaiverPercent: document.getElementById("settingDefaultWaiver"),
  minCreditsForWaiver: document.getElementById("settingMinCreditsWaiver"),
  defaultPaidRegistration: document.getElementById(
    "settingDefaultPaidRegistration",
  ),
  transportFee: document.getElementById("settingTransportFee"),
  gymFee: document.getElementById("settingGymFee"),
  lateFineInstallment: document.getElementById("settingLateFineInstallment"),
  lateRegistrationFine: document.getElementById("settingLateRegFine"),
  trimesterTitle: document.getElementById("settingTrimesterTitle"),
  refund100Date: document.getElementById("settingRefund100Date"),
  refund50Date: document.getElementById("settingRefund50Date"),
  dueDateInst1: document.getElementById("settingDueDateInst1"),
  dueDateInst2: document.getElementById("settingDueDateInst2"),
  dueDateInst3: document.getElementById("settingDueDateInst3"),
  dueDateInst4: document.getElementById("settingDueDateInst4"),
  installmentCount: document.getElementById("settingInstallmentCount"),
  installmentMode: document.getElementById("settingInstallmentMode"),
};

// Badges & Headers
const trimesterPill = document.getElementById("trimesterPill");
const perCreditRateText = document.getElementById("perCreditRateText");
const semesterFeeLabel = document.getElementById("semesterFeeLabel");
const retakeFirstHint = document.getElementById("retakeFirstHint");
const retakeNonFirstHint = document.getElementById("retakeNonFirstHint");

// Non-waiver Hint Popover
const nonWaiverHintBtn = document.getElementById("nonWaiverHintBtn");
const nonWaiverHintPopover = document.getElementById("nonWaiverHintPopover");
const nonWaiverHintClose = document.getElementById("nonWaiverHintClose");

// Waiver Policy Alert
const waiverThresholdAlert = document.getElementById("waiverThresholdAlert");
const waiverThresholdAlertText = document.getElementById(
  "waiverThresholdAlertText",
);

// Course and Adjustment Form Fields
const fields = {
  newCredit: document.getElementById("newCredit"),
  nonWaiverCredit: document.getElementById("nonWaiverCredit"),
  retakeFirstCredit: document.getElementById("retakeFirstCredit"),
  retakeNonFirstCredit: document.getElementById("retakeNonFirstCredit"),
  scl: document.getElementById("scl"),
  waiver: document.getElementById("waiver"),
  paidRegistration: document.getElementById("paidRegistration"),
  prevDue: document.getElementById("prevDue"),
  extraCustom: document.getElementById("extraCustom"),
};

// Checkbox Extras
const extraCheckboxes = {
  transport: document.getElementById("extraTransport"),
  gym: document.getElementById("extraGym"),
  lateReg: document.getElementById("fineLateReg"),
  lateInst: document.getElementById("fineLateInst"),
};

// Extra fee labels on checkboxes
const extraFeeLabels = {
  transport: document.getElementById("extraTransportAmount"),
  gym: document.getElementById("extraGymAmount"),
  lateReg: document.getElementById("fineLateRegAmount"),
  lateInst: document.getElementById("fineLateInstAmount"),
};

// Error fields
const errorFields = {
  newCredit: document.getElementById("newCreditError"),
  nonWaiverCredit: document.getElementById("nonWaiverCreditError"),
  retakeFirstCredit: document.getElementById("retakeFirstCreditError"),
  retakeNonFirstCredit: document.getElementById("retakeNonFirstCreditError"),
  scl: document.getElementById("sclError"),
  waiver: document.getElementById("waiverError"),
  paidRegistration: document.getElementById("paidRegistrationError"),
  prevDue: document.getElementById("prevDueError"),
};

// Summary & Result Fields
const resultFields = {
  grossTotal: document.getElementById("grossTotal"),
  semesterFee: document.getElementById("semesterFee"),
  labFeeSummaryRow: document.getElementById("labFeeSummaryRow"),
  labFeeTotal: document.getElementById("labFeeTotal"),
  extrasSummaryRow: document.getElementById("extrasSummaryRow"),
  extrasTotal: document.getElementById("extrasTotal"),
  prevDueSummaryRow: document.getElementById("prevDueSummaryRow"),
  prevDueSummaryLabel: document.getElementById("prevDueSummaryLabel"),
  prevDueTotal: document.getElementById("prevDueTotal"),
  totalWithoutDiscountRow: document.getElementById("totalWithoutDiscountRow"),
  totalWithoutDiscount: document.getElementById("totalWithoutDiscount"),
  discountSummaryRow: document.getElementById("discountSummaryRow"),
  discountAmount: document.getElementById("discountAmount"),
  dropRefundSummaryRow: document.getElementById("dropRefundSummaryRow"),
  dropRefundTotal: document.getElementById("dropRefundTotal"),
  netTotalPayable: document.getElementById("netTotalPayable"),
  paidAtRegSummaryRow: document.getElementById("paidAtRegSummaryRow"),
  paidAtRegTotal: document.getElementById("paidAtRegTotal"),
  remainingPayableRow: document.getElementById("remainingPayableRow"),
  remainingPayable: document.getElementById("remainingPayable"),
  appliedDiscountBadge: document.getElementById("appliedDiscountBadge"),
  installmentRows: document.getElementById("installmentRows"),
  results: document.getElementById("results"),
};

const currencyFieldKeys = [
  "grossTotal",
  "semesterFee",
  "labFeeTotal",
  "extrasTotal",
  "prevDueTotal",
  "totalWithoutDiscount",
  "discountAmount",
  "dropRefundTotal",
  "netTotalPayable",
  "paidAtRegTotal",
  "remainingPayable",
];

// Summary Action Buttons
const copyBreakdownBtn = document.getElementById("copyBreakdownBtn");
const viewVoucherBtn = document.getElementById("viewVoucherBtn");
const shareCalcBtn = document.getElementById("shareCalcBtn");
const resetFormBtn = document.getElementById("resetFormBtn");

// Course Drop & Refund Tool
const dropToolContainer = document.getElementById("dropToolContainer");
const dropToolToggle = document.getElementById("dropToolToggle");
const dropToolBody = document.getElementById("dropToolBody");
const dropCredits = document.getElementById("dropCredits");
const dropCourseType = document.getElementById("dropCourseType");
const dropWindow = document.getElementById("dropWindow");
const dropRefundValue = document.getElementById("dropRefundValue");
const dropRetainedValue = document.getElementById("dropRetainedValue");
const dropPolicyNote = document.getElementById("dropPolicyNote");
const applyDropRefund = document.getElementById("applyDropRefund");
const dropAppliedPreview = document.getElementById("dropAppliedPreview");

// Fee Voucher Modal Elements
const voucherModal = document.getElementById("voucherModal");
const voucherBackdrop = document.getElementById("voucherBackdrop");
const voucherClose = document.getElementById("voucherClose");
const voucherPrint = document.getElementById("voucherPrint");
const voucherDate = document.getElementById("voucherDate");
const voucherTerm = document.getElementById("voucherTerm");
const voucherTableBody = document.getElementById("voucherTableBody");
const voucherScheduleBody = document.getElementById("voucherScheduleBody");

// User Manual Modal Elements
const headerManualBtn = document.getElementById("headerManualBtn");
const manualModal = document.getElementById("manualModal");
const manualBackdrop = document.getElementById("manualBackdrop");
const manualClose = document.getElementById("manualClose");
const manualBody = document.getElementById("manualBody");
const manualNavBtns = document.querySelectorAll(".manual-nav__btn");

// Action Toast Notification
const actionToast = document.getElementById("actionToast");
const actionToastMsg = document.getElementById("actionToastMsg");

let calculatorSettings = loadStoredSettings();
let lastCalculationState = null;
let toastTimeoutId = null;
let actualPaidInstallments = {};

// Installment Mode Switcher Elements
const instModeSwitcher = document.getElementById("instModeSwitcher");
const instModeOfficialBtn = document.getElementById("instModeOfficialBtn");
const instModeRemainingBtn = document.getElementById("instModeRemainingBtn");
const instModeNote = document.getElementById("instModeNote");
let currentInstallmentMode = calculatorSettings?.installmentMode || "official";

// Installment Ledger Bar
const instLedgerBar = document.getElementById("instLedgerBar");
const instPaidSoFar = document.getElementById("instPaidSoFar");
const instRemainingDue = document.getElementById("instRemainingDue");
const instAllClearedBadge = document.getElementById("instAllClearedBadge");

const animatedValues = new Map();
const animationHandles = new Map();

function cloneSettings(settings) {
  return {
    program: settings.program || "trimester",
    perCreditFee: settings.perCreditFee,
    semesterFee: settings.semesterFee,
    labFee: settings.labFee || 0,
    firstTimeRetakeRate: settings.firstTimeRetakeRate,
    nonFirstTimeRetakeRate: settings.nonFirstTimeRetakeRate,
    defaultScholarshipPercent: settings.defaultScholarshipPercent,
    defaultWaiverPercent: settings.defaultWaiverPercent,
    installmentRates: [...settings.installmentRates],
    minCreditsForWaiver: settings.minCreditsForWaiver,
    defaultPaidRegistration: settings.defaultPaidRegistration,
    transportFee: settings.transportFee,
    gymFee: settings.gymFee,
    lateFineInstallment: settings.lateFineInstallment,
    lateRegistrationFine: settings.lateRegistrationFine,
    trimesterTitle: settings.trimesterTitle,
    dueDateInst1: settings.dueDateInst1,
    dueDateInst2: settings.dueDateInst2,
    dueDateInst3: settings.dueDateInst3,
    dueDateInst4: settings.dueDateInst4 || "",
    refund100Date: settings.refund100Date,
    refund50Date: settings.refund50Date,
    installmentMode: settings.installmentMode || "official",
  };
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parseOrZero(rawValue) {
  if (rawValue === undefined || rawValue === null) return 0;
  const normalized = String(rawValue).trim();
  if (normalized === "") return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBDT(value) {
  const normalized = Math.abs(value) < 0.005 ? 0 : roundToTwo(value);
  return `\u09F3 ${currencyFormatter.format(normalized)}`;
}

function formatPercent(value) {
  return percentFormatter.format(roundToTwo(value));
}

function formatMilestoneDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function parseDisplayedCurrency(text) {
  const numericOnly = text.replace(/[^\d.-]/g, "");
  if (numericOnly === "" || numericOnly === "-" || numericOnly === ".") {
    return null;
  }
  const parsed = Number(numericOnly);
  return Number.isFinite(parsed) ? parsed : null;
}

function showToast(message) {
  if (!actionToast || !actionToastMsg) return;
  actionToastMsg.textContent = message;
  actionToast.hidden = false;
  actionToast.classList.add("is-visible");

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = setTimeout(() => {
    actionToast.classList.remove("is-visible");
    actionToast.hidden = true;
  }, 2800);
}

async function copyToClipboard(text, successToastMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    showToast(successToastMsg);
  } catch (err) {
    console.error("Failed to copy:", err);
    showToast("Copy failed. Please allow clipboard permissions.");
  }
}

function setFieldError(fieldName, message) {
  const input = fields[fieldName];
  const error = errorFields[fieldName];

  if (error) {
    error.textContent = message;
  }
  if (input) {
    input.classList.toggle("input-error", message !== "");
  }
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
  if (!element) return;

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

function setAppliedDiscountBadge(type, percent, isSuspended = false) {
  const badge = resultFields.appliedDiscountBadge;
  if (!badge) return;

  badge.classList.remove(
    "badge--scholarship",
    "badge--waiver",
    "badge--none",
    "badge--suspended",
  );

  if (isSuspended) {
    badge.classList.add("badge--suspended");
    badge.textContent = `Discount Suspended (< ${calculatorSettings.minCreditsForWaiver} cr)`;
    return;
  }

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

function getInstallmentMilestoneInfo(index) {
  const isPharm = calculatorSettings.program === "pharmacy";
  const milestones = isPharm
    ? [
        {
          date: calculatorSettings.dueDateInst1,
          name: "1st Installment",
        },
        {
          date: calculatorSettings.dueDateInst2,
          name: "2nd Installment",
        },
        {
          date: calculatorSettings.dueDateInst3,
          name: "3rd Installment",
        },
        {
          date: calculatorSettings.dueDateInst4,
          name: "4th Installment",
        },
      ]
    : [
        {
          date: calculatorSettings.dueDateInst1,
          name: "1st Installment",
        },
        {
          date: calculatorSettings.dueDateInst2,
          name: "2nd Installment",
        },
        {
          date: calculatorSettings.dueDateInst3,
          name: "3rd Installment",
        },
      ];

  if (index < milestones.length) {
    const item = milestones[index];
    return {
      dateFormatted: formatMilestoneDate(item.date),
      name: item.name,
    };
  }

  return {
    dateFormatted: "",
    name: `Installment ${index + 1}`,
  };
}

function onInstallmentPaidInput(e) {
  const input = e.target;
  const index = Number(input.dataset.index);
  const val = input.value.trim();

  if (val === "") {
    delete actualPaidInstallments[index];
  } else {
    actualPaidInstallments[index] = Math.max(0, Number(val) || 0);
  }

  calculateAndRender({ animate: false });
}

function onInstallmentPaidFullClick(e) {
  const btn = e.currentTarget;
  const index = Number(btn.dataset.index);
  const due = Number(btn.dataset.due) || 0;
  actualPaidInstallments[index] = due;

  const input = resultFields.installmentRows.querySelector(
    `.inst-paid-input[data-index="${index}"]`,
  );
  if (input) {
    input.value = String(due);
  }

  calculateAndRender({ animate: false });
}

function renderInstallmentRows(scheduleData, usePlaceholder = false) {
  if (!resultFields.installmentRows) return;
  const rates = calculatorSettings.installmentRates;
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

  if (usePlaceholder || !scheduleData) {
    resultFields.installmentRows.innerHTML = "";
    if (instLedgerBar) instLedgerBar.hidden = true;
    rates.forEach((rate, index) => {
      const row = document.createElement("div");
      row.className = "inst-row";
      const namePrefix = ordinals[index] || `Inst. ${index + 1}`;
      row.innerHTML = `
        <div class="inst-row__meta">
          <div class="inst-row__titleGroup">
            <span class="inst-row__name">${namePrefix} Inst.</span>
            <span class="inst-row__rate">${formatPercent(rate * 100)}%</span>
          </div>
          <span class="inst-row__due">—</span>
        </div>
        <div class="inst-row__tracker">
          <div class="inst-row__inputWrap">
            <span class="inst-row__currency">\u09F3</span>
            <input type="number" class="inst-paid-input" disabled placeholder="0" />
          </div>
        </div>
        <div class="inst-row__amountGroup">
          <span class="inst-row__amount">\u09F3 —</span>
        </div>
      `;
      resultFields.installmentRows.appendChild(row);
    });
    return;
  }

  const {
    nominal = [],
    scheduled = [],
    adjusted = [],
  } = scheduleData;

  let totalActuallyPaid = 0;
  let hasAnyPayment = false;
  let allCleared = true;

  const existingRows = resultFields.installmentRows.querySelectorAll(
    ".inst-row[data-index]",
  );
  const canUpdateInPlace = existingRows.length === rates.length;

  if (!canUpdateInPlace) {
    resultFields.installmentRows.innerHTML = "";
  }

  rates.forEach((rate, index) => {
    const namePrefix = ordinals[index] || `Inst. ${index + 1}`;
    const milestone = getInstallmentMilestoneInfo(index);
    const scheduledDue = scheduled[index] ?? 0;
    const adjustedDue = adjusted[index] ?? scheduledDue;
    const rawPaid = actualPaidInstallments[index];
    const hasPaidEntered =
      rawPaid !== undefined && rawPaid !== null && rawPaid !== "";
    const paidAmount = hasPaidEntered ? Math.max(0, Number(rawPaid) || 0) : 0;

    if (hasPaidEntered) {
      hasAnyPayment = true;
      totalActuallyPaid = roundToTwo(totalActuallyPaid + paidAmount);
    }

    let statusHtml = "";
    let isCleared = false;

    if (scheduledDue === 0 && !hasPaidEntered) {
      statusHtml = `<span class="inst-tag inst-tag--waived">Waived</span>`;
      isCleared = true;
    } else if (hasPaidEntered) {
      if (paidAmount >= adjustedDue) {
        isCleared = true;
        const surplus = roundToTwo(paidAmount - adjustedDue);
        if (surplus > 0 && index < rates.length - 1) {
          statusHtml = `<span class="inst-tag inst-tag--surplus">+&#2547;${currencyFormatter.format(surplus)}</span>`;
        } else {
          statusHtml = `<span class="inst-tag inst-tag--paid">&#10003; Paid</span>`;
        }
      } else {
        allCleared = false;
        const remainingThisInst = roundToTwo(adjustedDue - paidAmount);
        statusHtml = `<span class="inst-tag inst-tag--partial">Rem: &#2547;${currencyFormatter.format(remainingThisInst)}</span>`;
      }
    } else {
      if (adjustedDue > 0) {
        allCleared = false;
        statusHtml = `<span class="inst-tag inst-tag--pending">Due</span>`;
      } else {
        statusHtml = `<span class="inst-tag inst-tag--waived">&#2547; 0</span>`;
      }
    }

    if (canUpdateInPlace) {
      const row = existingRows[index];
      if (row) {
        row.classList.toggle("inst-row--cleared", isCleared);
        const nameEl = row.querySelector(".inst-row__name");
        if (nameEl) nameEl.textContent = `${namePrefix} Inst.`;
        const rateEl = row.querySelector(".inst-row__rate");
        if (rateEl) rateEl.textContent = `${formatPercent(rate * 100)}%`;
        const dueEl = row.querySelector(".inst-row__due");
        if (dueEl)
          dueEl.textContent = milestone.dateFormatted
            ? `Due: ${milestone.dateFormatted}`
            : "";
        const amountEl = row.querySelector(".inst-row__amount");
        if (amountEl) {
          amountEl.textContent = formatBDT(adjustedDue);
          amountEl.classList.toggle(
            "inst-row__amount--waived",
            scheduledDue === 0 && adjustedDue === 0,
          );
        }
        const statusWrap = row.querySelector(".inst-row__statusWrap");
        if (statusWrap) statusWrap.innerHTML = statusHtml;
        const inputEl = row.querySelector(".inst-paid-input");
        if (inputEl) {
          inputEl.placeholder = String(roundToTwo(adjustedDue));
          if (document.activeElement !== inputEl) {
            inputEl.value = hasPaidEntered ? String(rawPaid) : "";
          }
        }
        const fillBtn = row.querySelector(".inst-fill-btn");
        if (fillBtn) fillBtn.dataset.due = String(adjustedDue);
      }
    } else {
      const row = document.createElement("div");
      row.className = `inst-row ${isCleared ? "inst-row--cleared" : ""}`;
      row.dataset.index = String(index);

      row.innerHTML = `
        <div class="inst-row__meta">
          <div class="inst-row__titleGroup">
            <span class="inst-row__name">${namePrefix} Inst.</span>
            <span class="inst-row__rate">${formatPercent(rate * 100)}%</span>
          </div>
          <span class="inst-row__due">${milestone.dateFormatted ? `Due: ${milestone.dateFormatted}` : ""}</span>
        </div>

        <div class="inst-row__tracker">
          <div class="inst-row__inputWrap" title="Enter actual amount paid for this installment">
            <span class="inst-row__currency">\u09F3</span>
            <input
              type="number"
              id="instPaidInput_${index}"
              class="inst-paid-input"
              data-index="${index}"
              inputmode="decimal"
              min="0"
              step="100"
              placeholder="${roundToTwo(adjustedDue)}"
              value="${hasPaidEntered ? rawPaid : ""}"
              aria-label="Paid for ${namePrefix} installment"
            />
          </div>
          <button
            type="button"
            class="inst-fill-btn"
            data-index="${index}"
            data-due="${adjustedDue}"
            title="Mark as paid in full"
          >
            Full
          </button>
        </div>

        <div class="inst-row__amountGroup">
          <span class="inst-row__amount ${scheduledDue === 0 && adjustedDue === 0 ? "inst-row__amount--waived" : ""}">
            ${formatBDT(adjustedDue)}
          </span>
          <div class="inst-row__statusWrap">
            ${statusHtml}
          </div>
        </div>
      `;
      resultFields.installmentRows.appendChild(row);
    }
  });

  if (!canUpdateInPlace) {
    const inputs = resultFields.installmentRows.querySelectorAll(
      ".inst-paid-input",
    );
    inputs.forEach((input) => {
      input.addEventListener("input", onInstallmentPaidInput);
      input.addEventListener("change", onInstallmentPaidInput);
    });

    const fillButtons =
      resultFields.installmentRows.querySelectorAll(".inst-fill-btn");
    fillButtons.forEach((btn) => {
      btn.addEventListener("click", onInstallmentPaidFullClick);
    });
  }

  // Update Ledger Bar
  if (instLedgerBar) {
    if (hasAnyPayment || totalActuallyPaid > 0) {
      instLedgerBar.hidden = false;
      const netPayable = lastCalculationState
        ? lastCalculationState.remainingPayable
        : 0;
      const totalRemainingDue = Math.max(
        0,
        roundToTwo(netPayable - totalActuallyPaid),
      );

      if (instPaidSoFar)
        instPaidSoFar.textContent = formatBDT(totalActuallyPaid);
      if (instRemainingDue)
        instRemainingDue.textContent = formatBDT(totalRemainingDue);
      if (instAllClearedBadge) {
        instAllClearedBadge.hidden = !(allCleared && hasAnyPayment);
      }
    } else {
      instLedgerBar.hidden = true;
    }
  }
}

function setPlaceholderResults() {
  stopNumberAnimations();

  const placeholder = "\u09F3 \u2014";
  currencyFieldKeys.forEach((fieldKey) => {
    if (resultFields[fieldKey]) {
      resultFields[fieldKey].textContent = placeholder;
    }
    animatedValues.delete(fieldKey);
  });

  if (resultFields.totalWithoutDiscountRow)
    resultFields.totalWithoutDiscountRow.hidden = true;
  if (resultFields.discountSummaryRow)
    resultFields.discountSummaryRow.hidden = true;
  if (resultFields.labFeeSummaryRow)
    resultFields.labFeeSummaryRow.hidden = true;
  if (resultFields.extrasSummaryRow)
    resultFields.extrasSummaryRow.hidden = true;
  if (resultFields.prevDueSummaryRow)
    resultFields.prevDueSummaryRow.hidden = true;
  if (resultFields.dropRefundSummaryRow)
    resultFields.dropRefundSummaryRow.hidden = true;
  if (resultFields.paidAtRegSummaryRow)
    resultFields.paidAtRegSummaryRow.hidden = true;
  if (resultFields.remainingPayableRow)
    resultFields.remainingPayableRow.hidden = true;

  if (waiverThresholdAlert) {
    waiverThresholdAlert.hidden = true;
  }

  renderInstallmentRows(null, true);
  setAppliedDiscountBadge("none", 0);
  lastCalculationState = null;
}

function readAndValidateInputs() {
  clearAllFieldErrors();

  const newCredits = parseOrZero(fields.newCredit.value);
  const nonWaiverCredits = parseOrZero(fields.nonWaiverCredit.value);
  const retakeFirstCredits = parseOrZero(fields.retakeFirstCredit.value);
  const retakeNonFirstCredits = parseOrZero(fields.retakeNonFirstCredit.value);

  const scholarshipRaw = fields.scl.value.trim();
  const waiverRaw = fields.waiver.value.trim();
  const scholarshipPercent =
    scholarshipRaw === ""
      ? calculatorSettings.defaultScholarshipPercent
      : Number(scholarshipRaw);
  const waiverPercent =
    waiverRaw === ""
      ? calculatorSettings.defaultWaiverPercent
      : Number(waiverRaw);

  const paidRegistration = parseOrZero(fields.paidRegistration.value);
  const prevDue = parseOrZero(fields.prevDue.value);
  const customExtra = parseOrZero(fields.extraCustom.value);

  const isNewCreditsValid = validateCredit(newCredits, "newCredit");
  const isNonWaiverCreditsValid = validateCredit(
    nonWaiverCredits,
    "nonWaiverCredit",
  );
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

  let isPaidRegistrationValid = true;
  if (paidRegistration < 0) {
    setFieldError(
      "paidRegistration",
      "Deposit paid must be 0 or a positive number.",
    );
    isPaidRegistrationValid = false;
  }

  const isValid =
    isNewCreditsValid &&
    isNonWaiverCreditsValid &&
    isRetakeFirstCreditsValid &&
    isRetakeNonFirstCreditsValid &&
    isScholarshipValid &&
    isWaiverValid &&
    isPaidRegistrationValid;

  return {
    isValid,
    values: {
      newCredits,
      nonWaiverCredits,
      retakeFirstCredits,
      retakeNonFirstCredits,
      scholarshipPercent,
      waiverPercent,
      paidRegistration,
      prevDue,
      customExtra,
      transportChecked: extraCheckboxes.transport?.checked || false,
      gymChecked: extraCheckboxes.gym?.checked || false,
      lateRegChecked: extraCheckboxes.lateReg?.checked || false,
      lateInstChecked: extraCheckboxes.lateInst?.checked || false,
    },
  };
}

// ─── Course Drop Calculation ──────────────────────────────────────────────────
function getDropRefundCalculation() {
  if (!dropCredits || !dropCourseType || !dropWindow) {
    return {
      credits: 0,
      category: "new",
      windowPercent: 100,
      courseFee: 0,
      refundAmount: 0,
      retainedAmount: 0,
      isAuto: false,
    };
  }

  const credits = Math.max(0, parseOrZero(dropCredits.value));
  const category = dropCourseType.value;
  const rawWindow = dropWindow.value;
  const isAuto = rawWindow === "auto";

  let windowPercent = 100;
  if (isAuto) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const r100 = calculatorSettings.refund100Date || "2026-10-31";
    const r50 = calculatorSettings.refund50Date || "2026-11-09";

    if (todayStr <= r100) {
      windowPercent = 100;
    } else if (todayStr <= r50) {
      windowPercent = 50;
    } else {
      windowPercent = 0;
    }
  } else {
    windowPercent = Number(rawWindow);
  }

  let creditRate = calculatorSettings.perCreditFee;
  if (category === "retakeFirst") {
    creditRate =
      calculatorSettings.perCreditFee * calculatorSettings.firstTimeRetakeRate;
  } else if (category === "retakeNonFirst") {
    creditRate =
      calculatorSettings.perCreditFee *
      calculatorSettings.nonFirstTimeRetakeRate;
  }

  const courseFee = credits * creditRate;
  const refundAmount = roundToTwo(courseFee * (windowPercent / 100));
  const retainedAmount = roundToTwo(courseFee - refundAmount);

  return {
    credits,
    category,
    windowPercent,
    courseFee,
    refundAmount,
    retainedAmount,
    isAuto,
  };
}

function updateDropToolCalculation() {
  const { credits, windowPercent, refundAmount, retainedAmount, isAuto } =
    getDropRefundCalculation();

  if (dropRefundValue) dropRefundValue.textContent = formatBDT(refundAmount);
  if (dropRetainedValue)
    dropRetainedValue.textContent = formatBDT(retainedAmount);

  if (dropAppliedPreview) {
    dropAppliedPreview.textContent = `-${formatBDT(refundAmount)}`;
  }

  if (dropPolicyNote) {
    const isPharm = calculatorSettings.program === "pharmacy";
    const autoPrefix = isAuto ? "Auto-detected based on today's date: " : "";
    if (windowPercent === 100) {
      dropPolicyNote.textContent = `${autoPrefix}100% adjustable credit refund as per official UIU Calendar (Drop deadline: ${formatMilestoneDate(calculatorSettings.refund100Date)}).`;
    } else if (windowPercent === 50) {
      const termWithdrawal = isPharm
        ? "Course withdrawal cutoff"
        : "Withdrawal deadline ('W' grade)";
      dropPolicyNote.textContent = `${autoPrefix}50% adjustable refund with 'W' grade on transcript as per UIU Calendar (${termWithdrawal}: ${formatMilestoneDate(calculatorSettings.refund50Date)}).`;
    } else {
      dropPolicyNote.textContent = `${autoPrefix}0% refund. Courses dropped after ${formatMilestoneDate(calculatorSettings.refund50Date)} are strictly non-refundable per UIU policy.`;
    }
  }
}

function updateDropWindowOptions(dropWindows) {
  if (!dropWindow || !Array.isArray(dropWindows)) return;
  const currentVal = dropWindow.value;
  dropWindow.innerHTML = "";

  const autoOpt = document.createElement("option");
  autoOpt.value = "auto";
  autoOpt.textContent = "Dropped Today (Auto-Detect)";
  if (currentVal === "auto" || !currentVal) autoOpt.selected = true;
  dropWindow.appendChild(autoOpt);

  dropWindows.forEach((w) => {
    const opt = document.createElement("option");
    opt.value = w.value;
    opt.textContent = w.label;
    if (w.value === currentVal) opt.selected = true;
    dropWindow.appendChild(opt);
  });
}

function renderCalculatedResults(values, animate = true) {
  const {
    newCredits,
    nonWaiverCredits,
    retakeFirstCredits,
    retakeNonFirstCredits,
    scholarshipPercent,
    waiverPercent,
    paidRegistration,
    prevDue,
    customExtra,
    transportChecked,
    gymChecked,
    lateRegChecked,
    lateInstChecked,
  } = values;

  const newCourseFee = newCredits * calculatorSettings.perCreditFee;
  const nonWaiverFee = nonWaiverCredits * calculatorSettings.perCreditFee;
  const retakeFirstFee =
    retakeFirstCredits *
    calculatorSettings.perCreditFee *
    calculatorSettings.firstTimeRetakeRate;
  const retakeNonFirstFee =
    retakeNonFirstCredits *
    calculatorSettings.perCreditFee *
    calculatorSettings.nonFirstTimeRetakeRate;

  const grossTotal =
    newCourseFee + nonWaiverFee + retakeFirstFee + retakeNonFirstFee;
  const semesterFee = calculatorSettings.semesterFee;
  const labFee = calculatorSettings.labFee || 0;

  // Campus Extras & Fines
  let extrasTotal = 0;
  if (transportChecked) extrasTotal += calculatorSettings.transportFee;
  if (gymChecked) extrasTotal += calculatorSettings.gymFee;
  if (lateRegChecked) extrasTotal += calculatorSettings.lateRegistrationFine;
  if (lateInstChecked) extrasTotal += calculatorSettings.lateFineInstallment;
  if (customExtra > 0) extrasTotal += customExtra;

  // Resolve discount type
  const { type: appliedType, appliedPercent } = resolveAppliedDiscountType(
    scholarshipPercent,
    waiverPercent,
  );

  // UIU Minimum 9-Credit Fresh Course Rule
  const isBelowThreshold =
    appliedPercent > 0 &&
    newCredits > 0 &&
    newCredits < calculatorSettings.minCreditsForWaiver;

  if (waiverThresholdAlert) {
    if (isBelowThreshold) {
      waiverThresholdAlert.hidden = false;
      if (waiverThresholdAlertText) {
        waiverThresholdAlertText.textContent = `At least ${calculatorSettings.minCreditsForWaiver} fresh credits are required for waiver or scholarship eligibility. Discount is currently suspended for ${newCredits} credits.`;
      }
    } else {
      waiverThresholdAlert.hidden = true;
    }
  }

  // If below threshold, waiver does NOT apply
  const effectiveDiscountPercent = isBelowThreshold ? 0 : appliedPercent;
  const discountAmount = newCourseFee * (effectiveDiscountPercent / 100);

  // Drop Refund Adjustment from drop tool
  const dropCalc = getDropRefundCalculation();
  const isDropRefundApplied = Boolean(
    applyDropRefund && applyDropRefund.checked && dropCalc.refundAmount > 0,
  );
  const dropRefundCredit = isDropRefundApplied ? dropCalc.refundAmount : 0;

  // Total Without Discount (Includes Semester Fee, Mandatory Lab Fee, Extras & Previous Dues)
  const totalWithoutDiscount =
    grossTotal + semesterFee + labFee + extrasTotal + prevDue;

  // Net Total Payable deducting discounts & drop refund adjustments
  const netTotalPayable = Math.max(
    0,
    totalWithoutDiscount - discountAmount - dropRefundCredit,
  );

  // Remaining Balance after Paid at Registration deduction
  const remainingPayable = Math.max(0, netTotalPayable - paidRegistration);

  // Non-splittable dues: Previous trimester dues & late registration fines cannot be deferred
  // across installments under UIU regulations and must be 100% placed into the 1st installment.
  const upfrontDues =
    prevDue + (lateRegChecked ? calculatorSettings.lateRegistrationFine : 0);

  // 1. Gross Installment Base is total without discount minus deposit paid at registration minus upfront dues
  const grossInstallmentBase = Math.max(
    0,
    totalWithoutDiscount - paidRegistration - upfrontDues,
  );

  // 2. Split into nominal milestone shares (e.g. 40%, 30%, 30% for trimester; 25%x4 for pharmacy)
  const nominalInstallments = splitInstallmentAmounts(
    grossInstallmentBase,
    calculatorSettings.installmentRates,
  );

  // ── Mode A: Official UIU Rule (Waiver Deducted from 1st Installment First) ──
  const totalDeductions = roundToTwo(discountAmount + dropRefundCredit);
  let remDeduction = totalDeductions;
  const officialScheduledInstallments = [];

  for (let i = 0; i < nominalInstallments.length; i++) {
    const nom = nominalInstallments[i];
    const cut = Math.min(nom, remDeduction);
    let due = roundToTwo(nom - cut);
    if (i === 0) {
      due = roundToTwo(due + upfrontDues);
    }
    officialScheduledInstallments.push(due);
    remDeduction = roundToTwo(remDeduction - cut);
  }

  // Official Cumulative milestone targets (for late-fine safety benchmarks)
  const officialCumulativeTargets = [];
  let cumOfficial = 0;
  for (let i = 0; i < officialScheduledInstallments.length; i++) {
    cumOfficial = roundToTwo(cumOfficial + officialScheduledInstallments[i]);
    officialCumulativeTargets.push(cumOfficial);
  }

  // ── Mode B: Split Remaining Balance (40% • 30% • 30% of Net Remaining) ──
  // The net remaining balance after deducting registration deposit and upfront dues
  const splittableRemaining = Math.max(
    0,
    netTotalPayable - paidRegistration - upfrontDues,
  );

  const rawRemainingSplit = splitInstallmentAmounts(
    splittableRemaining,
    calculatorSettings.installmentRates,
  );

  const remainingScheduledInstallments = [];
  for (let i = 0; i < rawRemainingSplit.length; i++) {
    let due = rawRemainingSplit[i];
    if (i === 0) {
      due = roundToTwo(due + upfrontDues);
    }
    remainingScheduledInstallments.push(roundToTwo(due));
  }

  // University Late-Fine Protection Guarantee:
  // Ensure that cumulative target at each installment deadline i is AT LEAST equal to
  // the official university required milestone (officialCumulativeTargets[i]).
  // If due to custom inputs or edge cases it's less, clamp it up to guarantee no fine!
  let cumRemaining = 0;
  for (let i = 0; i < remainingScheduledInstallments.length; i++) {
    cumRemaining = roundToTwo(cumRemaining + remainingScheduledInstallments[i]);
    const reqMilestone = officialCumulativeTargets[i] || 0;
    if (cumRemaining < reqMilestone) {
      const shortfall = roundToTwo(reqMilestone - cumRemaining);
      remainingScheduledInstallments[i] = roundToTwo(
        remainingScheduledInstallments[i] + shortfall,
      );
      if (i + 1 < remainingScheduledInstallments.length) {
        remainingScheduledInstallments[i + 1] = Math.max(
          0,
          roundToTwo(remainingScheduledInstallments[i + 1] - shortfall),
        );
      }
      cumRemaining = reqMilestone;
    }
  }

  const remainingCumulativeTargets = [];
  let cumRemTarget = 0;
  for (let i = 0; i < remainingScheduledInstallments.length; i++) {
    cumRemTarget = roundToTwo(cumRemTarget + remainingScheduledInstallments[i]);
    remainingCumulativeTargets.push(cumRemTarget);
  }

  // Determine active schedule based on currentInstallmentMode
  const isRemainingMode = currentInstallmentMode === "remaining";
  const scheduledInstallments = isRemainingMode
    ? remainingScheduledInstallments
    : officialScheduledInstallments;
  const cumulativeTargets = isRemainingMode
    ? remainingCumulativeTargets
    : officialCumulativeTargets;

  // Dynamic adjustment based on actual amounts paid by student
  const adjustedInstallments = [];
  let cumPaidBefore = 0;
  let hasAnyPriorPaid = false;

  for (let i = 0; i < scheduledInstallments.length; i++) {
    let due = scheduledInstallments[i];
    if (i === 0) {
      due = scheduledInstallments[0];
    } else {
      if (hasAnyPriorPaid) {
        due = Math.max(0, roundToTwo(cumulativeTargets[i] - cumPaidBefore));
      } else {
        due = scheduledInstallments[i];
      }
    }
    adjustedInstallments.push(due);

    const paidVal = actualPaidInstallments[i];
    if (paidVal !== undefined && paidVal !== null && paidVal !== "") {
      hasAnyPriorPaid = true;
      cumPaidBefore = roundToTwo(cumPaidBefore + Number(paidVal));
    } else {
      cumPaidBefore = roundToTwo(cumPaidBefore + due);
    }
  }

  const scheduleData = {
    nominal: nominalInstallments,
    scheduled: scheduledInstallments,
    adjusted: adjustedInstallments,
    cumulativeTargets,
    officialScheduled: officialScheduledInstallments,
    remainingScheduled: remainingScheduledInstallments,
    officialCumulativeTargets,
    remainingCumulativeTargets,
    mode: currentInstallmentMode,
  };

  // Save full calculation state for Voucher / WhatsApp export
  lastCalculationState = {
    program: calculatorSettings.program,
    newCredits,
    nonWaiverCredits,
    retakeFirstCredits,
    retakeNonFirstCredits,
    newCourseFee,
    nonWaiverFee,
    retakeFirstFee,
    retakeNonFirstFee,
    grossTotal,
    semesterFee,
    labFee,
    extrasTotal,
    prevDue,
    customExtra,
    transportChecked,
    gymChecked,
    lateRegChecked,
    lateInstChecked,
    appliedType,
    appliedPercent,
    effectiveDiscountPercent,
    isBelowThreshold,
    discountAmount,
    dropRefundCredit,
    isDropRefundApplied,
    totalWithoutDiscount,
    netTotalPayable,
    paidRegistration,
    remainingPayable,
    nominalInstallments,
    scheduledInstallments,
    adjustedInstallments,
    installments: adjustedInstallments,
    installmentMode: currentInstallmentMode,
    scheduleData,
  };

  // Render Core Currency Totals
  setCurrencyText("grossTotal", grossTotal, animate);
  setCurrencyText("semesterFee", semesterFee, animate);
  setCurrencyText("netTotalPayable", netTotalPayable, animate);

  // Total Without Discount Row (Show only if adjustments exist)
  if (resultFields.totalWithoutDiscountRow) {
    const hasAdjustments =
      discountAmount > 0 ||
      extrasTotal > 0 ||
      prevDue !== 0 ||
      dropRefundCredit > 0;
    if (hasAdjustments) {
      resultFields.totalWithoutDiscountRow.hidden = false;
      setCurrencyText("totalWithoutDiscount", totalWithoutDiscount, animate);
    } else {
      resultFields.totalWithoutDiscountRow.hidden = true;
    }
  }

  // Discount Amount Row (Show only if discountAmount > 0)
  if (resultFields.discountSummaryRow) {
    if (discountAmount > 0) {
      resultFields.discountSummaryRow.hidden = false;
      setCurrencyText("discountAmount", discountAmount, animate);
    } else {
      resultFields.discountSummaryRow.hidden = true;
    }
  }

  // Mandatory Lab Fee Row Visibility
  if (resultFields.labFeeSummaryRow) {
    if (labFee > 0) {
      resultFields.labFeeSummaryRow.hidden = false;
      setCurrencyText("labFeeTotal", labFee, animate);
    } else {
      resultFields.labFeeSummaryRow.hidden = true;
    }
  }

  // Extras Row Visibility
  if (resultFields.extrasSummaryRow) {
    if (extrasTotal > 0) {
      resultFields.extrasSummaryRow.hidden = false;
      setCurrencyText("extrasTotal", extrasTotal, animate);
    } else {
      resultFields.extrasSummaryRow.hidden = true;
    }
  }

  // Previous Due Row Visibility
  if (resultFields.prevDueSummaryRow) {
    if (prevDue !== 0) {
      resultFields.prevDueSummaryRow.hidden = false;
      if (resultFields.prevDueSummaryLabel) {
        resultFields.prevDueSummaryLabel.textContent =
          prevDue > 0 ? "Previous Dues (+)" : "Previous Credit Balance (-)";
      }
      setCurrencyText("prevDueTotal", Math.abs(prevDue), animate);
    } else {
      resultFields.prevDueSummaryRow.hidden = true;
    }
  }

  // Drop Refund Adjustment Row Visibility
  if (resultFields.dropRefundSummaryRow) {
    if (dropRefundCredit > 0) {
      resultFields.dropRefundSummaryRow.hidden = false;
      setCurrencyText("dropRefundTotal", dropRefundCredit, animate);
    } else {
      resultFields.dropRefundSummaryRow.hidden = true;
    }
  }

  // Paid at Registration & Remaining Balance Rows
  if (resultFields.paidAtRegSummaryRow && resultFields.remainingPayableRow) {
    if (paidRegistration > 0) {
      resultFields.paidAtRegSummaryRow.hidden = false;
      setCurrencyText("paidAtRegTotal", paidRegistration, animate);
      resultFields.remainingPayableRow.hidden = false;
      setCurrencyText("remainingPayable", remainingPayable, animate);
    } else {
      resultFields.paidAtRegSummaryRow.hidden = true;
      resultFields.remainingPayableRow.hidden = true;
    }
  }

  // Render Installment Rows
  renderInstallmentRows(scheduleData);

  // Update Installment Mode Switcher UI & Late-Fine Guidance
  if (instModeOfficialBtn && instModeRemainingBtn) {
    const isRem = currentInstallmentMode === "remaining";
    instModeOfficialBtn.classList.toggle("is-active", !isRem);
    instModeRemainingBtn.classList.toggle("is-active", isRem);

    const isPharm = calculatorSettings.program === "pharmacy";
    instModeRemainingBtn.textContent = isPharm
      ? "Split Remaining (25% × 4)"
      : "Split Remaining (40/30/30)";

    if (instModeNote) {
      if (isRem) {
        const ratesText = calculatorSettings.installmentRates
          .map((r) => `${formatPercent(r * 100)}%`)
          .join(" • ");
        instModeNote.innerHTML = `
          <span class="inst-mode-note-badge">&#10003; Late-Fine Safe</span>
          <span>Splits net remaining payable (<strong>${formatBDT(remainingPayable)}</strong>) into ${ratesText}. Guaranteed to satisfy UIU cumulative requirements so you never face a late fine.</span>
        `;
      } else {
        instModeNote.innerHTML = `
          <span class="inst-mode-note-badge">UCAM Standard</span>
          <span>Official UIU Rule: Waiver &amp; drop refund discounts are credited against the 1st installment first.</span>
        `;
      }
    }
  }

  // Set Applied Discount Badge
  setAppliedDiscountBadge(
    appliedType,
    appliedPercent,
    isBelowThreshold && appliedPercent > 0,
  );

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
  syncStateToURL();
  updateDropToolCalculation();
}

function toInputString(value) {
  return String(roundToTwo(value));
}

function initializeStaticTexts() {
  const isPharm = calculatorSettings.program === "pharmacy";

  if (resultFields.perCreditRateText) {
    resultFields.perCreditRateText.textContent = `Per-credit: ${formatBDT(calculatorSettings.perCreditFee)}`;
  }
  if (trimesterPill) {
    trimesterPill.textContent = isPharm
      ? `Semester: ${calculatorSettings.trimesterTitle}`
      : `Trimester: ${calculatorSettings.trimesterTitle}`;
  }
  if (semesterFeeLabel) {
    semesterFeeLabel.textContent = isPharm ? "Semester Fee" : "Trimester Fee";
  }
  if (retakeFirstHint) {
    retakeFirstHint.textContent = `Payable: ${formatPercent(calculatorSettings.firstTimeRetakeRate * 100)}%`;
  }
  if (retakeNonFirstHint) {
    retakeNonFirstHint.textContent = `Payable: ${formatPercent(calculatorSettings.nonFirstTimeRetakeRate * 100)}%`;
  }

  // Checkbox Extra Labels
  if (extraFeeLabels.transport) {
    extraFeeLabels.transport.textContent = `+${formatBDT(calculatorSettings.transportFee)}`;
  }
  if (extraFeeLabels.gym) {
    extraFeeLabels.gym.textContent = `+${formatBDT(calculatorSettings.gymFee)}`;
  }
  if (extraFeeLabels.lateReg) {
    extraFeeLabels.lateReg.textContent = `+${formatBDT(calculatorSettings.lateRegistrationFine)}`;
  }
  if (extraFeeLabels.lateInst) {
    extraFeeLabels.lateInst.textContent = `+${formatBDT(calculatorSettings.lateFineInstallment)}`;
  }

  const campusServicesTitle = document.getElementById("campusServicesTitle");
  if (campusServicesTitle) {
    campusServicesTitle.textContent = `Campus Services & Fines (UIU ${calculatorSettings.trimesterTitle})`;
  }

  const dropWindowLabel = document.getElementById("dropWindowLabel");
  if (dropWindowLabel) {
    dropWindowLabel.textContent = `Drop Window (UIU ${calculatorSettings.trimesterTitle})`;
  }

  const voucherTerm = document.getElementById("voucherTerm");
  if (voucherTerm) {
    voucherTerm.textContent = `${isPharm ? "Academic Semester" : "Academic Trimester"}: ${calculatorSettings.trimesterTitle}`;
  }
}

function applyStoredDiscountDefaults(options = {}) {
  const { clearValues = false } = options;
  fields.scl.placeholder = `Default: ${formatPercent(calculatorSettings.defaultScholarshipPercent)}%`;
  fields.waiver.placeholder = `Default: ${formatPercent(calculatorSettings.defaultWaiverPercent)}%`;

  if (clearValues) {
    fields.scl.value = "";
    fields.waiver.value = "";
  }
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("theme-dark", isDark);
  document.body.classList.toggle("theme-light", !isDark);

  const themeColorMeta = document.getElementById("themeColorMeta");
  if (themeColorMeta) {
    themeColorMeta.content = isDark ? "#0f172b" : "#e9f0ff";
  }

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

// ─── Academic Program Switcher ────────────────────────────────────────────────
function switchProgram(programId, options = {}) {
  const { animate = true, keepCustom = false } = options;
  const profile = PROGRAM_PROFILES[programId] || PROGRAM_PROFILES.trimester;

  calculatorSettings.program = profile.id;
  if (!keepCustom) {
    calculatorSettings.perCreditFee = profile.perCreditFee;
    calculatorSettings.semesterFee = profile.semesterFee;
    calculatorSettings.labFee = profile.labFee;
    calculatorSettings.installmentRates = [...profile.installmentRates];
    calculatorSettings.trimesterTitle = profile.trimesterTitle;
    calculatorSettings.dueDateInst1 = profile.dueDateInst1;
    calculatorSettings.dueDateInst2 = profile.dueDateInst2;
    calculatorSettings.dueDateInst3 = profile.dueDateInst3;
    calculatorSettings.dueDateInst4 = profile.dueDateInst4;
    calculatorSettings.refund100Date = profile.refund100Date;
    calculatorSettings.refund50Date = profile.refund50Date;
  }

  if (programTrimesterBtn) {
    const isTrim = profile.id === "trimester";
    programTrimesterBtn.classList.toggle("is-active", isTrim);
    programTrimesterBtn.setAttribute("aria-checked", String(isTrim));
  }
  if (programPharmacyBtn) {
    const isPharm = profile.id === "pharmacy";
    programPharmacyBtn.classList.toggle("is-active", isPharm);
    programPharmacyBtn.setAttribute("aria-checked", String(isPharm));
  }

  updateDropWindowOptions(profile.dropWindows);

  if (profile.id === "pharmacy" && parseOrZero(fields.paidRegistration.value) === 0) {
    fields.paidRegistration.value = "20000";
  }

  persistSettings(calculatorSettings);
  initializeStaticTexts();
  calculateAndRender({ animate });
}

if (programTrimesterBtn) {
  programTrimesterBtn.addEventListener("click", () => {
    switchProgram("trimester");
  });
}
if (programPharmacyBtn) {
  programPharmacyBtn.addEventListener("click", () => {
    switchProgram("pharmacy");
  });
}

// ─── Inline Preset Chips ──────────────────────────────────────────────────────
function initializeInlinePresetChips() {
  document.querySelectorAll(".field-preset-chips").forEach((container) => {
    const targetKey = container.getAttribute("data-for");
    const targetInput = fields[targetKey];
    if (!targetInput) return;

    container.querySelectorAll(".chip-sm").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-preset-val");
        targetInput.value = val;

        container.querySelectorAll(".chip-sm").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
        });

        calculateAndRender();
      });
    });

    const syncChipsOnInput = () => {
      const current = targetInput.value.trim();
      container.querySelectorAll(".chip-sm").forEach((b) => {
        b.classList.toggle("is-active", current === b.getAttribute("data-preset-val"));
      });
    };

    targetInput.addEventListener("input", syncChipsOnInput);
    targetInput.addEventListener("change", syncChipsOnInput);
  });
}

// ─── URL Parameters Synchronization ───────────────────────────────────────────
function loadStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  let hasParam = false;

  if (params.has("prog")) {
    const prog = params.get("prog");
    if (prog === "pharmacy" || prog === "trimester") {
      switchProgram(prog, { animate: false, keepCustom: false });
      hasParam = true;
    }
  }

  if (params.has("c")) {
    fields.newCredit.value = params.get("c");
    hasParam = true;
  }
  if (params.has("nw")) {
    fields.nonWaiverCredit.value = params.get("nw");
    hasParam = true;
  }
  if (params.has("rf")) {
    fields.retakeFirstCredit.value = params.get("rf");
    hasParam = true;
  }
  if (params.has("rn")) {
    fields.retakeNonFirstCredit.value = params.get("rn");
    hasParam = true;
  }
  if (params.has("s")) {
    fields.scl.value = params.get("s");
    hasParam = true;
  }
  if (params.has("w")) {
    fields.waiver.value = params.get("w");
    hasParam = true;
  }
  if (params.has("p")) {
    fields.paidRegistration.value = params.get("p");
    hasParam = true;
  }
  if (params.has("due")) {
    fields.prevDue.value = params.get("due");
    hasParam = true;
  }
  if (params.has("tr")) {
    if (extraCheckboxes.transport)
      extraCheckboxes.transport.checked = params.get("tr") === "1";
    hasParam = true;
  }
  if (params.has("gym")) {
    if (extraCheckboxes.gym)
      extraCheckboxes.gym.checked = params.get("gym") === "1";
    hasParam = true;
  }
  if (params.has("lreg")) {
    if (extraCheckboxes.lateReg)
      extraCheckboxes.lateReg.checked = params.get("lreg") === "1";
    hasParam = true;
  }
  if (params.has("linst")) {
    if (extraCheckboxes.lateInst)
      extraCheckboxes.lateInst.checked = params.get("linst") === "1";
    hasParam = true;
  }
  if (params.has("extra")) {
    fields.extraCustom.value = params.get("extra");
    hasParam = true;
  }
  if (params.has("imode")) {
    const imode = params.get("imode");
    if (imode === "remaining" || imode === "official") {
      currentInstallmentMode = imode;
      hasParam = true;
    }
  }
  if (params.has("drop") && dropCredits) {
    dropCredits.value = params.get("drop");
    hasParam = true;
  }
  if (params.has("dw") && dropWindow) {
    dropWindow.value = params.get("dw");
    hasParam = true;
  }

  // Restore paid installment amounts
  actualPaidInstallments = {};
  for (let i = 0; i < MAX_INSTALLMENTS; i++) {
    if (params.has(`p${i}`)) {
      const v = Number(params.get(`p${i}`));
      if (!isNaN(v) && v >= 0) {
        actualPaidInstallments[i] = v;
        hasParam = true;
      }
    }
  }

  return hasParam;
}

function syncStateToURL() {
  const params = new URLSearchParams();
  const c = fields.newCredit.value.trim();
  const nw = fields.nonWaiverCredit.value.trim();
  const rf = fields.retakeFirstCredit.value.trim();
  const rn = fields.retakeNonFirstCredit.value.trim();
  const s = fields.scl.value.trim();
  const w = fields.waiver.value.trim();
  const p = fields.paidRegistration.value.trim();
  const due = fields.prevDue.value.trim();
  const extra = fields.extraCustom.value.trim();

  if (calculatorSettings.program && calculatorSettings.program !== "trimester") {
    params.set("prog", calculatorSettings.program);
  }
  if (c && Number(c) > 0) params.set("c", c);
  if (nw && Number(nw) > 0) params.set("nw", nw);
  if (rf && Number(rf) > 0) params.set("rf", rf);
  if (rn && Number(rn) > 0) params.set("rn", rn);
  if (s && Number(s) > 0) params.set("s", s);
  if (w && Number(w) > 0) params.set("w", w);
  if (p && Number(p) > 0) params.set("p", p);
  if (due && Number(due) !== 0) params.set("due", due);
  if (extraCheckboxes.transport?.checked) params.set("tr", "1");
  if (extraCheckboxes.gym?.checked) params.set("gym", "1");
  if (extraCheckboxes.lateReg?.checked) params.set("lreg", "1");
  if (extraCheckboxes.lateInst?.checked) params.set("linst", "1");
  if (extra && Number(extra) > 0) params.set("extra", extra);
  if (currentInstallmentMode === "remaining") {
    params.set("imode", "remaining");
  }

  if (dropCredits && Number(dropCredits.value) > 0) {
    params.set("drop", dropCredits.value);
  }
  if (dropWindow && dropWindow.value !== "auto") {
    params.set("dw", dropWindow.value);
  }

  Object.keys(actualPaidInstallments).forEach((key) => {
    const val = actualPaidInstallments[key];
    if (val > 0) {
      params.set(`p${key}`, String(val));
    }
  });

  const query = params.toString();
  const newPath =
    window.location.pathname + (query.length > 0 ? `?${query}` : "");
  window.history.replaceState(null, "", newPath);
}

// ─── Reset Form ───────────────────────────────────────────────────────────────
function resetCalculatorForm() {
  fields.newCredit.value = "";
  fields.nonWaiverCredit.value = "";
  fields.retakeFirstCredit.value = "";
  fields.retakeNonFirstCredit.value = "";
  fields.scl.value = "";
  fields.waiver.value = "";
  fields.paidRegistration.value =
    calculatorSettings.defaultPaidRegistration > 0
      ? String(calculatorSettings.defaultPaidRegistration)
      : "";
  fields.prevDue.value = "";
  fields.extraCustom.value = "";

  actualPaidInstallments = {};
  currentInstallmentMode = calculatorSettings.installmentMode || "official";
  if (dropCredits) dropCredits.value = "0";
  if (dropWindow) dropWindow.value = "auto";
  if (applyDropRefund) applyDropRefund.checked = true;

  Object.values(extraCheckboxes).forEach((cb) => {
    if (cb) cb.checked = false;
  });

  document.querySelectorAll(".chip-sm").forEach((chip) => {
    chip.classList.remove("is-active");
  });

  window.history.replaceState(null, "", window.location.pathname);
  clearAllFieldErrors();
  calculateAndRender({ animate: false });
  showToast("Calculator reset to defaults.");
}

// ─── Course Drop Tool Listeners ───────────────────────────────────────────────
[dropCredits, dropCourseType, dropWindow].forEach((input) => {
  if (input) {
    input.addEventListener("input", () => calculateAndRender());
    input.addEventListener("change", () => calculateAndRender());
  }
});

if (applyDropRefund) {
  applyDropRefund.addEventListener("change", () => calculateAndRender());
}

// ─── Installment Calculation Mode Listeners ──────────────────────────────────
if (instModeOfficialBtn) {
  instModeOfficialBtn.addEventListener("click", () => {
    if (currentInstallmentMode !== "official") {
      currentInstallmentMode = "official";
      calculateAndRender({ animate: false });
      syncStateToURL();
    }
  });
}

if (instModeRemainingBtn) {
  instModeRemainingBtn.addEventListener("click", () => {
    if (currentInstallmentMode !== "remaining") {
      currentInstallmentMode = "remaining";
      calculateAndRender({ animate: false });
      syncStateToURL();
    }
  });
}

// ─── WhatsApp / Messenger Breakdown Formatting ───────────────────────────────
function generateWhatsAppSummary() {
  if (!lastCalculationState) return "";

  const s = lastCalculationState;
  const isPharm = s.program === "pharmacy";
  const totalCredits =
    s.newCredits +
    s.nonWaiverCredits +
    s.retakeFirstCredits +
    s.retakeNonFirstCredits;

  let text = `*UIU Tuition Fee & Installment Plan*\n`;
  text += `Program: ${isPharm ? "Bachelor of Pharmacy (B.Pharm)" : "Undergraduate Trimester"}\n`;
  text += `Term: ${calculatorSettings.trimesterTitle}\n`;
  text += `------------------------------------\n`;
  text += `Enrolled Credits: ${totalCredits.toFixed(1)} cr\n`;
  if (s.newCredits > 0) text += `• Fresh Credits: ${s.newCredits} cr\n`;
  if (s.nonWaiverCredits > 0)
    text += `• Non-Waiver Credits: ${s.nonWaiverCredits} cr\n`;
  if (s.retakeFirstCredits > 0)
    text += `• Retake (1st-time): ${s.retakeFirstCredits} cr\n`;
  if (s.retakeNonFirstCredits > 0)
    text += `• Retake (2nd+ time): ${s.retakeNonFirstCredits} cr\n`;

  text += `Per-Credit Rate: ${formatBDT(calculatorSettings.perCreditFee)}\n`;
  text += `Course Tuition: ${formatBDT(s.grossTotal)}\n`;
  text += `${isPharm ? "Semester Fee" : "Trimester Fee"}: ${formatBDT(s.semesterFee)}\n`;

  if (s.labFee > 0) {
    text += `Mandatory Lab Fee: ${formatBDT(s.labFee)}\n`;
  }
  if (s.extrasTotal > 0) {
    text += `Campus Extras & Fines: ${formatBDT(s.extrasTotal)}\n`;
  }
  if (s.prevDue !== 0) {
    const dueLabel =
      s.prevDue > 0 ? "Previous Dues (+)" : "Previous Credit (-)";
    text += `${dueLabel}: ${formatBDT(Math.abs(s.prevDue))}\n`;
  }

  if (s.appliedPercent > 0) {
    if (s.isBelowThreshold) {
      text += `Discount (${s.appliedType.toUpperCase()} ${formatPercent(s.appliedPercent)}%): Suspended (< ${calculatorSettings.minCreditsForWaiver} cr)\n`;
    } else {
      text += `Applied Discount (${s.appliedType.toUpperCase()} ${formatPercent(s.effectiveDiscountPercent)}%): -${formatBDT(s.discountAmount)}\n`;
    }
  }

  if (s.isDropRefundApplied && s.dropRefundCredit > 0) {
    text += `Course Drop Refund Credit: -${formatBDT(s.dropRefundCredit)}\n`;
  }

  text += `------------------------------------\n`;
  text += `*Net Payable:* ${formatBDT(s.netTotalPayable)}\n`;

  if (s.paidRegistration > 0) {
    text += `Paid at Registration: -${formatBDT(s.paidRegistration)}\n`;
    text += `*Remaining Balance:* ${formatBDT(s.remainingPayable)}\n`;
  }

  const modeTitle =
    s.installmentMode === "remaining"
      ? `Split Remaining Balance (${isPharm ? "25%×4" : "40/30/30"})`
      : "Official UIU Policy (Waiver First)";
  text += `\n*Installment Schedule [${modeTitle}]:*\n`;
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const adjusted = s.adjustedInstallments || s.installments || [];
  calculatorSettings.installmentRates.forEach((rate, i) => {
    const amount = adjusted[i] ?? (s.installments[i] ?? 0);
    const milestone = getInstallmentMilestoneInfo(i);
    const dateStr = milestone.dateFormatted
      ? ` (Due: ${milestone.dateFormatted})`
      : "";
    let paidNote = "";
    const rawPaid = actualPaidInstallments[i];
    if (rawPaid !== undefined && rawPaid !== null && rawPaid !== "") {
      const p = Number(rawPaid) || 0;
      if (p >= amount) {
        paidNote = ` [Paid: ${formatBDT(p)} \u2713]`;
      } else {
        paidNote = ` [Paid: ${formatBDT(p)}, Due: ${formatBDT(amount - p)}]`;
      }
    }
    text += `• ${ordinals[i] || `Inst ${i + 1}`} (${formatPercent(rate * 100)}%): ${formatBDT(amount)}${dateStr}${paidNote}\n`;
  });

  text += `\nShared via UIU Installment Calculator:\n${window.location.href}`;
  return text;
}

if (copyBreakdownBtn) {
  copyBreakdownBtn.addEventListener("click", () => {
    if (!lastCalculationState) {
      calculateAndRender();
    }
    const text = generateWhatsAppSummary();
    if (text) {
      copyToClipboard(text, "Breakdown copied for WhatsApp / Messenger!");
    }
  });
}

// ─── Shareable Link Copy ──────────────────────────────────────────────────────
function copyShareableLink() {
  syncStateToURL();
  copyToClipboard(window.location.href, "Shareable link copied to clipboard!");
}

if (headerShareBtn) headerShareBtn.addEventListener("click", copyShareableLink);
if (shareCalcBtn) shareCalcBtn.addEventListener("click", copyShareableLink);

// ─── Reset Form Triggers ──────────────────────────────────────────────────────
if (headerResetBtn)
  headerResetBtn.addEventListener("click", resetCalculatorForm);
if (resetFormBtn) resetFormBtn.addEventListener("click", resetCalculatorForm);

// ─── Fee Voucher Modal ────────────────────────────────────────────────────────
function populateFeeVoucher() {
  if (!lastCalculationState) {
    calculateAndRender({ animate: false });
  }

  const s = lastCalculationState;
  if (!s) return;

  const isPharm = s.program === "pharmacy";

  if (voucherDate) {
    const today = new Date();
    voucherDate.textContent = today.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  if (voucherTerm) {
    voucherTerm.textContent = `${isPharm ? "Academic Semester" : "Academic Trimester"}: ${calculatorSettings.trimesterTitle}`;
  }

  // Populate Itemized Voucher Table
  if (voucherTableBody) {
    voucherTableBody.innerHTML = "";

    const addItemRow = (title, detail, amountStr, isDiscount = false) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${title}</strong></td>
        <td>${detail}</td>
        <td class="text-right ${isDiscount ? "text-good" : ""}">${amountStr}</td>
      `;
      voucherTableBody.appendChild(tr);
    };

    if (s.newCredits > 0) {
      addItemRow(
        "Tuition Fee (Fresh Courses)",
        `${s.newCredits} Credits @ ${formatBDT(calculatorSettings.perCreditFee)}`,
        formatBDT(s.newCourseFee),
      );
    }

    if (s.nonWaiverCredits > 0) {
      addItemRow(
        "Non-Waiver Course Fee (FYDP/Capstone/Thesis)",
        `${s.nonWaiverCredits} Credits @ ${formatBDT(calculatorSettings.perCreditFee)} (Full 100%)`,
        formatBDT(s.nonWaiverFee),
      );
    }

    if (s.retakeFirstCredits > 0) {
      addItemRow(
        "Retake Fee (First-Time)",
        `${s.retakeFirstCredits} Credits @ ${formatPercent(calculatorSettings.firstTimeRetakeRate * 100)}% rate`,
        formatBDT(s.retakeFirstFee),
      );
    }

    if (s.retakeNonFirstCredits > 0) {
      addItemRow(
        "Retake Fee (Not First-Time)",
        `${s.retakeNonFirstCredits} Credits @ ${formatPercent(calculatorSettings.nonFirstTimeRetakeRate * 100)}% rate`,
        formatBDT(s.retakeNonFirstFee),
      );
    }

    addItemRow(
      isPharm ? "Semester Registration & Institutional Fee" : "Trimester Activity & Registration Fee",
      "Fixed Institutional Fee",
      formatBDT(s.semesterFee),
    );

    if (s.labFee > 0) {
      addItemRow(
        "Mandatory Departmental Laboratory Fee",
        "Required for Pharmacy (B.Pharm) laboratory usage",
        formatBDT(s.labFee),
      );
    }

    if (s.appliedPercent > 0 && !s.isBelowThreshold) {
      addItemRow(
        `Discount Applied (${s.appliedType.toUpperCase()} ${formatPercent(s.effectiveDiscountPercent)}%)`,
        `Applicable exclusively to fresh credit tuition (${s.newCredits} credits)`,
        `-${formatBDT(s.discountAmount)}`,
        true,
      );
    } else if (s.appliedPercent > 0 && s.isBelowThreshold) {
      addItemRow(
        `Waiver / Scholarship (${s.appliedType.toUpperCase()} ${formatPercent(s.appliedPercent)}%)`,
        `Suspended: UIU requires at least ${calculatorSettings.minCreditsForWaiver} fresh credits (enrolled: ${s.newCredits})`,
        "\u09F3 0.00",
      );
    }

    if (s.isDropRefundApplied && s.dropRefundCredit > 0) {
      addItemRow(
        "Course Drop Adjustment / Refund Credit",
        "Adjusted from tuition according to UIU academic calendar",
        `-${formatBDT(s.dropRefundCredit)}`,
        true,
      );
    }

    if (s.extrasTotal > 0) {
      const extraDetails = [];
      if (s.transportChecked) extraDetails.push("Bus Transportation");
      if (s.gymChecked) extraDetails.push("Gym Membership");
      if (s.lateRegChecked) extraDetails.push("Late Registration Fine");
      if (s.lateInstChecked) extraDetails.push("Late Installment Fine");
      if (s.customExtra > 0) extraDetails.push("Other Extras");

      addItemRow(
        "Campus Extras & Fine Charges",
        extraDetails.join(", ") || "Selected Extras",
        formatBDT(s.extrasTotal),
      );
    }

    if (s.prevDue !== 0) {
      addItemRow(
        s.prevDue > 0
          ? "Previous Outstanding Dues"
          : "Previous Credit Balance (Carried Forward)",
        s.prevDue > 0 ? "Payable adjustment" : "Deduction from net total",
        `${s.prevDue > 0 ? "+" : "-"}${formatBDT(Math.abs(s.prevDue))}`,
        s.prevDue < 0,
      );
    }

    // Totals Rows
    const netTr = document.createElement("tr");
    netTr.className = "voucher-row--total";
    netTr.innerHTML = `
      <td colspan="2"><strong>Net Total Payable</strong></td>
      <td class="text-right"><strong>${formatBDT(s.netTotalPayable)}</strong></td>
    `;
    voucherTableBody.appendChild(netTr);

    if (s.paidRegistration > 0) {
      const paidTr = document.createElement("tr");
      paidTr.innerHTML = `
        <td colspan="2">Paid at Registration (Down Payment Deduction)</td>
        <td class="text-right text-good">-${formatBDT(s.paidRegistration)}</td>
      `;
      voucherTableBody.appendChild(paidTr);

      const remTr = document.createElement("tr");
      remTr.className = "voucher-row--total";
      remTr.innerHTML = `
        <td colspan="2"><strong>Net Remaining Payable Balance</strong></td>
        <td class="text-right"><strong>${formatBDT(s.remainingPayable)}</strong></td>
      `;
      voucherTableBody.appendChild(remTr);
    }
  }

  // Populate Schedule Table
  if (voucherScheduleBody) {
    voucherScheduleBody.innerHTML = "";
    const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

    const adjusted = s.adjustedInstallments || s.installments || [];
    calculatorSettings.installmentRates.forEach((rate, i) => {
      const amount = adjusted[i] ?? (s.installments[i] ?? 0);
      const milestone = getInstallmentMilestoneInfo(i);
      const rawPaid = actualPaidInstallments[i];
      let paidHtml = "";
      if (rawPaid !== undefined && rawPaid !== null && rawPaid !== "") {
        const p = Number(rawPaid) || 0;
        paidHtml = `<br><span style="font-size:0.82em; color:var(--text); opacity:0.85;">Paid: ${formatBDT(p)}</span>`;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${ordinals[i] || `Installment ${i + 1}`}</strong>${paidHtml}</td>
        <td>${milestone.dateFormatted || "As announced"}</td>
        <td>${formatPercent(rate * 100)}%</td>
        <td class="text-right"><strong>${formatBDT(amount)}</strong></td>
      `;
      voucherScheduleBody.appendChild(tr);
    });
  }

  const voucherDropNote = document.getElementById("voucherDropNote");
  if (voucherDropNote) {
    voucherDropNote.textContent = `Dropping courses is subject to UIU Academic Calendar adjustment cutoffs (100% refund by ${formatMilestoneDate(calculatorSettings.refund100Date)}; 50% refund by ${formatMilestoneDate(calculatorSettings.refund50Date)}).`;
  }
}

function openFeeVoucher() {
  populateFeeVoucher();
  if (voucherModal) {
    voucherModal.hidden = false;
    document.body.classList.add("modal-open");
  }
}

function closeFeeVoucher() {
  if (voucherModal) {
    voucherModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
}

if (headerVoucherBtn) headerVoucherBtn.addEventListener("click", openFeeVoucher);
if (viewVoucherBtn) viewVoucherBtn.addEventListener("click", openFeeVoucher);
if (voucherClose) voucherClose.addEventListener("click", closeFeeVoucher);
if (voucherBackdrop) voucherBackdrop.addEventListener("click", closeFeeVoucher);
if (voucherPrint) {
  voucherPrint.addEventListener("click", () => {
    window.print();
  });
}

// ─── User Manual Modal & Dynamic Rate Scenarios ──────────────────────────────
function populateUserManual() {
  const perCredit = Number(calculatorSettings.perCreditFee) || 5525;
  const semesterFee = Number(calculatorSettings.semesterFee) || 6500;
  const labFee = Number(calculatorSettings.labFee) || 0;
  const deposit = Number(calculatorSettings.defaultPaidRegistration) || 20000;
  const minCredits = Number(calculatorSettings.minCreditsWaiver) || 9;

  // 1. Overview callout & badges
  const configuredRateEl = document.getElementById("manualConfiguredRateText");
  if (configuredRateEl) {
    configuredRateEl.textContent = formatBDT(perCredit);
  }

  const scenarioRateBadge = document.getElementById("manualScenarioRateBadge");
  if (scenarioRateBadge) {
    scenarioRateBadge.textContent = `${formatBDT(perCredit)} / credit`;
  }

  // 2. Program Overview Cards
  const programsGrid = document.getElementById("manualOverviewPrograms");
  if (programsGrid) {
    const isPharm = calculatorSettings.program === "pharmacy";
    const instBreakdown = calculatorSettings.installmentRates
      .map((r) => `${formatPercent(r * 100)}%`)
      .join(", ");

    programsGrid.innerHTML = `
      <div class="manual-card">
        <div class="manual-card__head">
          <span class="manual-card__title">Undergraduate Trimester (CSE, BBA, EEE, Civil, DS)</span>
          <span class="manual-card__badge">
            ${!isPharm ? "Active Program" : "Trimester System"}
          </span>
        </div>
        <p>&bull; <strong>Configured Per-Credit Rate:</strong> ${formatBDT(perCredit)}</p>
        <p>&bull; <strong>Trimester Fee:</strong> ${formatBDT(semesterFee)}</p>
        <p>&bull; <strong>Installments:</strong> ${calculatorSettings.installmentCount} installments (${instBreakdown})</p>
        <p>&bull; <strong>Waiver Eligibility Threshold:</strong> Minimum ${minCredits} fresh credits</p>
      </div>

      <div class="manual-card">
        <div class="manual-card__head">
          <span class="manual-card__title">Bachelor of Pharmacy (B.Pharm)</span>
          <span class="manual-card__badge">
            ${isPharm ? "Active Program" : "Semester System"}
          </span>
        </div>
        <p>&bull; <strong>Per-Credit Rate:</strong> ${formatBDT(PROGRAM_PROFILES.pharmacy.perCreditFee)}</p>
        <p>&bull; <strong>Semester Fee:</strong> ${formatBDT(PROGRAM_PROFILES.pharmacy.semesterFee)} | <strong>Mandatory Lab:</strong> ${formatBDT(PROGRAM_PROFILES.pharmacy.labFee)}</p>
        <p>&bull; <strong>Installments:</strong> 4 installments (25% each)</p>
        <p>&bull; <em>Tip: Switch to B.Pharm mode at the top left to load pharmacy milestone dates &amp; lab fees.</em></p>
      </div>
    `;
  }

  // 3. Populate Dynamic Step-by-Step Sample Scenarios
  const scenariosGrid = document.getElementById("manualScenariosGrid");
  if (scenariosGrid) {
    // Scenario 1: 13 Credits + 25% Waiver
    const s1Credits = 13;
    const s1CourseFee = s1Credits * perCredit;
    const s1Total = s1CourseFee + semesterFee + labFee;
    const s1Waiver = s1CourseFee * 0.25;
    const s1Net = s1Total - s1Waiver;
    const s1Nominal1 = s1Total * 0.40;
    const s1Nominal2 = s1Total * 0.30;
    const s1Nominal3 = s1Total * 0.30;
    const s1Inst1 = Math.max(0, s1Nominal1 - s1Waiver);
    const s1Spillover = Math.max(0, s1Waiver - s1Nominal1);
    const s1Inst2 = Math.max(0, s1Nominal2 - s1Spillover);
    const s1Inst3 = s1Nominal3;

    // Scenario 2: FYDP / Capstone (9 Fresh with 50% waiver + 3 Non-waiver Capstone credits)
    const s2FreshCredits = 9;
    const s2CapstoneCredits = 3;
    const s2FreshFee = s2FreshCredits * perCredit;
    const s2CapstoneFee = s2CapstoneCredits * perCredit;
    const s2Total = s2FreshFee + s2CapstoneFee + semesterFee + labFee;
    const s2Waiver = s2FreshFee * 0.50; // Waiver applies strictly to fresh credits!
    const s2Net = s2Total - s2Waiver;
    const s2Nominal1 = s2Total * 0.40;
    const s2Nominal2 = s2Total * 0.30;
    const s2Nominal3 = s2Total * 0.30;
    const s2Inst1 = Math.max(0, s2Nominal1 - s2Waiver);
    const s2Spillover = Math.max(0, s2Waiver - s2Nominal1);
    const s2Inst2 = Math.max(0, s2Nominal2 - s2Spillover);
    const s2Inst3 = s2Nominal3;

    // Scenario 3: Deposit Paid at Registration
    const s3PaidReg = deposit > 0 ? deposit : 20000;
    const s3Credits = 12;
    const s3Gross = s3Credits * perCredit + semesterFee + labFee;
    const s3Remaining = Math.max(0, s3Gross - s3PaidReg);
    const s3Inst1 = s3Remaining * 0.40;
    const s3Inst2 = s3Remaining * 0.30;
    const s3Inst3 = s3Remaining * 0.30;

    // Scenario 4: Overpayment in 1st Installment (Tracker Adjustment)
    const s4PaidExtra = 2000;
    const s4PaidActual = s1Inst1 + s4PaidExtra;
    const s4AdjustedInst2 = Math.max(0, s1Inst2 - s4PaidExtra);

    scenariosGrid.innerHTML = `
      <!-- Scenario 1 -->
      <div class="manual-scenario-card">
        <div class="manual-scenario-card__header">
          <span class="manual-scenario-card__title">Scenario 1: 13 Credits + 25% Waiver</span>
          <span class="manual-card__badge">Live Rates</span>
        </div>
        <div class="manual-scenario-card__stat"><span>Course Fee (13 cr &times; ${formatBDT(perCredit)}):</span> <strong>${formatBDT(s1CourseFee)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Trimester Fee:</span> <strong>${formatBDT(semesterFee)}</strong></div>
        ${labFee > 0 ? `<div class="manual-scenario-card__stat"><span>Mandatory Lab Fee:</span> <strong>${formatBDT(labFee)}</strong></div>` : ""}
        <div class="manual-scenario-card__stat"><span>Gross Total:</span> <strong>${formatBDT(s1Total)}</strong></div>
        <div class="manual-scenario-card__stat"><span>25% Waiver Discount:</span> <strong class="text-good">-${formatBDT(s1Waiver)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Net Payable:</span> <strong>${formatBDT(s1Net)}</strong></div>
        <div class="manual-scenario-card__highlight">
          &bull; 1st Inst (40% gross - waiver): <strong>${formatBDT(s1Inst1)}</strong><br>
          &bull; 2nd Inst (30% gross): <strong>${formatBDT(s1Inst2)}</strong><br>
          &bull; 3rd Inst (30% gross): <strong>${formatBDT(s1Inst3)}</strong>
        </div>
      </div>

      <!-- Scenario 2 -->
      <div class="manual-scenario-card">
        <div class="manual-scenario-card__header">
          <span class="manual-scenario-card__title">Scenario 2: FYDP / Capstone (Non-Waiver)</span>
          <span class="manual-card__badge">Final Year Project</span>
        </div>
        <p style="font-size:0.77rem; margin:0; color:var(--muted)">9 Fresh credits (50% waiver) + 3 Non-waiver Capstone credits</p>
        <div class="manual-scenario-card__stat"><span>Fresh Tuition (9 cr):</span> <strong>${formatBDT(s2FreshFee)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Capstone (3 cr, full 100% pay):</span> <strong>${formatBDT(s2CapstoneFee)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Trimester Fee:</span> <strong>${formatBDT(semesterFee)}</strong></div>
        <div class="manual-scenario-card__stat"><span>50% Waiver (Fresh only):</span> <strong class="text-good">-${formatBDT(s2Waiver)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Net Payable:</span> <strong>${formatBDT(s2Net)}</strong></div>
        <div class="manual-scenario-card__highlight">
          &bull; Total Bill: ${formatBDT(s2Total)}<br>
          &bull; 1st Inst (40% - waiver): <strong>${formatBDT(s2Inst1)}</strong><br>
          &bull; 2nd Inst (30%): <strong>${formatBDT(s2Inst2)}</strong><br>
          &bull; 3rd Inst (30%): <strong>${formatBDT(s2Inst3)}</strong>
        </div>
      </div>

      <!-- Scenario 3 -->
      <div class="manual-scenario-card">
        <div class="manual-scenario-card__header">
          <span class="manual-scenario-card__title">Scenario 3: Deposit Paid at Registration</span>
          <span class="manual-card__badge">Down Payment</span>
        </div>
        <div class="manual-scenario-card__stat"><span>Total Tuition (12 cr) + Term Fee:</span> <strong>${formatBDT(s3Gross)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Paid at Registration:</span> <strong class="text-good">-${formatBDT(s3PaidReg)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Remaining Balance:</span> <strong>${formatBDT(s3Remaining)}</strong></div>
        <div class="manual-scenario-card__highlight">
          &bull; 1st Inst (40% of remaining): <strong>${formatBDT(s3Inst1)}</strong><br>
          &bull; 2nd Inst (30% of remaining): <strong>${formatBDT(s3Inst2)}</strong><br>
          &bull; 3rd Inst (30% of remaining): <strong>${formatBDT(s3Inst3)}</strong>
        </div>
      </div>

      <!-- Scenario 4 -->
      <div class="manual-scenario-card">
        <div class="manual-scenario-card__header">
          <span class="manual-scenario-card__title">Scenario 4: Overpayment in 1st Installment</span>
          <span class="manual-card__badge">Tracker Auto-Adjust</span>
        </div>
        <div class="manual-scenario-card__stat"><span>1st Inst Scheduled:</span> <strong>${formatBDT(s1Inst1)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Student Actually Paid:</span> <strong>${formatBDT(s4PaidActual)}</strong></div>
        <div class="manual-scenario-card__stat"><span>Surplus Carried to 2nd Inst:</span> <strong class="text-good">+${formatBDT(s4PaidExtra)}</strong></div>
        <div class="manual-scenario-card__highlight">
          &bull; 2nd Inst Scheduled was ${formatBDT(s1Inst2)}<br>
          &bull; <strong>Adjusted 2nd Inst Due:</strong> ${formatBDT(s1Inst2)} - ${formatBDT(s4PaidExtra)} = <strong>${formatBDT(s4AdjustedInst2)}</strong>!
        </div>
      </div>
    `;
  }

  // 4. Hook up the "Open Settings" button inside the manual
  const manualOpenSettingsBtn = document.getElementById("manualOpenSettingsBtn");
  if (manualOpenSettingsBtn) {
    manualOpenSettingsBtn.onclick = () => {
      closeManualModal();
      openSettingsModal();
    };
  }
}

function openManualModal() {
  if (manualModal) {
    populateUserManual();
    manualModal.hidden = false;
    document.body.classList.add("modal-open");
    if (manualBody) {
      manualBody.scrollTop = 0;
    }
  }
}

function closeManualModal() {
  if (manualModal) {
    manualModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
}

if (headerManualBtn) headerManualBtn.addEventListener("click", openManualModal);
if (manualClose) manualClose.addEventListener("click", closeManualModal);
if (manualBackdrop) manualBackdrop.addEventListener("click", closeManualModal);

if (manualNavBtns && manualNavBtns.length > 0) {
  manualNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      manualNavBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const targetId = btn.dataset.target;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ─── Settings Percentages Helpers ─────────────────────────────────────────────
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
  if (!installmentPercentFields) return;
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
  if (!installmentPercentFields) return [];
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
  if (settingsError) {
    settingsError.textContent = message;
  }
}

function populateSettingsForm(settings) {
  if (settingsInputs.perCreditFee)
    settingsInputs.perCreditFee.value = toInputString(settings.perCreditFee);
  if (settingsInputs.semesterFee)
    settingsInputs.semesterFee.value = toInputString(settings.semesterFee);
  if (settingsInputs.labFee)
    settingsInputs.labFee.value = toInputString(settings.labFee || 0);
  if (settingsInputs.firstTimeRetakeRate)
    settingsInputs.firstTimeRetakeRate.value = toInputString(
      settings.firstTimeRetakeRate * 100,
    );
  if (settingsInputs.nonFirstTimeRetakeRate)
    settingsInputs.nonFirstTimeRetakeRate.value = toInputString(
      settings.nonFirstTimeRetakeRate * 100,
    );
  if (settingsInputs.defaultScholarshipPercent)
    settingsInputs.defaultScholarshipPercent.value = toInputString(
      settings.defaultScholarshipPercent,
    );
  if (settingsInputs.defaultWaiverPercent)
    settingsInputs.defaultWaiverPercent.value = toInputString(
      settings.defaultWaiverPercent,
    );
  if (settingsInputs.minCreditsForWaiver)
    settingsInputs.minCreditsForWaiver.value = toInputString(
      settings.minCreditsForWaiver,
    );
  if (settingsInputs.defaultPaidRegistration)
    settingsInputs.defaultPaidRegistration.value = toInputString(
      settings.defaultPaidRegistration,
    );
  if (settingsInputs.transportFee)
    settingsInputs.transportFee.value = toInputString(settings.transportFee);
  if (settingsInputs.gymFee)
    settingsInputs.gymFee.value = toInputString(settings.gymFee);
  if (settingsInputs.lateFineInstallment)
    settingsInputs.lateFineInstallment.value = toInputString(
      settings.lateFineInstallment,
    );
  if (settingsInputs.lateRegistrationFine)
    settingsInputs.lateRegistrationFine.value = toInputString(
      settings.lateRegistrationFine,
    );
  if (settingsInputs.trimesterTitle)
    settingsInputs.trimesterTitle.value = settings.trimesterTitle || "";
  if (settingsInputs.refund100Date)
    settingsInputs.refund100Date.value = settings.refund100Date || "";
  if (settingsInputs.refund50Date)
    settingsInputs.refund50Date.value = settings.refund50Date || "";
  if (settingsInputs.dueDateInst1)
    settingsInputs.dueDateInst1.value = settings.dueDateInst1 || "";
  if (settingsInputs.dueDateInst2)
    settingsInputs.dueDateInst2.value = settings.dueDateInst2 || "";
  if (settingsInputs.dueDateInst3)
    settingsInputs.dueDateInst3.value = settings.dueDateInst3 || "";
  if (settingsInputs.dueDateInst4)
    settingsInputs.dueDateInst4.value = settings.dueDateInst4 || "";
  if (settingsInputs.installmentMode)
    settingsInputs.installmentMode.value = settings.installmentMode || "official";

  if (settingsInputs.installmentCount) {
    settingsInputs.installmentCount.value = String(
      settings.installmentRates.length,
    );
  }

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
  if (settingsInputs.perCreditFee) {
    settingsInputs.perCreditFee.focus();
  }
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

  const program = candidate.program === "pharmacy" ? "pharmacy" : "trimester";
  const perCreditFee = Number(candidate.perCreditFee);
  const semesterFee = Number(candidate.semesterFee);
  const labFee = candidate.labFee !== undefined ? Number(candidate.labFee) : 0;
  const firstTimeRetakeRate = Number(candidate.firstTimeRetakeRate);
  const nonFirstTimeRetakeRate = Number(candidate.nonFirstTimeRetakeRate);
  const defaultScholarshipPercent =
    candidate.defaultScholarshipPercent === undefined
      ? 0
      : Number(candidate.defaultScholarshipPercent);
  const defaultWaiverPercent =
    candidate.defaultWaiverPercent === undefined
      ? 0
      : Number(candidate.defaultWaiverPercent);

  const minCreditsForWaiver =
    candidate.minCreditsForWaiver === undefined
      ? DEFAULT_SETTINGS.minCreditsForWaiver
      : Number(candidate.minCreditsForWaiver);
  const defaultPaidRegistration =
    candidate.defaultPaidRegistration === undefined
      ? DEFAULT_SETTINGS.defaultPaidRegistration
      : Number(candidate.defaultPaidRegistration);
  const transportFee =
    candidate.transportFee === undefined
      ? DEFAULT_SETTINGS.transportFee
      : Number(candidate.transportFee);
  const gymFee =
    candidate.gymFee === undefined
      ? DEFAULT_SETTINGS.gymFee
      : Number(candidate.gymFee);
  const lateFineInstallment =
    candidate.lateFineInstallment === undefined
      ? DEFAULT_SETTINGS.lateFineInstallment
      : Number(candidate.lateFineInstallment);
  const lateRegistrationFine =
    candidate.lateRegistrationFine === undefined
      ? DEFAULT_SETTINGS.lateRegistrationFine
      : Number(candidate.lateRegistrationFine);

  const installmentMode =
    candidate.installmentMode === "remaining" ? "remaining" : "official";

  const trimesterTitle =
    typeof candidate.trimesterTitle === "string" &&
    candidate.trimesterTitle.trim()
      ? candidate.trimesterTitle.trim()
      : DEFAULT_SETTINGS.trimesterTitle;
  const refund100Date =
    typeof candidate.refund100Date === "string" && candidate.refund100Date
      ? candidate.refund100Date
      : DEFAULT_SETTINGS.refund100Date;
  const refund50Date =
    typeof candidate.refund50Date === "string" && candidate.refund50Date
      ? candidate.refund50Date
      : DEFAULT_SETTINGS.refund50Date;
  const dueDateInst1 =
    typeof candidate.dueDateInst1 === "string" && candidate.dueDateInst1
      ? candidate.dueDateInst1
      : DEFAULT_SETTINGS.dueDateInst1;
  const dueDateInst2 =
    typeof candidate.dueDateInst2 === "string" && candidate.dueDateInst2
      ? candidate.dueDateInst2
      : DEFAULT_SETTINGS.dueDateInst2;
  const dueDateInst3 =
    typeof candidate.dueDateInst3 === "string" && candidate.dueDateInst3
      ? candidate.dueDateInst3
      : DEFAULT_SETTINGS.dueDateInst3;
  const dueDateInst4 =
    typeof candidate.dueDateInst4 === "string" && candidate.dueDateInst4
      ? candidate.dueDateInst4
      : "";

  const rawInstallmentRates = Array.isArray(candidate.installmentRates)
    ? candidate.installmentRates.map((value) => Number(value))
    : [];

  if (
    !Number.isFinite(perCreditFee) ||
    perCreditFee < 0 ||
    !Number.isFinite(semesterFee) ||
    semesterFee < 0 ||
    !Number.isFinite(labFee) ||
    labFee < 0 ||
    !Number.isFinite(firstTimeRetakeRate) ||
    firstTimeRetakeRate < 0 ||
    firstTimeRetakeRate > 1 ||
    !Number.isFinite(nonFirstTimeRetakeRate) ||
    nonFirstTimeRetakeRate < 0 ||
    nonFirstTimeRetakeRate > 1 ||
    !Number.isFinite(defaultScholarshipPercent) ||
    defaultScholarshipPercent < 0 ||
    defaultScholarshipPercent > 100 ||
    !Number.isFinite(defaultWaiverPercent) ||
    defaultWaiverPercent < 0 ||
    defaultWaiverPercent > 100 ||
    !Number.isFinite(minCreditsForWaiver) ||
    minCreditsForWaiver < 0 ||
    !Number.isFinite(defaultPaidRegistration) ||
    defaultPaidRegistration < 0 ||
    !Number.isFinite(transportFee) ||
    transportFee < 0 ||
    !Number.isFinite(gymFee) ||
    gymFee < 0 ||
    !Number.isFinite(lateFineInstallment) ||
    lateFineInstallment < 0 ||
    !Number.isFinite(lateRegistrationFine) ||
    lateRegistrationFine < 0 ||
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
    program,
    perCreditFee: roundToTwo(perCreditFee),
    semesterFee: roundToTwo(semesterFee),
    labFee: roundToTwo(labFee),
    firstTimeRetakeRate,
    nonFirstTimeRetakeRate,
    defaultScholarshipPercent: roundToTwo(defaultScholarshipPercent),
    defaultWaiverPercent: roundToTwo(defaultWaiverPercent),
    installmentRates: normalizedRates,
    minCreditsForWaiver: roundToTwo(minCreditsForWaiver),
    defaultPaidRegistration: roundToTwo(defaultPaidRegistration),
    transportFee: roundToTwo(transportFee),
    gymFee: roundToTwo(gymFee),
    lateFineInstallment: roundToTwo(lateFineInstallment),
    lateRegistrationFine: roundToTwo(lateRegistrationFine),
    trimesterTitle,
    lastCalendarTermId: candidate.lastCalendarTermId || "",
    refund100Date,
    refund50Date,
    dueDateInst1,
    dueDateInst2,
    dueDateInst3,
    dueDateInst4,
    installmentMode,
  };
}

function loadStoredSettings() {
  let settings = null;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const validated = validateSettingsCandidate(parsed);
      if (validated) {
        settings = validated;
      }
    }
  } catch {
    // Fall back to defaults.
  }

  if (!settings) {
    settings = cloneSettings(DEFAULT_SETTINGS);
  }

  // Automatic Academic Calendar Sync:
  // Before the new trimester's official startDate arrives, dates stay on the current term.
  // When a new trimester/semester begins (today >= startDate), dates update automatically!
  const activeProfile = getProgramProfile(settings.program || "trimester");
  if (settings.lastCalendarTermId !== activeProfile.termId) {
    settings.lastCalendarTermId = activeProfile.termId;
    settings.trimesterTitle = activeProfile.trimesterTitle;
    settings.refund100Date = activeProfile.refund100Date;
    settings.refund50Date = activeProfile.refund50Date;
    settings.dueDateInst1 = activeProfile.dueDateInst1;
    settings.dueDateInst2 = activeProfile.dueDateInst2;
    settings.dueDateInst3 = activeProfile.dueDateInst3;
    settings.dueDateInst4 = activeProfile.dueDateInst4;
    persistSettings(settings);
  }

  return settings;
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

  if (settings.installmentMode) {
    currentInstallmentMode = settings.installmentMode;
  }

  if (persist) {
    persistSettings(calculatorSettings);
  }

  initializeStaticTexts();
  applyStoredDiscountDefaults();
  calculateAndRender({ animate });
  populateUserManual();
}

function collectSettingsFromForm() {
  const perCreditFee = Number(settingsInputs.perCreditFee.value);
  const semesterFee = Number(settingsInputs.semesterFee.value);
  const labFee = Number(settingsInputs.labFee?.value || 0);
  const firstTimeRetakePercent = Number(
    settingsInputs.firstTimeRetakeRate.value,
  );
  const nonFirstTimeRetakePercent = Number(
    settingsInputs.nonFirstTimeRetakeRate.value,
  );
  const defaultScholarshipPercent = Number(
    settingsInputs.defaultScholarshipPercent.value,
  );
  const defaultWaiverPercent = Number(
    settingsInputs.defaultWaiverPercent.value,
  );
  const minCreditsForWaiver = Number(settingsInputs.minCreditsForWaiver.value);
  const defaultPaidRegistration = Number(
    settingsInputs.defaultPaidRegistration.value,
  );
  const transportFee = Number(settingsInputs.transportFee.value);
  const gymFee = Number(settingsInputs.gymFee.value);
  const lateFineInstallment = Number(
    settingsInputs.lateFineInstallment.value,
  );
  const lateRegistrationFine = Number(
    settingsInputs.lateRegistrationFine.value,
  );
  const installmentMode = settingsInputs.installmentMode
    ? settingsInputs.installmentMode.value
    : "official";

  const trimesterTitle = settingsInputs.trimesterTitle.value.trim();
  const refund100Date = settingsInputs.refund100Date.value;
  const refund50Date = settingsInputs.refund50Date.value;
  const dueDateInst1 = settingsInputs.dueDateInst1.value;
  const dueDateInst2 = settingsInputs.dueDateInst2.value;
  const dueDateInst3 = settingsInputs.dueDateInst3.value;
  const dueDateInst4 = settingsInputs.dueDateInst4 ? settingsInputs.dueDateInst4.value : "";

  const installmentCount = Number(settingsInputs.installmentCount.value);
  const installmentPercents = readInstallmentPercentInputs();

  if (!Number.isFinite(perCreditFee) || perCreditFee < 0) {
    return { error: "Per-credit rate must be 0 or more." };
  }
  if (!Number.isFinite(semesterFee) || semesterFee < 0) {
    return { error: "Semester fee must be 0 or more." };
  }
  if (!Number.isFinite(labFee) || labFee < 0) {
    return { error: "Lab fee must be 0 or more." };
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
  if (
    !Number.isFinite(defaultScholarshipPercent) ||
    defaultScholarshipPercent < 0 ||
    defaultScholarshipPercent > 100
  ) {
    return { error: "Default scholarship must be between 0 and 100." };
  }
  if (
    !Number.isFinite(defaultWaiverPercent) ||
    defaultWaiverPercent < 0 ||
    defaultWaiverPercent > 100
  ) {
    return { error: "Default waiver must be between 0 and 100." };
  }
  if (!Number.isFinite(minCreditsForWaiver) || minCreditsForWaiver < 0) {
    return { error: "Minimum fresh credits must be 0 or more." };
  }
  if (!Number.isFinite(transportFee) || transportFee < 0) {
    return { error: "Transport fee must be 0 or more." };
  }
  if (!Number.isFinite(gymFee) || gymFee < 0) {
    return { error: "Gym fee must be 0 or more." };
  }
  if (!Number.isFinite(lateFineInstallment) || lateFineInstallment < 0) {
    return { error: "Late installment fine must be 0 or more." };
  }
  if (!Number.isFinite(lateRegistrationFine) || lateRegistrationFine < 0) {
    return { error: "Late registration fine must be 0 or more." };
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
    program: calculatorSettings.program,
    perCreditFee,
    semesterFee,
    labFee,
    firstTimeRetakeRate: firstTimeRetakePercent / 100,
    nonFirstTimeRetakeRate: nonFirstTimeRetakePercent / 100,
    defaultScholarshipPercent,
    defaultWaiverPercent,
    minCreditsForWaiver,
    defaultPaidRegistration,
    transportFee,
    gymFee,
    lateFineInstallment,
    lateRegistrationFine,
    trimesterTitle: trimesterTitle || DEFAULT_SETTINGS.trimesterTitle,
    refund100Date,
    refund50Date,
    dueDateInst1,
    dueDateInst2,
    dueDateInst3,
    dueDateInst4,
    installmentRates: normalizedInstallmentRates,
    installmentMode,
  });

  if (!normalized) {
    return { error: "Unable to save settings. Please verify all values." };
  }

  return { settings: normalized };
}

// ─── Event Bindings ───────────────────────────────────────────────────────────
Object.values(fields).forEach((input) => {
  if (input) {
    input.addEventListener("input", () => calculateAndRender());
    input.addEventListener("change", () => calculateAndRender());
  }
});

Object.values(extraCheckboxes).forEach((cb) => {
  if (cb) {
    cb.addEventListener("change", () => calculateAndRender());
  }
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
    showToast("Settings updated successfully!");
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
    const currentProg = calculatorSettings.program || "trimester";
    const profile = PROGRAM_PROFILES[currentProg] || PROGRAM_PROFILES.trimester;
    populateSettingsForm({
      ...DEFAULT_SETTINGS,
      program: profile.id,
      perCreditFee: profile.perCreditFee,
      semesterFee: profile.semesterFee,
      labFee: profile.labFee,
      installmentRates: profile.installmentRates,
      trimesterTitle: profile.trimesterTitle,
      dueDateInst1: profile.dueDateInst1,
      dueDateInst2: profile.dueDateInst2,
      dueDateInst3: profile.dueDateInst3,
      dueDateInst4: profile.dueDateInst4,
      refund100Date: profile.refund100Date,
      refund50Date: profile.refund50Date,
    });
  });
}

// ─── Non-Waiver Hint Popover ──────────────────────────────────────────────────
function openNonWaiverHint() {
  if (!nonWaiverHintPopover) return;
  nonWaiverHintPopover.hidden = false;
  if (nonWaiverHintBtn) {
    nonWaiverHintBtn.setAttribute("aria-expanded", "true");
  }
}

function closeNonWaiverHint() {
  if (!nonWaiverHintPopover) return;
  nonWaiverHintPopover.hidden = true;
  if (nonWaiverHintBtn) {
    nonWaiverHintBtn.setAttribute("aria-expanded", "false");
  }
}

function toggleNonWaiverHint() {
  if (!nonWaiverHintPopover) return;
  if (nonWaiverHintPopover.hidden) {
    openNonWaiverHint();
  } else {
    closeNonWaiverHint();
  }
}

if (nonWaiverHintBtn) {
  nonWaiverHintBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleNonWaiverHint();
  });
}

if (nonWaiverHintClose) {
  nonWaiverHintClose.addEventListener("click", (event) => {
    event.stopPropagation();
    closeNonWaiverHint();
    if (nonWaiverHintBtn) {
      nonWaiverHintBtn.focus();
    }
  });
}

document.addEventListener("click", (event) => {
  if (!nonWaiverHintPopover || nonWaiverHintPopover.hidden) return;
  if (
    !nonWaiverHintPopover.contains(event.target) &&
    !nonWaiverHintBtn.contains(event.target)
  ) {
    closeNonWaiverHint();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (nonWaiverHintPopover && !nonWaiverHintPopover.hidden) {
      closeNonWaiverHint();
      if (nonWaiverHintBtn) {
        nonWaiverHintBtn.focus();
      }
    }
    if (settingsModal && !settingsModal.hidden) {
      closeSettingsModal();
    }
    if (voucherModal && !voucherModal.hidden) {
      closeFeeVoucher();
    }
    if (manualModal && !manualModal.hidden) {
      closeManualModal();
    }
  }
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

// ─── Initialization ───────────────────────────────────────────────────────────
initializeTheme();
initializeInlinePresetChips();

const activeProgram = calculatorSettings.program || "trimester";
const activeProfile = PROGRAM_PROFILES[activeProgram] || PROGRAM_PROFILES.trimester;
updateDropWindowOptions(activeProfile.dropWindows);

if (programTrimesterBtn) {
  const isTrim = activeProgram === "trimester";
  programTrimesterBtn.classList.toggle("is-active", isTrim);
  programTrimesterBtn.setAttribute("aria-checked", String(isTrim));
}
if (programPharmacyBtn) {
  const isPharm = activeProgram === "pharmacy";
  programPharmacyBtn.classList.toggle("is-active", isPharm);
  programPharmacyBtn.setAttribute("aria-checked", String(isPharm));
}

initializeStaticTexts();
applyStoredDiscountDefaults({ clearValues: true });

const loadedFromURL = loadStateFromURL();
if (!loadedFromURL && calculatorSettings.defaultPaidRegistration > 0) {
  fields.paidRegistration.value = String(
    calculatorSettings.defaultPaidRegistration,
  );
}

renderInstallmentRows([], true);
calculateAndRender({ animate: false });
updateDropToolCalculation();
populateUserManual();
