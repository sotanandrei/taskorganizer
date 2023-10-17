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
