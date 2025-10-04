// ========== CONFIGURACIÓN ==========
const ADMIN_EMAIL = 'photomarketgadea@gmail.com';
const MENU_JSON_PATH = 'data/menu.json';

// Elementos del DOM
const productsList = document.getElementById('products-list');
const productSearch = document.getElementById('product-search');
const refreshBtn = document.getElementById('refresh-products');
const logoutBtn = document.getElementById('logout-btn');
const tabLinks = document.querySelectorAll('.sidebar li');
const tabContents = document.querySelectorAll('.tab-content');
const lastUpdatedSpan = document.getElementById('last-updated');

// Elementos del modal
const editModal = document.getElementById('edit-modal');
const editProductId = document.getElementById('edit-product-id');
const editProductName = document.getElementById('edit-product-name');
const editProductPrice = document.getElementById('edit-product-price');
const editProductCategory = document.getElementById('edit-product-category');
const saveProductBtn = document.getElementById('save-product');
const cancelEditBtn = document.getElementById('cancel-edit');

// Variables globales
let menuData = {};
let allProducts = [];
let currentUser = null;

// ========== AUTENTICACIÓN ==========

// Verificar si el usuario está autenticado
function checkAuth() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    currentUser = users.find(user => user.email === ADMIN_EMAIL);
    
    if (!currentUser) {
        // Redirigir a la página de inicio de sesión si no está autenticado
        window.location.href = 'auth.html';
        return false;
    }
    
    // Actualizar la UI con la información del usuario
    document.getElementById('admin-email').textContent = currentUser.email;
    return true;
}

// Cerrar sesión
function logout() {
    // Limpiar el usuario actual
    localStorage.removeItem('currentUser');
    // Redirigir a la página de inicio de sesión
    window.location.href = 'auth.html';
}

// ========== MANEJO DE PRODUCTOS ==========

// Cargar los datos del menú
async function loadMenuData() {
    try {
        const response = await fetch(MENU_JSON_PATH);
        if (!response.ok) {
            throw new Error('No se pudo cargar el menú');
        }
        menuData = await response.json();
        processProducts();
        updateLastUpdated();
    } catch (error) {
        console.error('Error cargando el menú:', error);
        showNotification('Error al cargar el menú', 'error');
    }
}

// Procesar los productos para mostrarlos en la lista
function processProducts() {
    allProducts = [];
    
    // Recorrer cada categoría y subcategoría para extraer los productos
    for (const [category, subcategories] of Object.entries(menuData)) {
        for (const [subcategory, products] of Object.entries(subcategories)) {
            if (Array.isArray(products)) {
                products.forEach(product => {
                    allProducts.push({
                        ...product,
                        category: `${category} > ${subcategory}`,
                        fullCategory: { category, subcategory },
                        id: `${category}-${subcategory}-${product.nombre.toLowerCase().replace(/\s+/g, '-')}`
                    });
                });
            }
        }
    }
    
    renderProducts(allProducts);
}

// Renderizar la lista de productos
function renderProducts(products) {
    if (products.length === 0) {
        productsList.innerHTML = '<div class="no-results">No se encontraron productos</div>';
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <div class="product-item" data-id="${product.id}">
            <div class="product-info">
                <div class="product-name">${product.nombre}</div>
                <span class="product-category">${product.category}</span>
            </div>
            <div class="product-price">$${product.precio?.toFixed(2) || '0.00'}</div>
            <button class="btn-edit" data-id="${product.id}">
                <i class="fas fa-edit"></i> Editar
            </button>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones de editar
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.id;
            openEditModal(productId);
        });
    });
}

// Filtrar productos por búsqueda
function filterProducts(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = allProducts.filter(product => 
        product.nombre.toLowerCase().includes(term) || 
        product.descripcion?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    );
    renderProducts(filtered);
}

// ========== MANEJO DEL MODAL ==========

