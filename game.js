var canvasBg = document.getElementById("canvas_bg");
var ctxBg = canvasBg.getContext('2d');
var canvasPaddle = document.getElementById("canvas_paddle");
var ctxPaddle = canvasPaddle.getContext('2d');
var canvasBall = document.getElementById("canvas_ball");
var ctxBall = canvasBall.getContext('2d');
var isPlaying = false;

gameWidth = canvasBg.width;
gameHeight = canvasBg.height;

var requestAnimFrame =  window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.oRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };

var imgSprite = new Image();
imgSprite.src = 'images/imageSprite.png';
imgSprite.addEventListener('load', init, false);

var paddle = new Paddle();
var balls = [new Ball(paddle)];

function init(){
	ctxBg.clearRect(0, 0);
    document.addEventListener('keydown', checkKeyDown, false);
    document.addEventListener('keyup', checkKeyUp, false);
	startLoop();
}

function loop(){
    if(isPlaying){
        drawBg();
        paddle.draw();
        drawBalls();
        requestAnimFrame(loop);
    }
}

function startLoop(){
    isPlaying = true;
    loop();
}

function stopLoop(){
    isPlaying = false;
}

function drawBg(){
	ctxBg.drawImage(imgSprite, 0, 0, gameWidth, gameHeight, 0, 0, gameWidth, gameHeight);
}

// Paddle functions
function Paddle(){
	this.score = 0;
	this.srcX = 0;
	this.srcY = 800;
	this.width = 95;
	this.height = 96;
	this.speed = 10;
	this.drawX = 0; //max 410 px
	this.drawY = 635; // max 720 px
	this.isUpKey = false;
    this.isRightKey = false;
    this.isDownKey = false;
    this.isLeftKey = false;
    this.bottomY; this.rightX; this.leftX; this.topY; // Just initalize them
    this.boundsX = [0,70];
    this.boundsY = [0,0];
    this.score = 0;
}

Paddle.prototype.draw = function(){
	clearCtxPaddle();
    this.updateCo();
	this.checkDirection();
	ctxPaddle.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
}

Paddle.prototype.updateCo = function(){
    this.bottomY = this.drawY + this.height-30;
    this.rightX = this.drawX + this.width-30;
    this.leftX = this.drawX;
    this.topY = this.drawY;
    this.boundsX[0] = this.drawX; this.boundsX[1] = this.drawX+70;
    this.boundsY[0] = this.drawY; this.boundsY[1] = this.drawY;
}    


Paddle.prototype.checkDirection = function() {
    if(this.isUpKey && 635 < this.drawY){
        this.drawY  -= this.speed;
    }
    if(this.isDownKey && gameHeight > this.bottomY){
        this.drawY  += this.speed;
    }
    if(this.isLeftKey && 0 < this.drawX){
        this.drawX  -= this.speed;
    }
    if(this.isRightKey && gameWidth > this.rightX){
        this.drawX  += this.speed;
    }
}



function clearCtxPaddle() {
    ctxPaddle.clearRect(0, 0, gameWidth, gameHeight);
}

// end of paddle functions

// start of ball functions

function Ball(paddle){ //838 136 | 95 800
    this.paddle = paddle;
    this.srcX = 95;
    this.srcY = 800;
    this.width = 38;
    this.height = 41;
    this.speed = {'x':0.25, 'y':10};
    this.drawX = Math.floor(Math.random()*(gameWidth-20));
    this.drawY = Math.floor(Math.random()*(+100))+100;
}

Ball.prototype.draw = function(){
    this.drawY += this.speed['y'];
    this.drawX += this.speed['x'];
    ctxBall.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
    this.checkBallResult();
}
//70 by 64
Ball.prototype.checkBallResult = function(){
    var hit = this.paddle.boundsX[0] < (this.drawX+this.width) && this.paddle.boundsX[1] > this.drawX && (this.drawY + this.height) > this.paddle.boundsY[0];

    if(hit && this.speed['y'] > 0){
        this.speed['y'] *= -1.01;
        this.paddle.score += Math.abs(this.speed) * 10;

    }
    if(this.drawY<0 && this.speed['y'] <0){
        this.speed['y'] *= -1.015;
    }
    if(this.drawY + this.width > 800){
        this.drawX = Math.floor(Math.random()*gameWidth);
        this.drawY = Math.floor(Math.random()*(-100));
        this.speed['y'] = (this.speed['y'] > 1.5)?(this.speed['y']*0.8) : 1;
        var tempscore = this.paddle.score - Math.abs(this.speed)*50
        
        this.paddle.score = (tempscore<100 && tempscore > 0) ? (this.paddle.score*0.8) : tempscore;
        this.score
    }
    this.paddle.score = Math.floor(this.paddle.score);
}


function drawBalls(){
    clearCtxBall();
    for (var i=0; i<balls.length; i++){
        balls[i].draw();
    }
}


function clearCtxBall() {
    ctxBall.clearRect(0, 0, gameWidth, gameHeight);
}



// end of balls functions











/* Event Functions */
function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        paddle.isUpKey = true;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        paddle.isRightKey = true;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        paddle.isDownKey = true;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        paddle.isLeftKey = true;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        paddle.isSpacebar = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 38 || keyID === 87) { //up arrow or W key
        paddle.isUpKey = false;
        e.preventDefault();
    }
    if (keyID === 39 || keyID === 68) { //right arrow or D key
        paddle.isRightKey = false;
        e.preventDefault();
    }
    if (keyID === 40 || keyID === 83) { //down arrow or S key
        paddle.isDownKey = false;
        e.preventDefault();
    }
    if (keyID === 37 || keyID === 65) { //left arrow or A key
        paddle.isLeftKey = false;
        e.preventDefault();
    }
    if (keyID === 32) { //spacebar
        paddle.isSpacebar = false;
        e.preventDefault();
    }
}

// end of event functions