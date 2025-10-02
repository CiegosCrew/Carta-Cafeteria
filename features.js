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
    const shareMenu = document.getElementById('shareMenu');
    const shareOverlay = document.getElementById('shareOverlay');
    
    if (shareBtn && shareMenu) {
        shareBtn.addEventListener('click', () => {
            shareMenu.classList.toggle('active');
            shareOverlay.classList.toggle('active');
        });
        
        shareOverlay.addEventListener('click', () => {
            shareMenu.classList.remove('active');
            shareOverlay.classList.remove('active');
        });
    }
}

function shareOn(platform) {
    // Check if running locally
    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Use GitHub Pages URL if local, otherwise use current URL
    const actualUrl = isLocal ? 'https://ciegoscrew.github.io/Carta-Cafeteria/' : window.location.href;
    const url = encodeURIComponent(actualUrl);
    const title = encodeURIComponent('PHOTOMARKET - Carta Digital');
    const text = encodeURIComponent('¡Mirá la carta de PHOTOMARKET! Cafetería y servicios fotográficos en Mendoza 🍰☕📸');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'facebook':
            if (isLocal) {
                showNotification('ℹ️ Facebook solo funciona con el sitio publicado. Compartiendo link de GitHub Pages...');
            }
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
            break;
        case 'copy':
            const copyUrl = isLocal ? 'https://ciegoscrew.github.io/Carta-Cafeteria/' : window.location.href;
            navigator.clipboard.writeText(copyUrl).then(() => {
                const msg = isLocal ? '✅ Link de GitHub Pages copiado' : '✅ Link copiado al portapapeles';
                showNotification(msg);
                document.getElementById('shareMenu').classList.remove('active');
                document.getElementById('shareOverlay').classList.remove('active');
            }).catch(() => {
                showNotification('❌ No se pudo copiar');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        document.getElementById('shareMenu').classList.remove('active');
        document.getElementById('shareOverlay').classList.remove('active');
    }
}

// ========== REVIEWS SYSTEM ==========
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

function setupReviewForm() {
    const starsInput = document.getElementById('starsInput');
    const ratingValue = document.getElementById('ratingValue');
    const reviewForm = document.getElementById('reviewForm');
    
    // Star rating interaction
    if (starsInput) {
        const stars = starsInput.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingValue.value = rating;
                
                // Update visual
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.add('active');
                        s.textContent = '★';
                    } else {
                        s.classList.remove('active');
                        s.textContent = '☆';
                    }
                });
            });
            
            // Hover effect
            star.addEventListener('mouseenter', () => {
                const rating = star.getAttribute('data-rating');
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.textContent = '★';
                    } else {
                        s.textContent = '☆';
                    }
                });
            });
        });
        
        starsInput.addEventListener('mouseleave', () => {
            const currentRating = ratingValue.value;
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });
    }
    
    // Form submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = ratingValue.value;
            const name = document.getElementById('reviewName').value;
            const comment = document.getElementById('reviewText').value;
            
            if (!rating) {
                showNotification('⚠️ Por favor selecciona una calificación');
                return;
            }
            
            const review = {
                id: Date.now(),
                rating: parseInt(rating),
                name: name,
                comment: comment,
                date: new Date().toLocaleDateString('es-AR')
            };
            
            reviews.unshift(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            
            renderReviews();
            reviewForm.reset();
            ratingValue.value = '';
            
            // Reset stars
            const stars = starsInput.querySelectorAll('.star');
            stars.forEach(s => {
                s.classList.remove('active');
                s.textContent = '☆';
            });
            
            showNotification('✅ ¡Gracias por tu reseña!');
        });
    }
}

function renderReviews() {
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    
    if (!reviewsDisplay) return;
    
    if (reviews.length === 0) {
        reviewsDisplay.innerHTML = '<p class="no-reviews">Sé el primero en dejar una reseña</p>';
        return;
    }
    
    reviewsDisplay.innerHTML = reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        return `
            <div class="testimonial-card">
                <div class="testimonial-rating">${stars}</div>
                <p class="testimonial-text">"${review.comment}"</p>
                <p class="testimonial-author">- ${review.name}</p>
                <p style="font-size: 0.85rem; color: #999; margin-top: 10px;">${review.date}</p>
            </div>
        `;
    }).join('');
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
const ADMIN_PASSWORD = '123pataza'; // Cambiá esta contraseña

