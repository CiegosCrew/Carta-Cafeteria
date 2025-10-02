const translations = {
    es: {
        // Header
        title: "PHOTOMARKET",
        subtitle: "Cafetería y Servicios Fotográficos",
        
        // Navigation
        menu: "Menú",
        photos: "Fotografía",
        location: "Ubicación",
        reviews: "Reseñas",
        
        // Info
        schedule: "Horario",
        address: "Dirección",
        phone: "Teléfono",
        
        // Menu sections
        promos: "PROMOS",
        hotDrinks: "BEBIDAS CALIENTES",
        coldDrinks: "BEBIDAS FRÍAS",
        bakery: "PANIFICADO",
        lunch: "ALMUERZO",
        photoServices: "FOTO CARNET",
        
        // Buttons
        addToCart: "Agregar",
        order: "Pedir",
        share: "Compartir",
        installApp: "Instalar App",
        viewMap: "Ver en Google Maps",
        reserveAppointment: "Reservar por WhatsApp",
        sendOrder: "Enviar por WhatsApp",
        clearCart: "Vaciar carrito",
        
        // Cart
        myOrder: "Mi Pedido",
        cartEmpty: "Tu carrito está vacío",
        total: "Total",
        itemsInCart: "Items en Carritos",
        
        // Reviews
        reviewsTitle: "Lo que dicen nuestros clientes",
        leaveReview: "Dejanos tu opinión",
        yourRating: "Tu calificación",
        yourName: "Tu nombre",
        yourComment: "Tu comentario",
        submitReview: "Enviar reseña",
        firstReview: "Sé el primero en dejar una reseña",
        adminResponse: "Respuesta de PHOTOMARKET",
        
        // Footer
        thankYou: "Gracias por elegirnos",
        rights: "Todos los derechos reservados",
        
        // Notifications
        addedToCart: "agregado al carrito",
        linkCopied: "Link copiado al portapapeles",
        accessGranted: "Acceso concedido",
        incorrectPassword: "Contraseña incorrecta",
        
        // Accessibility
        fontSize: "Tamaño de fuente",
        contrast: "Contraste",
        normal: "Normal",
        large: "Grande",
        extraLarge: "Extra grande",
        highContrast: "Alto contraste",
        
        // Theme
        theme: "Tema",
        light: "Claro",
        dark: "Oscuro",
        auto: "Automático"
    },
    en: {
        // Header
        title: "PHOTOMARKET",
        subtitle: "Café and Photography Services",
        
        // Navigation
        menu: "Menu",
        photos: "Photography",
        location: "Location",
        reviews: "Reviews",
        
        // Info
        schedule: "Schedule",
        address: "Address",
        phone: "Phone",
        
        // Menu sections
        promos: "SPECIALS",
        hotDrinks: "HOT DRINKS",
        coldDrinks: "COLD DRINKS",
        bakery: "BAKERY",
        lunch: "LUNCH",
        photoServices: "ID PHOTOS",
        
        // Buttons
        addToCart: "Add",
        order: "Order",
        share: "Share",
        installApp: "Install App",
        viewMap: "View on Google Maps",
        reserveAppointment: "Reserve via WhatsApp",
        sendOrder: "Send via WhatsApp",
        clearCart: "Clear cart",
        
        // Cart
        myOrder: "My Order",
        cartEmpty: "Your cart is empty",
        total: "Total",
        itemsInCart: "Items in Carts",
        
        // Reviews
        reviewsTitle: "What our customers say",
        leaveReview: "Leave your review",
        yourRating: "Your rating",
        yourName: "Your name",
        yourComment: "Your comment",
        submitReview: "Submit review",
        firstReview: "Be the first to leave a review",
        adminResponse: "PHOTOMARKET Response",
        
        // Footer
        thankYou: "Thank you for choosing us",
        rights: "All rights reserved",
        
        // Notifications
        addedToCart: "added to cart",
        linkCopied: "Link copied to clipboard",
        accessGranted: "Access granted",
        incorrectPassword: "Incorrect password",
        
        // Accessibility
        fontSize: "Font size",
        contrast: "Contrast",
        normal: "Normal",
        large: "Large",
        extraLarge: "Extra large",
        highContrast: "High contrast",
        
        // Theme
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        auto: "Auto"
    }
};

