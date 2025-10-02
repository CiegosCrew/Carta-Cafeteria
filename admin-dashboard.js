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
    } else if (tabName === 'reviews') {
        document.getElementById('reviewsTab').classList.add('active');
        document.querySelector('.tab-btn:nth-child(3)').classList.add('active');
        loadReviewsAdmin();
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

let productsChart, hoursChartInstance, visitsChartInstance;

function renderTopProducts(productClicks) {
    const canvas = document.getElementById('productsChart');
    if (!canvas) return;
    
    if (Object.keys(productClicks).length === 0) {
        return;
    }
    
    // Sort by clicks and get top 5
    const sorted = Object.entries(productClicks)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sorted.map(([name]) => name);
    const data = sorted.map(([, count]) => count);
    
    // Destroy previous chart
    if (productsChart) {
        productsChart.destroy();
    }
    
    // Create pie chart
    productsChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#8fbc8f',
                    '#d4a5a5',
                    '#e8d5c4'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' veces';
                        }
                    }
                }
            }
        }
    });
}

function renderHourlyActivity() {
    const canvas = document.getElementById('hoursChart');
    if (!canvas) return;
    
    const hourlyData = analyticsData.hourlyActivity || {};
    
    const hours = [];
    const activities = [];
    
    for (let hour = 8; hour <= 20; hour++) {
        hours.push(`${hour}:00`);
        activities.push(hourlyData[hour] || 0);
    }
    
    // Destroy previous chart
    if (hoursChartInstance) {
        hoursChartInstance.destroy();
    }
    
    // Create bar chart
    hoursChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: hours,
            datasets: [{
                label: 'Actividad',
                data: activities,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderDailyVisits(visits) {
    const canvas = document.getElementById('visitsChart');
    if (!canvas) return;
    
    // Get last 7 days
    const days = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayName = date.toLocaleDateString('es-AR', { weekday: 'short' });
        const dayNum = date.getDate();
        const monthNum = date.getMonth() + 1;
        const dateStr = `${dayName.charAt(0).toUpperCase() + dayName.slice(1, 3)} ${dayNum}/${monthNum}`;
        days.push(dateStr);
        
        const dayVisits = visits.filter(v => {
            const visitDate = new Date(v);
            return visitDate.toDateString() === date.toDateString();
        }).length;
        
        counts.push(dayVisits);
    }
    
    // Destroy previous chart
    if (visitsChartInstance) {
        visitsChartInstance.destroy();
    }
    
    // Create line chart
    visitsChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Visitas',
                data: counts,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
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

// ========== REVIEWS MANAGEMENT ==========
function loadReviewsAdmin() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const container = document.getElementById('reviewsAdminList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p class="no-data">No hay reseñas aún</p>';
        return;
    }
    
    container.innerHTML = reviews.map(review => {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const hasReply = review.adminReply;
        
        return `
            <div class="review-admin-card">
                <div class="review-admin-header">
                    <div>
                        <div class="review-rating">${stars}</div>
                        <strong>${review.name}</strong> - ${review.date}
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                
                ${hasReply ? `
                    <div class="admin-reply-preview">
                        <strong>Tu respuesta:</strong>
                        <p>${review.adminReply.text}</p>
                        <small>${review.adminReply.date}</small>
                    </div>
                ` : `
                    <div class="reply-form">
                        <textarea id="reply-${review.id}" placeholder="Escribe tu respuesta..." rows="3"></textarea>
                        <button onclick="replyToReview(${review.id})">Responder</button>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function replyToReview(reviewId) {
    const replyText = document.getElementById(`reply-${reviewId}`).value.trim();
    
    if (!replyText) {
        alert('Por favor escribe una respuesta');
        return;
    }
    
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (review) {
        review.adminReply = {
            text: replyText,
            date: new Date().toLocaleString('es-AR')
        };
        
        localStorage.setItem('reviews', JSON.stringify(reviews));
        alert('✅ Respuesta publicada');
        loadReviewsAdmin();
    }
}

// Make functions global
window.showTab = showTab;
window.logout = logout;
window.trackVisit = trackVisit;
window.trackProductClick = trackProductClick;
window.replyToReview = replyToReview;
