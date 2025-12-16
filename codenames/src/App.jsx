import { useState } from "react";
import "./index.css";

const WORDS = [
  "APPLE", "TRAIN", "BANK", "CODE", "DOG",
  "CAT", "CAR", "BRIDGE", "PILOT", "PLANE",
  "MOUSE", "KEY", "SCREEN", "JACK", "CROWN",
  "RIVER", "NOTE", "TABLE", "CHAIR", "BOOK",
  "MOON", "STAR", "LIGHT", "GLASS", "CLOCK"
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

  function revealTile(index) {
    setBoard(prev =>
      prev.map((tile, i) =>
        i === index ? { ...tile, revealed: true } : tile
      )
    );
  }

  return (
    <div className="app">
      <h1>Codenames Demo Board</h1>

      <label style={{ marginBottom: "1rem", display: "block" }}>
        <input
          type="checkbox"
          checked={spymasterView}
          onChange={() => setSpymasterView(v => !v)}
        />
        Spymaster View
      </label>

      <div className="board">
        {board.map((tile, index) => (
          <div
            key={index}
            className={`tile ${
              tile.revealed || spymasterView ? tile.color : ""
            }`}
            onClick={() => revealTile(index)}
          >
            {tile.word}
          </div>
        ))}
      </div>
    </div>
  );
}
