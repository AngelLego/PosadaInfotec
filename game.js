// Interfaces y tipos principales
class Teacher {
    constructor(id, name, generation, registrationDate = new Date()) {
        this.id = id;
        this.name = name;
        this.generation = generation;
        this.registrationDate = registrationDate;
    }
}

class GameResult {
    constructor(id, teacherId, score, carbonCount, gameDate = new Date(), duration = 0) {
        this.id = id;
        this.teacherId = teacherId;
        this.score = score;
        this.carbonCount = carbonCount;
        this.gameDate = gameDate;
        this.duration = duration;
    }
}

class FallingObject {
    constructor(x, y, type, sprite, points = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sprite = sprite;
        this.points = points;
        this.width = 40;
        this.height = 40;
        this.speed = 2;
    }
    
    update() {
        this.y += this.speed;
    }
    
    draw(ctx) {
        if (this.sprite instanceof Image && this.sprite.complete) {
            ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: dibujar rectángulo con texto
            ctx.fillStyle = this.type === 'carbon' ? '#333' : 
                           this.type === 'infotec' ? '#0066cc' : '#4CAF50';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.type, this.x + this.width/2, this.y + this.height/2);
        }
    }
    
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
    
    collidesWith(basket) {
        return this.x < basket.x + basket.width &&
               this.x + this.width > basket.x &&
               this.y < basket.y + basket.height &&
               this.y + this.height > basket.y;
    }
}

class CollectionBasket {
    constructor(x, y, canvasWidth) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 60;
        this.speed = 8; // Aumentado para mejor respuesta
        this.canvasWidth = canvasWidth;
    }
    
    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
    }
    
    moveRight() {
        this.x = Math.min(this.canvasWidth - this.width, this.x + this.speed);
    }
    
    draw(ctx) {
        // Dibujar canasta navideña
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Dibujar borde dorado navideño
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Dibujar líneas de la canasta
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
            const lineX = this.x + (this.width / 4) * i;
            ctx.beginPath();
            ctx.moveTo(lineX, this.y);
            ctx.lineTo(lineX, this.y + this.height);
            ctx.stroke();
        }
        
        // Agregar decoración navideña en la canasta
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(this.x + 5, this.y - 10, this.width - 10, 8);
        
        // Pequeños adornos
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y - 6, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 35, this.y - 6, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 55, this.y - 6, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ScoreManager {
    constructor() {
        this.score = 0;
        this.carbonCount = 0;
        this.level = 1;
        this.maxCarbons = 5; // Incrementado de 3 a 5
    }
    
    addScore(points) {
        this.score += points;
        this.updateLevel();
        this.updateScoreDisplay();
    }
    
    addCarbon() {
        this.carbonCount++;
        this.updateCarbonDisplay();
        return this.carbonCount >= this.maxCarbons;
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.score / 200) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
            this.updateLevelDisplay();
        }
    }
    
    reset() {
        this.score = 0;
        this.carbonCount = 0;
        this.level = 1;
        this.updateScoreDisplay();
        this.updateCarbonDisplay();
        this.updateLevelDisplay();
    }
    
    updateScoreDisplay() {
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = this.score.toLocaleString();
        }
    }
    
    updateCarbonDisplay() {
        const carbonElement = document.getElementById('carbonCount');
        if (carbonElement) {
            carbonElement.textContent = `${this.carbonCount}/${this.maxCarbons}`;
            carbonElement.className = 'info-value carbon-counter';
            if (this.carbonCount >= this.maxCarbons - 1) {
                carbonElement.classList.add('danger');
            }
        }
    }
    
    updateLevelDisplay() {
        const levelElement = document.getElementById('gameLevel');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
    }
}

// Adaptador de almacenamiento local
class LocalStorageAdapter {
    static saveTeacher(teacher) {
        const teachers = this.getTeachers();
        teachers[teacher.id] = teacher;
        localStorage.setItem('infotec_teachers', JSON.stringify(teachers));
    }
    
    static getTeachers() {
        const data = localStorage.getItem('infotec_teachers');
        return data ? JSON.parse(data) : {};
    }
    
    static saveGameResult(gameResult) {
        const results = this.getGameResults();
        results.push(gameResult);
        localStorage.setItem('infotec_game_results', JSON.stringify(results));
    }
    
    static getGameResults() {
        const data = localStorage.getItem('infotec_game_results');
        return data ? JSON.parse(data) : [];
    }
    
    static getCurrentTeacher() {
        const data = localStorage.getItem('infotec_current_teacher');
        return data ? JSON.parse(data) : null;
    }
    
    static setCurrentTeacher(teacher) {
        localStorage.setItem('infotec_current_teacher', JSON.stringify(teacher));
    }
}

