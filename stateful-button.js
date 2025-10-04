// ========== STATEFUL BUTTON COMPONENT ==========

class StatefulButton {
    constructor(element, options = {}) {
        this.element = element;
        this.originalText = element.textContent;
        this.loadingText = options.loadingText || 'Enviando...';
        this.successText = options.successText || '✓ Enviado';
        this.errorText = options.errorText || '✗ Error';
        this.onClick = options.onClick || (() => Promise.resolve());
        
        this.init();
    }
    
    init() {
        this.element.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleClick();
        });
    }
    
    async handleClick() {
        if (this.element.disabled) return;
        
        // Disable button
        this.element.disabled = true;
        
        // Save original styles
        const originalBg = this.element.style.background;
        const originalCursor = this.element.style.cursor;
        
        // Set loading state
        this.element.innerHTML = `
            <span class="btn-spinner"></span>
            <span>${this.loadingText}</span>
        `;
        this.element.style.cursor = 'wait';
        
        try {
            // Execute the action
            await this.onClick();
            
            // Success state
            this.element.innerHTML = `<span>${this.successText}</span>`;
            this.element.style.background = '#4CAF50';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.reset(originalBg, originalCursor);
            }, 2000);
            
        } catch (error) {
            // Error state
            this.element.innerHTML = `<span>${this.errorText}</span>`;
            this.element.style.background = '#f44336';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.reset(originalBg, originalCursor);
            }, 2000);
        }
    }
    
    reset(originalBg, originalCursor) {
        this.element.disabled = false;
        this.element.innerHTML = this.originalText;
        this.element.style.background = originalBg;
        this.element.style.cursor = originalCursor;
    }
}

// Initialize all WhatsApp buttons with stateful behavior
function initStatefulWhatsAppButtons() {
    // Cart WhatsApp button
    const cartWhatsAppBtn = document.querySelector('.btn-send-whatsapp');
    if (cartWhatsAppBtn) {
        new StatefulButton(cartWhatsAppBtn, {
            loadingText: 'Abriendo WhatsApp...',
            successText: '✓ Abierto',
            onClick: async () => {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    throw new Error('Carrito vacío');
                }
                
                let message = '*Mi Pedido:*\n\n';
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.precio * item.quantity;
                    total += itemTotal;
                    message += `• ${item.nombre} x${item.quantity} - $${itemTotal.toLocaleString('es-AR')}\n`;
                });
                
                message += `\n*Total: $${total.toLocaleString('es-AR')}*\n\n`;
                message += '¿Podés confirmar mi pedido? Gracias!';
                
                const whatsappUrl = `https://wa.me/5492612636244?text=${encodeURIComponent(message)}`;
                
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                window.open(whatsappUrl, '_blank');
            }
        });
    }
    
    // Product WhatsApp buttons
    document.querySelectorAll('.btn-whatsapp-product').forEach(btn => {
        new StatefulButton(btn, {
            loadingText: 'Abriendo...',
            successText: '✓ Abierto',
            onClick: async () => {
                const productName = btn.getAttribute('data-product-name');
                const productPrice = btn.getAttribute('data-product-price');
                
                const message = `Hola! Me interesa:\n\n*${productName}*\nPrecio: $${productPrice}\n\n¿Está disponible?`;
                const whatsappUrl = `https://wa.me/5492612636244?text=${encodeURIComponent(message)}`;
                
                // Simulate delay
                await new Promise(resolve => setTimeout(resolve, 800));
                
                window.open(whatsappUrl, '_blank');
            }
        });
    });
}

// Re-initialize when menu is rendered
function observeMenuChanges() {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    
    const observer = new MutationObserver(() => {
        initStatefulWhatsAppButtons();
    });
    
    observer.observe(menuContainer, {
        childList: true,
        subtree: true
    });
}

// Make function global
window.initStatefulWhatsAppButtons = initStatefulWhatsAppButtons;

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initStatefulWhatsAppButtons();
    observeMenuChanges();
});
