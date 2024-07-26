class Model {
  constructor() {
    this.initializeGameState();
  }

  initializeGameState() {
    this.score = 0;
    this.timeLeft = 30;
    this.gameBoard = Array(12).fill({ id: 0, hasMole: false });
    this.activeMoles = 0;
    this.hasSnake = false;
    this.snakePosition = null;
  }

  resetGame() {
    this.initializeGameState();
  }

  updateScore() {
    this.score++;
  }

  updateTimer() {
    this.timeLeft--;
  }

  addMole() {
    if (this.activeMoles >= 3) return;

    const emptySlots = this.gameBoard.filter((slot) => !slot.hasMole);
    if (emptySlots.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptySlots.length);
    const slotIndex = this.gameBoard.indexOf(emptySlots[randomIndex]);
    this.gameBoard[slotIndex] = { id: slotIndex, hasMole: true };
    this.activeMoles++;
  }

  addSnake() {
    const randomIndex = Math.floor(Math.random() * this.gameBoard.length);
    this.snakePosition = randomIndex;
    this.hasSnake = true;
    
    // Remove mole if snake appears on its spot
    if (this.gameBoard[randomIndex].hasMole) {
      this.removeMole(randomIndex);
    }
  }

  removeSnake() {
    this.hasSnake = false;
    this.snakePosition = null;
  }

  removeMole(id) {
    const index = this.gameBoard.findIndex((slot) => slot.id === id);
    if (index !== -1 && this.gameBoard[index].hasMole) {
      this.gameBoard[index] = { id: index, hasMole: false };
      this.activeMoles--;
    }
  }

  fillAllSpotsWithSnakes() {
    this.gameBoard = this.gameBoard.map((slot, index) => ({
      id: index,
      hasMole: false,
      hasSnake: true
    }));
    this.hasSnake = true;
    this.snakePosition = -1; // -1 to indicate all spots have snakes
  }
}

export { Model };