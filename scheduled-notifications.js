// ========== SCHEDULED NOTIFICATIONS ==========

let scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications')) || [];

// Schedule a notification
function scheduleNotification(notification) {
    const scheduled = {
        id: Date.now(),
        ...notification,
        status: 'pending'
    };
    
    scheduledNotifications.push(scheduled);
    localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    
    // Set timeout if scheduled for near future
    const now = new Date().getTime();
    const scheduledTime = new Date(notification.scheduledDate + ' ' + notification.scheduledTime).getTime();
    const delay = scheduledTime - now;
    
    if (delay > 0 && delay < 24 * 60 * 60 * 1000) { // Within 24 hours
        setTimeout(() => {
            sendScheduledNotification(scheduled.id);
        }, delay);
    }
    
    return scheduled;
}

// Send scheduled notification
function sendScheduledNotification(notificationId) {
    const notification = scheduledNotifications.find(n => n.id === notificationId);
    
    if (!notification || notification.status === 'sent') {
        return;
    }
    
    // Mark as sent
    notification.status = 'sent';
    notification.sentAt = new Date().toISOString();
    localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    
    // Send to users
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    userNotifications.unshift({
        id: Date.now(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        date: new Date().toLocaleString('es-AR')
    });
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    
    console.log('Scheduled notification sent:', notification);
}

// Check for pending notifications
function checkScheduledNotifications() {
    const now = new Date().getTime();
    
    scheduledNotifications.forEach(notification => {
        if (notification.status === 'pending') {
            const scheduledTime = new Date(notification.scheduledDate + ' ' + notification.scheduledTime).getTime();
            
            if (now >= scheduledTime) {
                sendScheduledNotification(notification.id);
            }
        }
    });
}

// Cancel scheduled notification
function cancelScheduledNotification(notificationId) {
    const index = scheduledNotifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
        scheduledNotifications.splice(index, 1);
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduledNotifications));
    }
}

// Get all scheduled notifications
function getScheduledNotifications() {
    return scheduledNotifications;
}

// Check every minute
setInterval(checkScheduledNotifications, 60000);

// Check on load
document.addEventListener('DOMContentLoaded', checkScheduledNotifications);

// Make functions global
window.scheduleNotification = scheduleNotification;
window.cancelScheduledNotification = cancelScheduledNotification;
window.getScheduledNotifications = getScheduledNotifications;
