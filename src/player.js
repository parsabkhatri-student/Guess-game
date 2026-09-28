export default class Player {

  #name;

  #totalScore = 0;

  #results = [];

  constructor(name) {

    this.#name = name;

  }

  getName() {

    return this.#name;

  }

  getTotalScore() {

    return this.#totalScore;

  }

  getResults() {

    return [...this.#results];

  }

  addGameResult(result) {

    if (!result || typeof result.getScore !== "function") {
      throw new Error("Invalid game result");
    }

    this.#results.push(result);

    this.#totalScore += result.getScore();

  }

}