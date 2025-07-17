document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const credit = parseInt(document.getElementById("credit").value) || 1;
    const scl = parseFloat(document.getElementById("scl").value) || 1;
    const waiver = parseFloat(document.getElementById("waiver").value) || 1;

    const disc = Math.max(waiver, scl);
    const total = 5525 * credit * (1 - disc / 100) + 6500;
    const firstInstallment = Math.ceil(total * 0.4);
    const secondInstallment = Math.ceil(total * 0.3);
    const thirdInstallment = Math.ceil(total * 0.3);

    document.getElementById(
      "totalAmount"
    ).textContent = `৳ ${total.toLocaleString("en-BD", {
      maximumFractionDigits: 0,
    })}`;
    document.getElementById(
      "firstInstallment"
    ).textContent = `৳ ${firstInstallment.toLocaleString("en-BD")}`;
    document.getElementById(
      "secondInstallment"
    ).textContent = `৳ ${secondInstallment.toLocaleString("en-BD")}`;
    document.getElementById(
      "thirdInstallment"
    ).textContent = `৳ ${thirdInstallment.toLocaleString("en-BD")}`;

    const discountType = disc === scl ? "Scholarship" : "Waiver";
    document.getElementById(
      "discountText"
    ).textContent = `Best discount applied: ${disc}% (${discountType})`;

    document.getElementById("results").classList.add("show");
  });

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", function () {
    const credit = document.getElementById("credit").value;
    const scl = document.getElementById("scl").value;
    const waiver = document.getElementById("waiver").value;

    if (credit && scl && waiver) {
      document
        .getElementById("calculatorForm")
        .dispatchEvent(new Event("submit"));
    }
  });
});

document.getElementById("calculatorForm").dispatchEvent(new Event("submit"));
