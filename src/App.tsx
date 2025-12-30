import { useState, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import Numbers from "./components/Numbers";
import { getSudoku } from "sudoku-gen";

function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
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
  }, []);

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
      const key = event.key;
      if (key >= "1" && key <= "9") {
        setActiveNumber(parseInt(key));
      }

      if (key.toLowerCase() === "e") {
        setIsEditing((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mt-4 sm:mt-10 md:mt-20 px-2 sm:px-4">
      <SudokuBoard
        board={board}
        setBoard={setBoard}
        notes={notes}
        setNotes={setNotes}
        activeNumber={activeNumber}
        isEditing={isEditing}
        isClearing={isClearing}
        lockedCells={lockedCells}
        wrongCells={wrongCells}
        setWrongCells={setWrongCells}
      />
      <div className="flex gap-1.5 sm:gap-2">
        <div
          onClick={() => setIsEditing(!isEditing)}
          className={`w-9 h-9 sm:w-10 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer text-sm sm:text-base ${isEditing ? "" : "bg-blue-400"}`}
        >
          Ed
        </div>

        <div
          onClick={() => setIsClearing(!isClearing)}
          className={`w-9 h-9 sm:w-10 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer text-sm sm:text-base ${isClearing ? "bg-blue-400" : ""}`}
        >
          Cl
        </div>

        {/*
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 text-sm sm:text-base`}
        >
          Un
        </div>
        */}

        <button
          onClick={validateBoard}
          className="px-3 sm:px-4 h-9 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 font-medium text-sm sm:text-base"
        >
          Check
        </button>
      </div>
      <Numbers activeNumber={activeNumber} setActiveNumber={setActiveNumber} />
    </div>
  );
}

export default App;
