// 🎬 Sistema de Intro con Efecto de Máquina de Escribir
// Para RE5ISTENCIA EN5ENADA

class IntroSystem {
    constructor() {
        this.introText = `16 de septiembre de 1955. Medianoche.

En la base naval de Río Santiago un grupo de marinos se subleva: 
comienza el golpe de Estado contra Juan Domingo Perón.

Desde las primeras horas, la policía ocupa las plazas y las entradas a Ensenada. 
Los accesos al Astillero quedan bloqueados.

A las nueve de la mañana, el fuego estalla.

Los rebeldes amenazan con bombardear la destilería de YPF 
y borrar del mapa a Ensenada, La Plata y Berisso.

En el barrio Campamento, los obreros miran el humo alzarse sobre el río.
Algunos huyen en un éxodo sin precedentes. 
Se evacua toda la ciudad y otros se quedan a resistir.

Esta es la historia de la RE5ISTENCIA EN EN5ENADA.

Presiona ESPACIO para continuar...`;

        this.currentIndex = 0;
        this.isTyping = false;
        this.isComplete = false;
        this.isSkipping = false; // Prevenir doble skip
        this.hasStarted = false; // Nueva bandera para saber si ya comenzó
        this.typingSpeed = 50; // milisegundos por caracter
        
        // Audio de máquina de escribir - precargar
        this.typewriterSound = new Audio('sounds/typewritter.mp3');
        this.typewriterSound.volume = 0.3;
        this.typewriterSound.loop = true;
        this.typewriterSound.preload = 'auto';

        this.init();
    }

    init() {
        this.bindStartButton();
        this.bindEvents(); // Registrar eventos desde el inicio
    }
    
    bindStartButton() {
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el evento se propague al documento
                
                // Marcar que ya comenzó
                this.hasStarted = true;
                
                // Ocultar el botón
                startButton.style.display = 'none';
                
                // Mostrar el texto y el skip
                document.getElementById('introText').style.display = 'block';
                document.querySelector('.intro-skip').style.display = 'block';
                
                // Iniciar el typing
                this.startTyping();
            });
        }
    }

    bindEvents() {
        // Permitir saltar la intro con espacio, enter o click
        document.addEventListener('keydown', (e) => {
            if ((e.code === 'Space' || e.code === 'Enter') && this.hasStarted) {
                e.preventDefault();
                if (!this.isSkipping) {
                    this.skipIntro();
                }
            }
        });

        document.addEventListener('click', (e) => {
            // Solo responder a clicks si ya comenzó la intro y no es el botón de inicio
            if (this.hasStarted && !this.isSkipping && e.target.id !== 'startButton') {
                this.skipIntro();
            }
        });
    }

    startTyping() {
        this.isTyping = true;
        const introElement = document.getElementById('introText');
        const introContent = document.querySelector('.intro-content');
        let hasExpanded = false;
        
        // Iniciar el sonido de typewriter con mejor manejo
        this.typewriterSound.currentTime = 0;
        const playPromise = this.typewriterSound.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Sonido de typewriter iniciado correctamente en la intro');
                })
                .catch(err => {
                    console.log('Error al reproducir sonido en la intro:', err);
                });
        }

        const typeWriter = () => {
            if (this.currentIndex < this.introText.length) {
                introElement.textContent = this.introText.substring(0, this.currentIndex + 1);
                this.currentIndex++;
                
                // Expandir el contenedor cuando el texto supere cierta longitud
                if (!hasExpanded && this.currentIndex > 100) {
                    introContent.classList.add('expanded');
                    hasExpanded = true;
                }
                
                setTimeout(typeWriter, this.typingSpeed);
            } else {
                this.isTyping = false;
                this.isComplete = true;
                
                // Detener el sonido cuando termine de escribir
                this.stopSound();
                
                this.showContinuePrompt();
            }
        };

        typeWriter();
    }
    
    stopSound() {
        if (this.typewriterSound) {
            this.typewriterSound.pause();
            this.typewriterSound.currentTime = 0;
        }
    }

    showContinuePrompt() {
        const skipElement = document.querySelector('.intro-skip');
        if (skipElement) {
            skipElement.textContent = 'Presiona ESPACIO o haz clic para continuar';
            skipElement.style.animation = 'pulse 1s infinite';
        }
    }

    skipIntro() {
        if (this.isSkipping) return; // Prevenir múltiples llamadas
        
        // Detener el sonido de typewriter
        this.stopSound();
        
        if (this.isComplete) {
            this.isSkipping = true;
            this.showMainMenu();
        } else {
            // Si aún está escribiendo, mostrar todo el texto inmediatamente
            this.isSkipping = true;
            const introElement = document.getElementById('introText');
            const introContent = document.querySelector('.intro-content');
            introElement.textContent = this.introText;
            
            // Expandir el contenedor si no está expandido
            if (!introContent.classList.contains('expanded')) {
                introContent.classList.add('expanded');
            }
            
            this.isTyping = false;
            this.isComplete = true;
            this.showContinuePrompt();
            
            // Permitir skip después de un momento
            setTimeout(() => {
                this.isSkipping = false;
            }, 300);
        }
    }

    showMainMenu() {
        const introScreen = document.getElementById('introScreen');
        const gameInterface = document.getElementById('gameInterface');

        // Fade out de la intro
        introScreen.style.transition = 'opacity 1s ease-out';
        introScreen.style.opacity = '0';

        // Mostrar interfaz del juego después del fade
        setTimeout(() => {
            introScreen.style.display = 'none';
            gameInterface.style.display = 'block';

            // Fade in del juego
            gameInterface.style.opacity = '0';
            gameInterface.style.transition = 'opacity 1s ease-in';
            setTimeout(() => {
                gameInterface.style.opacity = '1';
                // Iniciar el juego después de la intro
                if (typeof initGame === 'function') {
                    initGame();
                }
            }, 100);
        }, 1000);
    }
}

