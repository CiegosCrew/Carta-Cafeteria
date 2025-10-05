// ========== DARK MODE ==========
function setupDarkMode() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = savedTheme === 'dark'
            ? '<img src="assets/icons/sun.svg" alt="Claro" class="icon icon-20"/>'
            : '<img src="assets/icons/moon.svg" alt="Oscuro" class="icon icon-20"/>';
        // Accessibility and state
        themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark'
                ? '<img src="assets/icons/sun.svg" alt="Claro" class="icon icon-20"/>'
                : '<img src="assets/icons/moon.svg" alt="Oscuro" class="icon icon-20"/>';
            themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
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
    
    // Calculate average rating
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    // Show rating summary
    const summaryHTML = `
        <div class="reviews-summary">
            <div class="avg-rating">
                <div class="avg-number">${avgRating.toFixed(1)}</div>
                <div class="avg-stars">${'★'.repeat(Math.round(avgRating))}${'☆'.repeat(5 - Math.round(avgRating))}</div>
                <div class="total-reviews">${reviews.length} reseña${reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div class="rating-bars">
                ${[5,4,3,2,1].map(star => {
                    const count = reviews.filter(r => r.rating === star).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return `
                        <div class="rating-bar-row">
                            <span>${star}★</span>
                            <div class="rating-bar">
                                <div class="rating-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                            <span>${count}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    reviewsDisplay.innerHTML = summaryHTML + reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const adminReply = review.adminReply ? `
            <div class="admin-reply">
                <div class="admin-reply-header">
                    <strong>⚙️ Respuesta de PHOTOMARKET:</strong>
                </div>
                <p>${review.adminReply.text}</p>
                <small>${review.adminReply.date}</small>
            </div>
        ` : '';
        
        return `
            <div class="testimonial-card" data-review-id="${review.id}">
                <div class="testimonial-rating">${stars}</div>
                <p class="testimonial-text">"${review.comment}"</p>
                <p class="testimonial-author">- ${review.name}</p>
                <p style="font-size: 0.85rem; color: #999; margin-top: 10px;">${review.date}</p>
                ${adminReply}
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
    return colors[type] || '#666';
}

// ========== USER AUTHENTICATION ==========
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}


function viewOrders() {
    const currentUser = getCurrentUser();
    if (currentUser && Array.isArray(currentUser.orderHistory) && currentUser.orderHistory.length > 0) {
        console.log('Pedidos:', currentUser.orderHistory);
        alert(`Tenés ${currentUser.orderHistory.length} pedido(s). Ver consola (F12) para detalles.`);
    } else {
        alert('No tenés pedidos aún');
    }
}

function openFavorites() {
    const currentUser = getCurrentUser();
    if (!currentUser || !Array.isArray(currentUser.favorites) || currentUser.favorites.length === 0) {
        alert('Todavía no tenés favoritos guardados.');
        return;
    }

    const list = currentUser.favorites
        .map((fav, index) => {
            if (typeof fav === 'string') {
                return `${index + 1}. ${fav}`;
            }
            const nombre = fav?.nombre || 'Producto sin nombre';
            const descripcion = fav?.descripcion ? ` \u2013 ${fav.descripcion}` : '';
            return `${index + 1}. ${nombre}${descripcion}`;
        })
        .join('\n');

    alert(`Tus favoritos:\n${list}`);
}

function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}

