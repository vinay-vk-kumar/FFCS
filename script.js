const undoStack = [];
const redoStack = [];
const fixedHighlights = new Map();


  // Check if all slots are valid
const highlightColor = "#ffff00"; // Yellow color for fixed cells
const searchHighlightColor = "#ffb6c1"; // Pink color for searched cells

function highlightSlots() {
  const searchValue = document
    .getElementById("searchBox")
    .value.toUpperCase()
    .trim();
  const slots = searchValue.split("+");
  let foundAnySlot = false;
  const validSlots = [];
  const invalidSlots = [];
  const errorMessage = document.getElementById("slotErrorMessage");

  // Clear previous highlights, but keep fixed highlights
  document.querySelectorAll(".selectable").forEach((cell) => {
    if (!cell.classList.contains("fixed")) {
      cell.classList.remove("highlighted");
      cell.classList.remove("searched");
      cell.style.backgroundColor = ""; // Reset background color
    }
  });

  // Check if all slots are valid
  slots.forEach((slot) => {
    let slotFoundInTable = false;
    const cells = document.querySelectorAll(".selectable");

    cells.forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        slotFoundInTable = true;
        validSlots.push(slot);
      }
    });

    if (!slotFoundInTable) {
      invalidSlots.push(slot);
    }
  });

  // If there are invalid slots, show an error message
  if (invalidSlots.length > 0) {
    errorMessage.textContent = `Slot(s) ${invalidSlots.join(", ")} not found in the table. Please enter correct slot(s).`;
    errorMessage.style.display = "block";
    errorMessage.style.color = "red"; // Ensure the error message is red
    return; // Exit function to prevent highlighting
  }

  // If all slots are valid, highlight them
  validSlots.forEach((slot) => {
    document.querySelectorAll(".selectable").forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        foundAnySlot = true;
        cell.classList.add("searched");
        cell.style.backgroundColor = searchHighlightColor; // Set pink color for searched cells
      }
    });
  });

  if (foundAnySlot) {
    // Clear any existing error message if at least one slot was found
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }
}
  
function fixHighlights() {
  const searchValue = document
    .getElementById("searchBox")
    .value.toUpperCase()
    .trim();
  const slots = searchValue.split("+");
  const highlightedCells = [];
  const errorMessage = document.getElementById("slotErrorMessage");

  // Clear previous error message
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const alreadySelectedSlots = [];
  const notFoundSlots = [];

  // Check all slots for errors first
  slots.forEach((slot) => {
    let slotFoundInTable = false;
    const cells = document.querySelectorAll(".selectable");

    cells.forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        slotFoundInTable = true;

        if (cell.classList.contains("fixed")) {
          alreadySelectedSlots.push(slot); // Add to already fixed slots
        }
      }
    });

    if (!slotFoundInTable) {
      notFoundSlots.push(slot); // Add to not found slots
    }
  });

  // If any errors are found, show the error message and exit without fixing or highlighting any slots
  if (alreadySelectedSlots.length > 0 || notFoundSlots.length > 0) {
    let errorMessages = [];

    if (alreadySelectedSlots.length > 0) {
      errorMessages.push(`Slot(s) ${alreadySelectedSlots.join(", ")} already fixed.`);
    }
    if (notFoundSlots.length > 0) {
      errorMessages.push(`Slot(s) ${notFoundSlots.join(", ")} not found in the table.`);
    }

    // Show the appropriate error message
    errorMessage.textContent = errorMessages.join(" ");
    errorMessage.style.display = "block";
    return; // Exit function to prevent highlighting or fixing any slots
  }

  // If no errors, highlight and fix the slots
  slots.forEach((slot) => {
    const cells = document.querySelectorAll(".selectable");

    cells.forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        cell.classList.add("fixed");
        cell.classList.remove("searched");
        cell.classList.add("highlighted");
        cell.style.backgroundColor = highlightColor; // Set yellow color for fixed cells
        highlightedCells.push(cell);
      }
    });
  });

  // Open the modal to ask for the subject name only if there are no errors
  if (highlightedCells.length > 0) {
    openModal(highlightedCells, slots.join("+"));
  }

  // Clear the search box after fixing the highlights
  document.getElementById("searchBox").value = "";
}
  

function fixHighlights() {
  const searchValue = document
    .getElementById("searchBox")
    .value.toUpperCase()
    .trim();
  const slots = searchValue.split("+");
  const highlightedCells = [];
  const errorMessage = document.getElementById("slotErrorMessage");

  // Clear previous error message
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const alreadySelectedSlots = [];
  const notFoundSlots = [];

  // Check all slots for errors first
  slots.forEach((slot) => {
    let slotFoundInTable = false;
    const cells = document.querySelectorAll(".selectable");

    cells.forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        slotFoundInTable = true;

        if (cell.classList.contains("fixed")) {
          alreadySelectedSlots.push(slot); // Add to already fixed slots
        }
      }
    });

    if (!slotFoundInTable) {
      notFoundSlots.push(slot); // Add to not found slots
    }
  });

  // If any errors are found, show the error message and exit without fixing or highlighting any slots
  if (alreadySelectedSlots.length > 0 || notFoundSlots.length > 0) {
    let errorMessages = [];

    if (alreadySelectedSlots.length > 0) {
      errorMessages.push(`Slot(s) ${alreadySelectedSlots.join(", ")} already fixed.`);
    }
    if (notFoundSlots.length > 0) {
      errorMessages.push(`Slot(s) ${notFoundSlots.join(", ")} not found in the table.`);
    }

    // Show the appropriate error message
    errorMessage.textContent = errorMessages.join(" ");
    errorMessage.style.display = "block";
    return; // Exit function to prevent highlighting or fixing any slots
  }

  // If no errors, highlight and fix the slots
  slots.forEach((slot) => {
    const cells = document.querySelectorAll(".selectable");

    cells.forEach((cell) => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        cell.classList.add("fixed");
        cell.classList.add("highlighted");
        cell.style.backgroundColor = highlightColor;
        highlightedCells.push(cell);
      }
    });
  });

  // Open the modal to ask for the subject name only if there are no errors
  if (highlightedCells.length > 0) {
    openModal(highlightedCells, slots.join("+"));
  }

  // Clear the search box after fixing the highlights
  document.getElementById("searchBox").value = "";
}


