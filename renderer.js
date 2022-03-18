///////////////////////////
/////VARIABLES + SETUP/////
///////////////////////////

// Online
// const socket = io("https://ttthrantonlineserver.herokuapp.com", {
//   withCredentials: true,
// });

// Offline
const socket = io("http://127.00.1:3000", {
  withCredentials: true,
});

let enabled;
let btn;
let player;
let playerNumber;
let path;
let board;
let index;
let symbol;
let room;

//index.html//

const gameScreen = document.getElementById("gameScreen"); // Main Game screen
const welcomeScreen = document.getElementById("welcomeScreen"); // Welcome screen (join or create)
const createGameBtn = document.getElementById("createGameBtn"); // Create game button
const joinGameBtn = document.getElementById("joinGameBtn"); // Join game button
const gameCodeText = document.getElementById("gameCodeText"); // Code textbox
const gameCodeDisplay = document.getElementById("gameCodeDisplay"); // Code Label

createGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

const chooseTitle = document.getElementById("chooseTitle");
chooseTitle.innerHTML = "Choose your option: P1 (X)";

///////////////////
/////FUNCTIONS/////
///////////////////

// Sockets
socket.on("update", putSymbol);
socket.on("winner", doWinner);
socket.on("init", handleInit);
socket.on("gameCode", handleGameCode);
socket.on("tooManyPlayers", handleTooManyPlayers);
socket.on("unknownGame", handleUnknownGame);

function handleTooManyPlayers() {
  gameCodeText.value = "";
  alert("Too many players!");
}

function handleUnknownGame() {
  gameCodeText.value = "";
  alert("Game not Found");
}

function handleGameCode(gamecode) {
  room = gamecode;
  gameCodeDisplay.innerText = gamecode;
}

function handleInit(number) {
  playerNumber = number;
  init();
}

function newGame() {
  socket.emit("newGame");
}

function joinGame() {
  const code = gameCodeText.value;
  socket.emit("joinGame", code);
}

function init() {
  welcomeScreen.style.display = "none";
  gameScreen.style.display = "block";

  enabled = true;
  player = 1;
  path = window.location;
  index = 0;
}

function clicked(sender) {
  btn = document.getElementById(sender);

  if (btn.innerHTML != "X" && btn.innerHTML != "O") {
    if (enabled) {
      socket.emit("clicked", btn.id, room, playerNumber);
    }
  }
}

function putSymbol(board) {
  console.log(board);

  for (index = 1; index < board.length + 1; index++) {
    ch = board.charAt(index - 1);
    if (ch == " ") {
    } else if (ch == "X") {
      btn = document.getElementById("btn" + index);
      btn.innerHTML = "X";
    } else if (ch == "O") {
      btn = document.getElementById("btn" + index);
      btn.innerHTML = "O";
    }
  }
}

function doWinner(p, btns, draw) {
  if (draw) {
    btns.forEach(function (b) {
      console.log(b);
      b = document.getElementById(b);

      b.style.backgroundColor = "yellow";
    });
  } else if (!draw) {
    console.log(`${p} is the winner`);

    if (p == 1) {
      symbol = "X";
    } else if (p == 2) {
      symbol = "O";
    }

    btns.forEach(function (b) {
      console.log(b);
      b = document.getElementById(b);

      b.style.backgroundColor = "green";
    });
  }
}

// function replaceWindow() {
//   console.log("here");
//   path.replace("end.html");
// }