function updateUserButton() {
    const currentUser = getCurrentUser();
    const navUserSection = document.getElementById('navUserSection');
    
    if (!navUserSection) return;
    
    // Obtener el elemento padre (ul) para poder insertar elementos li después del navUserSection
    const navList = navUserSection.parentNode;
    
    // Eliminar cualquier elemento de administración existente
    const existingAdminLink = document.querySelector('.admin-nav-item');
    if (existingAdminLink) {
        existingAdminLink.remove();
    }
    
    if (currentUser) {
        // Verificar si el usuario es administrador
        const isAdmin = currentUser.email === 'photomarketgadea@gmail.com';
        
        // Actualizar la sección de usuario
        navUserSection.innerHTML = `
            <div class="user-profile-card ${isAdmin ? 'user-profile-admin' : ''}">
                <div class="user-profile-header">
                    <div class="user-avatar" aria-hidden="true">${currentUser.name.charAt(0).toUpperCase()}</div>
                    <div class="user-info">
                        <span class="user-name">${currentUser.name}</span>
                        <span class="user-email">${currentUser.email}</span>
                        <span class="user-role ${isAdmin ? 'role-admin' : 'role-user'}">
                            ${isAdmin ? 'Administrador' : 'Cliente'}
                        </span>
                    </div>
                    <button class="logout-btn" onclick="logout()" aria-label="Cerrar sesión">
                        <img src="assets/icons/logout.svg" alt="Cerrar sesión" class="icon icon-18"/>
                    </button>
{{ ... }}
                    <button class="user-action" onclick="openFavorites()">
                        <span class="user-action-icon">⭐</span>
                        <span class="user-action-text">Favoritos</span>
                    </button>
                </div>
            </div>
        `;
        
        // Si es administrador, agregar el enlace de administración como un nuevo elemento li
        if (isAdmin) {
            const adminLi = document.createElement('li');
{{ ... }}
            adminLi.className = 'admin-nav-item';
            adminLi.innerHTML = `
                <a href="admin-panel.html" class="nav-link admin-link" target="_blank">
                    <img src="assets/icons/shield.svg" class="icon icon-18 icon-left" alt="Admin"/>
                    Panel de Administración
                </a>
            `;
            // Insertar después del navUserSection
            navList.insertBefore(adminLi, navUserSection.nextSibling);
        }
    } else {
        // Mostrar botones de autenticación
        navUserSection.innerHTML = `
            <div class="auth-buttons">
                <a href="auth.html" class="nav-link nav-link-login">
                    <img src="assets/icons/login.svg" class="icon icon-18 icon-left" alt="Iniciar sesión"/>
                    Iniciar sesión
                </a>
                <a href="auth.html?register=true" class="nav-link nav-link-register">
                    <img src="assets/icons/register.svg" class="icon icon-18 icon-left" alt="Registrarse"/>
                    Registrarse
                </a>
            </div>
        `;
    }
    
    // Asegurarse de que los estilos se apliquen correctamente
    let style = document.getElementById('user-profile-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'user-profile-styles';
        style.textContent = `
        .nav-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        .nav-link-login {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #e0e0e0;
        }
        .nav-link-register {
            background: linear-gradient(135deg, #8d6e63, #a98274);
            color: white;
            box-shadow: 0 4px 10px rgba(141, 110, 99, 0.25);
        }
        .icon-18 {
            width: 18px;
            height: 18px;
        }
        .icon-left {
            margin-right: 6px;
        }
        .user-profile-card {
            width: 100%;
            background: linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
            border-radius: 12px;
            padding: 14px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            display: flex;
            flex-direction: column;
            gap: 12px;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .user-profile-admin {
            background: linear-gradient(145deg, rgba(109,76,65,0.95), rgba(141,110,99,0.85));
            color: white;
        }
        .user-profile-header {
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .user-avatar {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.3rem;
            text-transform: uppercase;
            color: inherit;
        }
        .user-profile-admin .user-avatar {
            background: rgba(255,255,255,0.25);
            color: white;
        }
        .user-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .user-name {
            font-weight: 700;
            font-size: 1rem;
        }
        .user-email {
            font-size: 0.85rem;
            opacity: 0.8;
        }
        .user-role {
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .role-admin {
            background: rgba(255, 255, 255, 0.25);
            color: white;
        }
        .role-user {
            background: rgba(141, 110, 99, 0.12);
            color: #6d4c41;
        }
        .logout-btn {
            background: rgba(0,0,0,0.06);
            border: none;
            border-radius: 10px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .user-profile-admin .logout-btn {
            background: rgba(0,0,0,0.2);
        }
        .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .user-profile-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
        }
        .user-action {
            background: rgba(255,255,255,0.8);
            border: 1px solid rgba(141, 110, 99, 0.2);
            border-radius: 10px;
            padding: 8px 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            color: #5d4037;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .user-profile-admin .user-action {
            background: rgba(255,255,255,0.15);
            color: white;
            border-color: rgba(255,255,255,0.25);
        }
        .user-action:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .user-profile-admin .user-action:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .user-action-icon {
            font-size: 1rem;
        }
        .user-action-text {
            font-size: 0.85rem;
        }
    `;
        document.head.appendChild(style);
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    setupDarkMode();
    setupShareButton();
    trackVisit();
    checkUserNotifications();
    updateUserButton();
});

// ========== APPOINTMENT BOOKING ==========
function reservarTurno() {
    const message = `¡Hola! Quiero reservar un turno para fotos carnet.\n\nServicio: Foto Carnet\nFecha preferida: [Indicar fecha y horario]\n\n¿Tienen disponibilidad?`;
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
window.viewOrders = viewOrders;
window.logout = logout;
