# ⚡ Quick Start - Agregar un Hotspot en 5 Minutos

## 🎯 Objetivo
Agregar una **estantería** clickeable al comedor que contenga libros.

> **💡 Nota:** Al hacer clic en "Iniciar Juego" desde el menú principal, verás una intro narrativa. Presiona **ESPACIO** para saltarla durante el desarrollo.
>
> **🔧 Para forzar ver la intro:** Agrega `?forceIntro=true` a la URL del juego
> **⏭️ Para saltar la intro:** Agrega `?skipIntro=true` a la URL del juego

---

## 📝 Paso a Paso

### 1️⃣ Definir el contenido (30 segundos)
Abrir `pages/game.js` y agregar:
```javascript
const objectContents = {
    // ... objetos existentes ...
    'estanteria': ['libros', 'panfletos']  // ← Agregar esta línea
};
```
💾 Guardar

---

### 2️⃣ Crear el hotspot visualmente (2 minutos)
1. Abrir `pages/game.html` en el navegador
2. Presionar `CTRL + SHIFT + A` 
   - ✓ Verás un indicador rojo en la esquina
   - ✓ Los hotspots existentes se vuelven visibles
3. Presionar `D`
   - ✓ Aparece un nuevo hotspot rojo en el centro
4. **Arrastrar** el hotspot a donde está la estantería en la imagen
5. **Redimensionar** usando las esquinas verdes
6. Al soltar → **CSS copiado automáticamente** ✓

---

### 3️⃣ Pegar y renombrar CSS (1 minuto)
Abrir `style/game.css`, ir al final y pegar (CTRL+V):

```css
/* Hotspot-1 */
#hotspot-1.interactive-area {
    top: 15.5%;
    left: 60.2%;
    width: 15.0%;
    height: 25.0%;
}
```

**Cambiar `hotspot-1` por `estanteria`:**
```css
/* Estantería del comedor */
#estanteria.interactive-area {
    top: 15.5%;
    left: 60.2%;
    width: 15.0%;
    height: 25.0%;
}
```
💾 Guardar

---

### 4️⃣ Agregar elemento HTML (1 minuto)
Abrir `pages/game.html`, buscar `<section id="comedor">` y agregar:

```html
<div class="interactive-area" 
     id="estanteria" 
     data-object="estanteria" 
     onclick="clickObject('estanteria')" 
     title="Estantería">
</div>
```
💾 Guardar

---

### 5️⃣ Probar (30 segundos)
1. Recargar la página (F5)
2. Presionar `CTRL + SHIFT + A` para salir del modo edición
3. Hacer clic en la estantería
4. Debe mostrar: **"Objeto: estanteria contiene: libros, panfletos"**

---

## ✅ Checklist Rápido

- [ ] `game.js` → Agregar a `objectContents`
- [ ] Browser → `CTRL+SHIFT+A` + `D` + Arrastrar + Redimensionar
- [ ] `game.css` → Pegar CSS y renombrar ID
- [ ] `game.html` → Agregar `<div>` con el mismo ID
- [ ] Recargar y probar

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| No es clickeable | IDs no coinciden | Verificar que `#estanteria` en CSS = `id="estanteria"` en HTML |
| No muestra items | `data-object` incorrecto | Verificar que `data-object="estanteria"` = clave en `objectContents` |
| No aparece | Archivo no guardado | Guardar todo y recargar (F5) |

---

## 🎓 Siguiente Nivel

Ya sabes lo básico! Ahora puedes:
- [Agregar personajes](README.md#cómo-agregar-personajes)
- [Crear nuevas habitaciones](README.md#cómo-crear-nuevas-habitacionesniveles)
- [Personalizar diálogos](README.md#personalizar-el-sistema-de-diálogos)

Ver el [README completo](README.md) para más detalles.
