///////////////////
/////VARIABLES/////
///////////////////

const playAgainBtn = document.getElementById('playAgainBtn');
const restartBtn = document.getElementById('restartBtn');

const winnerText = document.getElementById('winnerText');
const p1score = document.getElementById('p1score');
const p2score = document.getElementById('p2score');

let winnerNow = localStorage.getItem('winner');
let p1scoreNow = localStorage.getItem('scoreP1');
let p2scoreNow = localStorage.getItem('scoreP2');

let path = window.location;

///////////////
/////START/////
///////////////

if (winnerNow == 1 || winnerNow == 2)
{
    winnerText.innerHTML = "Player " + winnerNow + " wins";
}
else if (winnerNow == 0)
{
    winnerText.innerHTML = "Draw";
}

p1score.innerHTML = "P1: " + p1scoreNow;
p2score.innerHTML = "P2: " + p2scoreNow;

///////////////////
/////FUNCTIONS/////
///////////////////

function clicked2(sender) {
    btn = document.getElementById(sender);

    console.log(btn.id);

    if (btn == playAgainBtn)
    {
        path.replace('index.html');
    }

    if (btn == restartBtn)
    {
        localStorage.setItem('scoreP1', 0);
        localStorage.setItem('scoreP2', 0);
        path.reload();
    }
}