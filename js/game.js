// Main game logic
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;

// Game Objects
const player = new Player(50, canvas.height - 50, 40, 40);

const platforms = [
    {x: 0, y: 400, width: 150, height: 20}, // ground
    {x: 200, y: 400, width: 150, height: 20},
    {x: 400, y: 300, width: 150, height: 20}
];

const collectibles = [
    new Collectible(250, 350, 20),
    new Collectible(450, 250, 20)
];

// Game State
let score = 0;
const scoreDisplay = document.getElementById("score");
document.getElementById("music-toggle").addEventListener("click", toggleMusic);

// Keyboard controls
const keys = {left: false, right: false};
document.addEventListener(
    "keydown",
    (e)=>{
        if(e.key === "ArrowLeft") keys.left = true;
        if(e.key === "ArrowRight") keys.right = true;
        if(e.key === " ") player.jump();
    }
);
document.addEventListener(
    "keyup",
    (e)=>{
        if(e.key === "ArrowLeft") keys.left = false;
        if(e.key === "ArrowRight") keys.right = false;
    }
);

// Main game loop
function gameLoop()
{
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update Player
    if(keys.left) player.moveLeft();
    if(keys.right) player.moveRight();
    player.update(canvas);

    // Check platform collisions
    platforms.forEach(
        platform => {
            if(
                player.y + player.height > platform.y &&
                player.y + player.height < platform.y + platform.height &&
                player.x + player.width > platform.x &&
                player.x < platform.x + platform.width &&
                player.velocityY > 0
            )
            {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    );

    // Draw platforms
    ctx.fillStyle = "green";
    platforms.forEach(
        platform => {
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        }
    );

    // Update and draw collectibles
    collectibles.forEach(
        collectible => {
            if(collectible.checkCollision(player))
            {
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
            }
            collectible.draw(ctx);
        }
    );

    // Draw Player
    player.draw(ctx);

    requestAnimationFrame(gameLoop);
}