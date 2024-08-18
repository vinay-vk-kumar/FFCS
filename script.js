const undoStack = [];
const redoStack = [];
const fixedHighlights = new Map();

const highlightColor = "#ffff00"; // Yellow color for fixed cells
const searchHighlightColor = "#ffb6c1"; // Pink color for searched cells

function highlightSlots() {
  const searchValue = document.getElementById("searchBox").value.toUpperCase().trim();
  const slots = searchValue.split("+");
  const validSlots = [];
  const invalidSlots = [];
  const errorMessage = document.getElementById("slotErrorMessage");

  // Clear previous highlights, keep fixed highlights
  document.querySelectorAll(".selectable").forEach(cell => {
    if (!cell.classList.contains("fixed")) {
      cell.classList.remove("highlighted", "searched");
      cell.style.backgroundColor = ""; // Reset background color
    }
  });

  // Validate slots
  slots.forEach(slot => {
    const cells = document.querySelectorAll(".selectable");
    let slotFoundInTable = Array.from(cells).some(cell => cell.textContent.trim().toUpperCase() === slot);

    if (slotFoundInTable) {
      validSlots.push(slot);
    } else {
      invalidSlots.push(slot);
    }
  });

  // Show error message for invalid slots
  if (invalidSlots.length > 0) {
    errorMessage.textContent = `Slot(s) ${invalidSlots.join(", ")} not found in the table.`;
    errorMessage.style.display = "block";
    return; // Exit function
  }

  // Highlight valid slots
  validSlots.forEach(slot => {
    document.querySelectorAll(".selectable").forEach(cell => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        cell.classList.add("searched");
        cell.style.backgroundColor = searchHighlightColor;
      }
    });
  });

  // Hide error message if valid slots are found
  if (validSlots.length > 0) {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }
}

document.getElementById("searchBox").onkeydown = function (event) {
    console.log(event.key)
    if (event.key === "Enter") {
      highlightSlots();
    }
  };

function fixHighlights() {
  const searchValue = document.getElementById("searchBox").value.toUpperCase().trim();
  const slots = searchValue.split("+");
  const highlightedCells = [];
  const errorMessage = document.getElementById("slotErrorMessage");

  // Clear previous error message
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const alreadySelectedSlots = [];
  const notFoundSlots = [];

  // Validate slots
  slots.forEach(slot => {
    const cells = document.querySelectorAll(".selectable");
    let slotFoundInTable = Array.from(cells).some(cell => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        if (cell.classList.contains("fixed")) {
          alreadySelectedSlots.push(slot);
        }
        return true;
      }
      return false;
    });

    if (!slotFoundInTable) {
      notFoundSlots.push(slot);
    }
  });

  // Show error messages for selected and not found slots
  if (alreadySelectedSlots.length > 0 || notFoundSlots.length > 0) {
    let errorMessages = [];

    if (alreadySelectedSlots.length > 0) {
      errorMessages.push(`Slot(s) ${alreadySelectedSlots.join(", ")} already fixed.`);
    }
    else if (notFoundSlots.length > 0) {
      errorMessages.push(`Slot(s) ${notFoundSlots.join(", ")} not found in the table.`);
    }

    errorMessage.textContent = errorMessages.join(" ");
    errorMessage.style.display = "block";
    return; // Exit function
  }

  // Highlight and fix slots
  slots.forEach(slot => {
    document.querySelectorAll(".selectable").forEach(cell => {
      if (cell.textContent.trim().toUpperCase() === slot) {
        cell.classList.add("highlighted");
        cell.style.backgroundColor = highlightColor;
        highlightedCells.push(cell);
      }
    });
  });

  // Open modal to enter subject name
  if (highlightedCells.length > 0) {
    openModal(highlightedCells, slots.join("+"));
  }

  // Clear search box
  document.getElementById("searchBox").value = "";
}

