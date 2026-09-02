// --- 1. DJANGO CSRF TOKEN HELPER ---
// Django requires this token for any POST/DELETE requests via fetch
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


// --- 2. LOGIN FORM ---
var loginForm = document.getElementById("loginForm");
var loginMsg = document.getElementById("loginMsg");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var email = document.getElementById("loginEmail").value.trim();
        var password = document.getElementById("loginPassword").value.trim();

        if (email === "" || password === "") {
            loginMsg.textContent = "Please fill in all fields.";
            loginMsg.className = "form-msg error";
            return;
        }

        fetch('/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Added Token
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginMsg.textContent = data.message;
                loginMsg.className = "form-msg success";
                setTimeout(function () {
                    // Close Bootstrap Modal
                    var modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
                    modal.hide();
                    loginForm.reset();
                    loginMsg.textContent = "";
                }, 1200);
            } else {
                loginMsg.textContent = data.message;
                loginMsg.className = "form-msg error";
            }
        })
        .catch(err => console.error("Error:", err));
    });
}


// --- 3. REGISTER FORM ---
var registerForm = document.getElementById("registerForm");
var registerMsg = document.getElementById("registerMsg");

if (registerForm) {
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

        if (password !== confirm) {
            registerMsg.textContent = "Passwords do not match.";
            registerMsg.className = "form-msg error";
            return;
        }

        fetch('/api/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken // Added Token
            },
            body: JSON.stringify({ name: name, email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                registerMsg.textContent = data.message;
                registerMsg.className = "form-msg success";
                setTimeout(function () {
                    registerForm.reset();
                    registerMsg.textContent = "";
                    // Switch to Login Tab (Bootstrap logic)
                    var loginTab = new bootstrap.Tab(document.getElementById('pills-login-tab'));
                    loginTab.show();
                }, 1200);
            } else {
                registerMsg.textContent = data.message;
                registerMsg.className = "form-msg error";
            }
        })
        .catch(err => console.error("Error:", err));
    });
}


// --- 4. DELETE SONG ---
document.querySelectorAll(".delete-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        var card = this.closest(".song-card");
        var songId = card.getAttribute("data-id");

        if (confirm("Are you sure you want to delete this song?")) {
            fetch('/api/delete-song/' + songId, { 
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken // Added Token
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    card.parentElement.remove(); // Remove the entire column grid wrapper
                } else {
                    alert("Failed to delete: " + data.message);
                }
            })
            .catch(err => console.error("Error:", err));
        }
    });
});


// --- 5. UPDATE SONG ---
document.querySelectorAll(".update-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        var card = this.closest(".song-card");
        var songId = card.getAttribute("data-id"); 

        var titleEl = card.querySelector(".card-title");
        var artistEl = card.querySelector(".card-text");
        var genreEl = card.querySelector(".badge");

        var newTitle = prompt("Enter new song title:", titleEl.textContent);
        var newArtist = prompt("Enter new artist name:", artistEl.textContent);
        var newGenre = prompt("Enter new genre:", genreEl.textContent);

        if (newTitle && newArtist && newGenre) {
            fetch('/api/update-song/' + songId, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken // Added Token
                },
                body: JSON.stringify({ title: newTitle, artist: newArtist, genre: newGenre })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    titleEl.textContent = newTitle;
                    artistEl.textContent = newArtist;
                    genreEl.textContent = newGenre;
                } else {
                    alert("Failed to update: " + data.message);
                }
            })
            .catch(err => console.error("Error:", err));
        }
    });
});