class WordTracker {
  static checkGameOver() {
    let timeUsed = performance.now() - START_TIME;
    return timeUsed > GAME_TIME;
  }

  static async submitWord() {
    if (WordTracker.checkGameOver()) return;

    let word = inputBox.value.trim().toLowerCase();
    let targetURL = `${window.location.href}/submit/${word}`;
    let fetchObj = { method: "GET" };
    let resp = await fetch(targetURL, fetchObj);
    if (resp.ok) {
      let wordStatus = await resp.json();
      inputBox.value = "";
      WordTracker.checkWordResponse(wordStatus, word);
    }
  }

  static checkWordResponse(wordStatus, word) {
    if (wordStatus === "ok") {
      let score = word.length;
      let resultText = "Nice word!";
      if (score >= 4) {
        resultText = score > 6 ? "Amazing word!" : "Great word!";
      }
      WordTracker.updateScore(resultText, score);
    } else if (wordStatus === "not-on-board") {
      WordTracker.updateScore(
        "That was a good word, but it isn't on the Boggle board."
      );
    } else {
      WordTracker.updateScore("Sorry, that word isn't in my dictionary!");
    }
  }

  static updateScore(msg, points = 0) {
    userMessage.textContent = msg;
    userScore.textContent = parseInt(userScore.textContent) + points;
  }
}
