const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// Variables del jugador
const player = {
    x: 50, y: 50, w: 20, h: 20,
    speed: 2, stealthSpeed: 1, runningSpeed: 4,
    noise: 0, isStealth: false, inShadow: false
};

// Variables de los enemigos
const enemies = [
    { x: 300, y: 200, w: 20, h: 20, speed: 1, visionRange: 100, alert: false, patrol: [[300, 200], [500, 200], [500, 400], [300, 400]], patrolIndex: 0, direction: 1 }
];

// Mapa con obstáculos y sombras
const walls = [
    { x: 200, y: 150, w: 200, h: 20 },
    { x: 100, y: 300, w: 150, h: 20 }
];

const shadows = [
    { x: 400, y: 100, w: 100, h: 100 }
];

// Objetos interactivos
const objects = [
    { x: 700, y: 500, w: 20, h: 20, type: "loot" } // El objeto que el jugador debe robar
];

// Teclas presionadas
const keys = {};
document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Dibuja elementos
function drawPlayer() {
    ctx.fillStyle = player.inShadow ? "darkgray" : "white";
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.alert ? "red" : "blue";
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    });
}

function drawWalls() {
    ctx.fillStyle = "gray";
    walls.forEach(w => ctx.fillRect(w.x, w.y, w.w, w.h));
}

function drawShadows() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    shadows.forEach(s => ctx.fillRect(s.x, s.y, s.w, s.h));
}

function drawObjects() {
    ctx.fillStyle = "gold";
    objects.forEach(o => ctx.fillRect(o.x, o.y, o.w, o.h));
}

// Movimiento del jugador
function movePlayer() {
    let speed = keys["Shift"] ? player.stealthSpeed : (keys["Control"] ? player.runningSpeed : player.speed);
    
    if (keys["ArrowUp"] || keys["w"]) player.y -= speed;
    if (keys["ArrowDown"] || keys["s"]) player.y += speed;
    if (keys["ArrowLeft"] || keys["a"]) player.x -= speed;
    if (keys["ArrowRight"] || keys["d"]) player.x += speed;

    // Detecta si está en la sombra
    player.inShadow = shadows.some(s =>
        player.x < s.x + s.w &&
        player.x + player.w > s.x &&
        player.y < s.y + s.h &&
        player.y + player.h > s.y
    );

    // Genera ruido dependiendo de la velocidad
    player.noise = keys["Control"] ? 3 : (keys["Shift"] ? 0.5 : 1);
}

// Movimiento de los enemigos
function moveEnemies() {
    enemies.forEach(enemy => {
        let target = enemy.patrol[enemy.patrolIndex];
        let dx = target[0] - enemy.x;
        let dy = target[1] - enemy.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrol.length;
        } else {
            enemy.x += (dx / dist) * enemy.speed;
            enemy.y += (dy / dist) * enemy.speed;
        }
    });
}

// Detección del jugador por los enemigos
function detectPlayer() {
    enemies.forEach(enemy => {
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < enemy.visionRange && !player.inShadow && player.noise > 0.5) {
            enemy.alert = true;
        } else {
            enemy.alert = false;
        }
    });
}

// Verifica si el jugador interactúa con objetos
function checkInteraction() {
    if (keys[" "]) {
        objects.forEach((obj, index) => {
            if (player.x < obj.x + obj.w &&
                player.x + player.w > obj.x &&
                player.y < obj.y + obj.h &&
                player.y + player.h > obj.y) {
                if (obj.type === "loot") {
                    alert("¡Has robado el objeto! Ahora escapa.");
                    objects.splice(index, 1);
                }
            }
        });
    }
}

// Bucle principal del juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShadows();
    drawWalls();
    drawObjects();
    drawPlayer();
    drawEnemies();
    movePlayer();
    moveEnemies();
    detectPlayer();
    checkInteraction();
    requestAnimationFrame(gameLoop);
}

gameLoop();
