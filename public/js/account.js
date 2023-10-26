// Get references to the modal and buttons
const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const tags = document.querySelectorAll(".tag");
console.log(tags);

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

// Add event listeners to all tags
for (let i = 0; i < tags.length; i++) {
  tags[i].addEventListener("click", () => {
    tags[i].classList.toggle("bordered");
  });
}

function hideErrorModal() {
  var modal = document.getElementById("errorModal");
  modal.style.display = "none";
}
