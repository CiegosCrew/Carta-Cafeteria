# 📋 PHOTOMARKET - Carta Digital Profesional

Sitio web completo con PWA, sistema de usuarios, chat en vivo, analytics, y más de 50 funcionalidades avanzadas para cafetería y servicios fotográficos.

## 🚀 Ver en vivo

**URL del sitio:** https://ciegoscrew.github.io/Carta-Cafeteria/

**Páginas disponibles:**
- 🏠 Cafetería: https://ciegoscrew.github.io/Carta-Cafeteria/
- 📸 Fotografía: https://ciegoscrew.github.io/Carta-Cafeteria/fotografia.html
- 📊 Dashboard Admin: https://ciegoscrew.github.io/Carta-Cafeteria/admin-dashboard.html
- 💳 Pagos: https://ciegoscrew.github.io/Carta-Cafeteria/mercadopago.html

**Contraseña Admin:** `123pataza`

## 📁 Estructura del proyecto

```
Carta-Cafeteria/
├── index.html                      # Página principal (Cafetería)
├── fotografia.html                 # Servicios fotográficos
├── admin-dashboard.html            # Dashboard administrativo
├── mercadopago.html               # Página de pagos
├── styles.css                     # Estilos principales
├── features.css                   # Estilos de funcionalidades
├── advanced-features.css          # Estilos avanzados
├── themes-extended.css            # Temas personalizados
├── user-features.css              # Estilos de usuario
├── admin-dashboard.css            # Estilos del dashboard
├── app.js                         # Lógica principal
├── features.js                    # Funcionalidades
├── fotografia.js                  # Lógica de fotografía
├── admin-dashboard.js             # Lógica del dashboard
├── translations.js                # Sistema multi-idioma
├── accessibility.js               # Accesibilidad y temas
├── user-system.js                 # Sistema de usuarios
├── advanced-features-extended.js  # Funcionalidades avanzadas
├── scheduled-notifications.js     # Notificaciones programadas
├── service-worker.js              # Service Worker PWA
├── manifest.json                  # Manifest PWA
├── robots.txt                     # SEO
├── sitemap.xml                    # Mapa del sitio
└── data/
    └── menu.json                  # Datos del menú
```

## ✏️ Cómo editar precios y productos

### Editar precios o productos existentes

1. Abre el archivo `data/menu.json`
2. Busca el producto que quieres modificar
3. Cambia el precio (solo números, sin símbolos)
4. Guarda el archivo
5. Sube los cambios a GitHub (ver sección "Actualizar en GitHub")

**Ejemplo:**
```json
{
  "nombre": "Cafe grande",
  "precio": 3500
}
```

Para cambiar el precio a $4000, modifica:
```json
{
  "nombre": "Cafe grande",
  "precio": 4000
}
```

### Agregar nuevos productos

Copia el formato de un producto existente y pégalo al final de la sección correspondiente (antes del `]`):

```json
{
  "nombre": "Producto nuevo",
  "descripcion": "Descripción opcional",
  "precio": 1500
}
```

**Importante:** No olvides agregar una coma (`,`) después del producto anterior.

### Eliminar productos

Simplemente borra todo el bloque del producto, incluyendo las llaves `{}` y la coma si es necesario.

## 🌐 Subir a GitHub

### Primera vez

1. Crea un repositorio en GitHub (puede ser público o privado)
2. En la carpeta del proyecto, abre Git Bash o PowerShell
3. Ejecuta:

```bash
git init
git add .
git commit -m "Primera versión de la carta digital"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/NOMBRE-REPO.git
git push -u origin main
```

### Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En "Source", selecciona **main** branch
5. Click en **Save**
6. Espera unos minutos y tu sitio estará en línea

### Actualizar en GitHub

Después de hacer cambios en `menu.json` u otros archivos:

```bash
git add .
git commit -m "Actualización de precios"
git push
```

Los cambios se verán en el sitio en 1-2 minutos.

## 🎨 Personalización

### Cambiar colores

Edita las variables en `styles.css` (líneas 10-16):

```css
:root {
    --color-primary: #e8d5c4;      /* Color de fondo principal */
    --color-secondary: #8fbc8f;    /* Color de títulos y acentos */
    --color-accent: #d4a5a5;       /* Color de hover */
    --color-dark: #2c2c2c;         /* Color de texto */
    --color-light: #f5f5f0;        /* Color de fondo claro */
}
```

### Cambiar información de contacto

Edita `data/menu.json`, sección `cafeteria`:

```json
"cafeteria": {
  "nombre": "PHOTOMARKET",
  "direccion": "Peltier 50, local 4",
  "horario": "Lunes a viernes de 8:30 a 16:00 h",
  "telefono": "+54 9 11 1234-5678",
  "instagram": "@photomarket",
  "whatsapp": "5491112345678"
}
```

