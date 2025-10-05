// ============================================
// CONFIGURACIÓN DEL FONDO 3D ANIMADO
// ============================================

class Background3D {
    constructor() {
        this.container = document.getElementById('canvas-3d-background');
        if (!this.container) return;

        this.init();
        this.createParticles();
        this.createWave();
        this.createLights();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Configuración de la escena
        this.scene = new THREE.Scene();
        
        // Cámara
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 30);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: window.innerWidth > 768 // Antialias solo en desktop
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Variables de interacción
        this.mouse = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
    }

    createParticles() {
        const particlesCount = window.innerWidth > 768 ? 5000 : 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Material con colores personalizables
        const material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0x00d4ff, // Color cian por defecto
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createWave() {
        const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });

        this.wave = new THREE.Mesh(geometry, material);
        this.wave.rotation.x = -Math.PI / 2;
        this.wave.position.y = -10;
        this.scene.add(this.wave);

        // Guardar posiciones originales
        this.waveOriginalPositions = this.wave.geometry.attributes.position.array.slice();
    }

    createLights() {
        // Luz ambiental
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Luces de colores
        this.light1 = new THREE.PointLight(0x00d4ff, 2, 100);
        this.light1.position.set(10, 10, 10);
        this.scene.add(this.light1);

        this.light2 = new THREE.PointLight(0xff006e, 2, 100);
        this.light2.position.set(-10, -10, -10);
        this.scene.add(this.light2);
    }

    setupEventListeners() {
        // Seguimiento del mouse
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Responsive
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Pausar cuando no está visible (optimización)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.clock.stop();
            } else {
                this.clock.start();
            }
        });
    }

    updateWave(time) {
        const positions = this.wave.geometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i += 3) {
            const x = this.waveOriginalPositions[i];
            const y = this.waveOriginalPositions[i + 1];
            
            positions[i + 2] = Math.sin(x * 0.3 + time) * 
                              Math.cos(y * 0.3 + time) * 2;
        }
        
        this.wave.geometry.attributes.position.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const elapsedTime = this.clock.getElapsedTime();

        // Rotar partículas
        this.particles.rotation.y = elapsedTime * 0.05;
        this.particles.rotation.x = elapsedTime * 0.03;

        // Actualizar onda
        this.updateWave(elapsedTime);

        // Interacción suave con el mouse
        this.target.x = this.mouse.x * 5;
        this.target.y = this.mouse.y * 5;

        this.particles.position.x += (this.target.x - this.particles.position.x) * 0.05;
        this.particles.position.y += (this.target.y - this.particles.position.y) * 0.05;

        // Animar luces
        this.light1.position.x = Math.sin(elapsedTime * 0.5) * 10;
        this.light1.position.z = Math.cos(elapsedTime * 0.5) * 10;

        this.light2.position.x = Math.cos(elapsedTime * 0.3) * 10;
        this.light2.position.z = Math.sin(elapsedTime * 0.3) * 10;

        // Renderizar
        this.renderer.render(this.scene, this.camera);
    }

    // Método para cambiar colores dinámicamente
    setColors(particleColor, light1Color, light2Color) {
        if (this.particles) {
            this.particles.material.color.setHex(particleColor);
        }
        if (this.light1) {
            this.light1.color.setHex(light1Color);
        }
        if (this.light2) {
            this.light2.color.setHex(light2Color);
        }
    }

    // Método para destruir (útil para SPA)
    destroy() {
        this.renderer.dispose();
        this.scene.clear();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.background3D = new Background3D();
    });
} else {
    window.background3D = new Background3D();
}

// Configuración de temas
document.addEventListener('DOMContentLoaded', () => {
    // Tema por defecto (Cibernético)
    if (window.background3D) {
        window.background3D.setColors(0x00d4ff, 0x00d4ff, 0xff006e);
    }
});

// Escuchar cambios de tema
document.addEventListener('themeChanged', (e) => {
    const theme = e.detail.theme;
    
    if (window.background3D) {
        if (theme === 'dark') {
            window.background3D.setColors(0x00d4ff, 0x00d4ff, 0xff006e);
        } else {
            window.background3D.setColors(0x667eea, 0x764ba2, 0xf093fb);
        }
    }
});
