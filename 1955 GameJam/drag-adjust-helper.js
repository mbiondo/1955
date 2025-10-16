// 🎯 Helper para ajustar posiciones con Drag & Drop
// Modo de ajuste visual para áreas interactivas

let adjustMode = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let selectedElement = null; // Para rotación

// Activar/Desactivar modo de ajuste
function toggleAdjustMode() {
    adjustMode = !adjustMode;
    const areas = document.querySelectorAll('.interactive-area');
    
    if (adjustMode) {
        console.log('%c🎨 MODO AJUSTE ACTIVADO', 'color: #00ff00; font-size: 16px; font-weight: bold');
        console.log('%c- Arrastrá las áreas para posicionarlas', 'color: #00ffff; font-size: 12px');
        console.log('%c- Usá las esquinas verdes para redimensionar', 'color: #00ffff; font-size: 12px');
        console.log('%c- Click en un área + Q/E para rotar (o usa la rueda del mouse)', 'color: #00ffff; font-size: 12px');
        console.log('%c- Presioná D para crear nuevo hotspot', 'color: #00ffff; font-size: 12px');
        console.log('%c- Al soltar, se copiarán los estilos al portapapeles', 'color: #00ffff; font-size: 12px');
        console.log('%c- Presioná ESC para salir', 'color: #ffff00; font-size: 12px');
        
        areas.forEach(area => {
            area.style.border = '3px dashed red';
            area.style.background = 'rgba(255, 0, 0, 0.2)';
            area.draggable = true;
            
            // Guardar rotación actual si existe
            if (!area.dataset.rotation) {
                area.dataset.rotation = '0';
            }
            
            // Deshabilitar click normal pero permitir selección
            area.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                selectElement(area);
            };
            
            // Rotación con rueda del mouse
            area.addEventListener('wheel', handleWheel, { passive: false });
        });
        
        // Agregar indicador visual
        showAdjustModeIndicator();
    } else {
        console.log('%c❌ MODO AJUSTE DESACTIVADO', 'color: #ff0000; font-size: 16px; font-weight: bold');
        
        areas.forEach(area => {
            area.style.border = '2px solid transparent';
            area.style.background = 'transparent';
            area.draggable = false;
            
            // Restaurar click normal
            const objectId = area.getAttribute('data-object');
            area.onclick = () => clickObject(objectId);
            
            // Remover listener de wheel
            area.removeEventListener('wheel', handleWheel);
        });
        
        selectedElement = null;
        removeAdjustModeIndicator();
        removeRotationIndicator();
    }
}

// Indicador visual del modo ajuste
function showAdjustModeIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'adjust-mode-indicator';
    indicator.innerHTML = `
        <div style="
            position: fixed;
            top: 50px;
            right: 20px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: monospace;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        ">
            <div style="font-weight: bold; margin-bottom: 5px;">🎨 MODO AJUSTE</div>
            <div style="font-size: 12px;">• Arrastrá las áreas rojas</div>
            <div style="font-size: 12px;">• Usa las esquinas verdes para redimensionar</div>
            <div style="font-size: 12px;">• <b>Q</b>/<b>E</b> o rueda del mouse para rotar</div>
            <div style="font-size: 12px;">• Presioná <b>D</b> para crear nuevo hotspot</div>
            <div style="font-size: 12px;">• <b>R</b> para resetear rotación</div>
            <div style="font-size: 12px; color: #ffff00; margin-top: 5px;">💡 Objetos rotados: arrastra desde el centro</div>
            <div style="font-size: 12px;">• <b>ESC</b> para salir</div>
        </div>
    `;
    document.body.appendChild(indicator);
}

function removeAdjustModeIndicator() {
    const indicator = document.getElementById('adjust-mode-indicator');
    if (indicator) indicator.remove();
}

// === SISTEMA DE ROTACIÓN ===

// Seleccionar elemento para rotar
function selectElement(element) {
    // Deseleccionar anterior
    if (selectedElement) {
        selectedElement.style.boxShadow = '';
        removeElementRotationLabel(selectedElement);
    }
    
    selectedElement = element;
    selectedElement.style.boxShadow = '0 0 20px rgba(0, 255, 255, 1)';
    
    showRotationIndicator(element);
    addElementRotationLabel(element);
    
    console.log(`🎯 Seleccionado: ${element.id} - Usa Q/E o rueda del mouse para rotar`);
}

