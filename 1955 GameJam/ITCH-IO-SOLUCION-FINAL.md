# ✅ Solución Final para itch.io - TODO en la Raíz

## 🎯 Problema

itch.io **NO permite rutas con `../`** por restricciones de seguridad. Esto causaba error 403 en las imágenes.

## ✅ Solución Implementada

**Mover TODOS los archivos a la RAÍZ** para evitar cualquier uso de `../`.

## 📁 Estructura Final

```
1955 GameJam/
├── index.html          ✅ RAÍZ
├── game.html           ✅ RAÍZ
├── creditos.html       ✅ RAÍZ
├── base.css            ✅ RAÍZ (movido desde style/)
├── game.css            ✅ RAÍZ (movido desde style/)
├── menu.css            ✅ RAÍZ (movido desde style/)
├── game.js             ✅ RAÍZ (movido desde pages/)
├── intro.js            ✅ RAÍZ (movido desde pages/)
├── drag-adjust-helper.js ✅ RAÍZ (movido desde pages/)
├── images/             📁 Carpeta de recursos
├── sounds/             📁 Carpeta de recursos
└── fonts/              📁 Carpeta de recursos
```

## 🔧 Todas las Rutas Son Directas

### En archivos HTML (raíz):
```html
<!-- CSS -->
<link rel="stylesheet" href="base.css">
<link rel="stylesheet" href="game.css">

<!-- JS -->
<script src="game.js"></script>
<script src="intro.js"></script>

<!-- Enlaces -->
<a href="index.html">Volver</a>
<a href="game.html">Jugar</a>
```

### En archivos CSS (raíz):
```css
/* SIN ../ */
.mainMenu {
    background-image: url(images/main.png);
}

@font-face {
    src: url(fonts/Crafter.ttf);
}
```

### En archivos JS (raíz):
```javascript
// SIN ../
background: 'images/comedor.png'
image: 'images/characters/obrero.jpg'
new Audio('sounds/tango.mp3')
```

## 📦 Para Subir a itch.io

Comprime estos archivos en un ZIP:

```
✅ index.html
✅ game.html
✅ creditos.html
✅ base.css
✅ game.css
✅ menu.css
✅ game.js
✅ intro.js
✅ drag-adjust-helper.js
✅ images/ (carpeta completa)
✅ sounds/ (carpeta completa)
✅ fonts/ (carpeta completa)
```

### PowerShell:
```powershell
Compress-Archive -Path @(
    "index.html",
    "game.html",
    "creditos.html",
    "base.css",
    "game.css",
    "menu.css",
    "game.js",
    "intro.js",
    "drag-adjust-helper.js",
    "images",
    "sounds",
    "fonts"
) -DestinationPath "1955-itch.zip" -Force
```

## ✅ Ventajas de Esta Estructura

1. **Sin `../`**: itch.io no bloqueará ningún recurso
2. **Rutas simples**: Todo es directo desde la raíz
3. **Fácil debugging**: Estructura plana y clara
4. **Compatible**: Funciona local Y en itch.io

## 🚀 Subir a itch.io

1. Comprimir los archivos listados arriba
2. Subir a itch.io
3. Marcar como "This file will be played in the browser"
4. Seleccionar `index.html` como archivo principal
5. ¡Listo!

## 🎮 Verificación

Todo debe funcionar:
- ✅ Fondo del menú principal
- ✅ Fondo del juego (comedor)
- ✅ Imágenes de personajes
- ✅ Sonidos
- ✅ Fuente personalizada
- ✅ Créditos

---

**Fecha:** 16 de octubre de 2025  
**Versión:** FINAL - Todo en Raíz  
**Estado:** ✅ Listo para itch.io
