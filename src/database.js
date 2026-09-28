const KEY = "guess-game-results";

export default class Database {
  static showScores() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      console.log("Database error: " + e.message);
      return [];
    }
  }

  static saveScore(name, score) {
    try {
      const rows = Database.showScores();
      rows.push({ id: rows.length + 1, name, score });
      localStorage.setItem(KEY, JSON.stringify(rows));
      console.log("Score saved to database!");
    } catch (e) {
      console.log("Database error: " + e.message);
    }
  }
}