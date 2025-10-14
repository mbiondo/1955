# 🎮 RE5ISTENCIA EN5ENADA - Guía de Desarrollo

> **¿Primera vez?** Lee el [Quick Start Guide](QUICK-START.md) para agregar tu primer hotspot en 5 minutos ⚡

## ⌨️ Atajos de Teclado Importantes

- **CTRL + SHIFT + A** = Activar/desactivar modo de edición de hotspots (hace visibles todas las áreas interactivas)
- **D** = Crear nuevo hotspot (solo en modo de edición)
- **F12** = Abrir DevTools del navegador para inspeccionar elementos

## 📋 Índice
1. [Introducción](#introducción)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Cómo Agregar Personajes](#cómo-agregar-personajes)
4. [Cómo Agregar Objetos](#cómo-agregar-objetos)
5. [Cómo Crear Hotspots (Áreas Interactivas)](#cómo-crear-hotspots-áreas-interactivas)
6. [Cómo Crear Nuevas Habitaciones/Niveles](#cómo-crear-nuevas-habitacionesniveles)
7. [Personalizar el Sistema de Diálogos](#personalizar-el-sistema-de-diálogos)
8. [Tips para Mejorar Niveles](#tips-para-mejorar-niveles)

---

## 🎯 Introducción

Este es un juego narrativo de tipo "point and click" ambientado en 1955. Los jugadores interactúan con diferentes objetos y personajes para avanzar en la historia.

---

## 📁 Estructura del Proyecto

```
1955 GameJam/
├── index.html              # Menú principal
├── pages/
│   ├── game.html          # Página principal del juego
│   ├── game.js            # Lógica del juego
│   ├── drag-adjust-helper.js  # Herramienta para posicionar hotspots
│   └── creditos.html      # Créditos
├── images/
│   ├── characters/        # Imágenes de personajes (150x200px recomendado)
│   ├── comedor.png       # Fondos de habitaciones
│   ├── dormitorio.png
│   └── patio.png
├── sounds/               # Archivos de audio (opcional)
├── style/
│   ├── base.css         # Estilos base
│   ├── game.css         # Estilos del juego
│   └── menu.css         # Estilos del menú
└── fonts/               # Fuentes personalizadas
```

---

## 👥 Cómo Agregar Personajes

### Paso 1: Preparar la imagen del personaje

1. Crear o conseguir una imagen del personaje
2. **Tamaño recomendado:** 150x200 píxeles (portrait vertical)
3. **Formato:** PNG con fondo transparente (preferible) o JPG
4. Guardar en: `images/characters/nombre-personaje.png`

### Paso 2: Definir el personaje en `game.js`

Abrir `pages/game.js` y agregar al objeto `characters`:

```javascript
const characters = {
    // ... personajes existentes ...
    
    // Nuevo personaje
    estudiante: {
        name: 'Estudiante',                    // Nombre que aparecerá en pantalla
        needs: ['libros', 'panfletos'],       // Items que necesita (pueden ser 1 o más)
        dialogue: '¿Tienes material para la campaña? Necesitamos informar a la gente.',
        correctResponse: 'Perfecto, esto ayudará a la causa.',
        info: 'Los estudiantes están organizando manifestaciones.',
        image: '/images/characters/estudiante.png'  // Ruta a la imagen
    },
    
    periodista: {
        name: 'Periodista',
        needs: ['cámara'],
        dialogue: 'Necesito documentar lo que está pasando. ¿Tienes una cámara?',
        correctResponse: 'Excelente, ahora podré mostrar la verdad.',
        info: 'La prensa libre es esencial en tiempos de crisis.',
        image: '/images/characters/periodista.png'
    }
};
```

### Paso 3: Agregar al orden de aparición

Modificar el array `characterSequence` para definir en qué orden aparecerán:

```javascript
const characterSequence = [
    'enfermera',
    'obrero', 
    'madre',
    'estudiante',    // ← Nuevo personaje
    'periodista'     // ← Otro personaje nuevo
];
```

**Nota:** Los personajes aparecerán en este orden cuando toquen a la puerta.

---

## 📦 Cómo Agregar Objetos

### Paso 1: Definir el contenido del objeto en `game.js`

Los objetos son contenedores que guardan items. Agregar al objeto `objectContents`:

```javascript
const objectContents = {
    'mesa-radio': ['herramientas', 'radio'],
    'mesa-papeles': ['papeles', 'pan de centeno'],
    'armario': ['alcohol', 'vendas'],
    'cuadro': ['mensaje secreto'],
    'puerta': [],
    
    // Nuevos objetos
    'estanteria': ['libros', 'panfletos'],           // ← Nuevo objeto
    'caja-fuerte': ['documentos', 'dinero'],         // ← Nuevo objeto
    'escritorio': ['cámara', 'pluma', 'cartas']      // ← Nuevo objeto
};
```

### Paso 2: Crear el hotspot en HTML

Ver sección [Cómo Crear Hotspots](#cómo-crear-hotspots-áreas-interactivas) más abajo.

---

## 🎯 Cómo Crear Hotspots (Áreas Interactivas)

Los hotspots son las áreas clickeables en la pantalla. Hay dos formas de crearlos:

### Método 1: Usando el Drag & Drop Helper (Recomendado para principiantes)

#### Paso 1: Activar el modo de edición
1. Abrir `pages/game.html` en el navegador
2. Presionar `CTRL + SHIFT + A` para activar el modo de edición
3. Los hotspots se volverán **visibles** con un borde rojo semi-transparente
4. Verás un indicador rojo en la esquina superior derecha con las instrucciones

#### Paso 2: Crear o ajustar hotspots
- **Crear nuevo:** Presionar `D` para crear un hotspot en el centro
- **Posicionar:** Arrastrar el hotspot con el mouse
- **Redimensionar:** Usar las **esquinas verdes** para cambiar el tamaño
- **CSS automático:** Al soltar, el CSS se copia automáticamente al portapapeles

#### Paso 3: Pegar y ajustar el CSS
1. Abrir `style/game.css`
2. Pegar el CSS copiado (CTRL+V) al final del archivo
3. **IMPORTANTE:** Cambiar el ID del CSS para que coincida con tu objeto

**Ejemplo de CSS copiado:**
```css
/* Hotspot-1 */
#hotspot-1.interactive-area {
    top: 25.5%;
    left: 30.2%;
    width: 12.5%;
    height: 18.3%;
}
```

**Después de ajustar el nombre:**
```css
/* Estantería */
#estanteria.interactive-area {
    top: 25.5%;
    left: 30.2%;
    width: 12.5%;
    height: 18.3%;
}
```

#### Paso 4: Agregar el hotspot al HTML
Ahora agregar en `pages/game.html` con el **mismo ID**:
```html
<div class="interactive-area" 
     id="estanteria" 
     data-object="estanteria" 
     onclick="clickObject('estanteria')" 
     title="Estantería">
</div>
```

**Nota crítica:** El `id` en el CSS y el HTML **deben ser idénticos** para que funcione.

#### Paso 5: Desactivar modo de edición
- Presionar `CTRL + SHIFT + A` nuevamente para ocultar los hotspots y volver al juego normal

### Método 2: Editar CSS directamente (Para usuarios avanzados)

Abrir `style/game.css` y agregar tu hotspot con ID específico:

```css
/* Ejemplo: Agregar una estantería en el comedor */
#estanteria {
    top: 15%;           /* Distancia desde arriba (0-100%) */
    left: 60%;          /* Distancia desde la izquierda (0-100%) */
    width: 180px;       /* Ancho del área clickeable */
    height: 220px;      /* Alto del área clickeable */
}

/* Ejemplo: Agregar un escritorio */
#escritorio {
    top: 45%;
    left: 10%;
    width: 200px;
    height: 150px;
}

/* Ejemplo: Caja fuerte en la pared */
#caja-fuerte {
    top: 25%;
    left: 75%;
    width: 80px;
    height: 80px;
}
```

### Paso 3: Agregar el hotspot al HTML

Editar `pages/game.html` dentro de la sección correspondiente (ej: `<section id="comedor">`):

```html
<section id="comedor" class="comedor">
    <!-- Hotspots existentes... -->
    
    <!-- Nuevos hotspots -->
    <div class="interactive-area" 
         id="estanteria" 
         data-object="estanteria" 
         onclick="clickObject('estanteria')" 
         title="Estantería">
    </div>
    
    <div class="interactive-area" 
         id="escritorio" 
         data-object="escritorio" 
         onclick="clickObject('escritorio')" 
         title="Escritorio">
    </div>
    
    <div class="interactive-area" 
         id="caja-fuerte" 
         data-object="caja-fuerte" 
         onclick="clickObject('caja-fuerte')" 
         title="Caja Fuerte">
    </div>
</section>
```

**Atributos importantes:**
- `id`: Identificador único (**debe coincidir exactamente con el ID del CSS**)
- `data-object`: Identificador del objeto (debe coincidir con `objectContents`)
- `onclick`: Función que se ejecuta al hacer clic
- `title`: Texto que aparece al pasar el mouse (tooltip)

---

## 🔄 Flujo de Trabajo Completo (Ejemplo Práctico)

Vamos a agregar una **estantería** al comedor paso a paso:

### 1️⃣ Definir el contenido del objeto
En `pages/game.js`:
```javascript
const objectContents = {
    // ... objetos existentes
    'estanteria': ['libros', 'panfletos', 'lámpara']  // ← Agregar esto
};
```

### 2️⃣ Crear y posicionar el hotspot visualmente
1. Abrir `pages/game.html` en el navegador
2. Presionar `CTRL + SHIFT + A` (modo edición activado)
3. Presionar `D` (crear nuevo hotspot)
4. Arrastrar el hotspot a donde está la estantería en la imagen
5. Usar las esquinas verdes para ajustar el tamaño
6. Al soltar, el CSS se copia automáticamente ✓

### 3️⃣ Pegar y renombrar en el CSS
Abrir `style/game.css` y pegar al final:

**CSS copiado (automático):**
```css
/* Hotspot-3 */
#hotspot-3.interactive-area {
    top: 15.5%;
    left: 60.2%;
    width: 15.0%;
    height: 25.0%;
}
```

**Renombrar a tu objeto:**
```css
/* Estantería del comedor */
#estanteria.interactive-area {
    top: 15.5%;
    left: 60.2%;
    width: 15.0%;
    height: 25.0%;
}
```

### 4️⃣ Agregar el elemento HTML
En `pages/game.html`, dentro de `<section id="comedor">`:
```html
<div class="interactive-area" 
     id="estanteria" 
     data-object="estanteria" 
     onclick="clickObject('estanteria')" 
     title="Estantería">
</div>
```

### 5️⃣ Probar
1. Recargar la página (F5)
2. Presionar `CTRL + SHIFT + A` para salir del modo edición
3. Hacer clic en la estantería
4. Debe mostrar: "Objeto: estanteria contiene: libros, panfletos, lámpara"

✅ **¡Listo!** Has agregado un nuevo hotspot funcional.

---

---

## ⚠️ Errores Comunes y Soluciones

### ❌ Error: "El hotspot no es clickeable"
**Causa:** El ID del CSS no coincide con el ID del HTML
```css
/* En game.css */
#mi-objeto.interactive-area { ... }  ← ID: "mi-objeto"
```
```html
<!-- En game.html -->
<div id="miObjeto" ...>  ← ID: "miObjeto" (diferente!)
```
**Solución:** Asegurar que ambos IDs sean **idénticos**:
```html
<div id="mi-objeto" ...>  ✓ Ahora coinciden
```

---

### ❌ Error: "El objeto no aparece"
**Causas posibles:**
1. El CSS tiene un typo en el ID
2. El archivo CSS no está guardado
3. La página no se recargó (F5)

**Solución:** Verificar en orden:
- ✓ CSS guardado
- ✓ HTML guardado
- ✓ Recargar página (F5 o CTRL+F5)
- ✓ Abrir consola (F12) y buscar errores

---

### ❌ Error: "El hotspot no tiene los items esperados"
**Causa:** El `data-object` no coincide con la clave en `objectContents`
```javascript
// En game.js
const objectContents = {
    'estanteria': ['libros']  ← Clave: "estanteria"
};
```
```html
<!-- En game.html -->
<div data-object="estante" ...>  ← "estante" (diferente!)
```
**Solución:** Usar el mismo nombre:
```html
<div data-object="estanteria" ...>  ✓ Ahora coinciden
```

---

### ❌ Error: "El CSS copiado tiene porcentajes raros"
**Esto es normal.** Los porcentajes se calculan relativamente al contenedor y pueden tener decimales:
```css
top: 25.734567%; /* Normal */
```
**Opcional:** Redondear a 1 decimal para que sea más legible:
```css
top: 25.7%; /* Más limpio */
```

---

### ❌ Error: "No puedo crear hotspots con la tecla D"
**Causa:** El modo de edición no está activo
**Solución:** 
1. Presionar `CTRL + SHIFT + A` primero
2. Verificar que aparezca el indicador rojo en la esquina
3. Ahora presionar `D`

---

### ❌ Error: "Los handles verdes no aparecen"
**Causa:** El modo de edición está desactivado
**Solución:** Presionar `CTRL + SHIFT + A` para activar el modo

---

## 🏠 Cómo Crear Nuevas Habitaciones/Niveles

### Paso 1: Preparar la imagen de fondo

1. Crear o conseguir una imagen de la habitación
2. **Tamaño recomendado:** 1920x1080px (Full HD)
3. **Formato:** PNG o JPG
4. Guardar en: `images/nombre-habitacion.png`

### Paso 2: Definir la habitación en `game.js`

Agregar al objeto `rooms`:

```javascript
const rooms = {
    comedor: {
        objects: ['puerta', 'armario', 'mesa-radio', 'mesa-papeles', 'cuadro'],
        background: '/images/comedor.png'
    },
    
    // Nueva habitación
    biblioteca: {
        objects: ['estanteria', 'escritorio', 'puerta-biblioteca', 'ventana'],
        background: '/images/biblioteca.png'
    },
    
    sotano: {
        objects: ['caja-fuerte', 'mesa-trabajo', 'escaleras'],
        background: '/images/sotano.png'
    }
};
```

### Paso 3: Crear la sección HTML

Agregar en `pages/game.html` después de las secciones existentes:

```html
<!-- Nueva habitación: Biblioteca -->
<section id="biblioteca" class="biblioteca">
    <div class="interactive-area" 
         id="estanteria" 
         data-object="estanteria" 
         onclick="clickObject('estanteria')" 
         title="Estantería">
    </div>
    
    <div class="interactive-area" 
         id="escritorio" 
         data-object="escritorio" 
         onclick="clickObject('escritorio')" 
         title="Escritorio">
    </div>
    
    <div class="interactive-area" 
         id="puerta-biblioteca" 
         data-object="puerta-biblioteca" 
         onclick="clickObject('puerta-biblioteca')" 
         title="Puerta">
    </div>
    
    <a href="../index.html" class="buttonMenu">Volver al Menú</a>
</section>
```

### Paso 4: Agregar estilos CSS

En `style/game.css`, agregar:

```css
/* Nueva habitación */
.biblioteca {
    display: none;
    position: absolute;
    top: 0px;
    left: 0px;
    background-image: url(/images/biblioteca.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
}

/* Hotspots específicos de la biblioteca */
#estanteria {
    top: 20%;
    left: 10%;
    width: 200px;
    height: 300px;
}

#escritorio {
    top: 50%;
    left: 60%;
    width: 250px;
    height: 180px;
}

#puerta-biblioteca {
    top: 30%;
    left: 85%;
    width: 120px;
    height: 250px;
}
```

### Paso 5: Agregar navegación entre habitaciones (Opcional)

Modificar la función `changeRoom` en `game.js`:

```javascript
function changeRoom(direction) {
    const roomOrder = ['comedor', 'dormitorio', 'patio', 'biblioteca', 'sotano'];
    let currentIndex = roomOrder.indexOf(currentRoom);
    if (direction === 'next' && currentIndex < roomOrder.length - 1) {
        showRoom(roomOrder[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
        showRoom(roomOrder[currentIndex - 1]);
    }
}
```

---

## 💬 Personalizar el Sistema de Diálogos

### Cambiar el tiempo de espera entre personajes

En `game.js`, buscar la función `respondCorrect()`:

```javascript
setTimeout(() => {
    doorKnock();
}, 5000); // ← Cambiar este valor (en milisegundos)
          // 5000 = 5 segundos
          // 10000 = 10 segundos
```

### Cambiar el tiempo del temporizador

Modificar en `game.js`:

```javascript
let gameState = {
    inventory: [],
    dialogues: [],
    timeLeft: 60, // ← Cambiar aquí (en segundos)
    score: 0
};
```

### Agregar más contexto histórico

Cada personaje tiene una propiedad `info` que muestra información histórica:

```javascript
estudiante: {
    name: 'Estudiante',
    needs: ['libros'],
    dialogue: '¿Tienes material educativo?',
    correctResponse: 'Gracias por tu ayuda.',
    info: 'En 1955, los estudiantes jugaron un papel crucial en la resistencia. ' +
          'Organizaron manifestaciones y distribuyeron información prohibida.',
    image: '/images/characters/estudiante.png'
}
```

---

## 🎨 Tips para Mejorar Niveles

### 1. **Diseño Visual**
- Usar imágenes de alta calidad (mínimo 1920x1080px para fondos)
- Mantener un estilo visual coherente
- Agregar detalles visuales que cuenten la historia

### 2. **Balance de Dificultad**
- No hacer hotspots muy pequeños (mínimo 80x80px)
- Colocar objetos importantes en lugares visibles
- Agregar pistas visuales sutiles (luz, contraste)

### 3. **Narrativa**
- Cada personaje debe tener necesidades lógicas
- Los objetos deben tener sentido en el contexto histórico
- Los diálogos deben ser cortos y claros

### 4. **Testing de Hotspots**

**Método Rápido (Recomendado):**
```
1. Abrir game.html en el navegador
2. Presionar CTRL + SHIFT + A
3. Ver todos los hotspots con bordes rojos visibles
4. Verificar que estén bien posicionados
5. Presionar CTRL + SHIFT + A nuevamente para volver al modo normal
```

**Método Alternativo (CSS):**
```css
// Agregar temporalmente en game.css para ver todos los hotspots:
.interactive-area {
    background: rgba(255, 0, 0, 0.3) !important; /* Rojo semi-transparente */
    border: 2px solid red !important;
}
// Recordar quitar esto cuando termines de ajustar
```

### 5. **Optimización**
- Comprimir imágenes (usar herramientas como TinyPNG)
- Usar formatos WebP cuando sea posible
- Limitar el número de hotspots por habitación (máximo 8-10)

### 6. **Accesibilidad**
- Siempre agregar el atributo `title` a los hotspots
- Usar descripciones claras
- Mantener buen contraste en textos

---

## 🔧 Herramientas Útiles

### Drag & Drop Helper

Ya incluido en el proyecto (`drag-adjust-helper.js`). Permite:
- **CTRL + SHIFT + A:** Activar/desactivar modo de edición (hace visibles todos los hotspots)
- **Tecla D:** Crear nuevo hotspot
- **Mouse:** Arrastrar y posicionar
- **Esquinas verdes:** Redimensionar
- **Copiado automático:** Al soltar cualquier cambio, el CSS se copia al portapapeles

**Flujo recomendado:**
1. `CTRL + SHIFT + A` → Activar modo
2. `D` → Crear hotspot (o ajustar uno existente)
3. Arrastrar y redimensionar
4. Al soltar → CSS copiado automáticamente ✓
5. `CTRL + V` en `game.css` → Pegar
6. Renombrar el ID al nombre real del objeto
7. Agregar el elemento en `game.html` con el mismo ID

**Tip:** Siempre activa el modo de edición con `CTRL + SHIFT + A` primero para ver dónde están los hotspots existentes.

### Consola del Navegador (F12)

Útil para:
- Ver errores de JavaScript
- Inspeccionar elementos
- Probar código en tiempo real

### Ejemplo de debugging:

```javascript
// Agregar en game.js para ver qué objetos se clickean:
function clickObject(objectId) {
    console.log('Clicked:', objectId);
    console.log('Contents:', objectContents[objectId]);
    // ... resto del código
}
```

---

## 📝 Checklist para Agregar Contenido

### ✅ Nuevo Personaje
- [ ] Imagen preparada (150x200px, en `/images/characters/`)
- [ ] Agregado a `characters` en `game.js`
- [ ] Agregado a `characterSequence` en `game.js`
- [ ] Items necesarios agregados a `objectContents`
- [ ] Testeado en el juego

### ✅ Nuevo Objeto
- [ ] Agregado a `objectContents` en `game.js`
- [ ] Hotspot creado/posicionado con `CTRL+SHIFT+A` y tecla `D`
- [ ] CSS copiado automáticamente al portapapeles
- [ ] CSS pegado en `game.css`
- [ ] **ID renombrado** en el CSS (de `#hotspot-X` a `#nombre-objeto`)
- [ ] Elemento HTML agregado en `game.html` con el **mismo ID**
- [ ] Verificado que `id`, `data-object` y clave de `objectContents` coincidan
- [ ] Testeado que sea clickeable y muestre los items correctos

### ✅ Nueva Habitación
- [ ] Imagen de fondo preparada (1920x1080px)
- [ ] Agregada a `rooms` en `game.js`
- [ ] Sección HTML creada en `game.html`
- [ ] Estilos CSS agregados en `game.css`
- [ ] Hotspots posicionados
- [ ] Navegación configurada
- [ ] Testeado cambio de habitación

---

## 📊 Diagrama de Relaciones

Entender cómo se relacionan los archivos es clave:

```
┌─────────────────────────────────────────────────────────────┐
│                    AGREGAR UN OBJETO                        │
└─────────────────────────────────────────────────────────────┘

1. pages/game.js (Definir contenido)
   ↓
   const objectContents = {
       'estanteria': ['libros', 'panfletos']  ← Nombre clave
   };

2. Browser + CTRL+SHIFT+A + D (Crear hotspot visualmente)
   ↓
   [Arrastrar y redimensionar]
   ↓
   CSS copiado automáticamente al portapapeles ✓

3. style/game.css (Pegar y renombrar)
   ↓
   #hotspot-3 { ... }          ← CSS copiado
   ↓ (RENOMBRAR)
   #estanteria { ... }         ← Mismo nombre que la clave

4. pages/game.html (Agregar elemento)
   ↓
   <div id="estanteria"        ← Mismo nombre que CSS
        data-object="estanteria"  ← Mismo nombre que objectContents
        onclick="clickObject('estanteria')"
        title="Estantería">
   </div>

✓ IMPORTANTE: Los 3 nombres deben coincidir:
  - objectContents['estanteria']
  - CSS: #estanteria
  - HTML: id="estanteria" data-object="estanteria"
```

---

## 🤝 Contribuir

¡Todos pueden mejorar este juego! Solo sigue estos pasos:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-habitacion`)
3. **Commit** tus cambios (`git commit -m 'Agregada biblioteca con 3 hotspots'`)
4. **Push** a la rama (`git push origin feature/nueva-habitacion`)
5. Abre un **Pull Request**

---

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa este README completo
2. Usa la consola del navegador (F12) para ver errores
3. Verifica que todos los archivos estén en las rutas correctas
4. Abre un issue en GitHub con capturas de pantalla

---

## 📜 Licencia

Este proyecto es de código abierto. Consulta el archivo LICENSE para más detalles.

---

**¡Diviértete creando y mejorando el juego!** 🎮✨
