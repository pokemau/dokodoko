import { useState, useEffect } from "react";
import "./App.css";
import SudokuBoard from "./components/SudokuBoard";
import Numbers from "./components/Numbers";

function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [notes, setNotes] = useState<Set<number>[]>(
    Array(81)
      .fill(null)
      .map(() => new Set<number>()),
  );
  const [board, setBoard] = useState<(number | null)[]>(Array(81).fill(null));

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
    <div className="flex flex-col items-center justify-center mt-20">
      <SudokuBoard
        board={board}
        setBoard={setBoard}
        notes={notes}
        setNotes={setNotes}
        activeNumber={activeNumber}
        isEditing={isEditing}
      />
      <div className="flex gap-2">
        <div
          onClick={() => setIsEditing(!isEditing)}
          className={`w-10 h-10 border-2 mt-10 flex items-center justify-center rounded-full cursor-pointer ${isEditing ? "" : "bg-blue-400"}`}
        >
          Ed
        </div>

        <div
          className={`w-10 h-10 border-2 mt-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-200`}
        >
          Un
        </div>
      </div>
      <Numbers activeNumber={activeNumber} setActiveNumber={setActiveNumber} />
    </div>
  );
}

export default App;
