
"use strict";

(() => {

  const root =
    document.getElementById("practice-guided-selector");

  if (!root) return;

  const controls =
    root.querySelector("#practice-goal-controls");

  const select =
    root.querySelector("#practice-goal-select");

  const resetButton =
    root.querySelector("#practice-goal-reset");

  const prompt =
    root.querySelector("#practice-goal-prompt");

  const sections =
    Array.from(root.querySelectorAll(".practice-goal-result"));

  if (!controls || !select || !resetButton || !prompt) {
    return;
  }

  function updateSelection() {

    const selectedGoal = select.value;

    sections.forEach((section) => {

      const isMatch =
        section.dataset.goalId === selectedGoal;

      section.hidden = !isMatch;

    });

    prompt.hidden = selectedGoal !== "";

  }

  select.addEventListener("change", updateSelection);

  resetButton.addEventListener("click", () => {

    select.value = "";

    updateSelection();

    select.focus();

  });

  controls.hidden = false;

  updateSelection();

})();
