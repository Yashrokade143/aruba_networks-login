// script.js
// Handles client-side validations and a tiny mock "backend" using localStorage.
// Comments explain each block for readability and maintainability.

// Helper: simple email validation using browser constraint + regex fallback
function isValidEmail(email) {
  // Basic RFC-like pattern (not exhaustive)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Helper: show error text in an element
function showError(el, msg) {
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

// Mock user store functions using localStorage
const USER_STORE_KEY = 'fake_users_v1';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USER_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUser(user) {
  const users = loadUsers();
  users.push(user);
  localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
}

// Find user by email
function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// ----------------- Signup form handling -----------------
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  const signupError = document.getElementById('signupError');

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    showError(signupError, '');

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const pass = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    // Basic validations
    if (!name) return showError(signupError, 'Please enter your full name.');
    if (!email || !isValidEmail(email)) return showError(signupError, 'Please provide a valid email.');
    if (pass.length < 6) return showError(signupError, 'Password must be at least 6 characters.');
    if (pass !== confirm) return showError(signupError, 'Passwords do not match.');

    // Prevent duplicate registration
    if (findUserByEmail(email)) return showError(signupError, 'An account with this email already exists.');

    // Save user (note: password stored in plain text for demo only — do not do this in production)
    saveUser({ name, email, phone, password: pass, createdAt: new Date().toISOString() });

    // Redirect to login with a success message (simple)
    alert('Account created successfully. You will be redirected to the login page.');
    window.location.href = 'index.html';
  });
}

// ----------------- Login form handling -----------------
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  const loginError = document.getElementById('loginError');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    showError(loginError, '');

    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if (!email || !isValidEmail(email)) return showError(loginError, 'Please enter a valid email.');
    if (!pass || pass.length < 6) return showError(loginError, 'Please enter your password (min 6 characters).');

    const user = findUserByEmail(email);
    if (!user) return showError(loginError, 'No account found with this email.');

    if (user.password !== pass) return showError(loginError, 'Incorrect password.');

    localStorage.setItem("loggedUser", JSON.stringify(user));
    
    window.location.href = "dashboard.html";
  });
}

// Optional: pre-fill email if passed via query string (simple convenience)
(function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const e = params.get('email');
  if (e) {
    const el = document.getElementById('loginEmail');
    if (el) el.value = e;
  }
})();