function openModal(cells, key) {
  const modal = document.getElementById("subjectModal");
  const modalInput = document.getElementById("subjectName");
  const errorMessage = document.getElementById("errorMessage");

  modal.style.display = "block";
  modalInput.focus();

  const submitButton = document.getElementById("submitSubject");
  submitButton.onclick = () => {
    const subjectName = modalInput.value.trim().toUpperCase().substring(0, 3);

    if (subjectName) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";

      cells.forEach(cell => {
        cell.textContent += ` (${subjectName})`;
        cell.classList.add("fixed");  // Fix the cell only after subject name is entered
      });

      const li = document.createElement("li");
      li.textContent = `${key} (${subjectName})`;

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✖";
      removeBtn.className = "remove-btn-fixed";
      removeBtn.addEventListener("click", () => {
        li.remove();
        fixedHighlights.delete(key);
        cells.forEach(cell => {
          cell.classList.remove("fixed", "highlighted");
          cell.style.backgroundColor = "";
          cell.textContent = cell.textContent.replace(` (${subjectName})`, "");
        });
      });

      li.appendChild(removeBtn);
      document.getElementById("fixedHighlightsList").appendChild(li);
      fixedHighlights.set(key, cells);
    } else {
      errorMessage.textContent = "Please enter your subject name.";
      errorMessage.style.display = "block";
      return; // Prevent closing modal and fixing the slots
    }

    modal.style.display = "none";
    modalInput.value = "";
  };

  // Close modal on clicking outside or "X" button
  window.onclick = event => {
    if (event.target === modal) {
      cells.forEach(cell => {
        cell.classList.remove("highlighted");
        cell.style.backgroundColor = "";
      });
      modal.style.display = "none";
      modalInput.value = "";
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }

    // Add check for help modal
    const helpModal = document.getElementById("helpModal");
    if (event.target === helpModal) {
      helpModal.style.display = "none";
    }
  };

  document.getElementById("closeModal").onclick = () => {
    cells.forEach(cell => {
      cell.classList.remove("highlighted");
      cell.style.backgroundColor = "";
    });
    modal.style.display = "none";
    modalInput.value = "";
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  };

  // Submit on Enter key
  modalInput.onkeydown = event => {
    if (event.key === "Enter") {
      submitButton.click();
    }
  };
}

function resetTable() {
  // Clear error message
  const errorMessageElement = document.getElementById("slotErrorMessage");
  errorMessageElement.textContent = "";
  errorMessage.style.display = "none";

  // Reset table cells
  document.querySelectorAll(".selectable").forEach(cell => {
    cell.style.backgroundColor = "";
    cell.classList.remove("highlighted", "fixed");
    cell.textContent = cell.textContent.replace(/\s*\(.*?\)/, ""); // Remove subject name
  });

  // Clear undo and redo stacks
  undoStack.length = 0;
  redoStack.length = 0;

  // Clear fixed highlights list
  document.getElementById("fixedHighlightsList").textContent = "";
}

function openHelpPopup() {
  document.getElementById("helpModal").style.display = "block";
}

// Close help modal when clicking the "X" button or outside of the modal
document.getElementById("closeHelpModal").onclick = () => {
  document.getElementById("helpModal").style.display = "none";
};

// Ensure both modals close when clicking outside of them
window.onclick = event => {
  const helpModal = document.getElementById("helpModal");
  const subjectModal = document.getElementById("subjectModal");

  if (event.target === helpModal) {
    helpModal.style.display = "none";
  }

  if (event.target === subjectModal) {
    subjectModal.style.display = "none";
    document.getElementById("subjectName").value = "";
    document.getElementById("errorMessage").textContent = "";
    document.getElementById("errorMessage").style.display = "none";
  }
};

document.getElementById('redirectButton').addEventListener('click', function() {
  window.open('https://github.com/vinay-vk-kumar/FFCS', '_blank');
});

document.getElementById('insta').addEventListener('click', function() {
  window.open('https://www.instagram.com/vinay_vk_kumar?igsh=ZGhxbDN3YXJub254', '_blank');
});

document.getElementById("toggleButton").onclick = function () {
    var panel = document.getElementById("colorPanel");
    var toggleButton = document.getElementById("toggleButton");

    if (panel.style.display === "none" || panel.style.display === "") {
        panel.style.display = "flex";
        toggleButton.textContent = "Turn OFF";
    } else {
        panel.style.display = "none";
        toggleButton.textContent = "Turn ON";
    }
};
