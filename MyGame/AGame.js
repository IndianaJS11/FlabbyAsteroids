var frames = 0;
var fish;
var heli;
var canvas;
var renderingContext;
var width;
var height;
var states = {Splash: 0, Game: 1, Score: 2};
var currentState;
var foregroundPosition = 0;
var scores = 0;
var highscore = 0;

function HelicopterStuff() {
    this.helicopter = [];

    // empty helicopter array
    this.reset = function () {
        this.helicopter = [];
        this.helicopter.length = 0;
        scores = 0;
    };

    // add new helis to game (push to array)
    this.add = function () {
        this.helicopter.push(new Heli());
    };



    // update and add new helicopters
    this.update = function () {
        if (frames % 50 === 0) {
            this.add();
        }
        // runs through helicopters, adds current helicopter to index
        for (var i = 0, _length = this.helicopter.length; i < _length; i++) { 
            var _heli = this.helicopter[i]; 

            if (i === 0) {
                _heli.collisionTest();
            }


            if(scores < 5){
            _heli.x -= 7;
            }
            if(scores >= 5){
                _heli.x -= 8;
            }
            else if(scores >= 10){
                _heli.x -= 9;
            }
            else if(scores >= 20){
                _heli.x -= 10;
            }else if(scores >= 40){
                _heli.x -= 11;
            }else if(scores >= 60){
                _heli.x -= 13;
            }else if(scores >= 100){
                _heli.x -= 15;
            }


            // condition removes helicopter if off screen
            if (_heli.x < -_heli.width) { 
                this.helicopter.splice(i, 1);
                scores++;
                console.log(scores);
                i--;
                _length--;
            }


        }


    };

    // draw helicopters to canvas
    this.draw = function () {
        for (var i = 0, _length = this.helicopter.length; i < _length; i++) {
            var _heli = this.helicopter[i];
            _heli.draw();
        }
    };
}
//create helicopters
function Heli() {
    this.x = 550;
    this.y = Math.floor((Math.random() * height) + -40);
    this.width = helicopterSprite.width;
    this.height = helicopterSprite.height;

    if(this.x == 70){
        scores++;
        console.log(scores);
        $("#score").html(scores);
    }
    // detect collision
    this.collisionTest = function () {



            // if (fish.x < this.x + this.width &&
            //     fish.x + fish.width > this.x &&
            //     fish.y < this.y + this.height &&
            //     fish.height + fish.y > this.y) {
            //     // collision detected!
            //     currentState = states.Score;
            // }

        var cx = Math.min(Math.max(fish.x, this.x), this.x + -100);
        var cy1 = Math.min(Math.max(fish.y, this.y), this.y + -80);

        var dx = fish.x - cx;
        var dy1 = fish.y - cy1;

        var d1 = dx * dx + dy1 * dy1;

        var r = fish.radius * fish.radius;

        if (r > d1) {
            currentState = states.Score;
        }







    };

    this.draw = function () {
        helicopterSprite.draw(renderingContext, this.x, this.y);
    }
}



function FireBall() {
    this.frame = 0;
    this.animation = [0, 1, 2, 3, 4, 5];
    this.x = 70;
    this.y = 50;
    this.rotation = 0;
    this.radius = 90;
    this.velocity = 0;

    this.gravity = 0.15;
    this._jump = 4.6;

    this.jump = function () {
        this.velocity = -this._jump;
    };

    this.update = function(){

        var n = currentState === states.Splash ? 7 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if(currentState === states.Splash){

            this.updateIdleFireBall();
        }
        else
        {
            this.updatePlayingFireBall();
        }

        };

        this.updateIdleFireBall = function () {
            this.y = height - 650 + 1 * Math.cos(frames / 5);
            this.rotation = 0;
        };

        this.updatePlayingFireBall = function(){
                this.velocity += this.gravity;
                this.y += this.velocity;

            if(this.y >= height - foregroundSprite.height + 270){
                this.y = height - foregroundSprite.height + 270;
                if(currentState === states.Game){
                    currentState = states.Score;
                }
                this.velocity = this._jump;
            }

            if (this.y <= -70) {
                // currentState = states.Score;
                this.velocity = this._jump;
            }

            if(this.velocity >= this._jump){
                this.frame = 1;
            }

        };


        this.draw = function () {
            renderingContext.save();

            renderingContext.translate(this.x, this.y);
            renderingContext.rotate(this.rotation);

            var n = this.animation[this.frame];

            FireSprite[n].draw(renderingContext, 50, 50);

            renderingContext.restore();
        }
    }

function main() {
    windowSetup();
    canvasSetup();
    loadGraphics();
    currentState = states.Splash;

    width = window.innerWidth;
    height = window.innerHeight;

    document.body.appendChild(canvas);

    fish = new FireBall();
    chopper = new HelicopterStuff();
}

function windowSetup() {
    width = window.innerWidth;
    height = window.innerHeight;

    var inputEvent = "touchstart";
    if(width >= 500){
        width = 580;
        height = 830;
        inputEvent = "mousedown";
    }
    document.addEventListener(inputEvent, onpress);
}

function onpress(evt) {
    switch (currentState){
        case states.Splash:
            currentState = states.Game;
            fish.jump();
            break;
        case states.Game:
            fish.jump();
            break;
        case states.Score:
            currentState = states.Splash;
    }
    if (currentState === states.Splash){
        scores = 0;
    }
}

function canvasSetup() {
    canvas = document.createElement("canvas");

    canvas.style.border = "10px solid #666666";
    canvas.style.margin = "0 auto";
    canvas.width = width;
    canvas.height = height;

    renderingContext = canvas.getContext('2d');
}

function loadGraphics() {
    var img = new Image();
    img.src = "Images/Indiesprite.png";
    img.onload = function () {
        initSprites(this);
        // FireSprite[2].draw(renderingContext, 50, 50);
        gameLoop();
    };


}

function gameLoop() {
    update();
    render();

    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    if (currentState === states.Game) {
        chopper.update();
    }



    fish.update();



    if(currentState != states.Score){
        foregroundPosition = (foregroundPosition - 5) % 2937;
    }
}

function render() {
    renderingContext.fillRect(0,0, width, height);
    backgroundSprite.draw(renderingContext, 0, 200);
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height - 105);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width,  height - foregroundSprite.height -105);
    fish.draw(renderingContext);
    if(currentState === states.Game) {
        chopper.draw(renderingContext);
    }
    // foregroundSprite
}