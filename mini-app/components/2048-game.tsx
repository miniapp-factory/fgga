import { useState, useEffect } from "react";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const GRID_SIZE = 4;
const TILE_VALUES = [2, 4];
const TILE_PROBABILITIES = [0.9, 0.1];

function getRandomTile() {
  return Math.random() < TILE_PROBABILITIES[0] ? TILE_VALUES[0] : TILE_VALUES[1];
}

function cloneGrid(grid: number[][]) {
  return grid.map(row => [...row]);
}

export function Game2048() {
  const [grid, setGrid] = useState<number[][]>(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0)));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Add a random tile to an empty spot
  const addRandomTile = (g: number[][]) => {
    const empty: [number, number][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (g[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return g;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    g[r][c] = getRandomTile();
    return g;
  };

  // Merge a single row or column
  const mergeLine = (line: number[]) => {
    const filtered = line.filter(v => v !== 0);
    const merged: number[] = [];
    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }
    while (merged.length < GRID_SIZE) merged.push(0);
    return merged;
  };

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;
    let newGrid = cloneGrid(grid);
    let moved = false;

    const rotate = (g: number[][], times: number) => {
      let res = g;
      for (let t = 0; t < times; t++) {
        const tmp = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            tmp[c][GRID_SIZE - 1 - r] = res[r][c];
          }
        }
        res = tmp;
      }
      return res;
    };

    // Normalize to left move
    if (direction === "up") newGrid = rotate(newGrid, 1);
    else if (direction === "right") newGrid = rotate(newGrid, 2);
    else if (direction === "down") newGrid = rotate(newGrid, 3);

    for (let r = 0; r < GRID_SIZE; r++) {
      const original = newGrid[r];
      const merged = mergeLine(original);
      if (!moved && merged.some((v, idx) => v !== original[idx])) moved = true;
      newGrid[r] = merged;
    }

    // Rotate back
    if (direction === "up") newGrid = rotate(newGrid, 3);
    else if (direction === "right") newGrid = rotate(newGrid, 2);
    else if (direction === "down") newGrid = rotate(newGrid, 1);

    if (!moved) return;

    const newScore = newGrid.flat().reduce((a, b) => a + b, 0);
    setScore(newScore);
    setGrid(addRandomTile(newGrid));

    // Check win
    if (newGrid.flat().includes(2048)) setWon(true);

    // Check game over
    const hasEmpty = newGrid.flat().some(v => v === 0);
    const canMerge = () => {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (c + 1 < GRID_SIZE && newGrid[r][c] === newGrid[r][c + 1]) return true;
          if (r + 1 < GRID_SIZE && newGrid[r][c] === newGrid[r + 1][c]) return true;
        }
      }
      return false;
    };
    if (!hasEmpty && !canMerge()) setGameOver(true);
  };

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") move("up");
    else if (e.key === "ArrowDown") move("down");
    else if (e.key === "ArrowLeft") move("left");
    else if (e.key === "ArrowRight") move("right");
  };

  useEffect(() => {
    // Start with two tiles
    let g = cloneGrid(grid);
    g = addRandomTile(g);
    g = addRandomTile(g);
    setGrid(g);
    // Key listener
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-4 gap-2">
        {grid.flat().map((v, idx) => (
          <div
            key={idx}
            className={`w-16 h-16 flex items-center justify-center rounded-md text-2xl font-bold ${
              v === 0
                ? "bg-gray-200"
                : v <= 4
                ? "bg-yellow-200"
                : v <= 8
                ? "bg-yellow-300"
                : v <= 16
                ? "bg-yellow-400"
                : v <= 32
                ? "bg-yellow-500"
                : v <= 64
                ? "bg-yellow-600"
                : "bg-yellow-700"
            }`}
          >
            {v !== 0 && v}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl">Score: {score}</span>
        {gameOver && (
          <Share
            text={`I scored ${score} in 2048! ${url}`}
          />
        )}
        {won && <span className="text-lg font-semibold">You reached 2048!</span>}
      </div>
    </div>
  );
}
>>>>>>> SEARCH
````

mini-app/public/logo.png.todo
````txt
<<<<<<< SEARCH
