
var slides = document.querySelectorAll(".slide");
var dots = document.querySelectorAll(".dot");
var currentSlide = 0;
var slideTimer;

function showSlide(index) {
  // wrap around at both ends
  if (index >= slides.length) {
    index = 0;
  }
  if (index < 0) {
    index = slides.length - 1;
  }
  currentSlide = index;

  for (var i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    dots[i].classList.remove("active");
  }

  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function restartTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 4000);
}

document.getElementById("nextBtn").addEventListener("click", function () {
  nextSlide();
  restartTimer();
});

document.getElementById("prevBtn").addEventListener("click", function () {
  prevSlide();
  restartTimer();
});

dots.forEach(function (dot) {
  dot.addEventListener("click", function () {
    var index = parseInt(this.getAttribute("data-index"));
    showSlide(index);
    restartTimer();
  });
});

restartTimer(); // start autoplay

var authModal = document.getElementById("authModal");
var openAuthBtn = document.getElementById("openAuthBtn");
var closeAuthBtn = document.getElementById("closeAuthBtn");

openAuthBtn.addEventListener("click", function () {
  authModal.classList.add("active");
});

closeAuthBtn.addEventListener("click", function () {
  authModal.classList.remove("active");
});

// close modal when clicking the dark overlay (outside the box)
authModal.addEventListener("click", function (event) {
  if (event.target === authModal) {
    authModal.classList.remove("active");
  }
});

var loginTabBtn = document.getElementById("loginTabBtn");
var registerTabBtn = document.getElementById("registerTabBtn");
var loginForm = document.getElementById("loginForm");
var registerForm = document.getElementById("registerForm");

function switchTab(tabName) {
  if (tabName === "login") {
    loginTabBtn.classList.add("active");
    registerTabBtn.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  } else {
    registerTabBtn.classList.add("active");
    loginTabBtn.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  }
}

loginTabBtn.addEventListener("click", function () {
  switchTab("login");
});

registerTabBtn.addEventListener("click", function () {
  switchTab("register");
});

function isValidEmail(value) {
  return value.indexOf("@") > 0 && value.indexOf(".") > value.indexOf("@");
}

// ---- Login form ----
var loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page reload

  var email = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value.trim();

  if (email === "" || password === "") {
    loginMsg.textContent = "Please fill in all fields.";
    loginMsg.className = "form-msg error";
    return;
  }

  if (!isValidEmail(email)) {
    loginMsg.textContent = "Please enter a valid email address.";
    loginMsg.className = "form-msg error";
    return;
  }

  if (password.length < 6) {
    loginMsg.textContent = "Password must be at least 6 characters.";
    loginMsg.className = "form-msg error";
    return;
  }

  loginMsg.textContent = "Login successful! Welcome back.";
  loginMsg.className = "form-msg success";
  loginForm.reset();

  setTimeout(function () {
    authModal.classList.remove("active");
    loginMsg.textContent = "";
  }, 1200);
});

// ---- Register form ----
var registerMsg = document.getElementById("registerMsg");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var name = document.getElementById("registerName").value.trim();
  var email = document.getElementById("registerEmail").value.trim();
  var password = document.getElementById("registerPassword").value.trim();
  var confirm = document.getElementById("registerConfirm").value.trim();

  if (name === "" || email === "" || password === "" || confirm === "") {
    registerMsg.textContent = "Please fill in all fields.";
    registerMsg.className = "form-msg error";
    return;
  }

  if (!isValidEmail(email)) {
    registerMsg.textContent = "Please enter a valid email address.";
    registerMsg.className = "form-msg error";
    return;
  }

  if (password.length < 6) {
    registerMsg.textContent = "Password must be at least 6 characters.";
    registerMsg.className = "form-msg error";
    return;
  }

  if (password !== confirm) {
    registerMsg.textContent = "Passwords do not match.";
    registerMsg.className = "form-msg error";
    return;
  }

  registerMsg.textContent = "Account created successfully!";
  registerMsg.className = "form-msg success";
  registerForm.reset();

  setTimeout(function () {
    authModal.classList.remove("active");
    registerMsg.textContent = "";
    switchTab("login");
  }, 1200);
});

var deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var card = this.parentElement.parentElement;

    if (confirm("Are you sure you want to delete this song?")) {
      card.remove();
    }
  });
});


var updateButtons = document.querySelectorAll(".update-btn");

updateButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var card = this.parentElement.parentElement;

    var title = card.querySelector(".song-title");
    var artist = card.querySelector(".song-artist");
    var genre = card.querySelector(".song-genre");

    var newTitle = prompt("Enter new song title:", title.textContent);
    var newArtist = prompt("Enter new artist name:", artist.textContent);
    var newGenre = prompt("Enter new genre:", genre.textContent);

    if (newTitle !== null && newTitle.trim() !== "") {
      title.textContent = newTitle;
    }

    if (newArtist !== null && newArtist.trim() !== "") {
      artist.textContent = newArtist;
    }

    if (newGenre !== null && newGenre.trim() !== "") {
      genre.textContent = newGenre;
    }
  });
});