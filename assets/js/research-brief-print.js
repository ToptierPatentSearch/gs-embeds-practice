
"use strict";

(() => {

  const root =
    document.getElementById("practice-brief-builder");

  if (!root) return;

  const get = (id) =>
    root.querySelector(`#${id}`);

  const printButton =
    get("practice-brief-print");

  const generateButton =
    get("practice-brief-generate");

  const copyButton =
    get("practice-brief-copy");

  const resetButton =
    get("practice-brief-reset");

  const goalSelect =
    get("practice-brief-goal");

  const technology =
    get("practice-brief-technology");

  const jurisdictions =
    get("practice-brief-jurisdictions");

  const timing =
    get("practice-brief-timing");

  const output =
    get("practice-brief-output");

  const printText =
    get("practice-brief-print-text");

  const required = [
    printButton, generateButton, copyButton,
    resetButton, goalSelect, technology,
    jurisdictions, timing, output, printText
  ];

  if (required.some((element) => !element)) {
    return;
  }

  function updatePrintAvailability() {

    printButton.disabled =
      copyButton.disabled ||
      output.value.trim() === "";

  }

  function preparePrintDocument() {

    const hasCurrentBrief =
      !copyButton.disabled &&
      output.value.trim() !== "";

    printText.textContent = hasCurrentBrief
      ? output.value
      : "No current research brief. " +
        "Generate a draft before printing.";

  }

  printButton.addEventListener("click", () => {

    updatePrintAvailability();

    if (printButton.disabled) return;

    preparePrintDocument();

    window.print();

  });

  window.addEventListener(
    "beforeprint",
    preparePrintDocument
  );

  generateButton.addEventListener(
    "click",
    updatePrintAvailability
  );

  resetButton.addEventListener(
    "click",
    updatePrintAvailability
  );

  goalSelect.addEventListener(
    "change",
    updatePrintAvailability
  );

  [technology, jurisdictions, timing].forEach(
    (field) => {

      field.addEventListener(
        "input",
        updatePrintAvailability
      );

    }
  );

  updatePrintAvailability();

})();
