const icon = document.querySelectorAll(".dropdown-icon");
const dropdown = document.querySelectorAll(".menu");
const deleteTaskLink = document.querySelectorAll(".deleteTaskLink");
const deleteModal = document.querySelectorAll(".delete-modal");
const deleteCloseBtn = document.querySelectorAll(".delete-no-button");

for (let i = 0; i < icon.length; i++) {
  icon[i].addEventListener("click", () => {
    dropdown[i].style.display == "block"
      ? (dropdown[i].style.display = "none")
      : (dropdown[i].style.display = "block");
  });
}

for (let i = 0; i < icon.length; i++) {
  window.addEventListener("click", (event) => {
    if (event.target != dropdown[i] && event.target != icon[i]) {
      dropdown[i].style.display = "none";
    }
  });
}

// Delete button functionality
for (let i = 0; i < deleteTaskLink.length; i++) {
  deleteTaskLink[i].addEventListener("click", () => {
    deleteModal[i].style.display = "flex";
  });
}

for (let i = 0; i < deleteCloseBtn.length; i++) {
  deleteCloseBtn[i].addEventListener("click", () => {
    deleteModal[i].style.display = "none";
  });
}

for (let i = 0; i < deleteModal.length; i++) {
  window.addEventListener("click", (event) => {
    if (event.target == deleteModal[i]) {
      deleteModal[i].style.display = "none";
    }
  });
}
