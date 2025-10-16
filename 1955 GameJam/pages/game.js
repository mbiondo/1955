// Game demo for 1955 GameJam
// Point and click narrative game

let currentRoom = 'comedor';
let gameState = {
    inventory: [],
    dialogues: [],
    timeLeft: 60, // seconds
    score: 0
};

const rooms = {
    comedor: {
        objects: [
            'puerta', 'cuadro', 'armario', 'cocina', 'mate', 'bandera',
            'radio', 'herramientas', 
            'pan', 'papeles', 'cuchillo', 'botella', 'vaso',
            'escoba'
        ],
        background: '../images/comedor.png'
    }
};

const characters = {
    obrero: {
        name: 'Obrero',
        needs: ['herramientas'],
        dialogue: 'Juanjo, quieren matar a Perón, la marina está sublevada en la base naval de Río Santiago, y los leales estamos resistiendo. Yo me quedo para resistir, pero voy a necesitar algo para arreglar mi casilla.',
        correctResponse: 'Gracias, compañero. Tenemos que seguir resistiendo.',
        info: 'El obrero se fue a fortalecer su casilla para seguir resistiendo.',
        image: '../images/characters/obrero.jpg'
    },
    enfermera: {
        name: 'Luisa',
        needs: ['vendas', 'alcohol'],
        dialogue: '¿Hubo un bombardeo, no escuchaste? Volaron una manzana. Hay decenas de heridos y no sabemos si hay muertos todavía. Juanjo, necesitamos vendas, alcohol, lo que tengas, no damos abasto.',
        correctResponse: 'Muchas gracias, Juanjo. Escuchá, muchos vecinos se están yendo a La Plata. Sé que es difícil pero te sugiero hacer eso para no terminar en el hospital.',
        info: 'La enfermera pudo atender a los heridos con el alcohol.',
        image: '../images/characters/enfermera.jpg'
    },
    madre: {
        name: 'Graciela',
        needs: ['pan de centeno'],
        dialogue: 'Ay, Juancito. Me estoy llevando a los chicos al camión que está llevando a la gente a La Plata. No tenemos nada para comer en el viaje o cuando lleguemos.',
        correctResponse: 'Muchas gracias, Juanjo. Nos salvaste el día. Vení con nosotros. Los milicos están arrasando todo.',
        info: 'Graciela y sus hijos pudieron evacuar con algo de comida.',
        image: '../images/characters/madre.jpg'
    }
};

const characterSequence = ['obrero', 'enfermera', 'madre'];
let currentCharacterIndex = 0;

let currentCharacter = null;
let timerInterval = null;
let gameStarted = false;
let radioPlayed = false;
let initialMessageShown = false;

// Audio de fondo de la radio (música ambiental)
let radioBackgroundMusic = null;

// Initialize game
function initGame() {
    console.log('Game initialized');
    
    // Evitar que se llame múltiples veces
    if (initialMessageShown) {
        console.log('Game already initialized, skipping');
        return;
    }
    
    initialMessageShown = true;
    showRoom('comedor');
    setupInteractiveAreas();
    showObjectInfo('Espero que los vecinos estén bien. A ver qué dice la radio. (Haz click en la radio)', 0);
    // No iniciar el timer ni el primer personaje hasta que se active la radio
}