// Abrir el modal de edición
function openEditModal(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    editProductId.value = productId;
    editProductName.value = product.nombre;
    editProductPrice.value = product.precio?.toFixed(2) || '';
    editProductCategory.value = product.category;
    
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cerrar el modal de edición
function closeEditModal() {
    editModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Guardar los cambios del producto
async function saveProduct() {
    const productId = editProductId.value;
    const newPrice = parseFloat(editProductPrice.value);
    
    if (isNaN(newPrice) || newPrice < 0) {
        showNotification('Por favor ingresa un precio válido', 'error');
        return;
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Actualizar el precio en la estructura de datos
    product.precio = newPrice;
    
    // Actualizar el menú en memoria
    updateProductInMenu(product);
    
    // Guardar los cambios (en un entorno real, aquí harías una petición al servidor)
    try {
        // En un entorno real, aquí harías una petición para guardar los cambios
        // Por ahora, solo actualizamos la UI
        showNotification('Producto actualizado correctamente', 'success');
        closeEditModal();
        renderProducts(allProducts);
        
        // Actualizar la última vez que se modificó
        updateLastUpdated();
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        showNotification('Error al guardar los cambios', 'error');
    }
}

// Actualizar un producto en la estructura del menú
function updateProductInMenu(updatedProduct) {
    const { category, subcategory } = updatedProduct.fullCategory;
    
    if (menuData[category] && menuData[category][subcategory]) {
        const products = menuData[category][subcategory];
        const index = products.findIndex(p => p.nombre === updatedProduct.nombre);
        
        if (index !== -1) {
            // Actualizar solo el precio y mantener el resto de propiedades
            products[index] = {
                ...products[index],
                precio: updatedProduct.precio
            };
        }
    }
}

// ========== ANÁLISIS ==========

// Cargar estadísticas
function loadAnalytics() {
    // Datos de ejemplo (en un entorno real, estos vendrían de una API)
    document.getElementById('total-users').textContent = '24';
    document.getElementById('orders-today').textContent = '15';
    document.getElementById('visits-today').textContent = '189';
    document.getElementById('featured-product').textContent = 'Café Especial';
    
    // Inicializar gráficos
    initCharts();
}

// Inicializar gráficos
function initCharts() {
    // Gráfico de actividad reciente
    const activityCtx = document.getElementById('activity-chart').getContext('2d');
    new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Visitas',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#667eea',
                tension: 0.3,
                fill: true,
                backgroundColor: 'rgba(102, 126, 234, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de productos populares
    const popularCtx = document.getElementById('popular-products-chart').getContext('2d');
    new Chart(popularCtx, {
        type: 'doughnut',
        data: {
            labels: ['Café', 'Té', 'Tortas', 'Sandwiches', 'Otros'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#48bb78',
                    '#ecc94b',
                    '#ed64a6'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ========== UTILIDADES ==========

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Actualizar la última vez que se modificó
function updateLastUpdated() {
    const now = new Date();
    const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    lastUpdatedSpan.textContent = `Actualizado el ${now.toLocaleDateString('es-ES', options)}`;
}

// ========== EVENT LISTENERS ==========

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    if (!checkAuth()) return;
    
    // Cargar datos iniciales
    loadMenuData();
    loadAnalytics();
    
    // Evento de búsqueda
    productSearch.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });
    
    // Botón de actualizar
    refreshBtn.addEventListener('click', loadMenuData);
    
    // Cerrar sesión
    logoutBtn.addEventListener('click', logout);
    
    // Navegación por pestañas
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.dataset.tab;
            
            // Actualizar pestañas
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Mostrar contenido de la pestaña
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Actualizar título
            document.getElementById('tab-title').textContent = 
                tabId === 'prices' ? 'Gestionar Precios' : 'Análisis';
        });
    });
    
    // Eventos del modal
    document.querySelectorAll('.close-modal, #cancel-edit').forEach(btn => {
        btn.addEventListener('click', closeEditModal);
    });
    
    saveProductBtn.addEventListener('click', saveProduct);
    
    // Cerrar modal al hacer clic fuera del contenido
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    });
});

// Hacer que las funciones estén disponibles globalmente
window.openEditModal = openEditModal;
