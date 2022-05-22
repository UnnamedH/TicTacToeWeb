///////////
// Setup //
///////////

// Online mode
const socket = io("https://tictactoehrantserver.herokuapp.com", {
  withCredentials: true,
});

// Offline mode
// const socket = io("http://127.0.0.1:3000", {
//   withCredentials: true,
// });

// Variables //

let enabled = false;
let btn;
let player;
let playerNumber;
let path;
let board;
let index;
let symbol;
let room;

// Screen //
const gameScreen = document.getElementById("gameScreen"); //////////// Main Game screen
const welcomeScreen = document.getElementById("welcomeScreen"); ////// Welcome screen (join or create)
const endScreen = document.getElementById("endScreen"); ////////////// End Screen (scores)
// Buttons //
const createGameBtn = document.getElementById("createGameBtn"); ////// Create game button
const joinGameBtn = document.getElementById("joinGameBtn"); ////////// Join game button
// Label / Text //
const gameCodeText = document.getElementById("gameCodeText"); //////// Code textbox
const gameCodeDisplay = document.getElementById("gameCodeDisplay"); // Code Label
const connectionDiv = document.getElementById("connectionDiv"); ////// Connection status div
const waitDiv = document.getElementById("waitDiv"); ////////////////// Div that shows please wait message
const chooseTitle = document.getElementById("chooseTitle"); ////////// Title that shows the current player
const p1score = document.getElementById("p1score"); ////////////////// Player 1 score label
const p2score = document.getElementById("p2score"); ////////////////// Player 2 score label
const playerTitle = document.getElementById("playerTitle"); ////////// Title that shows which player you are
const winnerText = document.getElementById("winnerText"); //////////// Title message for who won etc

// Events //
createGameBtn.addEventListener("click", newGame);
joinGameBtn.addEventListener("click", joinGame);

// Setup //
chooseTitle.innerHTML = "Choose your option: P1 (X)";

// Sockets Listeners //
socket.on("test", connectionTest);
socket.on("update", update);
socket.on("winner", doWinner);
socket.on("init", handleInit);
socket.on("gameCode", handleGameCode);
socket.on("tooManyPlayers", handleTooManyPlayers);
socket.on("unknownGame", handleUnknownGame);
socket.on("start", handleStart);

////////////////////
// Main functions //
////////////////////

function init(p) {
  if (p == 1) {
    chooseTitle.innerHTML = "Choose your option: P1 (X)";
  } else if (p == 2) {
    chooseTitle.innerHTML = "Choose your option: P2 (O)";
  }

  welcomeScreen.style.display = "none";
  gameScreen.style.display = "block";
  endScreen.style.display = "none";

  enabled = false;
  path = window.location;
  index = 0;

  for (i = 1; i < 10; i++) {
    btn = document.getElementById("btn" + i);
    btn.style.backgroundColor = "chocolate";

    btn.addEventListener("mouseover", handleMouseOver);
    btn.addEventListener("mouseout", handleMouseOut);

    btn.innerHTML = " ";
  }
}

function clicked(sender) {
  btn = document.getElementById(sender);

  if (btn.innerHTML != "X" && btn.innerHTML != "O") {
    if (enabled) {
      socket.emit("clicked", btn.id, room, playerNumber);
    }
  }
}

function clickedMenu(sender) {
  btn = document.getElementById(sender);

  if (btn.id == "playAgainBtn") {
    socket.emit("playAgain", room);
    endScreen.style.display = "none";
    gameScreen.style.display = "block";
    init();
  } else if (btn.id == "leaveRoomBtn") {
    socket.emit("leaveRoom", room);
    init();
    endScreen.style.display = "none";
    gameScreen.style.display = "none";
    welcomeScreen.style.display = "block";
  }
}

function update(board, p) {
  console.log(board);

  if (p == 1) {
    chooseTitle.innerHTML = "Choose your option: P1 (X)";
  } else if (p == 2) {
    chooseTitle.innerHTML = "Choose your option: P2 (O)";
  }

  for (index = 1; index < board.length + 1; index++) {
    ch = board.charAt(index - 1);
    if (ch == " ") {
      btn = document.getElementById("btn" + index);
      btn.innerHTML = " ";
    } else if (ch == "X") {
      btn = document.getElementById("btn" + index);
      btn.innerHTML = "X";
    } else if (ch == "O") {
      btn = document.getElementById("btn" + index);
      btn.innerHTML = "O";
    }
  }
}

function doWinner(state, btns, draw) {
  if (draw) {
    btns.forEach(function (b) {
      console.log(b);
      b = document.getElementById(b);

      b.style.backgroundColor = "yellow";
    });
  } else if (!draw) {
    console.log(`${state.player} is the winner`);

    if (state.player == 1) {
      symbol = "X";
    } else if (state.player == 2) {
      symbol = "O";
    }

    if (state.player == 3) {
      winnerText.innerHTML = "Its a Tie!";
    } else if (state.player == playerNumber) {
      winnerText.innerHTML = `You Win!`;
      console.log("You Win!");
    } else if (state.player != playerNumber) {
      winnerText.innerHTML = `Player ${state.player} wins! You Lose!`;
      console.log("you lose");
    }

    btns.forEach(function (b) {
      console.log(b);
      b = document.getElementById(b);

      b.style.backgroundColor = "green";
    });
  }

  endScreen.style.display = "block";
  gameScreen.style.display = "none";

  p1score.innerHTML = `P1: ${state.scoreP1}`;
  p2score.innerHTML = `P2: ${state.scoreP2}`;
}

////////////////////
// Event handlers //
////////////////////

function handleStart() {
  alertify.message("Game Started!");
  enabled = true;
}

function handleMouseOut(event) {
  event.target.style.backgroundColor = "chocolate";
}

function handleMouseOver(event) {
  event.target.style.backgroundColor = "orange";
}

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

function handleInit(number, p) {
  console.log("got init");
  if (number == 1) {
    alertify.message("Waiting for game to start...");
  }
  playerNumber = number;
  playerTitle.innerText = `You are P${number}`;
  init(p);
}

function newGame() {
  socket.emit("newGame");
}

function joinGame() {
  const code = gameCodeText.value;
  socket.emit("joinGame", code);
  gameCodeText.value = "";
}

function connectionTest() {
  connectionDiv.innerHTML = "Connected";
  connectionDiv.style.color = "green";
  waitDiv.innerHTML = "";
  console.log("connected");
}