// Setup interactive areas with enhanced feedback
function setupInteractiveAreas() {
    const areas = document.querySelectorAll('.interactive-area');
    areas.forEach(area => {
        const objectId = area.getAttribute('data-object');
        
        // Agregar evento mouseenter para mostrar tooltip
        area.addEventListener('mouseenter', function(e) {
            if (gameStarted || objectId === 'radio') {
                showTooltip(objectId, e);
            }
        });
        
        // Agregar evento mousemove para seguir el mouse
        area.addEventListener('mousemove', function(e) {
            if (gameStarted || objectId === 'radio') {
                updateTooltipPosition(e);
            }
        });
        
        // Agregar evento mouseleave para ocultar tooltip
        area.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

// Mostrar tooltip
function showTooltip(objectId, event) {
    const description = objectDescriptions[objectId] || 'Objeto desconocido';
    
    let tooltip = document.getElementById('game-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'game-tooltip';
        tooltip.className = 'game-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = description;
    tooltip.style.display = 'block';
    updateTooltipPosition(event);
}

// Actualizar posición del tooltip
function updateTooltipPosition(event) {
    const tooltip = document.getElementById('game-tooltip');
    if (!tooltip) return;
    
    const offsetX = 15;
    const offsetY = 15;
    
    tooltip.style.left = (event.clientX + offsetX) + 'px';
    tooltip.style.top = (event.clientY + offsetY) + 'px';
}

// Ocultar tooltip
function hideTooltip() {
    const tooltip = document.getElementById('game-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Show room
function showRoom(roomId) {
    currentRoom = roomId;
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(roomId).style.display = 'block';
    updateUI();
}

// Update UI
function updateUI() {
    // Update inventory, etc.
    console.log('Current room:', currentRoom);
}

const objectContents = {
    // Objetos individuales que contienen items
    'radio': ['radio'],
    'herramientas': ['herramientas'],
    'pan': ['pan de centeno'],
    'papeles': ['papeles', 'documentos'],
    'cuchillo': ['cuchillo'],
    'botella': ['botella', 'agua'],
    'vaso': ['vaso'],
    'armario': ['ropa', 'alcohol', 'vendas', 'botiquin'],
    'cocina': ['ollas', 'pava'],
    'mate': ['mate', 'yerba'],
    'cuadro': ['foto', 'recuerdo'],
    'escoba': ['escoba'],
    'bandera': ['bandera argentina'],
    'puerta': [],
    // Add more
};

// Descripciones de objetos para tooltips
const objectDescriptions = {
    'radio': 'Radio antigua - Escuchar las noticias',
    'herramientas': 'Herramientas de trabajo',
    'pan': 'Pan de centeno - Alimento básico',
    'papeles': 'Documentos y papeles',
    'cuchillo': 'Cuchillo de cocina',
    'botella': 'Botella con agua',
    'vaso': 'Vaso de vidrio',
    'armario': 'Armario - Contiene ropa, medicinas y botiquín',
    'cocina': 'Cocina a leña',
    'mate': 'Mate con yerba - Bebida tradicional',
    'cuadro': 'Cuadro familiar - Recuerdo del pasado',
    'escoba': 'Escoba vieja',
    'bandera': 'Bandera argentina',
    'puerta': 'Puerta de entrada'
};

// Handle object click
function clickObject(objectId) {
    console.log('Clicked object:', objectId);
    const contents = objectContents[objectId] || [];
    
    // Si es la radio y no ha empezado el juego
    if (objectId === 'radio' && !gameStarted) {
        playRadio();
        return;
    }
    
    if (objectId === 'puerta' && isKnocking) {
        const charId = characterSequence[currentCharacterIndex];
        spawnCharacter(charId);
        isKnocking = false;
        document.getElementById('objectInfo').style.display = 'none';
        return;
    }
    
    // Si no ha empezado el juego y hacen click en otro objeto, no hacer nada
    if (!gameStarted && objectId !== 'radio') {
        console.log('Game not started yet, ignoring click on', objectId);
        return;
    }
    
    if (currentCharacter) {
        const needed = currentCharacter.needs.find(item => contents.includes(item));
        console.log('Needed item:', needed, 'from contents:', contents);
        if (needed) {
            giveItem(needed);
        } else {
            showObjectInfo('Este objeto no tiene lo que necesita.');
        }
    } else {
        showObjectInfo('Objeto: ' + objectId + ' contiene: ' + (contents.length ? contents.join(', ') : 'nada'));
    }
}

// Play radio and start game
function playRadio() {
    if (radioPlayed) return;
    radioPlayed = true;
    
    // Reproducir noticias.mp3
    const noticiasSound = new Audio('../sounds/noticias.mp3');
    noticiasSound.volume = 0.5;
    
    // Iniciar tango.mp3 1 segundo antes de que termine noticias.mp3
    noticiasSound.addEventListener('loadedmetadata', () => {
        const duration = noticiasSound.duration;
        setTimeout(() => {
            // Iniciar tango.mp3 como música de fondo
            radioBackgroundMusic = new Audio('../sounds/tango.mp3');
            radioBackgroundMusic.volume = 0.05; // Volumen muy bajo para música de fondo
            radioBackgroundMusic.loop = true; // Loop infinito
            radioBackgroundMusic.play().catch(err => {
                console.log('No se pudo reproducir tango.mp3:', err);
            });
        }, (duration - 1) * 1000);
    });
    
    noticiasSound.play().catch(err => {
        console.log('No se pudo reproducir noticias.mp3:', err);
    });
    
    showObjectInfo('Reproduciendo noticia...', 8000);
    
    // Cuando termine noticias.mp3, reproducir disparos y puerta simultáneamente
    noticiasSound.addEventListener('ended', () => {
        // Reproducir sonido de disparos
        const shotsSound = new Audio('../sounds/shots.mp3');
        shotsSound.volume = 0.3;
        shotsSound.play().catch(err => {
            console.log('No se pudo reproducir el sonido de disparos:', err);
        });
        
        showObjectInfo('*Se escuchan disparos y gritos afuera*', 3000);
        
        // Llamar a doorKnock simultáneamente
        gameStarted = true;
        startTimer();
        doorKnock();
    });
}

let isKnocking = false;

// Door knock
function doorKnock() {
    console.log('Door knock! Current character index:', currentCharacterIndex);
    isKnocking = true;
    gameState.timeLeft = 60; // Reset timer
    document.getElementById('timer').textContent = 'Tiempo: ' + gameState.timeLeft;
    
    // Reproducir sonido de golpe en la puerta
    const knockSound = new Audio('../sounds/doorKnock.mp3');
    knockSound.volume = 0.6;
    knockSound.play().catch(err => {
        console.log('No se pudo reproducir el sonido de golpe en la puerta:', err);
    });
    
    // Pregunta de Juanjo según el personaje
    let juanjoQuestion = '';
    if (currentCharacterIndex === 0) {
        juanjoQuestion = '¿Quién es a esta hora? ';
    } else if (currentCharacterIndex === 1) {
        juanjoQuestion = '';
    }
    
    setTimeout(() => {
        showObjectInfo(juanjoQuestion + '¡Tocan a la puerta! Haz click en la puerta para abrir.', 10000);
    }, 1000);
}

// Spawn character
function spawnCharacter(charId) {
    console.log('Spawning character:', charId);
    currentCharacter = characters[charId];
    console.log('Current character:', currentCharacter);
    
    // Pregunta inicial de Juanjo
    let juanjoQuestion = '';
    if (charId === 'obrero') {
        juanjoQuestion = 'Juanjo: ¿Qué está pasando afuera? ¿Qué son esos ruidos?\n\n';
    } else if (charId === 'enfermera') {
        juanjoQuestion = 'Juanjo: ¿Qué pasó, Luisa?\n\n';
    } else if (charId === 'madre') {
        juanjoQuestion = 'Juanjo: ¿Qué pasó, Graciela?\n\n';
    }
    
    showDialogue(juanjoQuestion + currentCharacter.dialogue);
}

// Show dialogue con efecto typewriter
function showDialogue(text, isResponse = false) {
    console.log('Showing dialogue:', text);
    console.log('Current character image:', currentCharacter.image);
    
    // Remove previous dialogue if exists
    const existingDialogue = document.getElementById('dialogue');
    if (existingDialogue) {
        existingDialogue.remove();
    }
    
    const dialogueDiv = document.createElement('div');
    dialogueDiv.id = 'dialogue';
    dialogueDiv.className = 'dialogue-container';
    
    // Si es una respuesta (agradecimiento), agregar clase especial
    if (isResponse) {
        dialogueDiv.classList.add('dialogue-response');
    }
    
    dialogueDiv.innerHTML = `
        <div class="character-portrait">
            <img src="${currentCharacter.image}" alt="${currentCharacter.name}">
        </div>
        <div class="dialogue-content">
            <h3 class="character-name">${currentCharacter.name}</h3>
            <p class="dialogue-text"></p>
            ${!isResponse ? '<p class="dialogue-hint">Haz click en el objeto correcto para ayudar.</p>' : ''}
        </div>
    `;
    document.body.appendChild(dialogueDiv);
    console.log('Dialogue added to body');
    
    // Aplicar efecto typewriter al texto del diálogo
    const dialogueText = dialogueDiv.querySelector('.dialogue-text');
    typewriterEffect(dialogueText, text, 30);
}

// Respond correct
function respondCorrect() {
    console.log('Respond correct called');
    if (currentCharacter) {
        const response = currentCharacter.correctResponse;
        const info = currentCharacter.info;
        
        // Mostrar el agradecimiento en el diálogo del personaje
        showDialogue(response, true);
        
        // Después de 6 segundos (más tiempo para leer con typewriter), mostrar el panel de info narrativo
        setTimeout(() => {
            document.getElementById('dialogue').remove();
            showNarrativePanel(info);
            
            // Después de 7 segundos (más tiempo para el panel narrativo), continuar con el siguiente personaje o terminar
            setTimeout(() => {
                document.getElementById('narrativePanel').remove();
                currentCharacterIndex++;
                if (currentCharacterIndex < characterSequence.length) {
                    setTimeout(() => {
                        doorKnock();
                    }, 3000); // Next character after 3s
                } else {
                    endGame(true);
                }
            }, 7000);
        }, 6000);
        
        gameState.score += 10;
        currentCharacter = null;
    }
}

// Respond wrong - removed, now handled in clickObject

// Give item
function giveItem(item) {
    console.log('Giving item:', item);
    if (currentCharacter && currentCharacter.needs.includes(item)) {
        respondCorrect();
    }
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer').textContent = 'Tiempo: ' + gameState.timeLeft;
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// 🎬 Función de typewriter reutilizable con sonido
function typewriterEffect(element, text, speed = 30, onComplete = null) {
    element.textContent = '';
    let index = 0;
    let isTyping = true;
    
    // Crear el audio de la máquina de escribir con mejor configuración
    const typewriterSound = new Audio('../sounds/typewritter.mp3');
    typewriterSound.volume = 0.3;
    typewriterSound.loop = true;
    typewriterSound.preload = 'auto';
    
    // Iniciar el sonido con mejor manejo
    typewriterSound.currentTime = 0;
    const playPromise = typewriterSound.play();
    
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('Sonido de typewriter iniciado correctamente');
            })
            .catch(err => {
                console.log('Error al reproducir sonido:', err);
            });
    }
    
    const type = () => {
        if (index < text.length && isTyping) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Detener el sonido cuando termine o se interrumpa
            typewriterSound.pause();
            typewriterSound.currentTime = 0;
            
            if (onComplete) {
                onComplete();
            }
        }
    };
    
    type();
    
    // Devolver función para detener el efecto
    return {
        stop: () => {
            isTyping = false;
            typewriterSound.pause();
            typewriterSound.currentTime = 0;
        }
    };
}

// End game con efecto typewriter
function endGame(win) {
    clearInterval(timerInterval);
    
    // Detener la música de fondo de la radio
    if (radioBackgroundMusic) {
        radioBackgroundMusic.pause();
        radioBackgroundMusic.currentTime = 0;
    }
    
    const endDiv = document.getElementById('endGame');
    
    if (win) {
        endDiv.innerHTML = `
            <div class="end-game-content">
                <h2 class="end-title">La batalla de Ensenada</h2>
                <div class="end-text"></div>
                <div class="end-skip" style="opacity: 0;">Presiona ESPACIO para continuar</div>
            </div>
        `;
        
        const endText = document.querySelector('.end-text');
        const endSkip = document.querySelector('.end-skip');
        
        const fullText = `La batalla de Ensenada duró cinco días.

Ante la amenaza de que los sublevados bombardearan la destilería, el gobierno ordenó atacar.

En la tarde del 16 aparecieron tres bombarderos Avro Lincoln. Su objetivo: la base naval y las posiciones de la Marina. Al principio, nadie tenía claro a quién respondían.

Una de las bombas cayó sobre el barrio Campamento, junto a la zona del conflicto. Varias viviendas fueron destruidas y murió un vecino, Rodolfo "Cholo" Ortiz.

Esa misma noche, con el temor de nuevos bombardeos, muchos habitantes que habían resistido decidieron evacuar.

El barrio quedó en silencio.`;

        // Iniciar efecto typewriter y guardar el control
        const typewriterControl = typewriterEffect(endText, fullText, 40, () => {
            // Mostrar el botón de continuar cuando termine
            endSkip.style.opacity = '1';
            endSkip.style.animation = 'pulse 1s infinite';
        });
        
        // Permitir saltar presionando espacio
        let canSkip = false;
        const skipHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (endText.textContent.length < fullText.length) {
                    // Si está escribiendo, detener el efecto y mostrar todo el texto
                    typewriterControl.stop();
                    endText.textContent = fullText;
                    endSkip.style.opacity = '1';
                    endSkip.style.animation = 'pulse 1s infinite';
                } else if (canSkip) {
                    // Si ya terminó, volver al menú
                    window.location.href = '../index.html';
                    document.removeEventListener('keydown', skipHandler);
                } else {
                    canSkip = true;
                }
            }
        };
        
        document.addEventListener('keydown', skipHandler);
        
    } else {
        endDiv.innerHTML = `
            <div class="end-game-content">
                <h2 class="end-title">Tiempo agotado</h2>
                <div class="end-text"></div>
            </div>
        `;
        
        const endText = document.querySelector('.end-text');
        const failText = `No pudiste ayudar a tiempo...

La batalla de Ensenada continuó sin tu asistencia.`;
        
        typewriterEffect(endText, failText, 50);
    }
    
    endDiv.style.display = 'flex';
}

// Room navigation
function changeRoom(direction) {
    const roomOrder = ['comedor', 'dormitorio', 'patio'];
    let currentIndex = roomOrder.indexOf(currentRoom);
    if (direction === 'next' && currentIndex < roomOrder.length - 1) {
        showRoom(roomOrder[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
        showRoom(roomOrder[currentIndex - 1]);
    }
}

// Audio placeholders
// const tangoMusic = new Audio('/audio/tango.mp3'); // Música de tango
// const knockSound = new Audio('/audio/knock.mp3'); // Golpe en la puerta
// const gunshotSound = new Audio('/audio/gunshot.mp3'); // Disparos

// Play background music
// tangoMusic.loop = true;
// tangoMusic.play();

// In doorKnock:
// knockSound.play();

// Variable global para almacenar el timeout del mensaje
let objectInfoTimeout = null;

// Show object info
function showObjectInfo(text, duration = 3000) {
    const infoDiv = document.getElementById('objectInfo');
    
    // Cancelar el timeout anterior si existe
    if (objectInfoTimeout) {
        clearTimeout(objectInfoTimeout);
        objectInfoTimeout = null;
    }
    
    // Mostrar el nuevo mensaje
    infoDiv.textContent = text;
    infoDiv.style.display = 'block';
    
    // Reiniciar animación
    infoDiv.style.animation = 'none';
    setTimeout(() => {
        infoDiv.style.animation = '';
    }, 10);
    
    // Si duration es 0, el mensaje se queda permanente
    if (duration > 0) {
        // Crear nuevo timeout
        objectInfoTimeout = setTimeout(() => {
            infoDiv.style.display = 'none';
            objectInfoTimeout = null;
        }, duration);
    }
}

// Show info panel
function showInfoPanel(text) {
    const panel = document.getElementById('infoPanel');
    panel.textContent = text;
    panel.style.display = 'block';
}

// Show narrative panel (más vistoso para el mensaje final de cada personaje) con typewriter
function showNarrativePanel(text) {
    // Remover panel anterior si existe
    const existingPanel = document.getElementById('narrativePanel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = 'narrativePanel';
    panel.className = 'narrative-panel';
    panel.innerHTML = `
        <div class="narrative-content">
            <div class="narrative-icon">📖</div>
            <p class="narrative-text"></p>
        </div>
    `;
    document.body.appendChild(panel);
    
    // Fade in
    setTimeout(() => {
        panel.classList.add('show');
        
        // Aplicar efecto typewriter después del fade in
        const narrativeText = panel.querySelector('.narrative-text');
        typewriterEffect(narrativeText, text, 35);
    }, 100);
}

// Event listeners
// initGame() será llamado por intro.js después de la intro
document.addEventListener('DOMContentLoaded', function() {
    console.log('Game page loaded - waiting for intro to complete');
});