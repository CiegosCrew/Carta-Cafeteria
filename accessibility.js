// ========== ACCESSIBILITY & CUSTOMIZATION ==========

// Settings
let settings = JSON.parse(localStorage.getItem('userSettings')) || {
    fontSize: 'normal',
    contrast: 'normal',
    theme: 'auto',
    language: 'es'
};

// Apply settings on load
function applySettings() {
    // Font size
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    
    // Contrast
    document.documentElement.setAttribute('data-contrast', settings.contrast);
    
    // Theme
    applyTheme(settings.theme);
    
    // Language
    if (typeof changeLanguage === 'function') {
        changeLanguage(settings.language);
    }
}

// Font size
function setFontSize(size) {
    settings.fontSize = size;
    document.documentElement.setAttribute('data-font-size', size);
    saveSettings();
}

// Contrast
function setContrast(contrast) {
    settings.contrast = contrast;
    document.documentElement.setAttribute('data-contrast', contrast);
    saveSettings();
}

// Theme
function setTheme(theme) {
    settings.theme = theme;
    applyTheme(theme);
    saveSettings();
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const hour = new Date().getHours();
        const isDark = hour < 7 || hour > 19;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(settings));
}

// Show settings panel
function showSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    
    if (panel && overlay) {
        panel.classList.add('active');
        overlay.classList.add('active');
    }
}

function hideSettingsPanel() {
    const panel = document.getElementById('settingsPanel');
    const overlay = document.getElementById('settingsOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        hideSettingsPanel();
        
        // Close other modals
        const cartModal = document.getElementById('cartModal');
        if (cartModal && cartModal.classList.contains('active')) {
            toggleCart();
        }
        
        const shareMenu = document.getElementById('shareMenu');
        if (shareMenu && shareMenu.classList.contains('active')) {
            shareMenu.classList.remove('active');
            document.getElementById('shareOverlay').classList.remove('active');
        }
    }
    
    // Ctrl/Cmd + K to open settings
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSettingsPanel();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applySettings();
    
    // Update settings panel values
    updateSettingsPanelValues();
});

function updateSettingsPanelValues() {
    // Font size buttons
    document.querySelectorAll('[data-font-size-btn]').forEach(btn => {
        const size = btn.getAttribute('data-font-size-btn');
        if (size === settings.fontSize) {
            btn.classList.add('active');
        }
    });
    
    // Contrast buttons
    document.querySelectorAll('[data-contrast-btn]').forEach(btn => {
        const contrast = btn.getAttribute('data-contrast-btn');
        if (contrast === settings.contrast) {
            btn.classList.add('active');
        }
    });
    
    // Theme buttons
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        const theme = btn.getAttribute('data-theme-btn');
        if (theme === settings.theme) {
            btn.classList.add('active');
        }
    });
    
    // Language select
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.value = settings.language;
    }
}

// Custom themes
function setCustomTheme(themeName) {
    if (themeName === 'default') {
        document.documentElement.removeAttribute('data-custom-theme');
    } else {
        document.documentElement.setAttribute('data-custom-theme', themeName);
    }
    localStorage.setItem('customTheme', themeName);
    
    // Show confetti for colorful theme
    if (themeName === 'colorful' && typeof createConfetti === 'function') {
        createConfetti();
    }
}

// Apply custom theme on load
function applyCustomTheme() {
    const customTheme = localStorage.getItem('customTheme');
    if (customTheme && customTheme !== 'default') {
        document.documentElement.setAttribute('data-custom-theme', customTheme);
    }
}

// Make functions global
window.setFontSize = setFontSize;
window.setContrast = setContrast;
window.setTheme = setTheme;
window.setCustomTheme = setCustomTheme;
window.showSettingsPanel = showSettingsPanel;
window.hideSettingsPanel = hideSettingsPanel;

// Apply custom theme on load
document.addEventListener('DOMContentLoaded', applyCustomTheme);
