class Timer {
  constructor(gameTime) {
    this.gameTime = gameTime;
  }

  startCountdown() {
    this.interval = setInterval(this.updateTimer.bind(this), 1000);
  }

  updateTimer() {
    let newTime = parseInt(timeDisplay.textContent) - 1;
    timeDisplay.textContent = newTime;
    if (newTime === 0) {
      clearInterval(this.interval);
      timeDisplay.textContent = "Time is up!"
      Timer.disableInputs();
      timeDisplay.dispatchEvent(new Event("timeUp"));
    }
  }

  static disableInputs() {
    inputBox.setAttribute("disabled", "true");
    wordButton.setAttribute("disabled", "true");
  }
}