## 🎯 Funcionalidades Completas (50+)

### 📱 PWA (Progressive Web App)
- ✅ Instalable como app nativa
- ✅ Funciona offline
- ✅ Notificaciones push reales
- ✅ Ícono en pantalla de inicio
- ✅ Service Worker configurado

### 🌐 Multi-idioma
- ✅ Español / English
- ✅ Traducción completa automática
- ✅ Guarda preferencia del usuario

### 🎨 Temas y Personalización
- ✅ 6 temas: Claro, Oscuro, Auto, Vintage, Minimalista, Colorido
- ✅ 3 tamaños de fuente
- ✅ Alto contraste para accesibilidad
- ✅ Modo oscuro con botón

### 👤 Sistema de Usuarios
- ✅ Registro y login
- ✅ Perfiles personales
- ✅ Sistema de puntos (1 punto cada $100)
- ✅ Niveles: Bronze, Silver, Gold, Platinum
- ✅ Historial de pedidos
- ✅ Direcciones guardadas

### ❤️ Favoritos
- ✅ Guardar productos favoritos
- ✅ Efecto de corazón animado
- ✅ "Pedir lo de siempre"

### 🛒 Carrito de Compras
- ✅ Agregar/quitar productos
- ✅ Ajustar cantidades
- ✅ Persistente en localStorage
- ✅ Enviar por WhatsApp
- ✅ Pagar online

### 💰 Upselling / Cross-selling
- ✅ Sugerencias automáticas
- ✅ Descuentos en combos
- ✅ Modal atractivo

### ⭐ Productos Destacados
- ✅ Badge "Más Vendido"
- ✅ Destacados configurables

### 📊 Analytics Completo
- ✅ Tracking de visitas
- ✅ Productos más agregados
- ✅ Horarios pico
- ✅ Gráficos con Chart.js (Pie, Bar, Line)
- ✅ Dashboard en tiempo real

### ⭐ Sistema de Reseñas
- ✅ Calificación con estrellas
- ✅ Promedio y distribución
- ✅ Admin puede responder
- ✅ Barras de rating

### 🔔 Notificaciones
- ✅ Push notifications
- ✅ Notificaciones programadas
- ✅ 4 tipos: Promo, Turno, Info, Urgente
- ✅ Historial completo

### 💬 Chat en Vivo
- ✅ Widget flotante
- ✅ Respuestas automáticas
- ✅ Botones rápidos
- ✅ Historial guardado

### 📍 Geolocalización
- ✅ Detecta ubicación del usuario
- ✅ Muestra distancia al local
- ✅ Mensajes personalizados

### 💳 Pagos Online
- ✅ Mercado Pago (QR y links)
- ✅ Transferencia bancaria
- ✅ Efectivo en local
- ✅ Resumen del pedido

### 🎬 Animaciones y Efectos
- ✅ Granos de café cayendo (partículas)
- ✅ Parallax scrolling
- ✅ Hover effects avanzados
- ✅ Scroll reveal
- ✅ Stagger animations
- ✅ Confetti y corazones

### 🔍 SEO Avanzado
- ✅ Meta tags completos
- ✅ Open Graph (Facebook)
- ✅ Twitter Cards
- ✅ Schema.org (Restaurant)
- ✅ robots.txt
- ✅ sitemap.xml

### ♿ Accesibilidad
- ✅ Navegación por teclado
- ✅ ARIA labels
- ✅ Alto contraste
- ✅ Tamaños de fuente ajustables

### 📱 Compartir en Redes
- ✅ WhatsApp, Facebook, Twitter, Telegram
- ✅ Email y copiar link
- ✅ Logos oficiales

### 🎯 Otras Funcionalidades
- ✅ Diseño responsive
- ✅ Buscador en tiempo real
- ✅ Modo kiosco
- ✅ Generador de JSON
- ✅ Panel admin protegido

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript ES6
- **Gráficos:** Chart.js
- **PWA:** Service Workers, Web Manifest
- **Fuentes:** Google Fonts (Playfair Display + Lato)
- **Hosting:** GitHub Pages
- **Control de versiones:** Git

## 📊 Estadísticas del Proyecto

- **Archivos totales:** 25+
- **Líneas de código:** ~7,000+
- **Funcionalidades:** 50+
- **Temas:** 6
- **Idiomas:** 2 (ES/EN)

## 📞 Soporte

Si necesitas ayuda para editar o personalizar el sitio, consulta este README o busca tutoriales de:
- Edición de archivos JSON
- Git y GitHub básico
- GitHub Pages

---

**Hecho con ☕ para PHOTOMARKET**
