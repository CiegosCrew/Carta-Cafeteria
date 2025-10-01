# 📋 PHOTOMARKET - Carta Digital

Sitio web estático para mostrar la carta de la cafetería PHOTOMARKET.

## 🚀 Ver en vivo

Una vez subido a GitHub, el sitio estará disponible en:
```
https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/
```

## 📁 Estructura del proyecto

```
Carta-Cafeteria/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js              # Lógica JavaScript
├── data/
│   └── menu.json       # Datos del menú (precios, productos)
└── README.md           # Este archivo
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

## 📱 Características

- ✅ Diseño responsive (se adapta a móviles y tablets)
- ✅ Buscador en tiempo real
- ✅ Precios editables desde JSON
- ✅ Animaciones suaves
- ✅ Tipografía elegante
- ✅ Optimizado para SEO

## 🛠️ Tecnologías

- HTML5
- CSS3 (con variables CSS)
- JavaScript (Vanilla)
- Google Fonts (Playfair Display + Lato)

## 📞 Soporte

Si necesitas ayuda para editar o personalizar el sitio, consulta este README o busca tutoriales de:
- Edición de archivos JSON
- Git y GitHub básico
- GitHub Pages

---

**Hecho con ☕ para PHOTOMARKET**
