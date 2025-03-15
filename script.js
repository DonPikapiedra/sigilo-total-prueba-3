window.onload = function() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;

    let gameRunning = false;

    // Jugador
    const player = {
        x: 100, y: 100, size: 20, speed: 3,
        dx: 0, dy: 0
    };

    // Enemigos
    const enemies = [
        { x: 400, y: 200, speed: 2, dir: "right", coneAngle: Math.PI / 4 }
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
        ctx.arc(enemy.x + 10, enemy.y + 10, 100, -Math.PI / 6, Math.PI / 6);
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

    // Mueve los enemigos
    function moveEnemies() {
        enemies.forEach(enemy => {
            if (enemy.dir === "right") enemy.x += enemy.speed;
            if (enemy.dir === "left") enemy.x -= enemy.speed;
            if (enemy.x > canvas.width - 20) enemy.dir = "left";
            if (enemy.x < 0) enemy.dir = "right";
        });
    }

    // Detecta colisión con la luz del enemigo
    function checkDetection() {
        enemies.forEach(enemy => {
            const distX = player.x - enemy.x;
            const distY = player.y - enemy.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            if (distance < 50) {
                alert("¡Has sido detectado!");
                resetGame();
            }
        });
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
        gameRunning = false;
        document.getElementById("menu").style.display = "block";
        document.getElementById("gameCanvas").style.display = "none";
    }
}
