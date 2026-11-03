
"use strict";

(() => {

  const root =
    document.getElementById("practice-brief-builder");

  if (!root) return;

  const controls =
    root.querySelector("#practice-brief-controls");

  const goalSelect =
    root.querySelector("#practice-brief-goal");

  const technology =
    root.querySelector("#practice-brief-technology");

  const jurisdictions =
    root.querySelector("#practice-brief-jurisdictions");

  const timing =
    root.querySelector("#practice-brief-timing");

  const generateButton =
    root.querySelector("#practice-brief-generate");

  const copyButton =
    root.querySelector("#practice-brief-copy");

  const resetButton =
    root.querySelector("#practice-brief-reset");

  const outputGroup =
    root.querySelector("#practice-brief-output-group");

  const output =
    root.querySelector("#practice-brief-output");

  const status =
    root.querySelector("#practice-brief-status");

  const reference =
    root.querySelector("#practice-brief-reference");

  const rules =
    Array.from(root.querySelectorAll(".practice-brief-rule"));

  if (
    !controls || !goalSelect || !technology ||
    !jurisdictions || !timing || !generateButton ||
    !copyButton || !resetButton || !outputGroup ||
    !output || !status || !reference
  ) {
    return;
  }

  function generateBrief() {

    const selectedRule = rules.find((rule) =>
      rule.dataset.goalId === goalSelect.value
    );

    if (!selectedRule) {
      status.textContent =
        "Please select a research objective.";
      goalSelect.focus();
      return;
    }

    const goalTitle =
      selectedRule.querySelector(
        ".practice-brief-goal-title"
      ).textContent.trim();

    const goalExplanation =
      selectedRule.querySelector(
        ".practice-brief-goal-explanation"
      ).textContent.trim();

    const recommendations =
      Array.from(selectedRule.querySelectorAll(
        ".practice-brief-recommendation"
      ));

    const recommendedServices =
      recommendations.map((item, index) => {

        const serviceName =
          item.querySelector(
            ".practice-brief-service-name"
          ).textContent.trim();

        const reason =
          item.querySelector(
            ".practice-brief-reason"
          ).textContent.trim();

        return `${index + 1}. ${serviceName}\n   ${reason}`;

      });

    const brief = [

      "PRELIMINARY PATENT RESEARCH BRIEF",
      "================================",

      "",
      "1. Research Objective",
      goalTitle,
      goalExplanation,

      "",
      "2. Technical Description",
      technology.value.trim() || "To be confirmed",

      "",
      "3. Target Jurisdictions",
      jurisdictions.value.trim() || "To be confirmed",

      "",
      "4. Relevant Dates or Deadline",
      timing.value.trim() || "To be confirmed",

      "",
      "5. Suggested Research Services",
      ...recommendedServices,

      "",
      "6. Items Requiring Confirmation",
      "- Technical features and research scope",
      "- Relevant filing and disclosure dates",
      "- Target jurisdictions",
      "- Search coverage and deliverables",
      "- Project schedule and commercial terms",

      "",
      "DISCLAIMER",
      "This is a preliminary, rule-based draft.",
      "It is not a legal opinion or an agreed search scope."

    ].join("\n");

    output.value = brief;

    outputGroup.hidden = false;

    copyButton.disabled = false;

    status.textContent =
      "Draft generated locally in your browser.";

  }

  async function copyBrief() {

    if (!output.value) return;

    try {

      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(output.value);

      status.textContent =
        "Research brief copied to clipboard.";

    } catch {

      output.focus();
      output.select();

      status.textContent =
        "Automatic copying is unavailable. " +
        "Press Ctrl+C to copy the selected text.";

    }

  }

  function clearBrief() {

    goalSelect.value = "";
    technology.value = "";
    jurisdictions.value = "";
    timing.value = "";

    output.value = "";

    outputGroup.hidden = true;
    copyButton.disabled = true;

    status.textContent = "All fields cleared.";

    goalSelect.focus();

  }

  generateButton.addEventListener(
    "click", generateBrief
  );

  copyButton.addEventListener(
    "click", copyBrief
  );

  resetButton.addEventListener(
    "click", clearBrief
  );

  controls.hidden = false;
  reference.hidden = true;

})();
