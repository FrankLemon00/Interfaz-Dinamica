// ==========================================
// MÓDULO: LÓGICA DEL JUEGO Y CLASES
// ==========================================

// --- CARGA DE IMÁGENES ---
const assets = {
    dinoSprites: new Image(),
    cactusImage: new Image(),
    suelo: new Image(),
    nube: new Image()
};

// RUTAS
assets.dinoSprites.src = '../recursos/imagenes/dino.png';
assets.cactusImage.src = '../recursos/imagenes/cactus2.png';
assets.suelo.src = '../recursos/imagenes/suelo.png';
assets.nube.src = '../recursos/imagenes/nube.png';

// --- CONSTANTES ---
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const GROUND_Y = 500;
const INITIAL_SPEED = 6;
const ACCELERATION = 0.002;
const SKY_COLOR = '#87CEEB'; 

// --- CONFIGURACIÓN DEL DINO ---
const DINO_CONFIG = {
    frameWidth: 88,  
    drawWidth: 75,   
    height: 94,
    runFrames: [0, 1], 
    deadFrame: 2,      
    animationSpeed: 100 
};

// --- ESTADO INTERNO ---
let canvas, ctx;
let gameActive = false;
let gameLoopId;
let onUpdateCallback = null;  
let onGameOverCallback = null; 

let gameState = { score: 0, lives: 1, isGameOver: false };
let player;
let obstacles = [];
let clouds = [];
let groundSpeed = INITIAL_SPEED;
let groundX = 0;

let lastObstacleTime = 0;
let timeSinceLastObstacle = 0;
let nextObstacleDelay = 0;

// --- CLASES ---
class GameElement {
    constructor(x, y, width, height, color) {
        this.x = x; this.y = y; this.width = width; this.height = height; this.color = color;
    }
}

