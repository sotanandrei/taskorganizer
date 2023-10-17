// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// When the Open Modal button is clicked, display the modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// When the Close button clicked, hide the modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// You can also close the modal by clicking anywhere outside of it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});
