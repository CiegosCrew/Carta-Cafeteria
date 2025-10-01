// ========== DARK MODE ==========
function setupDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.menu-item, .menu-section').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// ========== SHOPPING CART ==========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.nombre === item.nombre);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    
    // Show feedback
    showNotification(`${item.nombre} agregado al carrito`);
}

function removeFromCart(nombre) {
    cart = cart.filter(item => item.nombre !== nombre);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function updateQuantity(nombre, change) {
    const item = cart.find(cartItem => cartItem.nombre === nombre);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(nombre);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }
}

function clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
        cartTotal.innerHTML = '';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.precio * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div class="cart-item-header">
                    <span class="cart-item-name">${item.nombre}</span>
                    <button class="cart-item-remove" onclick="removeFromCart('${item.nombre}')">×</button>
                </div>
                ${item.descripcion ? `<div class="item-description">${item.descripcion}</div>` : ''}
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.nombre}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.nombre}', 1)">+</button>
                    <span class="cart-item-price">$${itemTotal.toLocaleString('es-AR')}</span>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.innerHTML = `
        <div class="cart-total">
            <div class="cart-total-label">Total:</div>
            <div class="cart-total-amount">$${total.toLocaleString('es-AR')}</div>
        </div>
    `;
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.toggle('active');
    }
}

function sendCartWhatsApp() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    let message = '¡Hola! Quiero hacer el siguiente pedido:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.precio * item.quantity;
        total += itemTotal;
        message += `• ${item.nombre} x${item.quantity} - $${itemTotal.toLocaleString('es-AR')}\n`;
        if (item.descripcion) {
            message += `  (${item.descripcion})\n`;
        }
    });
    
    message += `\n*Total: $${total.toLocaleString('es-AR')}*`;
    
    const whatsappUrl = `https://wa.me/5492612636244?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ========== WHATSAPP PER PRODUCT ==========
function sendProductWhatsApp(item) {
    let message = `¡Hola! Me interesa:\n\n• ${item.nombre}`;
    if (item.descripcion) {
        message += `\n  (${item.descripcion})`;
    }
    message += `\n• Precio: $${item.precio.toLocaleString('es-AR')}`;
    
    const whatsappUrl = `https://wa.me/5492612636244?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ========== SHARE BUTTON ==========
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'PHOTOMARKET - Carta Digital',
                text: 'Mirá la carta de PHOTOMARKET',
                url: window.location.href
            };
            
            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                } else {
                    // Fallback: copy to clipboard
                    await navigator.clipboard.writeText(window.location.href);
                    showNotification('Link copiado al portapapeles');
                }
            } catch (err) {
                console.log('Error sharing:', err);
            }
        });
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: var(--color-secondary);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== ADMIN PANEL ==========
function setupAdminPanel() {
    const adminToggle = document.getElementById('adminToggle');
    const adminModal = document.getElementById('adminModal');
    const adminOverlay = document.getElementById('adminOverlay');
    const adminClose = document.getElementById('adminClose');
    
    if (adminToggle && adminModal) {
        adminToggle.addEventListener('click', () => {
            adminModal.classList.add('active');
            adminOverlay.classList.add('active');
        });
        
        adminClose.addEventListener('click', () => {
            adminModal.classList.remove('active');
            adminOverlay.classList.remove('active');
        });
        
        adminOverlay.addEventListener('click', () => {
            adminModal.classList.remove('active');
            adminOverlay.classList.remove('active');
        });
    }
    
    // Admin form submission
    const adminForm = document.getElementById('adminForm');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Función de admin en desarrollo. Por ahora edita data/menu.json');
            adminModal.classList.remove('active');
            adminOverlay.classList.remove('active');
        });
    }
}

// ========== INITIALIZE ALL FEATURES ==========
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    setupScrollAnimations();
    updateCartCount();
    renderCart();
    setupShareButton();
    setupAdminPanel();
});

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.toggleCart = toggleCart;
window.sendCartWhatsApp = sendCartWhatsApp;
window.sendProductWhatsApp = sendProductWhatsApp;