// Verificar si ya se mostró la intro (usando localStorage)
function shouldShowIntro() {
    const introShown = localStorage.getItem('introShown');
    return true; // Mostrar si no se ha mostrado antes
}

function markIntroAsShown() {
    localStorage.setItem('introShown', 'true');
}

// Función para saltar intro (para desarrollo/testing)
function skipIntroDev() {
    const intro = new IntroSystem();
    intro.showMainMenu();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Intro.js loaded - DOM ready');
    console.log('📊 Intro shown before:', localStorage.getItem('introShown'));

    // Para desarrollo: agregar parámetro ?skipIntro=true para saltar
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skipIntro') === 'true') {
        console.log('⏭️ Skipping intro due to URL parameter');
        document.getElementById('introScreen').style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        // Iniciar el juego inmediatamente
        if (typeof initGame === 'function') {
            initGame();
        }
        return;
    }

    // Para desarrollo: agregar parámetro ?forceIntro=true para forzar mostrar intro
    if (urlParams.get('forceIntro') === 'true') {
        console.log('🎭 Forcing intro display');
        localStorage.removeItem('introShown');
    }

    // Mostrar intro si no se ha visto antes
    if (shouldShowIntro()) {
        console.log('🎭 Showing intro for first time');
        new IntroSystem();
        markIntroAsShown();
    } else {
        console.log('⏭️ Intro already shown, going straight to game');
        // Si ya se mostró, ir directo al juego
        document.getElementById('introScreen').style.display = 'none';
        document.getElementById('gameInterface').style.display = 'block';
        // Iniciar el juego
        if (typeof initGame === 'function') {
            initGame();
        }
    }
});

// Exponer funciones globales para desarrollo
window.skipIntroDev = skipIntroDev;
window.resetIntro = () => {
    localStorage.removeItem('introShown');
    location.reload();
};

console.log('🎬 Sistema de Intro cargado');
console.log('💡 Para desarrollo: agrega ?skipIntro=true a la URL para saltar la intro');
console.log('🔄 Para resetear: ejecuta resetIntro() en la consola');
