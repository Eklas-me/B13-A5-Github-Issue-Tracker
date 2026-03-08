var loginForm = document.getElementById("loginForm");
var errorMsg = document.getElementById("errorMsg");

var correctUsername = "admin";
var correctPassword = "admin123";

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (username === correctUsername && password === correctPassword) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);

        window.location.href = "index.html";
    } else {
        errorMsg.classList.remove("hidden");
    }
});