function setupAdminPanel() {
    const adminToggle = document.getElementById('adminToggle');
    const adminModal = document.getElementById('adminModal');
    const adminOverlay = document.getElementById('adminOverlay');
    const adminClose = document.getElementById('adminClose');
    
    if (adminToggle && adminModal) {
        adminToggle.addEventListener('click', () => {
            // Pedir contraseña
            const password = prompt('🔒 Ingresá la contraseña de administrador:');
            
            if (password === ADMIN_PASSWORD) {
                adminModal.classList.add('active');
                adminOverlay.classList.add('active');
                showNotification('✅ Acceso concedido');
            } else if (password !== null) {
                showNotification('❌ Contraseña incorrecta');
            }
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
            
            const category = document.getElementById('adminCategory').value;
            const name = document.getElementById('adminName').value;
            const price = document.getElementById('adminPrice').value;
            const description = document.getElementById('adminDescription').value;
            
            // Crear objeto del producto
            const product = {
                nombre: name,
                precio: parseInt(price)
            };
            
            if (description) {
                product.descripcion = description;
            }
            
            // Mostrar en consola para que puedas copiar y pegar en menu.json
            console.log('=== NUEVO PRODUCTO ===');
            console.log('Categoría:', category);
            console.log('JSON:', JSON.stringify(product, null, 2));
            console.log('======================');
            
            showNotification(`✅ Producto creado. Abrí la consola (F12) para copiar el JSON y agregarlo a data/menu.json en la categoría "${category}"`);
            
            adminForm.reset();
        });
    }
}

// ========== ANALYTICS TRACKING ==========
function trackVisit() {
    let analyticsData = JSON.parse(localStorage.getItem('analyticsData')) || {
        visits: [],
        productClicks: {},
        hourlyActivity: {}
    };
    
    analyticsData.visits.push(new Date().toISOString());
    
    const hour = new Date().getHours();
    analyticsData.hourlyActivity[hour] = (analyticsData.hourlyActivity[hour] || 0) + 1;
    
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
}

function trackProductClick(productName) {
    let analyticsData = JSON.parse(localStorage.getItem('analyticsData')) || {
        visits: [],
        productClicks: {},
        hourlyActivity: {}
    };
    
    analyticsData.productClicks[productName] = (analyticsData.productClicks[productName] || 0) + 1;
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
}

// ========== USER NOTIFICATIONS ==========
function checkUserNotifications() {
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    const shownNotifications = JSON.parse(localStorage.getItem('shownNotifications')) || [];
    
    // Show new notifications
    userNotifications.forEach(notif => {
        if (!shownNotifications.includes(notif.id)) {
            setTimeout(() => {
                showUserNotification(notif);
                shownNotifications.push(notif.id);
                localStorage.setItem('shownNotifications', JSON.stringify(shownNotifications));
            }, 1000);
        }
    });
}

function showUserNotification(notif) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        max-width: 350px;
        background: white;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        border-left: 5px solid ${getNotifColor(notif.type)};
    `;
    
    notification.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
            <strong style="font-size: 1.1rem; color: #2c2c2c;">${notif.title}</strong>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;">×</button>
        </div>
        <p style="color: #666; margin: 0; line-height: 1.5;">${notif.message}</p>
        <div style="margin-top: 10px; font-size: 0.85rem; color: #999;">${notif.date}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 8000);
}

function getNotifColor(type) {
    const colors = {
        promo: '#4CAF50',
        turno: '#2196F3',
        info: '#666',
        urgente: '#ff4444'
    };
    return colors[type] || '#667eea';
}

// ========== INITIALIZE ALL FEATURES ==========
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    setupScrollAnimations();
    updateCartCount();
    renderCart();
    setupShareButton();
    setupAdminPanel();
    setupReviewForm();
    renderReviews();
    
    // Track visit
    trackVisit();
    
    // Check for notifications
    checkUserNotifications();
});

// ========== APPOINTMENT BOOKING ==========
function reservarTurno() {
    const message = `¡Hola! Quiero reservar un turno para fotos carnet.\n\n📸 Servicio: Foto Carnet\n📅 Fecha preferida: [Indicar fecha y horario]\n\n¿Tienen disponibilidad?`;
    const whatsappUrl = `https://wa.me/5492612636244?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.toggleCart = toggleCart;
window.sendCartWhatsApp = sendCartWhatsApp;
window.sendProductWhatsApp = sendProductWhatsApp;
window.reservarTurno = reservarTurno;
window.shareOn = shareOn;
