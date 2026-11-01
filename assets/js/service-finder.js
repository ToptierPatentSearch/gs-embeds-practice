
"use strict";

(() => {

  const root =
    document.getElementById("practice-service-finder");

  if (!root) return;

  const controls =
    root.querySelector("#practice-finder-controls");

  const input =
    root.querySelector("#practice-finder-query");

  const clearButton =
    root.querySelector("#practice-finder-clear");

  const count =
    root.querySelector("#practice-finder-count");

  const emptyMessage =
    root.querySelector("#practice-finder-empty");

  const cards =
    Array.from(root.querySelectorAll(".practice-finder-card"));

  const normalize = (text) =>
    text.normalize("NFKC").toLowerCase().trim();

  const searchableCards = cards.map((card) => ({
    element: card,
    text: normalize(card.dataset.search || "")
  }));

  function updateResults() {

    const terms = normalize(input.value)
      .split(/\s+/)
      .filter(Boolean);

    let visibleCount = 0;

    searchableCards.forEach(({ element, text }) => {

      const matches = terms.every((term) =>
        text.includes(term)
      );

      element.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }

    });

    count.textContent =
      `Showing ${visibleCount} of ${cards.length} services.`;

    emptyMessage.hidden = visibleCount !== 0;

  }

  input.addEventListener("input", updateResults);

  clearButton.addEventListener("click", () => {
    input.value = "";
    updateResults();
    input.focus();
  });

  controls.hidden = false;

  updateResults();

})();
