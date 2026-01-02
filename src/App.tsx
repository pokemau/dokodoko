import { useState, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import Numbers from "./components/Numbers";
import { BoardControls } from "./components/BoardControls";
import Timer from "./components/Timer";
import PauseButton from "./components/PauseButton";
import { getSudoku } from "sudoku-gen";

function App() {
  const [isTakingNotes, setIsTakingNotes] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(1);
  const [notes, setNotes] = useState<Set<number>[]>(
    Array(81)
      .fill(null)
      .map(() => new Set<number>()),
  );
  const [board, setBoard] = useState<(number | null)[]>(Array(81).fill(null));
  const [lockedCells, setLockedCells] = useState<boolean[]>(
    Array(81).fill(false),
  );
  const [solution, setSolution] = useState<string>("");
  const [wrongCells, setWrongCells] = useState<boolean[]>(
    Array(81).fill(false),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const sudoku = getSudoku("expert");

    const initialBoard: (number | null)[] = sudoku.puzzle
      .split("")
      .map((char) => {
        if (char === "-") return null;
        return parseInt(char);
      });

    const locked: boolean[] = sudoku.puzzle
      .split("")
      .map((char) => char !== "-");

    setBoard(initialBoard);
    setLockedCells(locked);
    setSolution(sudoku.solution);
    setElapsedTime(0);
  }, []);

  // Timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const calculateNumberCounts = () => {
    const counts = Array(9).fill(0);

    board.forEach((value, index) => {
      if (value === null) return;
      if (wrongCells[index]) return;

      const correctValue = parseInt(solution[index]);
      if (value === correctValue) {
        counts[value - 1]++;
      }
    });

    return counts;
  };

  const validateBoard = () => {
    const wrong = board.map((value, index) => {
      if (lockedCells[index]) return false;

      if (value === null) return false;

      const correctValue = parseInt(solution[index]);
      return value !== correctValue;
    });

    setWrongCells(wrong);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isPaused) return;

      const key = event.key;
      if (key >= "1" && key <= "9") {
        const number = parseInt(key);
        const counts = calculateNumberCounts();
        if (counts[number - 1] < 9 || isTakingNotes) {
          setActiveNumber(number);
        }
      }

      if (key.toLowerCase() === "e") {
        if (isClearing)
          setIsClearing(prev => !prev);

        setIsTakingNotes((prev) => !prev);
      }

      if (key.toLowerCase() === "x") {
        setIsClearing((prev) => !prev);
      }

      if (key.toLowerCase() === "c") {
        validateBoard();
      }

      if (key.toLowerCase() === "p") {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [board, solution, lockedCells, wrongCells, isTakingNotes, isPaused]);

  useEffect(() => {
    if (activeNumber === null) return;

    const counts = calculateNumberCounts();
    if (counts[activeNumber - 1] >= 9) {
      // Find next available number
      let nextNumber = null;
      for (let i = 1; i <= 9; i++) {
        if (counts[i - 1] < 9) {
          nextNumber = i;
          break;
        }
      }
      setActiveNumber(nextNumber);
    }
  }, [board, wrongCells]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-2 sm:px-4">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Timer elapsedTime={elapsedTime} />
        <PauseButton isPaused={isPaused} onToggle={() => setIsPaused(!isPaused)} />
      </div>
      <SudokuBoard
        board={board}
        setBoard={setBoard}
        notes={notes}
        setNotes={setNotes}
        activeNumber={activeNumber}
        isTakingNotes={isTakingNotes}
        isClearing={isClearing}
        lockedCells={lockedCells}
        wrongCells={wrongCells}
        setWrongCells={setWrongCells}
        numberCounts={calculateNumberCounts()}
        isPaused={isPaused}
      />
      <BoardControls
        isTakingNotes={isTakingNotes}
        onEditToggle={() => {
          if (isClearing) setIsClearing(prev => !prev);
          setIsTakingNotes(!isTakingNotes);
        }}
        isClearing={isClearing}
        onClearToggle={() => setIsClearing(!isClearing)}
        onValidate={validateBoard}
      />
      <Numbers
        activeNumber={activeNumber}
        setActiveNumber={setActiveNumber}
        numberCounts={calculateNumberCounts()}
        isTakingNotes={isTakingNotes}
      />
    </div>
  );
}

export default App;
