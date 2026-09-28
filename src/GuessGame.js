export default class GuessGame {

  static LEVEL_RANGES = [5, 10, 15, 20];

  static LEVEL_POINTS = [10, 10, 10, 30]; // last level includes a bonus

  static totalLevels() {
    return GuessGame.LEVEL_RANGES.length;
  }

  static isValidLevel(level) {
    return Number.isInteger(level) &&
           level >= 0 &&
           level < GuessGame.totalLevels();
  }

  static newTarget(level) {
    return Math.floor(Math.random() * GuessGame.LEVEL_RANGES[level]) + 1;
  }

  static pointsFor(level) {
    return GuessGame.LEVEL_POINTS[level];
  }

}