class View {
  constructor() {
    this.header = document.querySelector("header");
    this.gameBoard = document.querySelector(".game-board");
    this.timerElement = document.querySelector(".timer");
    this.scoreElement = document.querySelector(".score");
    this.startButton = document.querySelector(".start-button");
  }

  renderGameBoard(gameBoard, hasSnake, snakePosition) {
    this.gameBoard.innerHTML = "";
    gameBoard.forEach((slot, index) => {
      const block = document.createElement("div");
      block.classList.add("block");
      block.dataset.id = index;
      
      if (hasSnake && (index === snakePosition || snakePosition === -1)) {
        const snake = document.createElement("img");
        snake.src = "../images/snake.jpg";
        snake.alt = "Snake";
        snake.classList.add("snake");
        block.appendChild(snake);
      } else if (slot.hasMole) {
        const mole = document.createElement("img");
        mole.src = "../images/mole.jpg";
        mole.alt = "Mole";
        mole.classList.add("mole");
        block.appendChild(mole);
      }
      
      this.gameBoard.appendChild(block);
    });
  }

  updateScore(score) {
    this.scoreElement.textContent = `Score: ${score}`;
  }

  updateTimer(timeLeft) {
    this.timerElement.textContent = `Time Left: ${timeLeft}`;
  }

  showGameOver(reason) {
    alert(reason === 'snake' ? "You clicked a snake! Game Over!" : "Time is Over!");
  }
}

export { View };