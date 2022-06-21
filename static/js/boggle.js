const wordButton = document.querySelector("#input-word-button");
const inputBox = document.querySelector("#input-word");
const userMessage = document.querySelector("#message");
const userScore = document.querySelector("#score");
const timeDisplay = document.querySelector("#timer");
const userWords = document.querySelector(".word-list");

const GAME_TIME = 60000;
const START_TIME = performance.now();

timeDisplay.textContent = GAME_TIME / 1000;

let gameClock = new Timer(GAME_TIME);
let scoreKeeper = new ScoreTracker();

wordButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  scoreKeeper.submitWord(inputBox.value.trim().toLowerCase());
});

timeDisplay.addEventListener("timeUp", scoreKeeper.submitScore.bind(scoreKeeper));

gameClock.startCountdown();
