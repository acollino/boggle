class Timer {
  Timer(gameTime) {
    this.gameTime = gameTime;
  }

  startCountdown() {
    this.interval = setInterval(this.updateTimer.bind(this), 1000);
    window.addEventListener("load", () =>
      setTimeout(Timer.disableInputs, GAME_TIME)
    );
  }

  updateTimer() {
    let newTime = parseInt(timeDisplay.textContent) - 1;
    timeDisplay.textContent = newTime;
    if (newTime === 0) {
      clearInterval(this.interval);
      timeDisplay.textContent = "";
    }
  }

  static disableInputs() {
    userMessage.textContent = "Time is up!";
    inputBox.setAttribute("disabled", "true");
    wordButton.setAttribute("disabled", "true");
  }
}
