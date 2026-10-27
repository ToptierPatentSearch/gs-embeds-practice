"use strict";

// Update the copyright year in the shared footer.

const practiceYearElement =
  document.getElementById("practice-current-year");

if (practiceYearElement) {
  practiceYearElement.textContent =
    new Date().getFullYear();
}
