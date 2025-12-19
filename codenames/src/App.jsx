import { useState } from "react";
import "./index.css";

/* ================= WORD LISTS ================= */

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
  "BABY", "FRIEND", "FAMILY", "HOME", "GARDEN",
  // New beginner words
  "BIRD", "FISH", "CUP", "BOTTLE", "TREEHOUSE",
  "CARPET", "RABBIT", "SPOON", "KNIFE", "FORK",
  "BALLON", "TRAINTRACK", "KITE", "UMBRELLA", "HILL",
  "ROADSIGN", "BRUSH", "CANDLE", "RIVERBANK", "STARFISH",
  "GUITAR", "DRUM", "PIANO", "BASKET", "PLANT",
  "PIZZA", "ICECREAM", "TOY", "LETTER", "JUPITER",
  "COUCH", "LAMP", "MOUSEPAD", "TOWER", "BED",
  "FENCE", "GARDEN", "WINDOW", "BOOKSHELF", "TEAPOT",
  "BOTTLECAP", "KEYCHAIN", "RUG", "BACKPACK", "WATERFALL",
  "LADDER", "BALLOONPUMP", "HUT", "SANDCASTLE", "TRAINSTATION"
];


// Intermediate (70)
const WORDS_INTERMEDIATE = [
  "BANK", "CODE", "ENGINE", "FIELD", "CHARGE",
  "SCREEN", "SERVER", "NETWORK", "SIGNAL", "POWER",
  "RING", "BAT", "PLANE", "PORT", "CHANNEL",
  "VOLUME", "PRESS", "MATCH", "NOTE", "TRACK",
  "SCALE", "THREAD", "CHAIN", "FRAME", "CORE",
  "SHIFT", "BLOCK", "LINK", "PATH", "LEVEL",
  "BOUNDARY", "COVER", "POINT", "BRANCH", "STREAM",
  // New intermediate words
  "MARKET", "BRIDGE", "CIRCUIT", "ROBOT", "BRACKET",
  "FURNACE", "LANTERN", "CARGO", "TUNNEL", "TOWER",
  "PLATFORM", "SIGN", "VALVE", "MACHINE", "PORTAL",
  "DIAL", "CHART", "HATCH", "CABIN", "RAIL",
  "GATE", "TUNING", "MODULE", "BEAM", "PLATE",
  "TRACKER", "MOTOR", "CLUSTER", "TRUNK", "SNAKE",
  "SENSOR", "FILTER", "PUMP", "CAGE", "PIPE",
  "OCEAN", "LINKAGE", "FUSE", "STATION", "PATHWAY"
];


// Advanced (30)
const WORDS_ADVANCED = [
  "VIRUS", "SHADOW", "AGENT", "SIGNATURE", "PROTOCOL",
  "PARADOX", "VECTOR", "DOMAIN", "PAYLOAD", "MIRROR",
  "DECAY", "ECHO", "FRACTURE", "OBSERVER", "ORIGIN",
  // New advanced words
  "ENIGMA", "QUANTUM", "ALGORITHM", "ENTROPY", "SPECTRUM",
  "LABYRINTH", "OBLIVION", "COSMOS", "DIMENSION", "NEXUS",
  "FREQUENCY", "RESONANCE", "SYNTHESIS", "CRYPTOGRAPHY", "CATALYST",
  "VORTEX", "ECLIPSE", "PARADIGM", "MATRIX", "SIGNALITY"
];


const WORDS = [
  ...shuffle(WORDS_BEGINNER).slice(0,12),
  ...shuffle(WORDS_INTERMEDIATE).slice(0,8),
  ...shuffle(WORDS_ADVANCED).slice(0,5)
];

/* ================= HELPERS ================= */

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

/* ================= APP ================= */

export default function App() {
  const [board, setBoard] = useState(generateBoard);
  const [spymasterView, setSpymasterView] = useState(false);
  const [remainingBlue, setRemainingBlue] = useState(9);
  const [gameStatus, setGameStatus] = useState("playing");

  function revealTile(index) {
    if (gameStatus !== "playing" || spymasterView) return;

    const tile = board[index];
    if (tile.revealed) return;

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

  /* ===== CLEAN CLASSNAME COMPOSITION ===== */

  const boardClassName = [
    "board",
    gameStatus !== "playing" && "game-over",
    spymasterView && "spymaster"
  ].filter(Boolean).join(" ");

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

        <button className="primary" onClick={resetGame}>
          New Game
        </button>
      </div>

      <div className={boardClassName}>
        {board.map((tile, index) => (
          <div
            key={index}
            className={`tile-container ${
              tile.revealed ? "revealed" : ""
            }`}
            onClick={() => revealTile(index)}
          >
            <div className={`tile-inner ${spymasterView ? "spymaster-reveal" : ""}`}>
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
