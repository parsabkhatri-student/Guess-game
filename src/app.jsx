import { useState } from "react";
import "./App.css";
import GuessGame from "./GuessGame";
import GameResult from "./GameResult";
import Player from "./Player";
import Database from "./Database";

export default function App() {
  const [nameInput, setNameInput] = useState("Parsab");
  const [player, setPlayer] = useState(null);
  const [phase, setPhase] = useState("start"); // start | play | lost | over | summary
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(1);
  const [guess, setGuess] = useState("");
  const [msg, setMsg] = useState(null);

  const startSession = () => {
    setPlayer(new Player(nameInput.trim()));
    startGame();
  };

  const startGame = () => {
    setLevel(0);
    setScore(0);
    setTarget(GuessGame.newTarget(0));
    setGuess("");
    setMsg(null);
    setPhase("play");
  };

  const finishGame = (finalScore) => {
    player.addGameResult(new GameResult(finalScore));
    Database.saveScore(player.getName(), finalScore);
    setScore(finalScore);
    setPhase("over");
  };

  const submitGuess = () => {
    const n = parseInt(guess, 10);
    if (isNaN(n)) {
      setMsg({ text: "Please enter a valid number.", type: "bad" });
      return;
    }

    if (n === target) {
      const newScore = score + GuessGame.pointsFor(level);
      if (level === GuessGame.totalLevels() - 1) {
        setMsg({ text: "You completed the game!", type: "ok" });
        finishGame(newScore);
        return;
      }
      setScore(newScore);
      setLevel(level + 1);
      setTarget(GuessGame.newTarget(level + 1));
      setMsg({ text: "Correct!", type: "ok" });
    } else {
      setMsg({ text: `Wrong! The number was ${target}.`, type: "bad" });
      setPhase("lost");
    }
    setGuess("");
  };

  return (
    <main>
      <h1>Number Guessing Game</h1>

      {phase === "start" && (
        <div className="card">
          <label htmlFor="name">Player name</label>
          <input id="name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <button onClick={startSession} disabled={!nameInput.trim()}>Start game</button>
        </div>
      )}

      {(phase === "play" || phase === "lost") && (
        <div className="card">
          <p>Level {level + 1} of {GuessGame.totalLevels()}</p>
          <p className="big">{score} pts</p>

          {phase === "play" && (
            <>
              <label htmlFor="guess">Guess a number (1-{GuessGame.LEVEL_RANGES[level]})</label>
              <input
                id="guess"
                inputMode="numeric"
                autoFocus
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitGuess()}
              />
              <button onClick={submitGuess}>Guess</button>
            </>
          )}

          {msg && <p className={`msg ${msg.type}`}>{msg.text}</p>}

          {phase === "lost" && (
            <>
              <p>Do you want to restart?</p>
              <button onClick={startGame}>Yes, restart</button>
              <button className="alt" onClick={() => finishGame(score)}>No, end game</button>
            </>
          )}
        </div>
      )}

      {phase === "over" && (
        <div className="card">
          {msg && msg.type === "ok" && msg.text.startsWith("You") && (
            <p className="msg ok">{msg.text}</p>
          )}
          <p className="big">{score} pts</p>
          <p className="ok">Score saved to database!</p>
          <p>Play again?</p>
          <button onClick={startGame}>Yes</button>
          <button className="alt" onClick={() => setPhase("summary")}>No, show scores</button>
        </div>
      )}

      {phase === "summary" && (
        <>
          <div className="card">
            <strong>Player: {player.getName()}</strong>
            <p>Total score: {player.getTotalScore()}</p>
            <p>Game history:</p>
            {player.getResults().map((r, i) => (
              <div key={i}>Game Score: {r.getScore()}</div>
            ))}
          </div>

          <div className="card">
            <strong>All saved scores</strong>
            <table>
              <thead>
                <tr><th>Name</th><th>Score</th></tr>
              </thead>
              <tbody>
                {Database.showScores()
                  .sort((a, b) => b.score - a.score)
                  .map((r) => (
                    <tr key={r.id}><td>{r.name}</td><td>{r.score}</td></tr>
                  ))}
              </tbody>
            </table>
          </div>

          <button onClick={() => setPhase("start")}>New session</button>
        </>
      )}
    </main>
  );
}