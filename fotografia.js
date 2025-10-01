// Global menu data
let menuData = null;

// Format price with thousands separator
function formatPrice(price) {
    return `$${price.toLocaleString('es-AR')}`;
}

// Create menu item HTML
function createMenuItem(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.setAttribute('data-name', item.nombre.toLowerCase());
    menuItem.setAttribute('data-description', (item.descripcion || '').toLowerCase());
    
    const itemHeader = document.createElement('div');
    itemHeader.className = 'item-header';
    
    const itemName = document.createElement('div');
    itemName.className = 'item-name';
    itemName.textContent = item.nombre;
    
    const itemPrice = document.createElement('div');
    itemPrice.className = 'item-price';
    itemPrice.textContent = item.precio === 0 ? 'Consultar' : formatPrice(item.precio);
    
    itemHeader.appendChild(itemName);
    itemHeader.appendChild(itemPrice);
    menuItem.appendChild(itemHeader);
    
    if (item.descripcion) {
        const itemDescription = document.createElement('div');
        itemDescription.className = 'item-description';
        itemDescription.textContent = item.descripcion;
        menuItem.appendChild(itemDescription);
    }
    
    return menuItem;
}

// Render menu sections
function renderMenu(data) {
    menuData = data;
    
    // Render Foto Carnet
    const fotoCarnetGrid = document.getElementById('fotocarnet-grid');
    fotoCarnetGrid.innerHTML = '';
    data.fotoCarnet.forEach(item => {
        fotoCarnetGrid.appendChild(createMenuItem(item));
    });
}

// Load menu data
async function loadMenu() {
    try {
        // Try to load from external JSON first
        const response = await fetch('data/menu.json');
        if (!response.ok) {
            throw new Error('Using embedded data');
        }
        const data = await response.json();
        renderMenu(data);
    } catch (error) {
        // Fallback to embedded data (for local file:// access)
        console.log('Using embedded menu data');
        if (typeof menuDataEmbedded !== 'undefined') {
            renderMenu(menuDataEmbedded);
        } else {
            document.getElementById('fotocarnet-grid').innerHTML = 
                '<div class="no-results">Error al cargar el menú. Por favor, recarga la página.</div>';
        }
    }
}

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupHamburgerMenu();
});
