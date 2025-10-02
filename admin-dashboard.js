// Admin password (same as in features.js)
const ADMIN_PASSWORD = '123pataza';

// Analytics data storage
let analyticsData = JSON.parse(localStorage.getItem('analyticsData')) || {
    visits: [],
    productClicks: {},
    hourlyActivity: {},
    dailyVisits: {}
};

// Notifications storage
let notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];

// ========== LOGIN ==========
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        loadDashboard();
    } else {
        alert('❌ Contraseña incorrecta');
    }
});

function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
    document.getElementById('loginPassword').value = '';
}

// ========== TABS ==========
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    if (tabName === 'analytics') {
        document.getElementById('analyticsTab').classList.add('active');
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
    } else if (tabName === 'notifications') {
        document.getElementById('notificationsTab').classList.add('active');
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
    }
}

// ========== ANALYTICS ==========
function loadDashboard() {
    loadAnalytics();
    loadNotificationsHistory();
}

function loadAnalytics() {
    // Get data from localStorage
    const visits = analyticsData.visits || [];
    const productClicks = analyticsData.productClicks || {};
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Calculate visits today
    const today = new Date().toDateString();
    const visitsToday = visits.filter(v => new Date(v).toDateString() === today).length;
    
    // Count cart items across all users
    let totalCartItems = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('cart')) {
            const cart = JSON.parse(localStorage.getItem(key));
            totalCartItems += cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }
    
    // Update stats
    document.getElementById('visitasHoy').textContent = visitsToday;
    document.getElementById('visitasTotales').textContent = visits.length;
    document.getElementById('itemsCarrito').textContent = totalCartItems;
    document.getElementById('totalReviews').textContent = reviews.length;
    
    // Top products
    renderTopProducts(productClicks);
    
    // Hourly activity
    renderHourlyActivity();
    
    // Daily visits chart
    renderDailyVisits(visits);
}

function renderTopProducts(productClicks) {
    const container = document.getElementById('topProducts');
    
    if (Object.keys(productClicks).length === 0) {
        container.innerHTML = '<p class="no-data">No hay datos disponibles aún</p>';
        return;
    }
    
    // Sort by clicks
    const sorted = Object.entries(productClicks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    container.innerHTML = sorted.map(([name, count]) => `
        <div class="product-item">
            <span class="product-name">${name}</span>
            <span class="product-count">${count} veces</span>
        </div>
    `).join('');
}

function renderHourlyActivity() {
    const container = document.getElementById('hoursChart');
    const hourlyData = analyticsData.hourlyActivity || {};
    
    if (Object.keys(hourlyData).length === 0) {
        container.innerHTML = '<p class="no-data">Recopilando datos...</p>';
        return;
    }
    
    const maxActivity = Math.max(...Object.values(hourlyData));
    
    container.innerHTML = '';
    for (let hour = 8; hour <= 20; hour++) {
        const activity = hourlyData[hour] || 0;
        const percentage = maxActivity > 0 ? (activity / maxActivity) * 100 : 0;
        
        const hourBar = document.createElement('div');
        hourBar.className = 'hour-bar';
        hourBar.innerHTML = `
            <div class="hour-label">${hour}:00</div>
            <div class="hour-value" style="height: ${percentage}%">${activity}</div>
        `;
        container.appendChild(hourBar);
    }
}

function renderDailyVisits(visits) {
    const canvas = document.getElementById('visitsCanvas');
    const ctx = canvas.getContext('2d');
    
    // Get last 7 days
    const days = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
        days.push(dateStr);
        
        const dayVisits = visits.filter(v => {
            const visitDate = new Date(v);
            return visitDate.toDateString() === date.toDateString();
        }).length;
        
        counts.push(dayVisits);
    }
    
    // Simple bar chart
    const maxCount = Math.max(...counts, 1);
    const barWidth = canvas.width / days.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    counts.forEach((count, index) => {
        const barHeight = (count / maxCount) * (canvas.height - 40);
        const x = index * barWidth;
        const y = canvas.height - barHeight - 20;
        
        // Draw bar
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 10, y, barWidth - 20, barHeight);
        
        // Draw label
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(days[index], x + barWidth / 2, canvas.height - 5);
        
        // Draw count
        ctx.fillStyle = '#2c2c2c';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(count, x + barWidth / 2, y - 5);
    });
}

// ========== NOTIFICATIONS ==========
document.getElementById('notificationForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('notifTitle').value;
    const message = document.getElementById('notifMessage').value;
    const type = document.getElementById('notifType').value;
    
    const notification = {
        id: Date.now(),
        title,
        message,
        type,
        date: new Date().toLocaleString('es-AR')
    };
    
    // Save notification
    notifications.unshift(notification);
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    // Send to users (save in localStorage for users to see)
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    userNotifications.unshift(notification);
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    
    // Show success
    alert('✅ Notificación enviada correctamente');
    
    // Reset form
    document.getElementById('notificationForm').reset();
    
    // Reload history
    loadNotificationsHistory();
});

function loadNotificationsHistory() {
    const container = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        container.innerHTML = '<p class="no-data">No hay notificaciones enviadas</p>';
        return;
    }
    
    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type}">
            <div class="notification-header">
                <span class="notification-title">${notif.title}</span>
                <span class="notification-date">${notif.date}</span>
            </div>
            <p class="notification-message">${notif.message}</p>
            <span class="notification-type ${notif.type}">${getTypeLabel(notif.type)}</span>
        </div>
    `).join('');
}

function getTypeLabel(type) {
    const labels = {
        promo: '🎉 Promoción',
        turno: '📅 Recordatorio',
        info: 'ℹ️ Información',
        urgente: '⚠️ Urgente'
    };
    return labels[type] || type;
}

// ========== TRACK ANALYTICS (to be called from main site) ==========
function trackVisit() {
    analyticsData.visits = analyticsData.visits || [];
    analyticsData.visits.push(new Date().toISOString());
    
    // Track hourly activity
    const hour = new Date().getHours();
    analyticsData.hourlyActivity = analyticsData.hourlyActivity || {};
    analyticsData.hourlyActivity[hour] = (analyticsData.hourlyActivity[hour] || 0) + 1;
    
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
}

function trackProductClick(productName) {
    analyticsData.productClicks = analyticsData.productClicks || {};
    analyticsData.productClicks[productName] = (analyticsData.productClicks[productName] || 0) + 1;
    localStorage.setItem('analyticsData', JSON.stringify(analyticsData));
}

// Make functions global
window.showTab = showTab;
window.logout = logout;
window.trackVisit = trackVisit;
window.trackProductClick = trackProductClick;
