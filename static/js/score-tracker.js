class ScoreTracker {
  constructor() {
    this.score = 0;
    this.wordList = [];
  }

  static checkGameOver() {
    let timeUsed = performance.now() - START_TIME;
    return timeUsed > GAME_TIME;
  }

  async submitWord(word) {
    if (ScoreTracker.checkGameOver()) return;
    let targetURL = `${window.location.href}submit/${word}`;
    let fetchObj = { method: "GET" };
    let resp = await fetch(targetURL, fetchObj);
    if (resp.ok) {
      let wordStatus = await resp.json();
      inputBox.value = "";
      this.checkWordResponse(wordStatus, word);
    }
  }

  checkWordResponse(wordStatus, word) {
    if (wordStatus === "ok" && !this.wordList.includes(word)) {
      this.addWord(word);
      let score = word.length;
      let resultText = "Nice word!";
      if (score >= 4) {
        resultText = score > 6 ? "Amazing word!" : "Great word!";
      }
      this.updateScore(resultText, score);
    } else if (this.wordList.includes(word)) {
      this.updateScore(
        "You already entered that word!"
      );
    } else if (wordStatus === "not-on-board") {
      this.updateScore(
        "That was a good word, but it isn't on the Boggle board."
      );
    } else {
      this.updateScore("Sorry, that word isn't in my dictionary!");
    }
  }

  addWord(word) {
    this.wordList.push(word);
    let listElement = document.createElement("li");
    listElement.textContent = word;
    userWords.append(listElement);
  }

  updateScore(msg, points = 0) {
    userMessage.textContent = msg;
    this.score += points;
    userScore.textContent = this.score;
  }

  async submitScore() {
    let targetURL = `${window.location.href}score`;
    let fetchObj = {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ "score": this.score }),
    };
    let resp = await fetch(targetURL, fetchObj);
    if (resp.ok) {
      let scoreInfo = await resp.json();
      userMessage.textContent = this.interpretScore(scoreInfo);
    }
    else {
      console.log(resp.statusText);
    }
  }

  interpretScore(scoreInfo) {
    let { highScore, numGames, newRecord } = scoreInfo;
    let message = "Thanks for playing!";
    if (newRecord) {
      message = "Wow, that's a new high score!";
    }
    else {
      message += ` Your current high score is ${highScore}.`;
    }
    message += ` You've played ${numGames} games so far.`;
    return message;
  }

}
