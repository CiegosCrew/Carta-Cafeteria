// ========== USER SYSTEM ==========

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// User class
class User {
    constructor(name, email, password) {
        this.id = Date.now();
        this.name = name;
        this.email = email;
        this.password = password; // En producción, usar hash
        this.favorites = [];
        this.orderHistory = [];
        this.addresses = [];
        this.points = 0;
        this.level = 'Bronze';
        this.createdAt = new Date().toISOString();
    }
}

// Register user
function registerUser(name, email, password) {
    // Check if email exists
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'El email ya está registrado' };
    }
    
    const user = new User(name, email, password);
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Usuario registrado exitosamente', user };
}

// Login user
function loginUser(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Email o contraseña incorrectos' };
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return { success: true, message: 'Inicio de sesión exitoso', user };
}

// Logout user
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForUser();
}

// Update user in storage
function updateUser(updatedUser) {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        if (currentUser && currentUser.id === updatedUser.id) {
            currentUser = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    }
}

// ========== FAVORITES SYSTEM ==========

function addToFavorites(product) {
    if (!currentUser) {
        showNotification('⚠️ Inicia sesión para guardar favoritos');
        showLoginModal();
        return;
    }
    
    if (!currentUser.favorites) {
        currentUser.favorites = [];
    }
    
    const exists = currentUser.favorites.find(f => f.nombre === product.nombre);
    
    if (exists) {
        showNotification('ℹ️ Ya está en favoritos');
        return;
    }
    
    currentUser.favorites.push(product);
    updateUser(currentUser);
    
    // Heart particle effect
    createHeartParticle(event.target);
    
    showNotification('❤️ Agregado a favoritos');
    updateFavoritesUI();
}

function removeFromFavorites(productName) {
    if (!currentUser) return;
    
    currentUser.favorites = currentUser.favorites.filter(f => f.nombre !== productName);
    updateUser(currentUser);
    
    showNotification('💔 Eliminado de favoritos');
    updateFavoritesUI();
}

function isFavorite(productName) {
    if (!currentUser || !currentUser.favorites) return false;
    return currentUser.favorites.some(f => f.nombre === productName);
}

// ========== ORDER HISTORY ==========

function addToOrderHistory(order) {
    if (!currentUser) return;
    
    if (!currentUser.orderHistory) {
        currentUser.orderHistory = [];
    }
    
    const orderRecord = {
        id: Date.now(),
        items: order,
        total: order.reduce((sum, item) => sum + (item.precio * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    currentUser.orderHistory.unshift(orderRecord);
    
    // Add points (1 point per $100)
    const points = Math.floor(orderRecord.total / 100);
    currentUser.points += points;
    
    // Update level
    updateUserLevel();
    
    updateUser(currentUser);
}

function updateUserLevel() {
    if (!currentUser) return;
    
    if (currentUser.points >= 1000) {
        currentUser.level = 'Platinum';
    } else if (currentUser.points >= 500) {
        currentUser.level = 'Gold';
    } else if (currentUser.points >= 200) {
        currentUser.level = 'Silver';
    } else {
        currentUser.level = 'Bronze';
    }
}

// ========== ADDRESSES ==========

function addAddress(address) {
    if (!currentUser) return;
    
    if (!currentUser.addresses) {
        currentUser.addresses = [];
    }
    
    currentUser.addresses.push({
        id: Date.now(),
        ...address,
        isDefault: currentUser.addresses.length === 0
    });
    
    updateUser(currentUser);
}

function setDefaultAddress(addressId) {
    if (!currentUser) return;
    
    currentUser.addresses.forEach(addr => {
        addr.isDefault = addr.id === addressId;
    });
    
    updateUser(currentUser);
}

// ========== UI UPDATES ==========

function updateUIForUser() {
    const userBtn = document.getElementById('userButton');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        if (userBtn) {
            userBtn.innerHTML = `
                <span class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</span>
                <span class="user-name">${currentUser.name}</span>
            `;
        }
        
        if (userMenu) {
            userMenu.classList.add('logged-in');
        }
    } else {
        if (userBtn) {
            userBtn.innerHTML = `
                <span>👤 Iniciar Sesión</span>
            `;
        }
        
        if (userMenu) {
            userMenu.classList.remove('logged-in');
        }
    }
    
    updateFavoritesUI();
}

function updateFavoritesUI() {
    // Update favorite buttons in menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        const productName = item.querySelector('.item-name')?.textContent;
        const favBtn = item.querySelector('.btn-favorite');
        
        if (favBtn && productName) {
            if (isFavorite(productName)) {
                favBtn.classList.add('active');
                favBtn.textContent = '❤️';
            } else {
                favBtn.classList.remove('active');
                favBtn.textContent = '🤍';
            }
        }
    });
}

// ========== PARTICLE EFFECTS ==========

function createHeartParticle(element) {
    const rect = element.getBoundingClientRect();
    const particle = document.createElement('div');
    particle.className = 'heart-particle';
    particle.style.position = 'fixed';
    particle.style.left = rect.left + 'px';
    particle.style.top = rect.top + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '10000';
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
}

function createConfetti() {
    const colors = ['#ff6b9d', '#c06c84', '#f67280', '#ffeaa7'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ========== PARTICLES BACKGROUND ==========

function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    container.id = 'particlesContainer';
    
    // Coffee particles (granos de café)
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'coffee-particle';
        particle.textContent = '☕';
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.opacity = '0.6';
        particle.style.animation = 'float 15s infinite ease-in-out';
        container.appendChild(particle);
    }
    
    // Steam particles
    for (let i = 0; i < 10; i++) {
        const steam = document.createElement('div');
        steam.className = 'steam-particle';
        steam.style.position = 'absolute';
        steam.style.left = Math.random() * 100 + '%';
        steam.style.bottom = '0';
        steam.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(steam);
    }
    
    document.body.insertBefore(container, document.body.firstChild);
}

function toggleParticles(enabled) {
    const container = document.getElementById('particlesContainer');
    if (container) {
        container.style.display = enabled ? 'block' : 'none';
    }
}

// ========== INITIALIZE ==========

document.addEventListener('DOMContentLoaded', () => {
    updateUIForUser();
    initParticles();
});

// Make functions global
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.isFavorite = isFavorite;
window.addToOrderHistory = addToOrderHistory;
window.addAddress = addAddress;
window.currentUser = currentUser;
window.createConfetti = createConfetti;
window.toggleParticles = toggleParticles;
