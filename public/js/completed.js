const icon = document.querySelectorAll(".dropdown-icon");
const dropdown = document.querySelectorAll(".menu");
const deleteTaskLink = document.querySelectorAll(".deleteTaskLink");
const disableTaskLink = document.querySelectorAll(".disableTaskLink");
const editTaskLink = document.querySelectorAll(".editTaskLink");
const deleteModal = document.querySelectorAll(".delete-modal");
const disableModal = document.querySelectorAll(".disable-modal");
const editModal = document.querySelectorAll(".edit-modal");
const deleteCloseBtn = document.querySelectorAll(".delete-no-button");
const disableCloseBtn = document.querySelectorAll(".disable-no-button");
const editCloseBtn = document.querySelectorAll(".editCloseBtn");
const tags = document.querySelectorAll(".tag");

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

// Delete & Disable button functionality
for (let i = 0; i < deleteTaskLink.length; i++) {
  deleteTaskLink[i].addEventListener("click", () => {
    deleteModal[i].style.display = "flex";
  });
  disableTaskLink[i].addEventListener("click", () => {
    disableModal[i].style.display = "flex";
  });
  editTaskLink[i].addEventListener("click", () => {
    editModal[i].style.display = "block";
  });
}

for (let i = 0; i < deleteCloseBtn.length; i++) {
  deleteCloseBtn[i].addEventListener("click", () => {
    deleteModal[i].style.display = "none";
  });
  disableCloseBtn[i].addEventListener("click", () => {
    disableModal[i].style.display = "none";
  });
  editCloseBtn[i].addEventListener("click", () => {
    editModal[i].style.display = "none";
  });
}

for (let i = 0; i < deleteModal.length; i++) {
  window.addEventListener("click", (event) => {
    if (event.target == deleteModal[i]) {
      deleteModal[i].style.display = "none";
    }
    if (event.target == disableModal[i]) {
      disableModal[i].style.display = "none";
    }
    if (event.target == editModal[i]) {
      editModal[i].style.display = "none";
    }
  });
}

for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener("click", (event) => {
    // Toggle the "bordered" class on the clicked element
    event.target.classList.toggle("bordered");
  });
}
