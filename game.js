var theGame;

window.onload = function() {

//Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var theInt;

class Game{
    constructor () {
        this.player = new Player();
        this.obstacles = [];
    }

    obstacleCollisionCheck() {
        this.obstacles.forEach((eachObstacle, i) => {
            var scoreDiv = document.getElementsByClassName("total-score")[0]
            var totalScore = Number(scoreDiv.innerHTML);
            var healthDiv = document.getElementsByClassName("total-health")[0]
            var totalHealth = Number(healthDiv.innerHTML);
            var healthBar = document.getElementsByClassName("bar")[0]
            var healthWidth = healthBar.style.width.slice(0, -1);
           
            if ((this.player.x + this.player.width >= eachObstacle.x && this.player.x <= eachObstacle.x + eachObstacle.width) &&
                (this.player.y + this.player.height >= eachObstacle.y && this.player.y <= eachObstacle.y + eachObstacle.height)){
                if(eachObstacle.imgsrc === 'images/mushroom-obstacle.png'){
                    this.obstacles.splice(i , 1);
                    this.player.score += 5;
                    scoreDiv.innerHTML = (totalScore + 5);
                } else if (eachObstacle.imgsrc === 'images/sapling-obstacle.png') {
                    this.obstacles.splice(i , 1);
                    this.player.health -= 10;
                    healthDiv.innerHTML = (totalHealth - 10);
                    healthBar.style.width = `${Number(healthWidth) - 10}%`
                        if (totalHealth === 10) {
                            healthDiv.innerHTML = (totalHealth - 10);
                            setTimeout(() => {
                                alert("Game Over! Your final score is " + `${totalScore}` + "." + " Click OK to play again.");
                                window.location.reload();
                            }, 1000)
                        }
                }      
            }
            if(eachObstacle.x === -75) {
                this.obstacles.pop(eachObstacle);
            } 
            
        })
    }
        
    drawEverything() {
        this.player.drawPlayer();
        this.obstacles.forEach((oneObsticle) => {
            oneObsticle.drawObstacle();
        })
    }
    
    generateNewObstacle() {
        const theX = 750;
        const theY = Math.floor(Math.random()*275);

        this.obstacles.unshift(new Obstacle(theX, theY))
        this.obstacles[0].moveObstacle();
    }
}



class Player {
    constructor(){
        this.x = 40;
        this.y = 250;
        this.width = 75;
        this.height = 90;
        this.img = 'images/teemo-player.png';
        this.score = 0;
        this.health = 100;
    }
    
    drawPlayer() {
        var img = new Image();
        img.src = this.img;
        ctx.drawImage(img, this.x, this.y,this.width, this.height);
    }
        
        movePlayer(number) {
            switch(number){
                case 37:
                if (this.x > 0) {
                    this.x -= 5;
                }break;
                case 39:
                if (this.x < canvas.width-75){
                    this.x += 5;
                }else{
                    this.x += 0;
                }
            }
        }
        
        jumpPlayer(keyCode) {
            clearInterval(theInt);
            if (keyCode === 32) {
                if (this.y > 50){
                    this.y -= 50;            
                    theInt = setInterval(() => {
                        if(this.y < 250){
                            this.y += 5    
                        }
                    }, 50);
                }else{
                    this.y=50;  
                    theInt = setInterval(() => {
                        if(this.y < 250){
                            this.y += 5    
                        }
                    }, 50);             
                }
            } 
        } 
}        

class Obstacle {
     constructor(theX, theY) {
        this.x = theX;
        this.y = theY;
        this.width = 50;
        this.height = 50;
        this.image = ['images/mushroom-obstacle.png', 'images/sapling-obstacle.png']
        this.imgsrc = this.image[Math.floor(Math.random() * 2)]
    }
    
    drawObstacle() {
        var theImage = new Image();
        theImage.src = this.imgsrc;
        // theImage.onload= (() => {
                ctx.drawImage(theImage, this.x, this.y, 45, 40);
            // })
    }
        
    moveObstacle() {
        setInterval(() => {
            this.x-=1;
        }, 15);
    }
}
    
let frames = 0;
    
function animate() {
    // setInterval(() => {
        ctx.clearRect(0,0,800,400);
        theGame.drawEverything();
        if(frames % 75 === 0) theGame.generateNewObstacle();
        theGame.obstacleCollisionCheck();
        frames++;
    // }, 50)
    window.requestAnimationFrame(animate);
}

//once this is working, use requestanimationframe instead of setinterval to stop the flickering

function bgScroll() {
        let bgPos = canvas.style.backgroundPositionX.slice(0, -1);
        canvas.style.backgroundPositionX = `${Number(bgPos) + 1}%`;
        window.requestAnimationFrame(bgScroll);
    }
    
    
function startGame() {
    theGame = new Game();
}


document.getElementById("btn-start").onclick = function() {
    startGame();
    animate();
    bgScroll();
}

document.onkeydown = function(e) {
    e.preventDefault();
    var move = e.keyCode;
    if (move === 37 || move === 39){
        theGame.player.movePlayer(move);
    }
    if (move === 32) {
        theGame.player.jumpPlayer(move);
    }
}

}