class Dino extends GameElement {
    constructor() {
        // ARREGLO: Aumenté el offset a 38 para que pise el suelo
        const DINO_OFFSET_Y = 38; 

        const startY = (GROUND_Y - DINO_CONFIG.height) + DINO_OFFSET_Y;

        super(100, startY, DINO_CONFIG.drawWidth, DINO_CONFIG.height, '#DAA520');
        
        this.vy = 0; 
        this.isJumping = false; 
        this.originalY = startY; 
        this.jumpPower = -17; 
        this.gravity = 0.8;
        this.currentFrameIndex = 0;
        this.frameTimer = 0;
    }
    update(delta) {
        if (this.isJumping) {
            this.vy += this.gravity; 
            this.y += this.vy;
            if (this.y >= this.originalY) { 
                this.y = this.originalY; 
                this.isJumping = false; 
                this.vy = 0; 
            }
        } else {
            this.frameTimer += delta;
            if (this.frameTimer > DINO_CONFIG.animationSpeed) {
                this.frameTimer = 0;
                this.currentFrameIndex = (this.currentFrameIndex + 1) % DINO_CONFIG.runFrames.length;
            }
        }
    }
    jump() { 
        if (!this.isJumping) { 
            this.isJumping = true; 
            this.vy = this.jumpPower; 
        } 
    }
    draw(ctx) {
        if (assets.dinoSprites.complete && assets.dinoSprites.naturalHeight !== 0) {
            let frameIndex;
            if (gameState.isGameOver) frameIndex = DINO_CONFIG.deadFrame;
            else if (this.isJumping) frameIndex = DINO_CONFIG.runFrames[0];
            else frameIndex = DINO_CONFIG.runFrames[this.currentFrameIndex];

            const sx = frameIndex * DINO_CONFIG.frameWidth;

            ctx.drawImage(
                assets.dinoSprites,
                sx, 0, DINO_CONFIG.drawWidth, DINO_CONFIG.height, 
                this.x, this.y, this.width, this.height
            );
        } else {
            ctx.fillStyle = this.color; 
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Cactus extends GameElement {
    constructor(x) {
        let w = 50; 
        let h = 90; 

        if (assets.cactusImage.complete && assets.cactusImage.naturalWidth !== 0) {
            const scale = 0.8; 
            w = assets.cactusImage.naturalWidth * scale;
            h = assets.cactusImage.naturalHeight * scale;
        }

        // Mantenemos el offset de los cactus en 25, parece estar bien
        const CACTUS_OFFSET_Y = 25; 

        super(x, (GROUND_Y - h) + CACTUS_OFFSET_Y, w, h, '#4CAF50');
    }
    update() { this.x -= groundSpeed; }
    draw(ctx) {
        if (assets.cactusImage.complete && assets.cactusImage.naturalHeight !== 0) {
            ctx.drawImage(assets.cactusImage, this.x, this.y, this.width, this.height);
        } else { 
            ctx.fillStyle = '#4CAF50'; 
            ctx.fillRect(this.x, this.y, this.width, this.height); 
        }
    }
}

class Cloud extends GameElement {
    constructor(x) { super(x, Math.random() * 200 + 50, 92, 54, '#bbb'); }
    update() { this.x -= groundSpeed * 0.3; } 
    draw(ctx) {
        if (assets.nube.complete && assets.nube.naturalHeight !== 0) 
            ctx.drawImage(assets.nube, 0, 0, 92, 54, this.x, this.y, this.width, this.height);
        else { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.width, this.height); }
    }
}

// --- FUNCIONES EXPORTADAS ---

export function initGameCanvas(canvasRef, ctxRef) {
    canvas = canvasRef; ctx = ctxRef;
    canvas.width = CANVAS_WIDTH; canvas.height = CANVAS_HEIGHT;
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('mousedown', () => { if(gameActive && player) player.jump(); });
}

export function startGameLoop(onUpdate, onGameOver) {
    onUpdateCallback = onUpdate;
    onGameOverCallback = onGameOver;
    
    gameState = { score: 0, lives: 1, isGameOver: false };
    player = new Dino();
    obstacles = [];
    clouds = [];
    groundSpeed = INITIAL_SPEED;
    groundX = 0;
    
    lastObstacleTime = performance.now();
    timeSinceLastObstacle = 0;
    nextObstacleDelay = 1000; 

    gameLoop.lastTime = null; 
    gameActive = true;
    gameLoop(0);
}

export function stopGame() {
    gameActive = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
}

// --- LÓGICA INTERNA ---

function handleInput(event) {
    if (gameActive && player && (event.code === 'Space' || event.code === 'ArrowUp')) {
        player.jump(); event.preventDefault();
    }
}

function checkCollision(a, b) {
    const paddingX = 20; 
    const paddingY = 15;
    return (a.x < b.x + b.width - paddingX && 
            a.x + a.width > b.x + paddingX &&
            a.y < b.y + b.height - paddingY && 
            a.y + a.height > b.y + paddingY);
}

function calculateNextObstacleDelay() {
    let speedFactor = groundSpeed / INITIAL_SPEED; 
    let minDelay = Math.max(800, 1200 / speedFactor);
    let maxDelay = Math.max(1600, 3000 / speedFactor);
    nextObstacleDelay = Math.random() * (maxDelay - minDelay) + minDelay;
}

function updateGame(delta) {
    if (gameState.isGameOver) return;
    if (delta > 100 || delta < 0) delta = 16; 

    groundSpeed += ACCELERATION;
    gameState.score += groundSpeed * 0.05;
    player.update(delta);

    groundX -= groundSpeed;
    if (groundX <= -CANVAS_WIDTH) groundX = 0;

    let canSpawnCloud = true;
    if (clouds.length > 0) {
        let lastCloud = clouds[clouds.length - 1];
        if (CANVAS_WIDTH - lastCloud.x < 400) canSpawnCloud = false;
    }
    if (canSpawnCloud && Math.random() < 0.015) clouds.push(new Cloud(CANVAS_WIDTH));
    clouds.forEach((c, i) => { c.update(); if (c.x + c.width < 0) clouds.splice(i, 1); });

    timeSinceLastObstacle += delta;
    if (timeSinceLastObstacle > nextObstacleDelay) {
        obstacles.push(new Cactus(CANVAS_WIDTH));
        timeSinceLastObstacle = 0;
        calculateNextObstacleDelay();
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        if (obstacles[i].x + obstacles[i].width < 0) { 
            obstacles.splice(i, 1); i--; continue; 
        }
        if (checkCollision(player, obstacles[i])) {
            gameState.lives = 0; 
            gameState.isGameOver = true;
            if (onGameOverCallback) onGameOverCallback(gameState.score);
            return;
        }
    }

    if (onUpdateCallback) onUpdateCallback(gameState.score, gameState.lives);
}

function drawGame() {
    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    clouds.forEach(c => c.draw(ctx));
    
    if (assets.suelo.complete && assets.suelo.naturalHeight !== 0) {
        ctx.drawImage(assets.suelo, groundX, GROUND_Y, CANVAS_WIDTH, 100);
        ctx.drawImage(assets.suelo, groundX + CANVAS_WIDTH, GROUND_Y, CANVAS_WIDTH, 100);
    } else { 
        ctx.fillStyle = '#444'; 
        ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y); 
    }

    if(player) player.draw(ctx);
    obstacles.forEach(o => o.draw(ctx));
}

function gameLoop(currentTime) {
    if (!gameActive) return;
    if (!gameLoop.lastTime) gameLoop.lastTime = currentTime;
    const delta = currentTime - gameLoop.lastTime;
    gameLoop.lastTime = currentTime;

    updateGame(delta);
    drawGame();

    if (!gameState.isGameOver) {
        gameLoopId = requestAnimationFrame(gameLoop);
    } else {
        drawGame(); 
    }
}