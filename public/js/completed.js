// DELETE
const deleteTaskLink = document.querySelectorAll(".deleteTaskLink");
const deleteModal = document.querySelectorAll(".delete-modal");
const deleteCloseBtn = document.querySelectorAll(".delete-no-button");
// RESTORE
const restoreTaskLink = document.querySelectorAll(".restoreTaskLink");
const restoreModal = document.querySelectorAll(".restore-modal");
const restoreCloseBtn = document.querySelectorAll(".restore-no-button");
const icon = document.querySelectorAll(".dropdown-icon");
const dropdown = document.querySelectorAll(".menu");

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

for (let i = 0; i < deleteTaskLink.length; i++) {
  deleteTaskLink[i].addEventListener("click", () => {
    deleteModal[i].style.display = "flex";
  });
  restoreTaskLink[i].addEventListener("click", () => {
    restoreModal[i].style.display = "flex";
  });
}
for (let i = 0; i < deleteCloseBtn.length; i++) {
  deleteCloseBtn[i].addEventListener("click", () => {
    deleteModal[i].style.display = "none";
  });
  restoreCloseBtn[i].addEventListener("click", () => {
    restoreModal[i].style.display = "none";
  });
}
for (let i = 0; i < deleteModal.length; i++) {
  window.addEventListener("click", (event) => {
    if (event.target == deleteModal[i]) {
      deleteModal[i].style.display = "none";
    }
    if (event.target == restoreModal[i]) {
      restoreModal[i].style.display = "none";
    }
  });
}
