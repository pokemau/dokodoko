import { useState, useEffect } from "react";
import SudokuBoard from "./components/SudokuBoard";
import Numbers from "./components/Numbers";
import { BoardControls, NewGameButton } from "./components/BoardControls";
import Timer from "./components/Timer";
import PauseButton from "./components/PauseButton";
import { getSudoku } from "sudoku-gen";
import { clearGameState, getGameState, hasGameState, saveGameState } from "./utils/storage";

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isTakingNotes, setIsTakingNotes] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [solution, setSolution] = useState<string>("");
  const [activeNumber, setActiveNumber] = useState<number | null>(1);
  const [board, setBoard] = useState<(number | null)[]>(Array(81).fill(null));
  const [wrongCells, setWrongCells] = useState<boolean[]>(Array(81).fill(false));
  const [lockedCells, setLockedCells] = useState<boolean[]>(Array(81).fill(false));
  const [notes, setNotes] = useState<Set<number>[]>(Array(81).fill(null).map(() => new Set()));


  // check if has existing board-state
  useEffect(() => {
    if (hasGameState()) {
      console.log('has game state, loading now')
      const state = getGameState();
      if (!state) { return; }

      setBoard(state.board);
      setElapsedTime(state.elapsedTime);
      setSolution(state.solution);
      setWrongCells(state.wrongCells);
      setLockedCells(state.lockedCells);
      setNotes(state.notes);
    }
  }, []);

  // auto save
  useEffect(() => {
    if (!solution) { return; }

    const timeoutId = setTimeout(() => {
      saveGameState(elapsedTime, solution, board, lockedCells, wrongCells, notes);
      console.log('Auto-saved game state');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [board, notes, wrongCells]);

  useEffect(() => {
    if (hasGameState()) { return; }

    const sudoku = getSudoku("expert");
    console.log(sudoku)

    const { board, solution, lockedCells } = initNewGame();

    setBoard(board);
    setLockedCells(lockedCells);
    setSolution(solution);
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

  const initNewGame = () => {
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
    return {
      board: initialBoard,
      solution: sudoku.solution,
      lockedCells: locked
    };
  }

  const validateBoard = () => {
    const wrong = board.map((value, index) => {
      if (lockedCells[index]) return false;

      if (value === null) return false;

      const correctValue = parseInt(solution[index]);
      return value !== correctValue;
    });

    setWrongCells(wrong);
  };

  const createNewGame = () => {
    clearGameState();
    const sudoku = getSudoku("expert");
    console.log('New game:', sudoku);

    const { board, lockedCells, solution } = initNewGame();

    setBoard(board);
    setSolution(solution);
    setLockedCells(lockedCells);

    setElapsedTime(0);
    setWrongCells(Array(81).fill(false));
    setNotes(Array(81).fill(null).map(() => new Set()));
    setActiveNumber(1);
    setIsPaused(false);
    setIsClearing(false);
    setIsTakingNotes(false);
  }

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
      <div className="flex items-center justify-between gap-4 mb-4 mx-auto">
        <Timer elapsedTime={elapsedTime} />
        <div className="flex gap-2">
          <PauseButton isPaused={isPaused} onToggle={() => setIsPaused(!isPaused)} />
          <NewGameButton onClick={createNewGame} />
        </div>
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