function openModal(cells, key) {
  const modal = document.getElementById("subjectModal");
  const modalInput = document.getElementById("subjectName");
  const errorMessage = document.getElementById("errorMessage");
  modal.style.display = "block";

  // Set focus to input field and center the input
  modalInput.focus();

  const submitButton = document.getElementById("submitSubject");
  submitButton.onclick = function () {
    const subjectName = modalInput.value.trim().toUpperCase().substring(0, 3);
    if (subjectName) {
      // Clear any existing error message
      errorMessage.textContent = "";
      errorMessage.style.display = "none"; // Hide the error message

      cells.forEach((cell) => {
        cell.textContent += ` (${subjectName})`;
      });

      const li = document.createElement("li");
      li.textContent = `${key} (${subjectName})`;
      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = "✖";
      removeBtn.className = "remove-btn-fixed";
      removeBtn.addEventListener("click", function () {
        li.remove();
        fixedHighlights.delete(key);
        cells.forEach((cell) => {
          cell.classList.remove("fixed");
          cell.classList.remove("highlighted"); // Unhighlight the cell
          cell.style.backgroundColor = ""; // Reset background color
          // Remove the subject name from the text content
          cell.textContent = cell.textContent.replace(` (${subjectName})`, "");
        });
      });
      li.appendChild(removeBtn);
      document.getElementById("fixedHighlightsList").appendChild(li);
      fixedHighlights.set(key, cells);
    } else {
      // Show an error message if the subject name is not entered
      errorMessage.textContent = "Please enter your subject name.";
      errorMessage.style.display = "block"; // Show the error message
      return; // Exit the function to prevent closing the modal
    }

    // Close modal and clear input field
    modal.style.display = "none";
    modalInput.value = "";
  };

  // Close the modal if the user clicks outside of it or on the "X" button
  window.onclick = function (event) {
    if (event.target === modal) {
      // Revert the highlighted cells back to normal
      cells.forEach((cell) => {
        cell.classList.remove("highlighted");
        cell.style.backgroundColor = ""; // Reset background color
      });
      modal.style.display = "none";
      modalInput.value = "";
      errorMessage.textContent = ""; // Clear any existing error message
      errorMessage.style.display = "none"; // Hide the error message
    }
  };

  // Close the modal when clicking the "X" button
  document.getElementById("closeModal").onclick = function () {
    // Revert the highlighted cells back to normal
    cells.forEach((cell) => {
      cell.classList.remove("highlighted");
      cell.style.backgroundColor = ""; // Reset background color
    });
    modal.style.display = "none";
    modalInput.value = "";
    errorMessage.textContent = ""; // Clear any existing error message
    errorMessage.style.display = "none"; // Hide the error message
  };

  // Allow pressing Enter key to submit
  modalInput.onkeydown = function (event) {
    if (event.key === "Enter") {
      submitButton.click();
    }
  };
}

function resetTable() {
  // Reset all cells
  document.querySelectorAll(".selectable").forEach((cell) => {
    cell.style.backgroundColor = ""; // Reset background color
    cell.classList.remove("highlighted");
    cell.classList.remove("fixed");
    // Remove the subject name from text content (handles names of any length)
    cell.textContent = cell.textContent.replace(/\s*\(.*?\)/, "");
  });

  // Clear undo and redo stacks
  undoStack.length = 0;
  redoStack.length = 0;

  // Clear fixed highlights and fixed highlights list
  fixedHighlights.clear();
  document.getElementById("fixedHighlightsList").innerHTML = "";

  // Clear the error message
  const errorMessage = document.getElementById("slotErrorMessage");
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  // Clear the search box
  document.getElementById("searchBox").value = "";
}

// Modal close function for the "X" button
document.getElementById("closeModal").onclick = function () {
  document.getElementById("subjectModal").style.display = "none";
  document.getElementById("subjectName").value = "";
};

// Add functionality for Enter key to trigger search
// Handle Enter key in the search box
document.getElementById("searchBox").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    highlightSlots();
  }
});

// Hide the project animation after 2 seconds
window.addEventListener("load", function () {
  const projectAnimation = document.getElementById("projectAnimation");

  // Ensure the projectAnimation element is present
  if (projectAnimation) {
    setTimeout(() => {
      projectAnimation.classList.add('hidden');
    }, 2000); // 2 seconds
  }
});




