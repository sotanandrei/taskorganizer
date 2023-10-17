const icon = document.querySelectorAll(".dropdown-icon");
const dropdown = document.querySelectorAll(".menu");

for (let i = 0; i < icon.length; i++) {
  icon[i].addEventListener("click", () => {
    dropdown[i].classList.toggle("active");
  });
}
