const wordButton = document.querySelector("#input-word-button");
const inputBox = document.querySelector("#input-word");
const userMessage = document.querySelector("#message");
const userScore = document.querySelector("#score");
const timeDisplay = document.querySelector("#timer");

const GAME_TIME = 60000;
const START_TIME = performance.now();

timeDisplay.textContent = GAME_TIME / 1000;

wordButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  WordTracker.submitWord();
});

let gameClock = new Timer(GAME_TIME);

gameClock.startCountdown();
