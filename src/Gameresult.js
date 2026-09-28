export default class GameResult {

  #score;

  constructor(score) {
    this.#score = score;
  }

  getScore() {
    return this.#score;
  }

  isWinner() {
    return this.#score > 0;
  }

}