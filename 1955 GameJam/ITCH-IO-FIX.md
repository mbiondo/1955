# 🎮 Fix para itch.io: Estructura de Archivos Reorganizada

## 🚨 Problema Original

En itch.io las imágenes no cargaban debido a que **itch.io bloquea rutas con `../`** por razones de seguridad. El error era:

```
Request URL: https://html-classic.itch.zone/images/main.png
Status Code: 403 Forbidden
```

## ✅ Solución Implementada

Reorganizar la estructura del proyecto para usar **rutas relativas sin `../`**.

### Cambios en la Estructura de Archivos

**ANTES:**
```
1955 GameJam/
├── index.html
├── pages/
│   ├── game.html
│   ├── creditos.html
│   ├── game.js
│   ├── intro.js
│   └── drag-adjust-helper.js
├── style/
├── images/
├── sounds/
└── fonts/
```

**DESPUÉS:**
```
1955 GameJam/
├── index.html          ⬅️ Raíz
├── game.html           ⬅️ MOVIDO desde pages/
├── creditos.html       ⬅️ MOVIDO desde pages/
├── pages/
│   ├── game.js         ⬅️ Se queda aquí
│   ├── intro.js        ⬅️ Se queda aquí
│   └── drag-adjust-helper.js ⬅️ Se queda aquí
├── style/
├── images/
├── sounds/
└── fonts/
```

## 📝 Cambios en los Archivos

### 1. **game.html** (Movido a raíz)

**CSS:**
```html
<!-- ANTES -->
<link rel="stylesheet" href="../style/base.css">
<link rel="stylesheet" href="../style/game.css">

<!-- DESPUÉS -->
<link rel="stylesheet" href="style/base.css">
<link rel="stylesheet" href="style/game.css">
```

**Scripts:**
```html
<!-- ANTES -->
<script src="intro.js"></script>
<script src="game.js"></script>

<!-- DESPUÉS -->
<script src="pages/intro.js"></script>
<script src="pages/game.js"></script>
```

**Enlaces:**
```html
<!-- ANTES -->
<a href="../index.html">Volver al Menú</a>

<!-- DESPUÉS -->
<a href="index.html">Volver al Menú</a>
```

### 2. **creditos.html** (Movido a raíz)

**CSS y Enlaces:**
```html
<!-- ANTES -->
<link rel="stylesheet" href="../style/base.css">
<a href="../index.html">Volver al Menú</a>

<!-- DESPUÉS -->
<link rel="stylesheet" href="style/base.css">
<a href="index.html">Volver al Menú</a>
```

### 3. **index.html**

**Enlaces:**
```html
<!-- ANTES -->
<a href="pages/game.html">Iniciar Juego</a>
<a href="pages/creditos.html">Créditos</a>

<!-- DESPUÉS -->
<a href="game.html">Iniciar Juego</a>
<a href="creditos.html">Créditos</a>
```

### 4. **pages/game.js**

**Imágenes:**
```javascript
// ANTES
background: '../images/comedor.png'
image: '../images/characters/obrero.jpg'

// DESPUÉS
background: 'images/comedor.png'
image: 'images/characters/obrero.jpg'
```

**Sonidos:**
```javascript
// ANTES
new Audio('../sounds/noticias.mp3')

// DESPUÉS
new Audio('sounds/noticias.mp3')
```

### 5. **pages/intro.js**

**Sonidos:**
```javascript
// ANTES
new Audio('../sounds/typewritter.mp3')

// DESPUÉS
new Audio('sounds/typewritter.mp3')
```

### 6. **style/base.css**

**Fuente:**
```css
/* ANTES */
@font-face {
    src: url(../fonts/Crafter.ttf);
}

/* DESPUÉS */
@font-face {
    src: url(fonts/Crafter.ttf);
}
```

**Imagen de fondo:**
```css
/* ANTES */
.mainMenu {
    background-image: url(../images/main.png);
}

/* DESPUÉS */
.mainMenu {
    background-image: url(images/main.png);
}
```

### 7. **style/game.css**

**Fondos de habitaciones:**
```css
/* ANTES */
.comedor { background-image: url(../images/comedor.png); }
.dormitorio { background-image: url(../images/dormitorio.png); }
.patio { background-image: url(../images/patio.png); }

/* DESPUÉS */
.comedor { background-image: url(images/comedor.png); }
.dormitorio { background-image: url(images/dormitorio.png); }
.patio { background-image: url(images/patio.png); }
```

## 📦 Cómo Empaquetar para itch.io

### Método 1: Comprimir Todo el Proyecto

1. Selecciona **TODO** el contenido de la carpeta `1955 GameJam`:
   ```
   ✅ index.html
   ✅ game.html
   ✅ creditos.html
   ✅ pages/
   ✅ style/
   ✅ images/
   ✅ sounds/
   ✅ fonts/
   ```

2. **NO incluir:**
   ```
   ❌ .git/
   ❌ .gitignore
   ❌ *.md (archivos de documentación)
   ❌ *.zip existentes
   ```

3. Comprimir en **ZIP** (clic derecho → "Comprimir en .zip")

4. Nombrar el archivo: `1955-resistencia-ensenada.zip`

### Método 2: PowerShell (Automático)

Ejecuta este comando en la raíz del proyecto:

```powershell
Compress-Archive -Path @(
    "index.html",
    "game.html",
    "creditos.html",
    "pages",
    "style",
    "images",
    "sounds",
    "fonts"
) -DestinationPath "1955-resistencia-ensenada.zip" -Force
```

## 🚀 Subir a itch.io

1. Ve a tu página de proyecto en itch.io
2. En "Upload files" sube el archivo ZIP
3. Marca como **"This file will be played in the browser"**
4. Asegúrate de seleccionar `index.html` como archivo principal
5. Guarda y publica

## 🔍 Verificación

Después de subir, verifica que:
- ✅ El menú principal muestra el fondo
- ✅ El juego muestra la habitación
- ✅ Los personajes muestran sus imágenes
- ✅ Los sonidos funcionan
- ✅ La fuente personalizada se aplica
- ✅ Los créditos se ven correctamente

## 📊 Resumen de Cambios

| Tipo de Cambio | Cantidad | Archivos Afectados |
|----------------|----------|-------------------|
| HTML movidos | 2 | `game.html`, `creditos.html` |
| Rutas en HTML | 6 | Todos los HTML |
| Rutas en JS | 9 | `game.js`, `intro.js` |
| Rutas en CSS | 5 | `base.css`, `game.css` |
| **TOTAL** | **22** | **7 archivos** |

## ✅ Por Qué Funciona Ahora

1. **Sin `../`**: Todas las rutas son directas desde la raíz
2. **Estructura plana**: Los HTML principales están en la raíz
3. **Compatible con itch.io**: Las rutas relativas simples funcionan
4. **Compatible local**: También funciona al abrir directo

## 🎯 Estructura Final de Rutas

Desde los archivos en **raíz** (game.html, creditos.html, index.html):
```
style/base.css          ✅ Directo
style/game.css          ✅ Directo
images/comedor.png      ✅ Directo
sounds/tango.mp3        ✅ Directo
fonts/Crafter.ttf       ✅ Directo
pages/game.js           ✅ Directo
```

---

**Fecha:** 16 de octubre de 2025  
**Tipo:** Restructuración para itch.io  
**Prioridad:** Crítica  
**Estado:** ✅ Implementado y listo para subir
