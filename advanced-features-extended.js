// ========== FEATURED PRODUCTS ==========

const featuredProducts = [
    'Café con Leche',
    'Medialunas',
    'Tostado de jamón y queso',
    'Capuchino',
    'Brownie'
];

function isFeaturedProduct(productName) {
    return featuredProducts.includes(productName);
}

function addFeaturedBadge(element, productName) {
    if (isFeaturedProduct(productName)) {
        const badge = document.createElement('div');
        badge.className = 'featured-badge';
        badge.innerHTML = '⭐ Más Vendido';
        element.appendChild(badge);
    }
}

// ========== UPSELLING / CROSS-SELLING ==========

const upsellingSuggestions = {
    'Café con Leche': [
        { nombre: 'Medialunas (x2)', precio: 800, discount: 10 },
        { nombre: 'Tostado de jamón y queso', precio: 1500, discount: 15 }
    ],
    'Capuchino': [
        { nombre: 'Brownie', precio: 1200, discount: 10 },
        { nombre: 'Alfajor de maicena/miel', precio: 800, discount: 5 }
    ],
    'Tostado de jamón y queso': [
        { nombre: 'Café con Leche', precio: 1000, discount: 10 },
        { nombre: 'Jugo de Naranja Exprimido', precio: 1500, discount: 5 }
    ]
};

function showUpsellingSuggestion(product) {
    const suggestions = upsellingSuggestions[product.nombre];
    
    if (!suggestions || suggestions.length === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'upselling-modal';
    modal.innerHTML = `
        <div class="upselling-content">
            <h3>¿Querés agregar algo más?</h3>
            <p class="upselling-subtitle">Aprovechá estos descuentos especiales</p>
            <div class="upselling-items">
                ${suggestions.map(item => `
                    <div class="upselling-item">
                        <div class="upselling-item-info">
                            <strong>${item.nombre}</strong>
                            <div class="upselling-price">
                                <span class="original-price">$${item.precio}</span>
                                <span class="discount-price">$${Math.floor(item.precio * (1 - item.discount / 100))}</span>
                                <span class="discount-badge">-${item.discount}%</span>
                            </div>
                        </div>
                        <button class="btn-add-upsell" onclick="addUpsellItem('${item.nombre}', ${Math.floor(item.precio * (1 - item.discount / 100))})">
                            Agregar
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-skip-upsell" onclick="closeUpsellModal()">No, gracias</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('active'), 10);
}

function addUpsellItem(nombre, precio) {
    const item = { nombre, precio, quantity: 1 };
    if (typeof addToCart === 'function') {
        addToCart(item);
    }
    closeUpsellModal();
}

function closeUpsellModal() {
    const modal = document.querySelector('.upselling-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========== GEOLOCATION ==========

let userLocation = null;
const storeLocation = {
    lat: -32.8895, // Coordenadas de ejemplo (Mendoza)
    lng: -68.8458,
    address: 'Peltier 50, local 4'
};

function checkUserLocation() {
    if (!navigator.geolocation) {
        console.log('Geolocalización no soportada');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                storeLocation.lat,
                storeLocation.lng
            );
            
            showLocationNotification(distance);
        },
        (error) => {
            console.log('Error obteniendo ubicación:', error);
        }
    );
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
}

function showLocationNotification(distance) {
    const distanceKm = distance.toFixed(1);
    const distanceM = Math.floor(distance * 1000);
    
    let message = '';
    
    if (distance < 0.1) {
        message = `📍 ¡Estás muy cerca! A solo ${distanceM}m del local`;
    } else if (distance < 0.5) {
    } else if (distance < 2) {
        message = `📍 Estás a ${distanceKm}km. Hacemos delivery en tu zona 🚚`;
    } else {
        message = `📍 Estás a ${distanceKm}km. Consultá por delivery`;
    }
}

// ========== CHAT WIDGET ==========

let chatOpen = false;
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

const autoResponses = {
    'hola': '¡Hola! 👋 ¿En qué puedo ayudarte?',
    'horario': 'Nuestro horario es de Lunes a Viernes de 8:00 a 20:00 hs',
    'ubicacion': 'Estamos en Peltier 50, local 4. ¿Querés ver el mapa?',
    'precio': 'Podés ver todos nuestros precios en el menú. ¿Buscás algo en particular?',
    'delivery': 'Hacemos delivery en un radio de 2km. ¿Cuál es tu dirección?',
    'foto carnet': 'Las fotos carnet cuestan $5000. Podés reservar turno por WhatsApp.',
    'reserva': 'Podés reservar turno por WhatsApp al +54 9 261 263-6244',
    'pago': 'Aceptamos efectivo, transferencia y Mercado Pago',
    'menu': 'Tenemos cafetería, panificados, almuerzos y servicios fotográficos. ¿Qué te interesa?'
};

function initChat() {
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chatWidget';
    chatWidget.className = 'chat-widget';
    chatWidget.innerHTML = `
        <button class="chat-toggle" onclick="toggleChat()">
            <img src="assets/icons/chat.svg" alt="Chat" class="icon icon-20"/>
            <span class="chat-badge" id="chatBadge">1</span>
        </button>
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <h3>Chat PHOTOMARKET</h3>
                <button onclick="toggleChat()">×</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot">
                    <p>¡Hola! 👋 Soy el asistente virtual de PHOTOMARKET. ¿En qué puedo ayudarte?</p>
                    <small>${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Escribe tu mensaje..." onkeypress="handleChatKeyPress(event)">
                <button onclick="sendChatMessage()">Enviar</button>
            </div>
            <div class="chat-quick-replies">
                <button onclick="sendQuickReply('horario')">⏰ Horario</button>
                <button onclick="sendQuickReply('ubicacion')">📍 Ubicación</button>
                <button onclick="sendQuickReply('delivery')">🚚 Delivery</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
}

function toggleChat() {
    chatOpen = !chatOpen;
    const chatWindow = document.getElementById('chatWindow');
    const chatBadge = document.getElementById('chatBadge');
    
    if (chatOpen) {
        chatWindow.classList.add('active');
        if (chatBadge) chatBadge.style.display = 'none';
    } else {
        chatWindow.classList.remove('active');
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage(message, 'user');
    input.value = '';
    
    // Auto response
    setTimeout(() => {
        const response = getAutoResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function sendQuickReply(keyword) {
    const response = autoResponses[keyword];
    addChatMessage(keyword, 'user');
    
    setTimeout(() => {
        addChatMessage(response, 'bot');
    }, 500);
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `
        <p>${text}</p>
        <small>${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</small>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Save to localStorage
    chatMessages.push({ text, sender, time: new Date().toISOString() });
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
}

function getAutoResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, response] of Object.entries(autoResponses)) {
        if (lowerMessage.includes(keyword)) {
            return response;
        }
    }
    
    return 'Gracias por tu mensaje. Un momento, te contactamos por WhatsApp para ayudarte mejor. 📱';
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// ========== INITIALIZE ==========

document.addEventListener('DOMContentLoaded', () => {
    initChat();
    
    // Check location after 3 seconds
    setTimeout(checkUserLocation, 3000);
});

// Make functions global
window.showUpsellingSuggestion = showUpsellingSuggestion;
window.addUpsellItem = addUpsellItem;
window.closeUpsellModal = closeUpsellModal;
window.toggleChat = toggleChat;
window.sendChatMessage = sendChatMessage;
window.sendQuickReply = sendQuickReply;
window.handleChatKeyPress = handleChatKeyPress;
window.addFeaturedBadge = addFeaturedBadge;
window.isFeaturedProduct = isFeaturedProduct;
