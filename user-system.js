// ========== PARTICLE EFFECTS ==========
// Note: User authentication is in auth.js, user menu is in features.js

function createConfetti() {
    const colors = ['#ff6b9d', '#c06c84', '#f67280', '#ffeaa7'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// ========== PARTICLES BACKGROUND ==========

function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    container.id = 'particlesContainer';
    
    // Coffee particles (granos de café cayendo)
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'coffee-bean-particle';
        particle.textContent = '☕'; // Coffee cup emoji
        particle.style.position = 'absolute';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '-50px';
        particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.opacity = '0.3';
        particle.style.animation = 'fallDown ' + (Math.random() * 10 + 15) + 's infinite linear';
        container.appendChild(particle);
    }
    
    document.body.insertBefore(container, document.body.firstChild);
}

function toggleParticles(enabled) {
    const container = document.getElementById('particlesContainer');
    if (container) {
        container.style.display = enabled ? 'block' : 'none';
    }
}

// ========== INITIALIZE ==========

// Comentada la inicialización automática de partículas
// document.addEventListener('DOMContentLoaded', () => {
//     initParticles();
// });

// Make functions global
window.createConfetti = createConfetti;
// window.toggleParticles = toggleParticles; // No se exporta para evitar su uso
