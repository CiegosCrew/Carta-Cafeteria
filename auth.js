// ========== USER AUTHENTICATION SYSTEM ==========

// Get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

// Save current user
function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Show alert message
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `auth-alert ${type}`;
    alert.textContent = message;

    const activeForm = document.querySelector('.auth-form-container:not(.hidden)');
    const form = activeForm.querySelector('form');
    form.parentNode.insertBefore(alert, form);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Switch to login form
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

// Switch to register form
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        saveUsers(users);
        saveCurrentUser(user);

        showAlert('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert('Email o contraseña incorrectos', 'error');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    // Validations
    if (password !== passwordConfirm) {
        showAlert('Las contraseñas no coinciden', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showAlert('Este email ya está registrado', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password, // En producción, usar hash
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        favorites: [],
        orderHistory: [],
        addresses: [],
        points: 0,
        level: 'Bronze'
    };

    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);

    showAlert('¡Cuenta creada exitosamente! Redirigiendo...', 'success');
    
    // Clear form
    document.getElementById('registerFormElement').reset();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User already logged in, redirect to home
        window.location.href = 'index.html';
    }
});

// Make functions global
window.showLogin = showLogin;
window.showRegister = showRegister;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
