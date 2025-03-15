window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    let gameRunning = false;
    let detectionTimer = 0;

    // Jugador
    const player = {
        x: 100, y: 100, size: 20, speed: 3,
        dx: 0, dy: 0
    };

    // Enemigos
    const enemies = [
        { x: 400, y: 200, speed: 1.5, state: "patrolling", visionRange: 150 }
    ];

    // Movimiento del jugador
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "w") player.dy = -player.speed;
        if (e.key === "ArrowDown" || e.key === "s") player.dy = player.speed;
        if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
        if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
    });

    document.addEventListener("keyup", (e) => {
        if (["ArrowUp", "w", "ArrowDown", "s"].includes(e.key)) player.dy = 0;
        if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) player.dx = 0;
    });

    // Dibuja el jugador
    function drawPlayer() {
        ctx.fillStyle = "white";
        ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    // Dibuja la linterna del enemigo
    function drawEnemyLight(enemy) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.beginPath();
        ctx.moveTo(enemy.x + 10, enemy.y + 10);
        ctx.arc(enemy.x + 10, enemy.y + 10, enemy.visionRange, -Math.PI / 6, Math.PI / 6);
        ctx.closePath();
        ctx.fill();
    }

    // Dibuja los enemigos
    function drawEnemies() {
        ctx.fillStyle = "red";
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, 20, 20);
            drawEnemyLight(enemy);
        });
    }

    // Mueve al jugador
    function movePlayer() {
        player.x += player.dx;
        player.y += player.dy;
    }

    // IA de enemigos
    function moveEnemies() {
        enemies.forEach(enemy => {
            const distX = player.x - enemy.x;
            const distY = player.y - enemy.y;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < enemy.visionRange) {
                enemy.state = "chasing";
            } else {
                enemy.state = "patrolling";
            }

            if (enemy.state === "chasing") {
                // Perseguir al jugador
                const angle = Math.atan2(distY, distX);
                enemy.x += Math.cos(angle) * enemy.speed;
                enemy.y += Math.sin(angle) * enemy.speed;
            } else {
                // Patrullar horizontalmente
                if (!enemy.dir) enemy.dir = "right";
                if (enemy.dir === "right") enemy.x += enemy.speed;
                if (enemy.dir === "left") enemy.x -= enemy.speed;
                if (enemy.x > canvas.width - 20) enemy.dir = "left";
                if (enemy.x < 0) enemy.dir = "right";
            }
        });
    }

    // Detecta si el jugador es visto por un enemigo por más de 2 segundos
    function checkDetection() {
        let detected = false;

        enemies.forEach(enemy => {
            const distX = player.x - enemy.x;
            const distY = player.y - enemy.y;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < enemy.visionRange) {
                detected = true;
            }
        });

        if (detected) {
            detectionTimer += 16; // Aproximadamente 16ms por frame
            if (detectionTimer >= 2000) { // 2 segundos
                alert("¡Has sido detectado!");
                resetGame();
            }
        } else {
            detectionTimer = 0;
        }
    }

    // Bucle del juego
    function gameLoop() {
        if (!gameRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        movePlayer();
        moveEnemies();
        drawPlayer();
        drawEnemies();
        checkDetection();
        requestAnimationFrame(gameLoop);
    }

    // Iniciar el juego
    window.startGame = function() {
        document.getElementById("menu").style.display = "none";
        document.getElementById("gameCanvas").style.display = "block";
        gameRunning = true;
        gameLoop();
    }

    // Mostrar controles
    window.showControls = function() {
        document.getElementById("menu").style.display = "none";
        document.getElementById("controls").style.display = "block";
    }

    // Ocultar controles
    window.hideControls = function() {
        document.getElementById("controls").style.display = "none";
        document.getElementById("menu").style.display = "block";
    }

    // Reiniciar juego
    function resetGame() {
        player.x = 100;
        player.y = 100;
        detectionTimer = 0;
        gameRunning = false;
        document.getElementById("menu").style.display = "block";
        document.getElementById("gameCanvas").style.display = "none";
    }
}
