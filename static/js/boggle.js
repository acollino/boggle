const wordButton = document.querySelector("#input-word-button");
const inputBox = document.querySelector("#input-word");
const lastGuessResult = document.querySelector("#last-guess");
const userScore = document.querySelector("#score");

wordButton.addEventListener("click", submitWord);

async function submitWord(event) {
  event.preventDefault();
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
  lastGuessResult.textContent = msg;
  userScore.textContent = parseInt(userScore.textContent) + points;
}