// Clase para manejar el cronómetro
class GameTimer {
    constructor(duration = 60) { // 1 minuto por defecto
        this.duration = duration;
        this.timeLeft = duration;
        this.isRunning = false;
        this.intervalId = null;
    }
    
    start(onTick, onComplete) {
        this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (onTick) onTick(this.timeLeft);
            
            if (this.timeLeft <= 0) {
                this.stop();
                if (onComplete) onComplete();
            }
        }, 1000);
        this.updateDisplay();
    }
    
    stop() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.stop();
        this.timeLeft = this.duration;
        this.updateDisplay();
    }
    
    updateDisplay() {
        const timerElement = document.getElementById('gameTimer');
        if (timerElement) {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Cambiar color cuando queda poco tiempo
            timerElement.className = 'info-value timer';
            if (this.timeLeft <= 10) {
                timerElement.classList.add('warning');
            }
        }
    }
    
    getTimeLeft() {
        return this.timeLeft;
    }
}

// Clase principal del juego
class InfotecGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.basket = new CollectionBasket(360, 540, this.canvas.width);
        this.scoreManager = new ScoreManager();
        this.timer = new GameTimer(60); // 1 minuto
        this.fallingObjects = [];
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameStartTime = null;
        this.currentTeacher = null;
        this.keys = {};
        this.spawnRate = 1000; // Velocidad inicial de aparición muy rápida
        this.objectSpeed = 3; // Velocidad inicial de caída más rápida
        
        this.initializeImages();
        this.setupEventListeners();
        this.loadCurrentTeacher();
    }
    
    initializeImages() {
        // Cargar imágenes
        this.images = {
            infotec: new Image(),
            javascript: new Image(),
            python: new Image(),
            java: new Image(),
            react: new Image(),
            nodejs: new Image(),
            csharp: new Image(),
            cpp: new Image(),
            php: new Image(),
            html: new Image(),
            css: new Image(),
            carbon: new Image(),
            // Objetos navideños
            gift: new Image(),
            star: new Image(),
            bell: new Image(),
            candy: new Image(),
            snowflake: new Image(),
            grinch: new Image()
        };
        
        // Logo de INFOTEC desde la carpeta imagenes
        this.images.infotec.src = 'imagenes/Infotec-logo.png';
        
        // Crear sprites mejorados para otros objetos
        this.createEnhancedSprites();
    }
    
    createEnhancedSprites() {
        // Configurar polyfill para roundRect
        this.setupCanvasPolyfill();
        
        // Función optimizada para crear sprites
        const createSprite = (bgColor, text, textColor = 'white', fontSize = 16, emoji = false) => {
            const canvas = document.createElement('canvas');
            canvas.width = 60;
            canvas.height = 60;
            const ctx = canvas.getContext('2d');
            
            // Fondo con gradiente optimizado
            const gradient = ctx.createLinearGradient(0, 0, 60, 60);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, this.adjustBrightness(bgColor, -20));
            
            ctx.fillStyle = gradient;
            this.drawRoundRect(ctx, 0, 0, 60, 60, 10);
            ctx.fill();
            
            // Borde brillante
            ctx.strokeStyle = this.adjustBrightness(bgColor, 30);
            ctx.lineWidth = 3;
            this.drawRoundRect(ctx, 2, 2, 56, 56, 8);
            ctx.stroke();
            
            // Texto o emoji centrado
            ctx.fillStyle = textColor;
            ctx.font = emoji ? `${fontSize + 6}px Arial` : `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Sombra del texto para mejor legibilidad
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            ctx.fillText(text, 30, 30);
            
            // Resetear sombra
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            const img = new Image();
            img.src = canvas.toDataURL();
            return img;
        };
        
        // Crear logos de programación con colores oficiales
        this.images.javascript = createSprite('#f7df1e', 'JS', 'black', 16);
        this.images.python = createSprite('#3776ab', 'PY', 'white', 16);
        this.images.java = createSprite('#ed8b00', '☕', 'white', 22, true);
        this.images.react = createSprite('#61dafb', '⚛', 'black', 24, true);
        this.images.nodejs = createSprite('#339933', 'NODE', 'white', 11);
        this.images.csharp = createSprite('#239120', 'C#', 'white', 16);
        this.images.cpp = createSprite('#00599c', 'C++', 'white', 14);
        this.images.php = createSprite('#777bb4', 'PHP', 'white', 14);
        this.images.html = createSprite('#e34f26', 'HTML', 'white', 11);
        this.images.css = createSprite('#1572b6', 'CSS', 'white', 14);
        this.images.carbon = createSprite('#333333', '💨', 'white', 22, true);
        
        // Crear objetos navideños especiales
        this.images.gift = createSprite('#dc2626', '🎁', 'white', 26, true);
        this.images.star = createSprite('#fbbf24', '⭐', 'white', 26, true);
        this.images.bell = createSprite('#f59e0b', '🔔', 'white', 26, true);
        this.images.candy = createSprite('#ec4899', '🍭', 'white', 26, true);
        this.images.snowflake = createSprite('#60a5fa', '❄️', 'white', 26, true);
        this.images.grinch = createSprite('#16a34a', '👹', 'white', 26, true);
    }
    
    drawRoundRect(ctx, x, y, width, height, radius) {
        if (ctx.roundRect) {
            ctx.roundRect(x, y, width, height, radius);
        } else {
            // Fallback manual
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }
    }
    
    adjustBrightness(color, amount) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * amount);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    // Polyfill para roundRect si no está disponible
    setupCanvasPolyfill() {
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
            };
        }
    }
    
    setupEventListeners() {
        // Eventos del teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            // Prevenir scroll de la página con las flechas
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Eventos de mouse mejorados
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameRunning && !this.gamePaused) {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const canvasMouseX = (mouseX / rect.width) * this.canvas.width;
                
                // Posicionar canasta directamente en la posición del mouse
                this.basket.x = Math.max(0, Math.min(this.canvas.width - this.basket.width, canvasMouseX - this.basket.width / 2));
            }
        });
        
        // Eventos táctiles mejorados para dispositivos móviles
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouchMove(e);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouchMove(e);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
        
        // Hacer que el canvas sea focusable
        this.canvas.setAttribute('tabindex', '0');
        
        // Eventos de botones del menú principal
        document.getElementById('registerBtn').addEventListener('click', () => {
            this.registerTeacher();
        });
        
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('endGameBtn').addEventListener('click', () => {
            this.endGame();
        });
        
        document.getElementById('backToMenu').addEventListener('click', () => {
            this.showMainMenu();
        });
        
        document.getElementById('showStatsBtn').addEventListener('click', () => {
            this.showStatsMenu();
        });
        
        document.getElementById('showIndividualStats').addEventListener('click', () => {
            this.showIndividualStats();
        });
        
        document.getElementById('showGenerationStats').addEventListener('click', () => {
            this.showGenerationStats();
        });
        
        document.getElementById('showRankings').addEventListener('click', () => {
            this.showRankings();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOverScreen();
            this.startGame();
        });
        
        document.getElementById('viewStatsBtn').addEventListener('click', () => {
            this.hideGameOverScreen();
            this.showStatsMenu();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.hideGameOverScreen();
            this.showMainMenu();
        });
        
        document.getElementById('resetStatsBtn').addEventListener('click', () => {
            this.resetAllStats();
        });
        
        // Controles de movimiento mejorados para botones
        this.setupButtonControls('moveLeftBtn', 'ArrowLeft');
        this.setupButtonControls('moveRightBtn', 'ArrowRight');
    }
    
    handleTouchMove(e) {
        if (this.gameRunning && !this.gamePaused && e.touches.length > 0) {
            const rect = this.canvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const canvasTouchX = (touchX / rect.width) * this.canvas.width;
            
            // Posicionar canasta directamente en la posición del toque
            this.basket.x = Math.max(0, Math.min(this.canvas.width - this.basket.width, canvasTouchX - this.basket.width / 2));
        }
    }
    
    setupButtonControls(buttonId, keyCode) {
        const button = document.getElementById(buttonId);
        
        // Eventos de mouse
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys[keyCode] = true;
        });
        
        button.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys[keyCode] = false;
        });
        
        button.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            this.keys[keyCode] = false;
        });
        
        // Eventos táctiles optimizados
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys[keyCode] = true;
            button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys[keyCode] = false;
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys[keyCode] = false;
            button.style.transform = 'scale(1)';
        });
    }
    
    loadCurrentTeacher() {
        const teacher = LocalStorageAdapter.getCurrentTeacher();
        if (teacher) {
            this.currentTeacher = teacher;
            document.getElementById('teacherName').value = teacher.name;
            document.getElementById('teacherGeneration').value = teacher.generation;
            document.getElementById('startGameBtn').disabled = false;
            document.getElementById('currentPlayer').textContent = teacher.name;
            this.showMessage('Bienvenido de vuelta, ' + teacher.name + '!', 'success');
        }
    }
    
    registerTeacher() {
        const name = document.getElementById('teacherName').value.trim();
        const generation = parseInt(document.getElementById('teacherGeneration').value);
        
        if (!name) {
            this.showMessage('Por favor ingresa tu nombre', 'error');
            return;
        }
        
        if (!generation || generation < 1 || generation > 12) {
            this.showMessage('Por favor selecciona una generación válida (1-12)', 'error');
            return;
        }
        
        const teacher = new Teacher(
            'teacher_' + Date.now(),
            name,
            generation
        );
        
        LocalStorageAdapter.saveTeacher(teacher);
        LocalStorageAdapter.setCurrentTeacher(teacher);
        this.currentTeacher = teacher;
        
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('currentPlayer').textContent = teacher.name;
        this.showMessage('Registro exitoso! Ahora puedes iniciar el juego.', 'success');
    }
    
    showMessage(message, type) {
        const messageElement = document.getElementById('registrationMessage');
        messageElement.textContent = message;
        messageElement.className = type;
    }
    
    startGame() {
        if (!this.currentTeacher) {
            this.showMessage('Debes registrarte primero', 'error');
            return;
        }
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameStartTime = Date.now();
        this.scoreManager.reset();
        this.timer.reset();
        this.fallingObjects = [];
        this.spawnRate = 1000;
        this.objectSpeed = 3;
        
        // Configurar polyfill para canvas
        this.setupCanvasPolyfill();
        
        // Mostrar elementos del juego
        document.getElementById('registrationMenu').style.display = 'none';
        document.getElementById('gameInfo').style.display = 'grid';
        document.getElementById('gameInstructions').style.display = 'block';
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('gameControls').style.display = 'block';
        
        // Asegurar que el canvas tenga foco para eventos de teclado
        setTimeout(() => {
            this.canvas.focus();
        }, 100);
        
        // Iniciar cronómetro
        this.timer.start(
            (timeLeft) => {
                // Aumentar dificultad con el tiempo (más frecuente)
                if (timeLeft === 50) this.increaseDifficulty();
                if (timeLeft === 40) this.increaseDifficulty();
                if (timeLeft === 30) this.increaseDifficulty();
                if (timeLeft === 20) this.increaseDifficulty();
                if (timeLeft === 10) this.increaseDifficulty();
            },
            () => {
                // Tiempo agotado
                this.endGame('¡Tiempo agotado!');
            }
        );
        
        this.gameLoop();
        this.spawnObjects();
    }
    
    increaseDifficulty() {
        this.spawnRate = Math.max(400, this.spawnRate - 200); // Spawn más rápido
        this.objectSpeed = Math.min(7, this.objectSpeed + 0.8); // Velocidad más alta
        
        // Actualizar velocidad de objetos existentes
        this.fallingObjects.forEach(obj => {
            obj.speed = this.objectSpeed;
        });
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Mover canasta con controles de teclado (más suave)
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.basket.moveLeft();
            this.basket.moveLeft(); // Doble movimiento para mayor velocidad
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.basket.moveRight();
            this.basket.moveRight(); // Doble movimiento para mayor velocidad
        }
        
        // Actualizar objetos que caen (optimizado)
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            obj.update();
            
            // Verificar colisión con canasta (hitbox mejorada)
            if (this.checkCollision(obj, this.basket)) {
                this.collectObject(obj);
                this.fallingObjects.splice(i, 1);
                continue;
            }
            
            // Remover objetos fuera de pantalla
            if (obj.y > this.canvas.height + 50) {
                this.fallingObjects.splice(i, 1);
            }
        }
    }
    
    checkCollision(obj, basket) {
        // Hitbox más generosa para mejor jugabilidad
        const margin = 5;
        return obj.x < basket.x + basket.width + margin &&
               obj.x + obj.width > basket.x - margin &&
               obj.y < basket.y + basket.height + margin &&
               obj.y + obj.height > basket.y - margin;
    }
    
    collectObject(obj) {
        switch (obj.type) {
            case 'programming':
                this.scoreManager.addScore(obj.points);
                this.showPointsEffect(obj.x, obj.y, `+${obj.points}`, '#4CAF50');
                break;
            case 'infotec':
                const bonusPoints = obj.points * 2;
                this.scoreManager.addScore(bonusPoints);
                this.showPointsEffect(obj.x, obj.y, `+${bonusPoints} INFOTEC!`, '#00d4ff');
                break;
            case 'christmas':
                const christmasPoints = obj.points + Math.floor(Math.random() * 10); // Bonus aleatorio navideño
                this.scoreManager.addScore(christmasPoints);
                this.showPointsEffect(obj.x, obj.y, `+${christmasPoints} 🎄`, '#FFD700');
                break;
            case 'carbon':
                const gameOver = this.scoreManager.addCarbon();
                this.showPointsEffect(obj.x, obj.y, '💨 CARBÓN!', '#ff6b6b');
                if (gameOver) {
                    this.endGame('¡Demasiado carbón recolectado!');
                }
                break;
            case 'grinch':
                // El Grinch roba puntos!
                const stolenPoints = Math.min(50, this.scoreManager.score);
                this.scoreManager.score = Math.max(0, this.scoreManager.score - stolenPoints);
                this.scoreManager.updateScoreDisplay();
                this.showPointsEffect(obj.x, obj.y, `👹 -${stolenPoints}!`, '#8B0000');
                break;
        }
    }
    
    showPointsEffect(x, y, text, color) {
        // Crear efecto visual de puntos (simplificado para este ejemplo)
        const effect = {
            x: x,
            y: y,
            text: text,
            color: color,
            opacity: 1,
            life: 60 // frames
        };
        
        // En una implementación completa, esto se añadiría a un array de efectos
        // y se renderizaría en cada frame
    }
    
    spawnObjects() {
        if (!this.gameRunning || this.gamePaused) return;
        
        const objectTypes = [
            // Logos de programación (mayor peso para que aparezcan más)
            { type: 'programming', sprite: this.images.javascript, points: 10, weight: 15 },
            { type: 'programming', sprite: this.images.python, points: 15, weight: 15 },
            { type: 'programming', sprite: this.images.java, points: 12, weight: 15 },
            { type: 'programming', sprite: this.images.react, points: 18, weight: 12 },
            { type: 'programming', sprite: this.images.nodejs, points: 14, weight: 12 },
            { type: 'programming', sprite: this.images.csharp, points: 16, weight: 10 },
            { type: 'programming', sprite: this.images.cpp, points: 20, weight: 8 },
            { type: 'programming', sprite: this.images.php, points: 8, weight: 12 },
            { type: 'programming', sprite: this.images.html, points: 6, weight: 15 },
            { type: 'programming', sprite: this.images.css, points: 8, weight: 15 },
            
            // Objetos especiales
            { type: 'infotec', sprite: this.images.infotec, points: 50, weight: 8 },
            
            // Objetos navideños (buenos) - mayor peso
            { type: 'christmas', sprite: this.images.gift, points: 25, weight: 20 },
            { type: 'christmas', sprite: this.images.star, points: 30, weight: 18 },
            { type: 'christmas', sprite: this.images.bell, points: 20, weight: 20 },
            { type: 'christmas', sprite: this.images.candy, points: 15, weight: 22 },
            { type: 'christmas', sprite: this.images.snowflake, points: 10, weight: 25 },
            
            // Objetos negativos (peso aumentado para mayor dificultad)
            { type: 'carbon', sprite: this.images.carbon, points: 0, weight: 45 },
            { type: 'grinch', sprite: this.images.grinch, points: 0, weight: 20 }
        ];
        
        // Seleccionar tipo de objeto basado en pesos
        const totalWeight = objectTypes.reduce((sum, obj) => sum + obj.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedType = objectTypes[0];
        
        for (const objType of objectTypes) {
            random -= objType.weight;
            if (random <= 0) {
                selectedType = objType;
                break;
            }
        }
        
        const objSize = 55; // Tamaño más grande para mejor visibilidad
        const x = Math.random() * (this.canvas.width - objSize);
        const obj = new FallingObject(x, -objSize, selectedType.type, selectedType.sprite, selectedType.points);
        obj.speed = this.objectSpeed;
        obj.width = objSize;
        obj.height = objSize;
        this.fallingObjects.push(obj);
        
        // Ocasionalmente crear ráfagas de carbones (10% de probabilidad)
        if (Math.random() < 0.1 && selectedType.type === 'carbon') {
            // Crear 2-3 carbones adicionales en ráfaga
            const burstCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => {
                    if (this.gameRunning && !this.gamePaused) {
                        const burstX = Math.random() * (this.canvas.width - objSize);
                        const burstObj = new FallingObject(burstX, -objSize - (i * 30), 'carbon', this.images.carbon, 0);
                        burstObj.speed = this.objectSpeed;
                        burstObj.width = objSize;
                        burstObj.height = objSize;
                        this.fallingObjects.push(burstObj);
                    }
                }, i * 200); // Espaciado de 200ms entre carbones de la ráfaga
            }
        }
        
        // Programar siguiente objeto con velocidad variable
        const baseDelay = this.spawnRate;
        const randomVariation = Math.random() * 300; // Reducido para más variabilidad
        const delay = baseDelay + randomVariation;
        
        setTimeout(() => this.spawnObjects(), delay);
    }
    
    draw() {
        // Fondo navideño con gradiente
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1e3a8a'); // Azul nocturno
        gradient.addColorStop(0.3, '#2563eb'); // Azul medio
        gradient.addColorStop(0.7, '#0d4f3c'); // Verde navideño
        gradient.addColorStop(1, '#1a5c4a'); // Verde oscuro
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar nieve cayendo
        this.drawSnow();
        
        // Dibujar árboles navideños de fondo
        this.drawChristmasTrees();
        
        // Dibujar canasta con sombra
        this.drawBasketWithShadow();
        
        // Dibujar objetos que caen con efectos
        this.fallingObjects.forEach(obj => {
            this.drawObjectWithEffects(obj);
        });
        
        // Dibujar efectos de pausa si está pausado
        if (this.gamePaused) {
            this.drawPauseOverlay();
        }
        
        // Dibujar indicador de controles
        this.drawControlsHint();
    }
    
    drawSnow() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Copos de nieve animados
        const time = Date.now() * 0.001;
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5 + time * 50) % this.canvas.width;
            const y = (i * 73.3 + time * 30) % this.canvas.height;
            const size = 1 + (i % 3);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawChristmasTrees() {
        // Árboles navideños de fondo
        const trees = [
            { x: 50, y: 400, size: 0.8 },
            { x: 200, y: 420, size: 1.0 },
            { x: 600, y: 410, size: 0.9 },
            { x: 750, y: 430, size: 0.7 }
        ];
        
        trees.forEach(tree => {
            this.drawChristmasTree(tree.x, tree.y, tree.size);
        });
    }
    
    drawChristmasTree(x, y, scale) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        
        // Tronco
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(-10, 0, 20, 40);
        
        // Capas del árbol
        this.ctx.fillStyle = '#0d4f3c';
        
        // Capa inferior
        this.ctx.beginPath();
        this.ctx.moveTo(0, -60);
        this.ctx.lineTo(-40, 0);
        this.ctx.lineTo(40, 0);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Capa media
        this.ctx.beginPath();
        this.ctx.moveTo(0, -80);
        this.ctx.lineTo(-30, -20);
        this.ctx.lineTo(30, -20);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Capa superior
        this.ctx.beginPath();
        this.ctx.moveTo(0, -100);
        this.ctx.lineTo(-20, -40);
        this.ctx.lineTo(20, -40);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Estrella en la punta
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⭐', 0, -95);
        
        this.ctx.restore();
    }
    
    drawBasketWithShadow() {
        // Sombra de la canasta
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(this.basket.x + 5, this.basket.y + 5, this.basket.width, this.basket.height);
        
        // Canasta
        this.basket.draw(this.ctx);
    }
    
    drawObjectWithEffects(obj) {
        // Sombra del objeto
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(obj.x + 3, obj.y + 3, obj.width, obj.height);
        
        // Objeto principal
        obj.draw(this.ctx);
        
        // Efecto de brillo para INFOTEC
        if (obj.type === 'infotec') {
            this.ctx.shadowColor = '#00d4ff';
            this.ctx.shadowBlur = 10;
            obj.draw(this.ctx);
            this.ctx.shadowBlur = 0;
        }
        
        // Efecto de humo para carbón
        if (obj.type === 'carbon') {
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            for (let i = 0; i < 3; i++) {
                const smokeX = obj.x + Math.random() * obj.width;
                const smokeY = obj.y + obj.height + i * 10;
                this.ctx.beginPath();
                this.ctx.arc(smokeX, smokeY, 3 + i, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    drawPauseOverlay() {
        // Overlay semi-transparente
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Texto de pausa
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('PAUSADO', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '20px Roboto';
        this.ctx.fillText('Presiona REANUDAR para continuar', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
    
    drawControlsHint() {
        // Mostrar indicador de controles en la esquina
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(10, 10, 200, 60);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Roboto';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Controles:', 20, 30);
        this.ctx.fillText('← → o A/D: Mover canasta', 20, 45);
        this.ctx.fillText('Mouse/Touch: También funciona', 20, 60);
        
        // Resetear alineación
        this.ctx.textAlign = 'center';
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.gamePaused) {
            pauseBtn.textContent = '▶️ REANUDAR';
            this.timer.stop();
        } else {
            pauseBtn.textContent = '⏸️ PAUSAR';
            this.timer.start(
                (timeLeft) => {
                    if (timeLeft === 50) this.increaseDifficulty();
                    if (timeLeft === 40) this.increaseDifficulty();
                    if (timeLeft === 30) this.increaseDifficulty();
                    if (timeLeft === 20) this.increaseDifficulty();
                    if (timeLeft === 10) this.increaseDifficulty();
                },
                () => this.endGame('¡Tiempo agotado!')
            );
            this.gameLoop();
            this.spawnObjects();
        }
    }
    
    endGame(reason = '¡Juego terminado!') {
        this.gameRunning = false;
        this.gamePaused = false;
        this.timer.stop();
        
        const duration = Date.now() - this.gameStartTime;
        const timeBonus = this.timer.getTimeLeft() * 2;
        const finalScore = this.scoreManager.score + timeBonus;
        
        const gameResult = new GameResult(
            'game_' + Date.now(),
            this.currentTeacher.id,
            finalScore, // Guardar el puntaje final con bonus
            this.scoreManager.carbonCount,
            new Date(),
            duration
        );
        
        LocalStorageAdapter.saveGameResult(gameResult);
        
        // Mostrar pantalla de resultados con imagen
        this.showGameOverScreen(reason, gameResult, timeBonus, duration);
    }
    
    showGameOverScreen(reason, gameResult, timeBonus, duration) {
        // Ocultar elementos del juego
        document.getElementById('gameInfo').style.display = 'none';
        document.getElementById('gameInstructions').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('gameControls').style.display = 'none';
        
        // Llenar datos de la pantalla de resultados
        document.getElementById('gameOverTitle').textContent = reason;
        document.getElementById('resultPlayer').textContent = this.currentTeacher.name;
        document.getElementById('resultGeneration').textContent = `Gen ${this.currentTeacher.generation}`;
        document.getElementById('resultScore').textContent = this.scoreManager.score.toLocaleString();
        document.getElementById('resultTimeBonus').textContent = `+${timeBonus}`;
        document.getElementById('resultFinalScore').textContent = gameResult.score.toLocaleString();
        document.getElementById('resultCarbons').textContent = `${this.scoreManager.carbonCount}/${this.scoreManager.maxCarbons}`;
        document.getElementById('resultLevel').textContent = this.scoreManager.level;
        
        // Formatear duración
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        document.getElementById('resultDuration').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Mostrar pantalla de resultados
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    hideGameOverScreen() {
        document.getElementById('gameOverScreen').style.display = 'none';
    }
    
    showMainMenu() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.timer.stop();
        
        document.getElementById('registrationMenu').style.display = 'block';
        document.getElementById('gameInfo').style.display = 'none';
        document.getElementById('gameInstructions').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'none';
        document.getElementById('gameControls').style.display = 'none';
        document.getElementById('statsMenu').style.display = 'none';
        document.getElementById('statsContainer').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Resetear botón de pausa
        document.getElementById('pauseBtn').textContent = '⏸️ PAUSAR';
    }
    
    showStatsMenu() {
        document.getElementById('registrationMenu').style.display = 'none';
        document.getElementById('statsMenu').style.display = 'block';
        document.getElementById('statsContainer').style.display = 'none';
    }
    
    showIndividualStats() {
        if (!this.currentTeacher) {
            alert('Debes registrarte primero para ver tus estadísticas');
            return;
        }
        
        const results = LocalStorageAdapter.getGameResults()
            .filter(result => result.teacherId === this.currentTeacher.id)
            .sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate));
        
        let html = '<h3>📊 Mis Estadísticas</h3>';
        
        if (results.length === 0) {
            html += '<p>No has jugado ninguna partida aún.</p>';
        } else {
            const totalGames = results.length;
            const bestScore = Math.max(...results.map(r => r.score));
            const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalGames);
            const totalCarbons = results.reduce((sum, r) => sum + r.carbonCount, 0);
            
            html += `
                <div class="result-stats">
                    <div class="result-stat">
                        <span class="result-stat-label">🎮 Partidas Jugadas:</span>
                        <span class="result-stat-value">${totalGames}</span>
                    </div>
                    <div class="result-stat">
                        <span class="result-stat-label">🏆 Mejor Puntaje:</span>
                        <span class="result-stat-value">${bestScore.toLocaleString()}</span>
                    </div>
                    <div class="result-stat">
                        <span class="result-stat-label">📈 Promedio:</span>
                        <span class="result-stat-value">${avgScore.toLocaleString()}</span>
                    </div>
                    <div class="result-stat">
                        <span class="result-stat-label">💨 Total Carbones:</span>
                        <span class="result-stat-value">${totalCarbons}</span>
                    </div>
                </div>
                
                <h4>🕒 Historial de Partidas</h4>
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Puntaje</th>
                            <th>Carbones</th>
                            <th>Duración</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            results.slice(0, 10).forEach(result => {
                const date = new Date(result.gameDate).toLocaleDateString();
                const duration = Math.floor(result.duration / 1000);
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                
                html += `
                    <tr>
                        <td>${date}</td>
                        <td>${result.score.toLocaleString()}</td>
                        <td>${result.carbonCount}/5</td>
                        <td>${minutes}:${seconds.toString().padStart(2, '0')}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
        }
        
        document.getElementById('statsContent').innerHTML = html;
        document.getElementById('statsContainer').style.display = 'block';
    }
    
    showGenerationStats() {
        const teachers = LocalStorageAdapter.getTeachers();
        const results = LocalStorageAdapter.getGameResults();
        
        let html = '<h3>🎓 Estadísticas por Generación</h3>';
        
        const generationStats = {};
        
        // Inicializar estadísticas por generación
        for (let gen = 1; gen <= 12; gen++) {
            generationStats[gen] = {
                players: 0,
                games: 0,
                totalScore: 0,
                bestScore: 0,
                avgScore: 0
            };
        }
        
        // Contar jugadores por generación
        Object.values(teachers).forEach(teacher => {
            generationStats[teacher.generation].players++;
        });
        
        // Procesar resultados
        results.forEach(result => {
            const teacher = teachers[result.teacherId];
            if (teacher) {
                const gen = teacher.generation;
                generationStats[gen].games++;
                generationStats[gen].totalScore += result.score;
                generationStats[gen].bestScore = Math.max(generationStats[gen].bestScore, result.score);
            }
        });
        
        // Calcular promedios
        Object.keys(generationStats).forEach(gen => {
            const stats = generationStats[gen];
            stats.avgScore = stats.games > 0 ? Math.round(stats.totalScore / stats.games) : 0;
        });
        
        html += `
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Generación</th>
                        <th>Jugadores</th>
                        <th>Partidas</th>
                        <th>Mejor Puntaje</th>
                        <th>Promedio</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (let gen = 1; gen <= 12; gen++) {
            const stats = generationStats[gen];
            html += `
                <tr>
                    <td>Generación ${gen}</td>
                    <td>${stats.players}</td>
                    <td>${stats.games}</td>
                    <td>${stats.bestScore.toLocaleString()}</td>
                    <td>${stats.avgScore.toLocaleString()}</td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        
        document.getElementById('statsContent').innerHTML = html;
        document.getElementById('statsContainer').style.display = 'block';
    }
    
    showRankings() {
        const teachers = LocalStorageAdapter.getTeachers();
        const results = LocalStorageAdapter.getGameResults();
        
        // Crear ranking de mejores puntajes
        const playerBestScores = {};
        
        results.forEach(result => {
            const teacher = teachers[result.teacherId];
            if (teacher) {
                const key = result.teacherId;
                if (!playerBestScores[key] || playerBestScores[key].score < result.score) {
                    playerBestScores[key] = {
                        name: teacher.name,
                        generation: teacher.generation,
                        score: result.score,
                        date: result.gameDate
                    };
                }
            }
        });
        
        const rankings = Object.values(playerBestScores)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);
        
        let html = '<h3>🏆 Ranking de Mejores Puntajes</h3>';
        
        if (rankings.length === 0) {
            html += '<p>No hay partidas registradas aún.</p>';
        } else {
            html += `
                <table class="stats-table">
                    <thead>
                        <tr>
                            <th>Posición</th>
                            <th>Jugador</th>
                            <th>Generación</th>
                            <th>Puntaje</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            rankings.forEach((player, index) => {
                const position = index + 1;
                let rankClass = 'rank-other';
                if (position === 1) rankClass = 'rank-1';
                else if (position === 2) rankClass = 'rank-2';
                else if (position === 3) rankClass = 'rank-3';
                
                const date = new Date(player.date).toLocaleDateString();
                
                html += `
                    <tr>
                        <td><span class="rank-badge ${rankClass}">${position}</span></td>
                        <td>${player.name}</td>
                        <td>Gen ${player.generation}</td>
                        <td>${player.score.toLocaleString()}</td>
                        <td>${date}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
        }
        
        document.getElementById('statsContent').innerHTML = html;
        document.getElementById('statsContainer').style.display = 'block';
    }
    
    resetAllStats() {
        const confirmReset = confirm(
            '⚠️ ADVERTENCIA ⚠️\n\n' +
            'Esta acción eliminará PERMANENTEMENTE:\n' +
            '• Todos los jugadores registrados\n' +
            '• Todas las partidas jugadas\n' +
            '• Todas las estadísticas\n' +
            '• Rankings y puntajes\n\n' +
            '¿Estás seguro de que quieres continuar?\n' +
            'Esta acción NO se puede deshacer.'
        );
        
        if (confirmReset) {
            const doubleConfirm = confirm(
                '🚨 ÚLTIMA CONFIRMACIÓN 🚨\n\n' +
                'Se eliminarán TODOS los datos del juego.\n' +
                'Esto incluye tu progreso actual.\n\n' +
                '¿Realmente quieres restablecer todo a 0?'
            );
            
            if (doubleConfirm) {
                // Limpiar localStorage
                localStorage.removeItem('infotec_teachers');
                localStorage.removeItem('infotec_game_results');
                localStorage.removeItem('infotec_current_teacher');
                
                // Resetear estado actual
                this.currentTeacher = null;
                
                // Limpiar formulario
                document.getElementById('teacherName').value = '';
                document.getElementById('teacherGeneration').value = '';
                document.getElementById('startGameBtn').disabled = true;
                document.getElementById('currentPlayer').textContent = '';
                
                // Mostrar mensaje de confirmación
                this.showMessage('✅ Todos los datos han sido restablecidos exitosamente.', 'success');
                
                // Volver al menú principal
                this.showMainMenu();
                
                alert('🎮 ¡Datos restablecidos!\n\nTodos los registros han sido eliminados.\nPuedes comenzar de nuevo registrándote.');
            }
        }
    }
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new InfotecGame();
});

// Exportar clases para pruebas (solo en entorno de pruebas)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Teacher,
        GameResult,
        FallingObject,
        CollectionBasket,
        ScoreManager,
        LocalStorageAdapter,
        GameTimer,
        InfotecGame
    };
}