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
    
    // Render info section
    document.getElementById('horario').innerHTML = `🕒 ${data.cafeteria.horario}`;
    document.getElementById('direccion').innerHTML = `📍 ${data.cafeteria.direccion}`;
    
    // Render Promos
    const promosGrid = document.getElementById('promos-grid');
    promosGrid.innerHTML = '';
    data.promos.forEach(item => {
        promosGrid.appendChild(createMenuItem(item));
    });
    
    // Render Bebidas Calientes
    const bebidasCalientesGrid = document.getElementById('bebidas-calientes-grid');
    bebidasCalientesGrid.innerHTML = '';
    data.bebidas.calientes.forEach(item => {
        bebidasCalientesGrid.appendChild(createMenuItem(item));
    });
    
    // Render Bebidas Frías
    const bebidasFriasGrid = document.getElementById('bebidas-frias-grid');
    bebidasFriasGrid.innerHTML = '';
    data.bebidas.frias.forEach(item => {
        bebidasFriasGrid.appendChild(createMenuItem(item));
    });
    
    // Render Panificado
    const panificadoGrid = document.getElementById('panificado-grid');
    panificadoGrid.innerHTML = '';
    data.panificado.forEach(item => {
        panificadoGrid.appendChild(createMenuItem(item));
    });
    
    // Render Almuerzo
    const almuerzoGrid = document.getElementById('almuerzo-grid');
    almuerzoGrid.innerHTML = '';
    data.almuerzo.forEach(item => {
        almuerzoGrid.appendChild(createMenuItem(item));
    });
    
    // Render Foto Carnet
    const fotoCarnetGrid = document.getElementById('fotocarnet-grid');
    fotoCarnetGrid.innerHTML = '';
    data.fotoCarnet.forEach(item => {
        fotoCarnetGrid.appendChild(createMenuItem(item));
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.menu-section');
        let hasResults = false;
        
        if (searchTerm === '') {
            // Show all items and sections
            menuItems.forEach(item => item.classList.remove('hidden'));
            sections.forEach(section => section.classList.remove('hidden'));
            removeNoResultsMessage();
            return;
        }
        
        // Filter items
        menuItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const description = item.getAttribute('data-description');
            const matches = name.includes(searchTerm) || description.includes(searchTerm);
            
            if (matches) {
                item.classList.remove('hidden');
                hasResults = true;
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Hide empty sections
        sections.forEach(section => {
            const visibleItems = section.querySelectorAll('.menu-item:not(.hidden)');
            if (visibleItems.length === 0) {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        });
        
        // Show no results message
        if (!hasResults) {
            showNoResultsMessage();
        } else {
            removeNoResultsMessage();
        }
    });
}

// Show no results message
function showNoResultsMessage() {
    removeNoResultsMessage();
    const menuContainer = document.getElementById('menuContainer');
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.id = 'no-results-message';
    noResults.textContent = 'No se encontraron resultados para tu búsqueda.';
    menuContainer.insertBefore(noResults, menuContainer.firstChild);
}

// Remove no results message
function removeNoResultsMessage() {
    const existing = document.getElementById('no-results-message');
    if (existing) {
        existing.remove();
    }
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
            document.getElementById('menuContainer').innerHTML = 
                '<div class="no-results">Error al cargar el menú. Por favor, recarga la página.</div>';
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', loadMenu);