// Agregar etiqueta de rotación en el elemento
function addElementRotationLabel(element) {
    // Remover etiqueta anterior si existe
    removeElementRotationLabel(element);
    
    const rotation = parseFloat(element.dataset.rotation || 0);
    
    if (rotation !== 0) {
        const label = document.createElement('div');
        label.className = 'rotation-label';
        label.style.cssText = `
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 255, 0.95);
            color: black;
            padding: 3px 8px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 11px;
            font-weight: bold;
            z-index: 10001;
            pointer-events: none;
            white-space: nowrap;
        `;
        label.textContent = `🔄 ${rotation.toFixed(1)}°`;
        element.appendChild(label);
    }
}

// Remover etiqueta de rotación del elemento
function removeElementRotationLabel(element) {
    const label = element.querySelector('.rotation-label');
    if (label) label.remove();
}

// Indicador de rotación actual
function showRotationIndicator(element) {
    removeRotationIndicator();
    
    const rotation = parseFloat(element.dataset.rotation || 0);
    
    const indicator = document.createElement('div');
    indicator.id = 'rotation-indicator';
    indicator.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 20px;
        background: rgba(0, 255, 255, 0.9);
        color: black;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 9999;
        font-family: monospace;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;
    indicator.innerHTML = `
        🔄 ${element.id}<br>
        Rotación: ${rotation.toFixed(1)}°
    `;
    
    document.body.appendChild(indicator);
}

function removeRotationIndicator() {
    const indicator = document.getElementById('rotation-indicator');
    if (indicator) indicator.remove();
}

// Rotar elemento
function rotateElement(element, delta) {
    const currentRotation = parseFloat(element.dataset.rotation || 0);
    let newRotation = currentRotation + delta;
    
    // Normalizar entre -180 y 180
    while (newRotation > 180) newRotation -= 360;
    while (newRotation < -180) newRotation += 360;
    
    element.dataset.rotation = newRotation.toString();
    element.style.transform = `rotate(${newRotation}deg)`;
    
    showRotationIndicator(element);
    addElementRotationLabel(element);
    
    return newRotation;
}

// Handler de rueda del mouse para rotación
function handleWheel(e) {
    if (!adjustMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget;
    selectElement(element);
    
    // Delta positivo = rotar a la derecha, negativo = izquierda
    const delta = e.deltaY > 0 ? -5 : 5;
    rotateElement(element, delta);
}

// Teclas Q y E para rotar
document.addEventListener('keydown', (e) => {
    if (!adjustMode || !selectedElement) return;
    
    if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        rotateElement(selectedElement, -5); // Rotar izquierda
    } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        rotateElement(selectedElement, 5); // Rotar derecha
    } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetRotation(selectedElement); // Resetear rotación
    }
});

// Resetear rotación a 0
function resetRotation(element) {
    element.dataset.rotation = '0';
    element.style.transform = 'rotate(0deg)';
    showRotationIndicator(element);
    removeElementRotationLabel(element);
    console.log(`🔄 Rotación reseteada para ${element.id}`);
    showNotification(`✓ ${element.id} - Rotación reseteada`);
}

// Manejadores de drag & drop
document.addEventListener('dragstart', (e) => {
    if (!adjustMode) return;
    
    if (e.target.classList.contains('interactive-area')) {
        draggedElement = e.target;
        const rect = draggedElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        // Guardar centro del elemento para rotación
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        draggedElement.dataset.dragCenterX = centerX;
        draggedElement.dataset.dragCenterY = centerY;
        
        draggedElement.style.opacity = '0.7';
        draggedElement.style.cursor = 'grabbing';
        
        console.log(`📦 Arrastrando: ${draggedElement.id} (Rotación: ${draggedElement.dataset.rotation}°)`);
    }
});

