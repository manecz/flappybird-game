const cvs = document.getElementById('mycanva');
console.log(cvs);
const ctx = cvs.getContext('2d');
let frames = 0;
const DEGREE = Math.PI/180;


const resetGame = function (){
    bird.reset();
    pipes.reset();
    score.reset();
}

//Game Sprites
const sprite = new Image();
sprite.src = "img/sprite.png";

//load Sounds
const playAudio = function(audio){
    const sound = new Audio();
    
    if(audio == 'die'){
        sound.src = './audio/sfx_' + audio + '.wav';
    } else if (audio == 'flap'){
        sound.src = './audio/sfx_' + audio + '.wav';
    } else if (audio == 'hit'){
        sound.src = './audio/sfx_' + audio + '.wav';
    } else if (audio == 'point'){
        sound.src = './audio/sfx_' + audio + '.wav';
    } else if (audio == 'swooshing'){
        sound.src = './audio/sfx_' + audio + '.wav';
    }
    return sound.play();

}
//Game State control the game

const gameState = {
    current: 0,
    ready: 0,
    playing: 1,
    over: 2
}

const startButton = {
    x: [120, 200],
    y: [265, 290]
}

const getCursorPosition = function (canvas, event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if((x >= startButton.x[0] && x <= startButton.x[1])&&(y >= startButton.y[0] && y <= startButton.y[1])){
        return true;
    }
    
}

cvs.addEventListener('click', function(e){
    switch (gameState.current) {
        case gameState.ready:
            gameState.current = gameState.playing;
            playAudio('swooshing');
            break;
        case gameState.playing:
            bird.flap();
            playAudio('flap');
            break;
        case gameState.over:
            if(getCursorPosition(cvs, e)){
                gameState.current = gameState.ready;
                resetGame();

            }
            break;
    }
})

/*
draw image from sprite 

> function to draw an image from sprite
ctx.drawImage(sprite, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

> source x and y position on sprite -> sX sY
> dX dY dW dh refers to destion x y postion and width and height (normaly the same)
*/



const score = {
    best: parseInt(localStorage.getItem("best") || 0),
    value: 0,
    draw: function() {
        ctx.fillStyle ="#FFF";
        ctx.strokeStyle = "#000";
        if(gameState.current == gameState.playing){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
        } else if(gameState.current == gameState.over){
                    //console.log(parseInt(localStorage.getItem("best")));
                    ctx.font = "25px Teko";
                    ctx.fillText(this.value, 225, 186);
                    ctx.strokeText(this.value, 225, 186);
                    ctx.fillText(this.best, 225, 228);
                    ctx.strokeText(this.best, 225, 228);
        }
    },
    reset: function (){
        this.value = 0;
    }
}

const bg = {
    w: 275,
    h: 226,
    sX: 0,
    sY: 0,
    x: 0,
    y: cvs.height - 226,
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}

const fg = {
    w: 224,
    h: 112,
    sX: 276,
    sY: 0,
    x: 0,
    y: cvs.height - 112,
    dx: 2,
    draw: function() {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    update: function () {
        if(gameState.current == gameState.playing){
            this.x = (this.x - this.dx) % (this.w/2);
        }
    }
}

const bird = {
    speed: 0,
    gravity: 0.25,
    jump: 4.5,
    animation: [
        {sX: 276, sY: 112},
        {sX: 276, sY: 139},
        {sX: 276, sY: 164},
        {sX: 276, sY: 139}
    ],
    w: 34,
    h: 26,
    x: 50,
    y: 150,
    frame: 0,
    rotation: 0,
    radius: 12,
    draw: function(){
        //ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);
        ctx.restore();
    },
    update: function() {
        let period = gameState.current == gameState.ready ? 10 : 5;
        this.frame += frames % period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;
        if(gameState.current == gameState.ready) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height -fg.h - this.h/2;
                //this.speed = 0;
                if(gameState.current == gameState.playing){
                    gameState.current = gameState.over;
                }
            }
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = -25 * DEGREE;
            }
        }
    },
    flap: function() {
        this.speed = - this.jump;
    },
    reset: function() {
        this.speed = 0;
        this.frames = 0;
    }
}

//Get Ready Message

const getReady = {
    w: 173,
    h: 152,
    sX: 0,
    sY: 228,
    x: cvs.width/2 - 173/2,
    y: 80,
    draw: function() {
        if(gameState.current == gameState.ready) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
}

//Get GameOver Message

const gameOver = {
    w: 225,
    h: 202,
    sX: 175,
    sY: 228,
    x: cvs.width/2 - 225/2,
    y: 90,
    draw: function() {
        if(gameState.current == gameState.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
        
    }
}

const pipes = {
    position: [],
    bottom: {
        sX: 502,
        sY: 0
    },
    top: {
        sX: 553,
        sY: 0
    },
    w: 53,
    h: 400,
    gap: 85,
    dX: 2,
    maxYpos: -150,
    draw: function(){
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            let topYpos = p.y;
            let bottomYpos = p.y + this.h + this.gap;
            //Top Pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYpos, this.w, this.h);
            //Bottom Pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYpos, this.w, this.h);
        }
    },
    update: function(){
        if(gameState.current !== gameState.playing) return;
        if(frames % 100 == 0){
            this.position.push({
                x: cvs.width,
                y: this.maxYpos * (Math.random() + 1)
            });
        };
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            

            let bottomPipeYPos = p.y + this.h + this.gap;

            //Collision detection
            if( 
                bird.x + bird.radius > p.x && 
                bird.x - bird.radius < p.x + this.w && 
                bird.y + bird.radius > p.y && 
                bird.y - bird.radius < p.y + this.h ||
                bird.x + bird.radius > p.x && 
                bird.x - bird.radius < p.x + this.w && 
                bird.y + bird.radius > bottomPipeYPos && 
                bird.y - bird.radius < bottomPipeYPos + this.h
            )
            {
                playAudio('die');
                gameState.current = gameState.over;
            };
            p.x -= this.dX;

            if(p.x + this.w <= 0){
                playAudio('point');
                this.position.shift();
                score.value++;
                score.best = (score.value > score.best)? score.value : score.best;
                localStorage.setItem("best", score.best);
            }
        }
    },
    reset: function (){
        this.position = [];
    }
}



function draw() {
    ctx.fillStyle = '#70C5CE';
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    
    getReady.draw();
    gameOver.draw();
    score.draw();
}

function update() {
    bird.update();
    fg.update();
    pipes.update();
}

function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
}

loop();

