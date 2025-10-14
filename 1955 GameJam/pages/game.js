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
        objects: ['puerta', 'armario', 'mesa-radio', 'mesa-papeles', 'cuadro'],
        background: '/images/comedor.png'
    }
};

const characters = {
    enfermera: {
        name: 'Enfermera',
        needs: ['alcohol', 'vendas'],
        dialogue: 'Necesito alcohol y vendas para curar a los heridos.',
        correctResponse: 'Aquí tienes lo que necesitas.',
        info: 'Los disparos han herido a muchos en la manifestación.',
        image: '/images/characters/enfermera.png'
    },
    obrero: {
        name: 'Obrero',
        needs: ['herramientas'],
        dialogue: '¿Tienes herramientas? Necesito arreglar la barricada.',
        correctResponse: 'Toma estas herramientas.',
        info: 'El golpe está avanzando, debemos defendernos.',
        image: '/images/characters/obrero.png'
    },
    madre: {
        name: 'Madre',
        needs: ['pan de centeno'],
        dialogue: '¿Tienes pan de centeno? Mis hijos tienen hambre.',
        correctResponse: 'Aquí tienes el pan.',
        info: 'La escasez está afectando a las familias.',
        image: '/images/characters/madre.png'
    }
};

const characterSequence = ['enfermera', 'obrero', 'madre'];
let currentCharacterIndex = 0;

let currentCharacter = null;
let timerInterval = null;

// Initialize game
function initGame() {
    console.log('Game initialized');
    showRoom('comedor');
    startTimer();
    setupInteractiveAreas();
    // Simulate door knock after 10 seconds
    setTimeout(() => {
        doorKnock();
    }, 10000);
}

// Setup interactive areas with enhanced feedback
function setupInteractiveAreas() {
    const areas = document.querySelectorAll('.interactive-area');
    areas.forEach(area => {
        area.addEventListener('mouseenter', function() {
            // Opcional: mostrar nombre del objeto
            const title = this.getAttribute('title');
            if (title) {
                this.setAttribute('data-tooltip', title);
            }
        });
    });
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
    'mesa-radio': ['herramientas', 'radio'],
    'mesa-papeles': ['papeles', 'pan de centeno'],
    'armario': ['alcohol', 'vendas'],
    'cuadro': ['mensaje secreto'],
    'puerta': [],
    // Add more
};

// Handle object click
function clickObject(objectId) {
    console.log('Clicked object:', objectId);
    const contents = objectContents[objectId] || [];
    if (objectId === 'puerta' && isKnocking) {
        const charId = characterSequence[currentCharacterIndex];
        spawnCharacter(charId);
        isKnocking = false;
        document.getElementById('objectInfo').style.display = 'none';
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

let isKnocking = false;

// Door knock
function doorKnock() {
    console.log('Door knock! Current character index:', currentCharacterIndex);
    isKnocking = true;
    gameState.timeLeft = 60; // Reset timer
    document.getElementById('timer').textContent = 'Tiempo: ' + gameState.timeLeft;
    showObjectInfo('¡Tocan a la puerta! Haz click en la puerta para abrir.', 10000);
}

// Spawn character
function spawnCharacter(charId) {
    console.log('Spawning character:', charId);
    currentCharacter = characters[charId];
    console.log('Current character:', currentCharacter);
    showDialogue(currentCharacter.dialogue);
}

// Show dialogue
function showDialogue(text) {
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
    dialogueDiv.innerHTML = `
        <div class="character-portrait">
            <img src="${currentCharacter.image}" alt="${currentCharacter.name}" onerror="this.src='https://via.placeholder.com/150x200/333/fff?text=${currentCharacter.name}'">
        </div>
        <div class="dialogue-content">
            <h3 class="character-name">${currentCharacter.name}</h3>
            <p class="dialogue-text">${text}</p>
            <p class="dialogue-hint">Haz click en el objeto correcto para ayudar.</p>
        </div>
    `;
    document.body.appendChild(dialogueDiv);
    console.log('Dialogue added to body');
}

// Respond correct
function respondCorrect() {
    console.log('Respond correct called');
    if (currentCharacter) {
        const response = currentCharacter.correctResponse;
        const info = currentCharacter.info;
        showObjectInfo(response);
        setTimeout(() => {
            showInfoPanel(info);
            setTimeout(() => {
                document.getElementById('infoPanel').style.display = 'none';
                currentCharacterIndex++;
                if (currentCharacterIndex < characterSequence.length) {
                    setTimeout(() => {
                        doorKnock();
                    }, 5000); // Next character after 5s
                } else {
                    endGame(true);
                }
            }, 5000);
        }, 2000);
        gameState.score += 10;
        document.getElementById('dialogue').remove();
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

// End game
function endGame(win) {
    clearInterval(timerInterval);
    const endDiv = document.getElementById('endGame');
    endDiv.textContent = win ? '¡Ganaste! Información completa.' : 'Perdiste. Tiempo agotado.';
    endDiv.style.display = 'block';
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
    }
    
    // Mostrar el nuevo mensaje
    infoDiv.textContent = text;
    infoDiv.style.display = 'block';
    
    // Reiniciar animación
    infoDiv.style.animation = 'none';
    setTimeout(() => {
        infoDiv.style.animation = '';
    }, 10);
    
    // Crear nuevo timeout
    objectInfoTimeout = setTimeout(() => {
        infoDiv.style.display = 'none';
        objectInfoTimeout = null;
    }, duration);
}

// Show info panel
function showInfoPanel(text) {
    const panel = document.getElementById('infoPanel');
    panel.textContent = text;
    panel.style.display = 'block';
}

// Event listeners
document.addEventListener('DOMContentLoaded', initGame);