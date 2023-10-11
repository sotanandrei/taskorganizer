// Get references to the modal and buttons
// let signupModal = document.getElementById("modalSignin");
// let loginModal = document.getElementById("modalLogin");
// let openSignupBtn = document.getElementById("openSignupBtn");
// let closeSignupBtn = document.getElementById("closeSignupBtn");
// let openLoginBtn = document.getElementById("openLoginBtn");
// let closeLoginBtn = document.getElementById("closeLoginBtn");

// // Function to open the modal
// function openSignupModal() {
//   signupModal.classList.remove("hidden");
// }
// function openLoginModal() {
//   loginModal.classList.remove("hidden");
// }

// // Function to close the modal
// function closeSignupModal() {
//   signupModal.classList.add("hidden");
// }
// function closeLoginModal() {
//   loginModal.classList.add("hidden");
// }

// // Event listeners
// openSignupBtn.addEventListener("click", openSignupModal);
// closeSignupBtn.addEventListener("click", closeSignupModal);

// openLoginBtn.addEventListener("click", openLoginModal);
// closeLoginBtn.addEventListener("click", closeLoginModal);

// // Close the modal if the user clicks outside of it
// window.addEventListener("click", function (event) {
//   console.log(event.target);
//   if (event.target === signupModal) {
//     closeSignupModal();
//   } else if (event.target === loginModal) {
//     closeLoginModal();
//   }
// });
function toggleModal(modal, action) {
  modal.classList[action]("hidden");
}

const modals = {
  signup: document.getElementById("modalSignin"),
  login: document.getElementById("modalLogin"),
};

const buttons = {
  openSignup: document.getElementById("openSignupBtn"),
  closeSignup: document.getElementById("closeSignupBtn"),
  openLogin: document.getElementById("openLoginBtn"),
  closeLogin: document.getElementById("closeLoginBtn"),
};

// Event listeners
for (const key in buttons) {
  if (buttons.hasOwnProperty(key)) {
    const action = key.startsWith("open") ? "remove" : "add";
    const modal = key.includes("Signup") ? modals.signup : modals.login;
    buttons[key].addEventListener("click", () => toggleModal(modal, action));
  }
}

// Close the modal if the user clicks outside of it
window.addEventListener("click", function (event) {
  for (const key in modals) {
    if (modals.hasOwnProperty(key)) {
      if (event.target === modals[key]) {
        toggleModal(modals[key], "add");
      }
    }
  }
});
