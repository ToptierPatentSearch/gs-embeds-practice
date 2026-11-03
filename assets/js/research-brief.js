
"use strict";

(() => {

  const root =
    document.getElementById("practice-brief-builder");

  if (!root) return;

  const get = (id) => root.querySelector(`#${id}`);

  const controls = get("practice-brief-controls");
  const goalSelect = get("practice-brief-goal");
  const technology = get("practice-brief-technology");
  const jurisdictions = get("practice-brief-jurisdictions");
  const timing = get("practice-brief-timing");
  const generateButton = get("practice-brief-generate");
  const copyButton = get("practice-brief-copy");
  const txtButton = get("practice-brief-download-txt");
  const jsonButton = get("practice-brief-download-json");
  const resetButton = get("practice-brief-reset");
  const outputGroup = get("practice-brief-output-group");
  const output = get("practice-brief-output");
  const status = get("practice-brief-status");
  const reference = get("practice-brief-reference");

  const rules = Array.from(
    root.querySelectorAll(".practice-brief-rule")
  );

  const required = [
    controls, goalSelect, technology,
    jurisdictions, timing, generateButton,
    copyButton, txtButton, jsonButton,
    resetButton, outputGroup, output,
    status, reference
  ];

  if (required.some((element) => !element)) return;

  let generatedSnapshot = null;

  function readText(element, selector) {
    return element.querySelector(selector)
      ?.textContent.trim() || "";
  }

  function setDraftAvailable(available) {
    copyButton.disabled = !available;
    txtButton.disabled = !available;
    jsonButton.disabled = !available;
  }

  function generateBrief() {

    const selectedRule = rules.find(
      (rule) => rule.dataset.goalId === goalSelect.value
    );

    if (!selectedRule) {
      status.textContent =
        "Please select a research objective.";
      goalSelect.focus();
      return;
    }

    const goalTitle = readText(
      selectedRule, ".practice-brief-goal-title"
    );

    const explanation = readText(
      selectedRule, ".practice-brief-goal-explanation"
    );

    const recommendations = Array.from(
      selectedRule.querySelectorAll(
        ".practice-brief-recommendation"
      )
    ).map((item) => ({
      service: readText(
        item, ".practice-brief-service-name"
      ),
      reason: readText(
        item, ".practice-brief-reason"
      )
    }));

    const serviceLines = recommendations.map(
      (item, index) =>
        `${index + 1}. ${item.service}\n   ${item.reason}`
    );

    const brief = [
      "PRELIMINARY PATENT RESEARCH BRIEF",
      "================================",
      "",
      "1. Research Objective",
      goalTitle,
      explanation,
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
      ...serviceLines,
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

    generatedSnapshot = {
      schema_version: "1.0",
      generated_at: new Date().toISOString(),
      objective: {
        id: goalSelect.value,
        title: goalTitle,
        explanation
      },
      technology_description:
        technology.value.trim() || null,
      target_jurisdictions:
        jurisdictions.value.trim() || null,
      relevant_dates_or_deadline:
        timing.value.trim() || null,
      suggested_services: recommendations,
      brief_text: brief
    };

    output.value = brief;
    outputGroup.hidden = false;
    setDraftAvailable(true);

    status.textContent =
      "Draft generated locally in your browser.";

  }

  function invalidateDraft() {

    if (!generatedSnapshot) return;

    generatedSnapshot = null;
    output.value = "";
    outputGroup.hidden = true;
    setDraftAvailable(false);

    status.textContent =
      "Inputs changed. Generate a new draft.";

  }

  function downloadFile(content, extension, mimeType) {

    const blob = new Blob(
      [content],
      { type: mimeType }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download =
      `patent-research-brief-${date}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

  }

  async function copyBrief() {

    if (!generatedSnapshot) return;

    try {

      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(output.value);

      status.textContent = "Brief copied to clipboard.";

    } catch {

      output.focus();
      output.select();

      status.textContent =
        "Press Ctrl+C to copy the selected text.";

    }

  }

  function clearBrief() {

    goalSelect.value = "";
    technology.value = "";
    jurisdictions.value = "";
    timing.value = "";

    generatedSnapshot = null;
    output.value = "";
    outputGroup.hidden = true;
    setDraftAvailable(false);

    status.textContent = "All fields cleared.";
    goalSelect.focus();

  }

  generateButton.addEventListener(
    "click", generateBrief
  );

  copyButton.addEventListener(
    "click", copyBrief
  );

  txtButton.addEventListener("click", () => {

    if (!generatedSnapshot) return;

    downloadFile(
      generatedSnapshot.brief_text,
      "txt",
      "text/plain;charset=utf-8"
    );

    status.textContent = "TXT download requested.";

  });

  jsonButton.addEventListener("click", () => {

    if (!generatedSnapshot) return;

    downloadFile(
      JSON.stringify(generatedSnapshot, null, 2),
      "json",
      "application/json;charset=utf-8"
    );

    status.textContent = "JSON download requested.";

  });

  resetButton.addEventListener(
    "click", clearBrief
  );

  goalSelect.addEventListener(
    "change", invalidateDraft
  );

  [technology, jurisdictions, timing].forEach(
    (field) => field.addEventListener(
      "input", invalidateDraft
    )
  );

  controls.hidden = false;
  reference.hidden = true;

})();
