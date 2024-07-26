import { Model } from './model.js';
import { View } from './view.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.gameInterval = null;
    this.timerInterval = null;
    this.snakeInterval = null;
    this.moleDisappearIntervals = {};

    this.view.startButton.addEventListener("click", () => this.startGame());
    this.view.gameBoard.addEventListener("mousedown", (e) => this.handleMoleClick(e));
  }

  startGame() {
    this.model.resetGame();
    this.view.renderGameBoard(this.model.gameBoard, this.model.hasSnake, this.model.snakePosition);
    this.view.updateScore(this.model.score);
    this.view.updateTimer(this.model.timeLeft);

    this.gameInterval = setInterval(() => {
      this.model.addMole();
      this.view.renderGameBoard(this.model.gameBoard, this.model.hasSnake, this.model.snakePosition);
      this.setMoleDisappearTimer();
    }, 500);

    this.snakeInterval = setInterval(() => {
      this.model.addSnake();
      this.view.renderGameBoard(this.model.gameBoard, this.model.hasSnake, this.model.snakePosition);
      
      // Remove the mole disappear timer for the snake's position
      if (this.moleDisappearIntervals[this.model.snakePosition]) {
        clearTimeout(this.moleDisappearIntervals[this.model.snakePosition]);
        delete this.moleDisappearIntervals[this.model.snakePosition];
      }
    }, 2000);

    this.timerInterval = setInterval(() => {
      this.model.updateTimer();
      this.view.updateTimer(this.model.timeLeft);
      if (this.model.timeLeft <= 0) {
        this.endGame('time');
      }
    }, 1000);
  }

  handleMoleClick(event) {
    const clickedBlock = event.target.closest(".block");
    if (clickedBlock) {
      const id = parseInt(clickedBlock.dataset.id);
      if (this.model.hasSnake && id === this.model.snakePosition) {
        this.model.fillAllSpotsWithSnakes();
        this.view.renderGameBoard(this.model.gameBoard, true, -1);
        this.endGame('snake');
      } else if (this.model.gameBoard[id].hasMole) {
        // Clear the disappear timer for this mole
        if (this.moleDisappearIntervals[id]) {
          clearTimeout(this.moleDisappearIntervals[id]);
          delete this.moleDisappearIntervals[id];
        }
        
        this.model.removeMole(id);
        this.model.updateScore();
        this.view.updateScore(this.model.score);
        this.view.renderGameBoard(this.model.gameBoard, this.model.hasSnake, this.model.snakePosition);
      }
    }
  }

  setMoleDisappearTimer() {
    this.model.gameBoard.forEach((slot, index) => {
      if (slot.hasMole) {
        // Clear existing timer if there is one
        if (this.moleDisappearIntervals[index]) {
          clearTimeout(this.moleDisappearIntervals[index]);
        }
        
        const timer = setTimeout(() => {
          this.model.removeMole(index);
          this.view.renderGameBoard(this.model.gameBoard, this.model.hasSnake, this.model.snakePosition);
          delete this.moleDisappearIntervals[index];
        }, 2000);
        this.moleDisappearIntervals[index] = timer;
      }
    });
  }

  endGame(reason) {
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);
    clearInterval(this.snakeInterval);
    Object.values(this.moleDisappearIntervals).forEach(clearTimeout);
    this.moleDisappearIntervals = {};
    
    if (reason !== 'snake') {
      this.view.showGameOver(reason);
    }
  }

  static bootstrap() {
    const model = new Model();
    const view = new View();
    return new Controller(model, view);
  }
}

export { Controller };