document.addEventListener('dragover', (e) => {
    if (!adjustMode || !draggedElement) return;
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    if (!adjustMode || !draggedElement) return;
    e.preventDefault();
    
    const container = document.querySelector('.comedor');
    const containerRect = container.getBoundingClientRect();
    
    // Calcular posición relativa al contenedor
    // Para elementos rotados, usar el centro como referencia
    const rotation = parseFloat(draggedElement.dataset.rotation || 0);
    
    let x, y;
    if (rotation !== 0) {
        // Usar el centro del elemento como punto de anclaje
        const elementWidth = draggedElement.offsetWidth;
        const elementHeight = draggedElement.offsetHeight;
        
        // Posición del centro del elemento
        const centerX = e.clientX - containerRect.left;
        const centerY = e.clientY - containerRect.top;
        
        // Calcular top-left desde el centro
        x = centerX - elementWidth / 2;
        y = centerY - elementHeight / 2;
    } else {
        // Sin rotación, usar el offset normal
        x = e.clientX - containerRect.left - offsetX;
        y = e.clientY - containerRect.top - offsetY;
    }
    
    // Convertir a porcentajes
    const leftPercent = (x / containerRect.width) * 100;
    const topPercent = (y / containerRect.height) * 100;
    
    // Aplicar nueva posición manteniendo rotación
    draggedElement.style.left = `${leftPercent}%`;
    draggedElement.style.top = `${topPercent}%`;
    draggedElement.style.opacity = '1';
    draggedElement.style.cursor = 'grab';
    
    // Asegurar que la rotación se mantiene
    if (rotation !== 0) {
        draggedElement.style.transform = `rotate(${rotation}deg)`;
    }
    
    // Obtener dimensiones actuales
    const width = (draggedElement.offsetWidth / containerRect.width) * 100;
    const height = (draggedElement.offsetHeight / containerRect.height) * 100;
    
    // Generar CSS con rotación
    const cssCode = generateCSS(draggedElement.id, leftPercent, topPercent, width, height, rotation);
    
    // Copiar al portapapeles
    copyToClipboard(cssCode);
    
    // Mostrar en consola
    console.log('%c📋 CSS COPIADO AL PORTAPAPELES:', 'color: #00ff00; font-size: 14px; font-weight: bold');
    console.log(cssCode);
    
    // Notificación visual
    showCopyNotification(draggedElement.id);
    
    draggedElement = null;
});

document.addEventListener('dragend', () => {
    if (draggedElement) {
        draggedElement.style.opacity = '1';
        draggedElement.style.cursor = 'grab';
        draggedElement = null;
    }
});

// Generar CSS formateado
function generateCSS(id, left, top, width, height, rotation = 0) {
    const name = id.charAt(0).toUpperCase() + id.slice(1);
    let css = `
/* ${name} */
#${id}.interactive-area {
    top: ${top.toFixed(1)}%;
    left: ${left.toFixed(1)}%;
    width: ${width.toFixed(1)}%;
    height: ${height.toFixed(1)}%;`;
    
    // Solo agregar transform si hay rotación
    if (rotation && rotation !== 0) {
        css += `
    transform: rotate(${rotation.toFixed(1)}deg);`;
    }
    
    css += `
}`;
    
    return css;
}

// Copiar al portapapeles
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Error al copiar:', err);
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

// Notificación visual
function showCopyNotification(id) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 255, 0, 0.95);
        color: black;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: fadeInOut 2s ease-in-out;
    `;
    notification.textContent = `✓ ${id.toUpperCase()} - CSS copiado!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Tecla ESC para salir
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adjustMode) {
        toggleAdjustMode();
    }
});

// Agregar animación CSS
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}

.interactive-area[draggable="true"] {
    cursor: grab !important;
}

