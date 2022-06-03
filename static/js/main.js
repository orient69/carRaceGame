'use strict'


const score = document.querySelector('.score');
const startScreen = document.querySelector('.start-screen');
const gameArea = document.querySelector('.game-area');

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

let player = {
    speed:5,
    score: 0,
};


startScreen.addEventListener('click', start);
document.addEventListener('keydown', pressOn);
document.addEventListener('keyup', pressOff);



// -------------------> Functions < ------------------------//  


function isCollide (player, enemy){
    let playerRect = player.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    return !(
        (playerRect.bottom < enemyRect.top) || 
        (playerRect.top > enemyRect.bottom) ||
        (playerRect.right < enemyRect.left) ||
        (playerRect.left > enemyRect.right)
    )
}



function moveEnemyCars(car){
    let enemyCars = document.querySelectorAll('.enemy');
    enemyCars.forEach(function (item) {
        if (isCollide(car, item)){
            endGame();
        }

        if (item.y >= 1500){
            item.y = -800;
            item.style.left = Math.floor(Math.random() * 450) + 'px';
            item.style.backgroundColor = randomColor();
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}



function moveLines(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (item) {
        if (item.y >= 1500){
            item.y -= 1500;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}


function playGame () {
    console.log('[IN_GAME]...');
    let car = document.querySelector('.car');
    moveLines();
    moveEnemyCars(car);
    let road = gameArea.getBoundingClientRect();

    if (player.start){

        if (keys.ArrowUp && player.y > (road.top - 100)) {player.y -= player.speed;}
        if (keys.ArrowDown && player.y < (road.bottom - 100)) {player.y += player.speed;}
        if (keys.ArrowLeft && player.x > 0) {player.x -= player.speed;}
        if (keys.ArrowRight && player.x <(road.width-50)) {player.x += player.speed;}

        car.style.left = player.x + 'px';
        car.style.top = player.y + 'px';

        window.requestAnimationFrame(playGame);

        player.score ++;
        score.innerText = `Score: ${player.score}`;
    }
}


function pressOn(event){
    event.preventDefault();
    keys[event.key] = true;

}

function pressOff (event){
    event.preventDefault();
    keys[event.key] = false;
}


function endGame(){
    player.start = false;
    score.innerHTML = `<h1>Game Over</h1>Score was ${player.score}!` ;
    startScreen.classList.remove('hide');
    
}


function start(){
    startScreen.classList.add('hide');
    // gameArea.classList.remove('hide');
    gameArea.innerHTML = '';
    player.start = true;
    player.score = 0;
    for (let n=0; n<10; n++){
        let div = document.createElement('div');
        div.classList.add('line');
        div.y = n * 150;
        div.style.top = (n*150) + 'px';
        gameArea.appendChild(div);
    }
    window.requestAnimationFrame(playGame);
    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;
    for (let n=0; n<3; n++){
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.innerHTML = '<br>'+ n + 1;
        enemy.y = ((n + 1) * 800) * -1;
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * 450) + 'px';
        enemy.style.backgroundColor = randomColor();
        gameArea.appendChild(enemy);
    }
}


function randomColor (){
    function color (){
        let hexValue = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hexValue)).substr(-2);
    }
    return '#' +color() +color() +color();
}