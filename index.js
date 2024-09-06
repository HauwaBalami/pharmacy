document.addEventListener("DOMContentLoaded", function() {
    const loginTab = document.getElementById("login-tab");
    const registerTab = document.getElementById("register-tab");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    let users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve users from local storage

    registerTab.addEventListener("click", function() {
        registerTab.classList.add("active");
        loginTab.classList.remove("active");
        registerForm.classList.add("active");
        loginForm.classList.remove("active");
    });

    loginTab.addEventListener("click", function() {
        loginTab.classList.add("active");
        registerTab.classList.remove("active");
        loginForm.classList.add("active");
        registerForm.classList.remove("active");
    });

    // Handle Registration
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const user = { name, email, password };
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users)); // Store users in local storage

        alert("Registration successful! Please login.");
        loginTab.click(); // Switch to login form
    });

    // Handle Login
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("user", JSON.stringify(user)); // Store logged-in user in local storage
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password");
        }
    });
});
