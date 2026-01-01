import { useState, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import Numbers from "./components/Numbers";
import { getSudoku } from "sudoku-gen";
import { FaCheck } from "react-icons/fa6";
import { MdClear, MdModeEditOutline } from "react-icons/md";

function App() {
  const [isEditing, setIsEditing] = useState(true);
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
      const key = event.key;
      if (key >= "1" && key <= "9") {
        const number = parseInt(key);
        const counts = calculateNumberCounts();
        if (counts[number - 1] < 9) {
          setActiveNumber(number);
        }
      }

      if (key.toLowerCase() === "e") {
        setIsEditing((prev) => !prev);
      }

      if (key.toLowerCase() === "x") {
        setIsClearing((prev) => !prev);
      }

      if (key.toLowerCase() === "c") {
        validateBoard();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [board, solution, lockedCells, wrongCells]);

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
        numberCounts={calculateNumberCounts()}
      />
      <div className="flex gap-1.5 sm:gap-2">
        <div
          onClick={() => setIsEditing(!isEditing)}
          className={`w-14 h-9 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer text-sm sm:text-base ${isEditing ? "" : "bg-blue-400"}`}
        >
          <MdModeEditOutline />
        </div>

        <div
          onClick={() => setIsClearing(!isClearing)}
          className={`w-14 h-9 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer text-sm sm:text-base ${isClearing ? "bg-blue-400" : ""}`}
        >
          <MdClear />
        </div>

        <button
          onClick={validateBoard}
          className="w-14 px-3 sm:px-4 h-9 sm:h-10 border-2 mt-4 sm:mt-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200 text-sm sm:text-base"
        >
          <FaCheck />
        </button>
      </div>
      <Numbers
        activeNumber={activeNumber}
        setActiveNumber={setActiveNumber}
        numberCounts={calculateNumberCounts()}
      />
    </div>
  );
}

export default App;
