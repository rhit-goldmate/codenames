import { useState } from "react";
import "./index.css";

// const WORDS = [
//   "APPLE", "TRAIN", "BANK", "CODE", "DOG",
//   "CAT", "CAR", "BRIDGE", "PILOT", "PLANE",
//   "MOUSE", "KEY", "SCREEN", "JACK", "CROWN",
//   "RIVER", "NOTE", "TABLE", "CHAIR", "BOOK",
//   "MOON", "STAR", "LIGHT", "GLASS", "CLOCK"
// ];
// Beginner (50)
const WORDS_BEGINNER = [
  "APPLE", "DOG", "CAT", "CAR", "TRAIN",
  "HOUSE", "TREE", "BOOK", "CHAIR", "TABLE",
  "PHONE", "CLOCK", "SHOE", "HAT", "BALL",
  "WATER", "FIRE", "SNOW", "SUN", "MOON",
  "STAR", "FOOD", "BREAD", "MILK", "EGG",
  "ROAD", "BRIDGE", "RIVER", "MOUNTAIN", "BEACH",
  "CITY", "FARM", "SCHOOL", "STORE", "PARK",
  "DOOR", "WINDOW", "KEY", "LIGHT", "GLASS",
  "PAPER", "PEN", "MAP", "CAMERA", "MUSIC",
  "BABY", "FRIEND", "FAMILY", "HOME", "GARDEN"
];

// Intermediate (35)
const WORDS_INTERMEDIATE = [
  "BANK", "CODE", "ENGINE", "FIELD", "CHARGE",
  "SCREEN", "SERVER", "NETWORK", "SIGNAL", "POWER",
  "RING", "BAT", "PLANE", "PORT", "CHANNEL",
  "VOLUME", "PRESS", "MATCH", "NOTE", "TRACK",
  "SCALE", "THREAD", "CHAIN", "FRAME", "CORE",
  "SHIFT", "BLOCK", "LINK", "PATH", "LEVEL",
  "BOUNDARY", "COVER", "POINT", "BRANCH", "STREAM"
];

// Advanced (15)
const WORDS_ADVANCED = [
  "VIRUS", "SHADOW", "AGENT", "SIGNATURE", "PROTOCOL",
  "PARADOX", "VECTOR", "DOMAIN", "PAYLOAD", "MIRROR",
  "DECAY", "ECHO", "FRACTURE", "OBSERVER", "ORIGIN"
];

const WORDS = [
  ...WORDS_BEGINNER,
  ...WORDS_INTERMEDIATE,
  ...WORDS_ADVANCED
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateBoard() {
  const words = shuffle(WORDS).slice(0, 25);

  const colors = shuffle([
    ...Array(9).fill("blue"),
    ...Array(15).fill("neutral"),
    "assassin"
  ]);

  return words.map((word, i) => ({
    word,
    color: colors[i],
    revealed: false
  }));
}

export default function App() {
  const [board, setBoard] = useState(generateBoard);
  const [spymasterView, setSpymasterView] = useState(false);
  const [remainingBlue, setRemainingBlue] = useState(9);
  const [gameStatus, setGameStatus] = useState("playing");

  function revealTile(index) {
    if (gameStatus != "playing") return;

    const tile = board[index];
    if (tile.revealed) return;

    // Handle game logic first
    if (tile.color === "blue") {
      const newRemaining = remainingBlue - 1;
      setRemainingBlue(newRemaining);
      if (newRemaining === 0) {
        setGameStatus("won");
      }
    }

    if (tile.color === "assassin") {
      setGameStatus("lost");
    }

    setBoard(prev =>
      prev.map((t, i) =>
        i === index ? { ...t, revealed: true } : t
      )
    );
  }

  function resetGame() {
    setBoard(generateBoard());
    setRemainingBlue(9);
    setGameStatus("playing");
  }

  return (
    <div className="app">
      <h1>Codenames (Co-Op)</h1>

      <p className={`status ${gameStatus}`}>
        {gameStatus === "playing" && `Blue remaining: ${remainingBlue}`}
        {gameStatus === "won" && "You win!"}
        {gameStatus === "lost" && "Assassin revealed. You lose."}
      </p>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={spymasterView}
            onChange={() => setSpymasterView(v => !v)}
          />
          Spymaster View
        </label>

        <button className="primary" onClick={resetGame}>New Game</button>
      </div>

      <div className={`board ${gameStatus !== "playing" ? "game-over" : ""}`}>
        {board.map((tile, index) => (
          <div
            key={index}
            className={`tile-container ${
              tile.revealed || spymasterView ? "revealed" : ""
            }`}
            onClick={() => revealTile(index)}
          >
            <div className="tile-inner">
              <div className="tile-front">
                {tile.word}
              </div>
              <div className={`tile-back ${tile.color}`}>
                {tile.word}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
