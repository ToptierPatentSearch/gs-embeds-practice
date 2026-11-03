"use strict";

(() => {

  const root =
    document.getElementById("practice-brief-builder");

  if (!root) return;

  const fileInput =
    root.querySelector("#practice-brief-import-file");

  const importButton =
    root.querySelector("#practice-brief-import-button");

  const goalSelect =
    root.querySelector("#practice-brief-goal");

  const technology =
    root.querySelector("#practice-brief-technology");

  const jurisdictions =
    root.querySelector("#practice-brief-jurisdictions");

  const timing =
    root.querySelector("#practice-brief-timing");

  const resetButton =
    root.querySelector("#practice-brief-reset");

  const status =
    root.querySelector("#practice-brief-status");

  const required = [
    fileInput, importButton, goalSelect,
    technology, jurisdictions, timing,
    resetButton, status
  ];

  if (required.some((element) => !element)) {
    return;
  }

  const MAX_FILE_SIZE = 100 * 1024;

  function restoreText(value, maxLength) {

    if (value === null) {
      return "";
    }

    if (
      typeof value !== "string" ||
      value.length > maxLength
    ) {
      throw new Error(
        "The file contains an invalid or oversized field."
      );
    }

    return value;

  }

  function validateBrief(data) {

    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      data.schema_version !== "1.0" ||
      !data.objective ||
      typeof data.objective.id !== "string"
    ) {
      throw new Error(
        "Unsupported research brief format."
      );
    }

    const validGoal =
      Array.from(goalSelect.options).some(
        (option) => option.value === data.objective.id
      );

    if (!validGoal || !data.objective.id) {
      throw new Error(
        "Unknown research objective."
      );
    }

    return {

      goal: data.objective.id,

      technology: restoreText(
        data.technology_description, 1500
      ),

      jurisdictions: restoreText(
        data.target_jurisdictions, 150
      ),

      timing: restoreText(
        data.relevant_dates_or_deadline, 150
      )

    };

  }

  async function importBrief() {

    const file = fileInput.files?.[0];

    if (!file) {
      status.textContent =
        "Please select a JSON file.";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      status.textContent =
        "The selected file exceeds the 100 KB limit.";
      return;
    }

    try {

      const fileText = await file.text();

      const data = JSON.parse(fileText);

      const restored = validateBrief(data);

      goalSelect.value = restored.goal;

      technology.value = restored.technology;

      jurisdictions.value = restored.jurisdictions;

      timing.value = restored.timing;

      // Invalidate any previously generated brief.

      goalSelect.dispatchEvent(
        new Event("change", { bubbles: true })
      );

      // Permit choosing the same file again.

      fileInput.value = "";

      status.textContent =
        "Research requirements restored. " +
        "Click Generate Draft to create a new brief.";

      goalSelect.focus();

    } catch (error) {

      status.textContent =
        "Import failed: " + error.message;

    }

  }

  importButton.addEventListener(
    "click", importBrief
  );

  resetButton.addEventListener("click", () => {
    fileInput.value = "";
  });

})();
