const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');


const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

//game constant
const FLAP_SPEED = -5;
const BIRD_WIDHT = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//bird variables
let birdX = 100;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.2;

//pipe variables 
let pipeX = 400;
let pipeY = canvas.height - 200;

//score and hightscore variables
let scoreDiv = document.getElementById('score-display');
let score = 0;
let hightscore = 0;

//add point or not 
let scored = false

//let control bird with space key
document.body.onkeyup = function (e) {
    if(e.code === 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

//let restart the game
document.getElementById('restart-button').addEventListener('click', function () {
    hideEndMeny();
    resetGame();
    loop();
})


function increaseScore () {
    if (birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP || 
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
            !scored) {
            
        score += 1;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

//if we have collision => return true
function callisionCheck () {

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDHT,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //check upper pipe box
    if (birdBox.x + birdBox.width > topPipeBox.x && 
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true
    }

    //check lower pipe box
    if (birdBox.x + birdBox.width > bottomPipeBox.x && 
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true
    }

    //check collision with boundaries
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;
}

function hideEndMeny () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdor-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdor-blur')
    document.getElementById('end-score').innerHTML = score;
    if (hightscore < score) {
        hightscore = score
    }
    document.getElementById('best-score').innerHTML = hightscore;
}

//reset the values
function resetGame () {
    birdX = 100;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.2;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0
}

function endGame () {
    showEndMenu();

}

function loop () {
    //reset ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    //draw bird
    ctx.drawImage(flappyImg, birdX, birdY);

    //draw Pipes 
    
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY)
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY)

    //check collision 

    if (callisionCheck()) {
        endGame();
        return;
    }


    // pipe velocity
    pipeX -= 3

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH
    }

        

    //apply gravity to the bird and let it move
    birdVelocity += birdAcceleration;
    birdY += birdVelocity

    increaseScore()
    requestAnimationFrame(loop)
}

loop()