.interactive-area[draggable="true"]:active {
    cursor: grabbing !important;
}
`;
document.head.appendChild(style);

// Exportar función global
window.toggleAdjustMode = toggleAdjustMode;

// Mensaje de bienvenida
console.log('%c🎮 DRAG & DROP HELPER CON ROTACIÓN CARGADO', 'color: #00ffff; font-size: 14px; font-weight: bold');
console.log('%cEscribí: toggleAdjustMode() para activar/desactivar', 'color: #ffff00; font-size: 12px');
console.log('%cO presioná Ctrl+Shift+A para activar', 'color: #ffff00; font-size: 12px');
console.log('%cNuevo: Q/E o rueda del mouse para rotar elementos', 'color: #00ff00; font-size: 12px');

// Atajo de teclado Ctrl+Shift+A
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdjustMode();
    }
    
    // Tecla D para crear nuevo hotspot (solo en modo ajuste)
    if (e.key === 'd' || e.key === 'D') {
        if (adjustMode) {
            e.preventDefault();
            createNewHotspot();
        }
    }
});

// Crear nuevo hotspot
let hotspotCounter = 0;
function createNewHotspot() {
    const container = document.querySelector('.comedor') || document.querySelector('section');
    if (!container) {
        console.error('No se encontró el contenedor');
        return;
    }
    
    hotspotCounter++;
    const newId = `hotspot-${hotspotCounter}`;
    
    const hotspot = document.createElement('div');
    hotspot.className = 'interactive-area';
    hotspot.id = newId;
    hotspot.setAttribute('data-object', newId);
    hotspot.setAttribute('title', `Nuevo Hotspot ${hotspotCounter}`);
    
    // Inicializar rotación
    hotspot.dataset.rotation = '0';
    
    // Posición inicial en el centro
    hotspot.style.position = 'absolute';
    hotspot.style.left = '40%';
    hotspot.style.top = '40%';
    hotspot.style.width = '150px';
    hotspot.style.height = '150px';
    hotspot.style.border = '3px dashed red';
    hotspot.style.background = 'rgba(255, 0, 0, 0.2)';
    hotspot.draggable = true;
    
    // Deshabilitar click pero permitir selección
    hotspot.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectElement(hotspot);
    };
    
    // Agregar listener de wheel para rotación
    hotspot.addEventListener('wheel', handleWheel, { passive: false });
    
    // Hacer redimensionable
    makeResizable(hotspot);
    
    container.appendChild(hotspot);
    
    console.log(`%c✨ Hotspot creado: ${newId}`, 'color: #00ff00; font-size: 14px; font-weight: bold');
    console.log('%cArrástralo para posicionar, usa las esquinas para redimensionar, Q/E para rotar', 'color: #00ffff; font-size: 12px');
    
    showNotification(`✓ Hotspot creado: ${newId}`);
}

// Hacer elemento redimensionable
function makeResizable(element) {
    // Crear handles de redimensión en las 4 esquinas
    const positions = ['nw', 'ne', 'sw', 'se'];
    
    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${pos}`;
        handle.style.cssText = `
            position: absolute;
            width: 15px;
            height: 15px;
            background: #00ff00;
            border: 2px solid #fff;
            z-index: 10;
            cursor: ${pos}-resize;
            border-radius: 50%;
        `;
        
        // Posicionar handles
        if (pos === 'nw') {
            handle.style.top = '-7px';
            handle.style.left = '-7px';
        } else if (pos === 'ne') {
            handle.style.top = '-7px';
            handle.style.right = '-7px';
        } else if (pos === 'sw') {
            handle.style.bottom = '-7px';
            handle.style.left = '-7px';
        } else if (pos === 'se') {
            handle.style.bottom = '-7px';
            handle.style.right = '-7px';
        }
        
        // Eventos de redimensión
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            startResize(e, element, pos);
        });
        
        element.appendChild(handle);
    });
    
    // Agregar indicador de centro para arrastre de elementos rotados
    const centerIndicator = document.createElement('div');
    centerIndicator.className = 'center-indicator';
    centerIndicator.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9;
    `;
    centerIndicator.innerHTML = `
        <div style="position: absolute; width: 2px; height: 20px; background: rgba(255, 255, 0, 0.8); left: 50%; transform: translateX(-50%);"></div>
        <div style="position: absolute; width: 20px; height: 2px; background: rgba(255, 255, 0, 0.8); top: 50%; transform: translateY(-50%);"></div>
    `;
    element.appendChild(centerIndicator);
}

// Variables para redimensión
let isResizing = false;
let currentElement = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;
let resizePosition = '';
let elementRotation = 0;

// Función auxiliar: convertir grados a radianes
function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Función auxiliar: rotar un punto alrededor del centro
function rotatePoint(x, y, centerX, centerY, angleDegrees) {
    const angleRad = toRadians(angleDegrees);
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    
    // Trasladar al origen
    const dx = x - centerX;
    const dy = y - centerY;
    
    // Rotar
    const rotatedX = dx * cos - dy * sin;
    const rotatedY = dx * sin + dy * cos;
    
    // Trasladar de vuelta
    return {
        x: rotatedX + centerX,
        y: rotatedY + centerY
    };
}

function startResize(e, element, position) {
    isResizing = true;
    currentElement = element;
    resizePosition = position;
    elementRotation = parseFloat(element.dataset.rotation || 0);
    
    startX = e.clientX;
    startY = e.clientY;
    startWidth = element.offsetWidth;
    startHeight = element.offsetHeight;
    
    const rect = element.getBoundingClientRect();
    const container = element.parentElement.getBoundingClientRect();
    startLeft = rect.left - container.left;
    startTop = rect.top - container.top;
    
    // Calcular el centro del elemento
    const centerX = startLeft + startWidth / 2;
    const centerY = startTop + startHeight / 2;
    
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    console.log(`🔧 Redimensionando con rotación: ${elementRotation.toFixed(1)}°`);
}

function resize(e) {
    if (!isResizing || !currentElement) return;
    
    const container = currentElement.parentElement.getBoundingClientRect();
    
    // Obtener posición del mouse relativa al contenedor
    const mouseX = e.clientX - container.left;
    const mouseY = e.clientY - container.top;
    
    // Calcular el centro actual del elemento
    const centerX = startLeft + startWidth / 2;
    const centerY = startTop + startHeight / 2;
    
    // Si hay rotación, rotar la posición del mouse al espacio del elemento
    let adjustedDx = e.clientX - startX;
    let adjustedDy = e.clientY - startY;
    
    if (elementRotation !== 0) {
        // Rotar el delta inversamente para que coincida con el espacio del elemento
        const angleRad = toRadians(-elementRotation);
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        
        const rotatedDx = adjustedDx * cos - adjustedDy * sin;
        const rotatedDy = adjustedDx * sin + adjustedDy * cos;
        
        adjustedDx = rotatedDx;
        adjustedDy = rotatedDy;
    }
    
    // Aplicar redimensionamiento según la esquina
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;
    
    if (resizePosition === 'se') {
        // Esquina inferior derecha: aumentar ancho y alto
        newWidth = Math.max(50, startWidth + adjustedDx);
        newHeight = Math.max(50, startHeight + adjustedDy);
    } else if (resizePosition === 'sw') {
        // Esquina inferior izquierda: cambiar ancho (reducir desde izq) y aumentar alto
        newWidth = Math.max(50, startWidth - adjustedDx);
        newHeight = Math.max(50, startHeight + adjustedDy);
        newLeft = startLeft + (startWidth - newWidth);
    } else if (resizePosition === 'ne') {
        // Esquina superior derecha: aumentar ancho, reducir alto desde arriba
        newWidth = Math.max(50, startWidth + adjustedDx);
        newHeight = Math.max(50, startHeight - adjustedDy);
        newTop = startTop + (startHeight - newHeight);
    } else if (resizePosition === 'nw') {
        // Esquina superior izquierda: reducir ancho y alto desde arriba-izquierda
        newWidth = Math.max(50, startWidth - adjustedDx);
        newHeight = Math.max(50, startHeight - adjustedDy);
        newLeft = startLeft + (startWidth - newWidth);
        newTop = startTop + (startHeight - newHeight);
    }
    
    // Aplicar los cambios
    currentElement.style.width = `${newWidth}px`;
    currentElement.style.height = `${newHeight}px`;
    currentElement.style.left = `${(newLeft / container.width) * 100}%`;
    currentElement.style.top = `${(newTop / container.height) * 100}%`;
}

function stopResize() {
    if (isResizing && currentElement) {
        // Generar CSS actualizado
        const container = currentElement.parentElement.getBoundingClientRect();
        
        // Obtener posición y tamaño actuales desde los estilos aplicados
        const leftPercent = parseFloat(currentElement.style.left);
        const topPercent = parseFloat(currentElement.style.top);
        const widthPercent = (currentElement.offsetWidth / container.width) * 100;
        const heightPercent = (currentElement.offsetHeight / container.height) * 100;
        
        const rotation = parseFloat(currentElement.dataset.rotation || 0);
        const cssCode = generateCSS(currentElement.id, leftPercent, topPercent, widthPercent, heightPercent, rotation);
        copyToClipboard(cssCode);
        
        console.log('%c📋 CSS ACTUALIZADO (copiado):', 'color: #00ff00; font-size: 14px; font-weight: bold');
        console.log(cssCode);
        
        showNotification(`✓ ${currentElement.id} redimensionado`);
    }
    
    isResizing = false;
    currentElement = null;
    elementRotation = 0;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Función de notificación genérica
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 255, 0, 0.95);
        color: black;
        padding: 20px 30px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: fadeInOut 2s ease-in-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Agregar handles de redimensión a hotspots existentes cuando se activa el modo
const originalToggleAdjustMode = toggleAdjustMode;
window.toggleAdjustMode = function() {
    originalToggleAdjustMode();
    
    if (adjustMode) {
        // Agregar handles a todos los hotspots existentes
        const areas = document.querySelectorAll('.interactive-area');
        areas.forEach(area => {
            // Solo agregar si no tiene handles ya
            if (!area.querySelector('.resize-handle')) {
                makeResizable(area);
            }
        });
    } else {
        // Remover handles cuando se desactiva
        const handles = document.querySelectorAll('.resize-handle');
        handles.forEach(handle => handle.remove());
    }
};
