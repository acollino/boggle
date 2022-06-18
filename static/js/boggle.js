const wordButton = document.querySelector("#input-word-button");
const inputBox = document.querySelector("#input-word");
const userMessage = document.querySelector("#message");
const userScore = document.querySelector("#score");
const timer = document.querySelector("#timer");

const GAME_TIME = 60000;
timer.textContent = GAME_TIME / 1000;
const START_TIME = performance.now();

wordButton.addEventListener("click", submitWord);

async function submitWord(event) {
  event.preventDefault();
  if ((performance.now() - START_TIME) > GAME_TIME) {
    return;
  }
  let word = inputBox.value.trim().toLowerCase();
  let targetURL = `${window.location.href}/submit/${word}`;
  let fetchObj = { method: "GET" };
  let resp = await fetch(targetURL, fetchObj);
  if (resp.ok) {
    let data = await resp.json();
    inputBox.value = "";
    checkWordResponse(data, word);
  }
}

function checkWordResponse(resp, word) {
  if (resp === "ok") {
    let score = word.length;
    let resultText = "Nice word!";
    if (score >= 4) {
      resultText = score > 6 ? "Amazing word!" : "Great word!";
    }
    updateScore(resultText, score);
  } else if (resp === "not-on-board") {
    updateScore("That was a good word, but it isn't on the Boggle board.");
  } else {
    updateScore("Sorry, that word isn't in my dictionary!");
  }
}

function updateScore(msg, points = 0) {
  userMessage.textContent = msg;
  userScore.textContent = parseInt(userScore.textContent) + points;
}

window.addEventListener("load", () => setTimeout(disableInputs, GAME_TIME));
let countdown = setInterval(updateTimer, 1000);

function disableInputs() {
  userMessage.textContent = "Time is up!";
  inputBox.setAttribute("disabled", "true");
  wordButton.setAttribute("disabled", "true");
}

function updateTimer() {
  let newTime = parseInt(timer.textContent) - 1;
  timer.textContent = newTime;
  if (newTime === 0) {
    clearInterval(countdown);
    timer.textContent = "";
  }
 }
