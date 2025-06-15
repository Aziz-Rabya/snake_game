// Define HTML elements
const board = document.getElementById('game-board')
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// define game variables
const gridSize = 20; // 20x20 grid
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0; // initialize high score
let direction = 'right';
let gameInterval;
let gamespeedDelay = 200; // game speed in milliseconds
let gameStarted = false;

// draw game map, snake, food
function draw() {
    board.innerHTML = '';
    if (gameStarted) {
        drawsnake();
        drawFood();
    }
    updateScore();
}

// draw snake
function drawsnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div',
        'snake');
        setPosition(snakeElement, segment)
        board.appendChild(snakeElement);
    })
}

// create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// testing draw function
// draw();

function drawFood(){
    if (gameStarted){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

// moving the snake

function move(){
    const head = { ...snake[0] }; // copy the head of the snake
    switch (direction) {
        case 'right':
            head.x++ ;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head); // add new head to the front of the snake

    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); 
        clearInterval(gameInterval);
        increaseSpeed();
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gamespeedDelay);
    } else {
        snake.pop(); // remove the last segment of the snake
    }
}

// start game function
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gamespeedDelay);
}

// keypress listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (event.code === ' ')) {
        startGame();
    }else{
        switch (event.code) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
 
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gamespeedDelay > 150) { // minimum speed limit
        gamespeedDelay -= 5; // increase speed by decreasing delay
    }else if (gamespeedDelay > 100){
        gamespeedDelay -= 3;    
    }else if (gamespeedDelay > 50){
        gamespeedDelay -= 2;    
    }else if (gamespeedDelay > 25){
        gamespeedDelay -= 1;    
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gamespeedDelay = 200; // reset game speed
    updateScore();
}
function updateScore() {
    const currentScore = snake.length - 1; // score is length of snake minus 1 (the head)
    score.textContent = currentScore.toString().padStart(3, '0'); // format score to 3 digits
}
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0'); // format high score to 3 digits
    }
    highScoreText.style.display = 'block';
}
