// ========== USER AUTHENTICATION SYSTEM ==========

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

function storageAvailable() {
    try {
        const testKey = '__auth_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        console.warn('[auth] localStorage no disponible, se usará un fallback en memoria.', error);
        return false;
    }
}

const useLocalStorage = storageAvailable();
let fallbackUsers = [];
let fallbackCurrentUser = null;

function safeParse(value) {
    if (!value) return null;
    try {
        return JSON.parse(value);
    } catch (error) {
        console.warn('[auth] JSON inválido en almacenamiento, se ignora.', error);
        return null;
    }
}

function getUsers() {
    if (useLocalStorage) {
        const raw = localStorage.getItem(USERS_KEY);
        const parsed = safeParse(raw);
        return Array.isArray(parsed) ? parsed : [];
    }
    return fallbackUsers;
}

function saveUsers(users) {
    if (useLocalStorage) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    fallbackUsers = Array.isArray(users) ? [...users] : [];
}

function getCurrentUser() {
    if (useLocalStorage) {
        return safeParse(localStorage.getItem(CURRENT_USER_KEY));
    }
    return fallbackCurrentUser;
}

function saveCurrentUser(user) {
    if (useLocalStorage) {
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    }
    fallbackCurrentUser = user ? { ...user } : null;
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

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => (u.email || '').toLowerCase() === email && u.password === password);

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
    const users = getUsers();
    if (!users.find(u => u.email === 'cristianbenegas137@gmail.com')) {
        users.push({
            id: Date.now(),
            name: 'Cristian Benegas',
            email: 'cristianbenegas137@gmail.com',
            phone: '',
            password: 'Ciego.2024',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            favorites: [],
            orderHistory: [],
            addresses: [],
            points: 0,
            level: 'Bronze'
        });
        saveUsers(users);
    }
});

// Make functions global
window.showLogin = showLogin;
window.showRegister = showRegister;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
