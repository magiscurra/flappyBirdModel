
        // Game variables
        const bird = document.getElementById('bird');
        const gameContainer = document.getElementById('game-container');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-btn');
        
        let birdY = 300;
        let birdVelocity = 0;
        let gravity = 0.3;          // Reduced from 0.5
        let jumpForce = -8;          // Reduced from -10
        let pipeSpeed = 1.5;         // New variable for pipe speed
        let gameRunning = true;
        let score = 0;
        let pipes = [];
        let pipeGap = 150;
        let pipeFrequency = 2000;    // Increased from 1500 ms
        let lastPipeTime = 0;
        
        // Initialize game
        function init() {
            birdY = 300;
            birdVelocity = 0;
            score = 0;
            scoreElement.textContent = score;
            pipes.forEach(pipe => pipe.element.remove());
            pipes = [];
            gameRunning = true;
            gameOverElement.style.display = 'none';
            bird.style.top = birdY + 'px';
            bird.style.left = '100px';
            
            // Start game loop
            requestAnimationFrame(gameLoop);
        }
        
        // Game loop
        function gameLoop(timestamp) {
            if (!gameRunning) return;
            
            // Update bird position
            birdVelocity += gravity;
            birdY += birdVelocity;
            bird.style.top = birdY + 'px';
            
            // Generate pipes
            if (timestamp - lastPipeTime > pipeFrequency) {
                createPipe();
                lastPipeTime = timestamp;
            }
            
            // Update pipes
            updatePipes();
            
            // Check collisions
            checkCollisions();
            
            // Continue game loop
            requestAnimationFrame(gameLoop);
        }
        
        // Create a new pipe
        function createPipe() {
            const pipeTopHeight = Math.random() * (gameContainer.offsetHeight - pipeGap - 100) + 50;
            const pipeBottomHeight = gameContainer.offsetHeight - pipeTopHeight - pipeGap;
            
            const pipeTop = document.createElement('div');
            pipeTop.className = 'pipe';
            pipeTop.style.height = pipeTopHeight + 'px';
            pipeTop.style.top = '0';
            pipeTop.style.left = gameContainer.offsetWidth + 'px';
            
            const pipeBottom = document.createElement('div');
            pipeBottom.className = 'pipe';
            pipeBottom.style.height = pipeBottomHeight + 'px';
            pipeBottom.style.bottom = '20px';
            pipeBottom.style.left = gameContainer.offsetWidth + 'px';
            
            gameContainer.appendChild(pipeTop);
            gameContainer.appendChild(pipeBottom);
            
            pipes.push({
                element: pipeTop,
                x: gameContainer.offsetWidth,
                height: pipeTopHeight,
                top: true,
                scored: false
            });
            
            pipes.push({
                element: pipeBottom,
                x: gameContainer.offsetWidth,
                height: pipeBottomHeight,
                top: false,
                scored: false
            });
        }
        
        // Update pipe positions
        function updatePipes() {
            for (let i = pipes.length - 1; i >= 0; i--) {
                const pipe = pipes[i];
                pipe.x -= pipeSpeed;  // Using the pipeSpeed variable
                pipe.element.style.left = pipe.x + 'px';
                
                // Remove pipes that are off screen
                if (pipe.x < -60) {
                    pipe.element.remove();
                    pipes.splice(i, 1);
                }
                
                // Check if bird passed a pipe (for scoring)
                if (!pipe.scored && !pipe.top && pipe.x < 100 - 60) {
                    pipe.scored = true;
                    score++;
                    scoreElement.textContent = score;
                }
            }
        }
        
        // Check for collisions
        function checkCollisions() {
            // Check ground collision
            if (birdY > gameContainer.offsetHeight - 50) {
                endGame();
                return;
            }
            
            // Check ceiling collision
            if (birdY < 0) {
                endGame();
                return;
            }
            
            // Check pipe collisions
            const birdRect = {
                x: 100,
                y: birdY,
                width: 40,
                height: 30
            };
            
            for (const pipe of pipes) {
                const pipeRect = {
                    x: pipe.x,
                    y: pipe.top ? 0 : gameContainer.offsetHeight - pipe.height - 20,
                    width: 60,
                    height: pipe.height
                };
                
                if (isColliding(birdRect, pipeRect)) {
                    endGame();
                    return;
                }
            }
        }
        
        // Check if two rectangles are colliding
        function isColliding(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }
        
        // End the game
        function endGame() {
            gameRunning = false;
            finalScoreElement.textContent = `Score: ${score}`;
            gameOverElement.style.display = 'block';
        }
        
        // Jump when spacebar or mouse is clicked
        function jump() {
            if (!gameRunning) return;
            birdVelocity = jumpForce;
        }
        
        // Event listeners
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                jump();
            }
        });
        
        gameContainer.addEventListener('click', jump);
        restartBtn.addEventListener('click', init);
        
        // Start the game
        init();