// Current language
let currentLang = localStorage.getItem('language') || 'es';

// Get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Change language
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updatePageTranslations();
}

// Update all translations on page
function updatePageTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update page title
    document.title = currentLang === 'es' 
        ? 'PHOTOMARKET - Carta Digital | Cafetería y Fotografía en Mendoza'
        : 'PHOTOMARKET - Digital Menu | Café and Photography in Mendoza';
    
    // Update section titles
    const sectionTitles = {
        'promos-section': t('promos'),
        'bebidas-calientes-section': t('hotDrinks'),
        'bebidas-frias-section': t('coldDrinks'),
        'panificado-section': t('bakery'),
        'almuerzo-section': t('lunch'),
        'fotocarnet-section': t('photoServices')
    };
    
    Object.keys(sectionTitles).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const titleElement = element.querySelector('.section-title');
            if (titleElement) {
                titleElement.textContent = sectionTitles[id];
            }
        }
    });
    
    // Update buttons
    updateButtonTexts();
    
    // Update cart
    updateCartTranslations();
    
    // Update dynamic content
    updateDynamicContent();
}

// Update button texts
function updateButtonTexts() {
    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.textContent = '🛒 ' + t('addToCart');
    });
    
    // Order buttons
    document.querySelectorAll('.btn-whatsapp-product').forEach(btn => {
        btn.textContent = '💬 ' + t('order');
    });
    
    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        const textSpan = shareBtn.querySelector('span:not(.share-option-icon)');
        if (textSpan) {
            textSpan.textContent = t('share');
        }
    }
    
    // Install app button
    const installBtns = document.querySelectorAll('[data-install-btn]');
    installBtns.forEach(btn => {
        btn.textContent = '📱 ' + t('installApp');
    });
}

// Update cart translations
function updateCartTranslations() {
    const cartTitle = document.querySelector('.cart-title');
    if (cartTitle) {
        cartTitle.textContent = t('myOrder');
    }
    
    const emptyCart = document.querySelector('.empty-cart');
    if (emptyCart) {
        emptyCart.textContent = t('cartEmpty');
    }
    
    const totalLabel = document.querySelector('.cart-total-label');
    if (totalLabel) {
        totalLabel.textContent = t('total') + ':';
    }
    
    const sendBtn = document.querySelector('.btn-send-whatsapp');
    if (sendBtn) {
        sendBtn.textContent = '📱 ' + t('sendOrder');
    }
    
    const clearBtn = document.querySelector('.btn-clear-cart');
    if (clearBtn) {
        clearBtn.textContent = '🗑️ ' + t('clearCart');
    }
    
    const payBtn = document.querySelector('.btn-pay-online');
    if (payBtn) {
        payBtn.textContent = currentLang === 'es' ? '💳 Pagar Online' : '💳 Pay Online';
    }
}

// Update all dynamic content
function updateDynamicContent() {
    // Update schedule text
    const scheduleText = document.getElementById('scheduleText');
    if (scheduleText) {
        scheduleText.textContent = currentLang === 'es' 
            ? 'Lunes a Viernes: 8:00 - 20:00'
            : 'Monday to Friday: 8:00 AM - 8:00 PM';
    }
    
    // Update reviews section title
    const reviewsTitle = document.querySelector('.testimonials-section h2');
    if (reviewsTitle) {
        reviewsTitle.textContent = t('reviewsTitle');
    }
    
    // Update review form
    const reviewFormTitle = document.querySelector('.review-form h3');
    if (reviewFormTitle) {
        reviewFormTitle.textContent = t('leaveReview');
    }
    
    // Re-render menu items if app.js is loaded
    if (typeof renderMenu === 'function') {
        renderMenu();
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = currentLang;
    updatePageTranslations();
});

// Make functions global
window.changeLanguage = changeLanguage;
window.t = t;
window.updatePageTranslations = updatePageTranslations;
