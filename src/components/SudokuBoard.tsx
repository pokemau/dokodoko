interface SudokuBoardProps {
  board: (number | null)[];
  setBoard: (board: (number | null)[]) => void;
  notes: Set<number>[];
  setNotes: (notes: Set<number>[]) => void;
  activeNumber: number | null;
  isNoting: boolean;
  isClearing: boolean;
  lockedCells: boolean[];
  wrongCells: boolean[];
  setWrongCells: (wrongCells: boolean[]) => void;
  numberCounts: number[];
}

const SudokuBoard = ({
  board,
  setBoard,
  notes,
  setNotes,
  activeNumber,
  isNoting,
  isClearing,
  lockedCells,
  wrongCells,
  setWrongCells,
  numberCounts,
}: SudokuBoardProps) => {
  return (
    <div className="inline-grid grid-cols-9 gap-0 border-2 border-gray-800">
      {Array.from({ length: 9 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, col) => {
          const index = row * 9 + col;
          return (
            <SudokuCell
              key={`${row}-${col}`}
              activeNumber={activeNumber}
              row={row}
              col={col}
              value={board[index]}
              cellNotes={notes[index]}
              isNoting={isNoting}
              isLocked={lockedCells[index]}
              isWrong={wrongCells[index]}
              onCellClick={() => {
                if (lockedCells[index]) return;

                if (isClearing) {
                  const hasValue = board[index] !== null;
                  const hasNotes = notes[index].size > 0;

                  if (!hasValue && !hasNotes) return;

                  if (hasValue) {
                    const newBoard = [...board];
                    newBoard[index] = null;
                    setBoard(newBoard);

                    const newWrongCells = [...wrongCells];
                    newWrongCells[index] = false;
                    setWrongCells(newWrongCells);
                  }

                  if (hasNotes) {
                    const newNotes = [...notes];
                    newNotes[index] = new Set<number>();
                    setNotes(newNotes);
                  }

                  return;
                }

                if (activeNumber === null) return;

                // Prevent placing numbers that have reached the limit
                if (numberCounts[activeNumber - 1] >= 9) return;

                if (!isNoting) {
                  const newBoard = [...board];
                  newBoard[index] = activeNumber;
                  setBoard(newBoard);

                  if (wrongCells[index]) {
                    const newWrongCells = [...wrongCells];
                    newWrongCells[index] = false;
                    setWrongCells(newWrongCells);
                  }
                } else {
                  const newNotes = [...notes];
                  const currentNotes = new Set(notes[index]);

                  if (currentNotes.has(activeNumber)) {
                    currentNotes.delete(activeNumber);
                  } else {
                    currentNotes.add(activeNumber);
                  }

                  newNotes[index] = currentNotes;
                  setNotes(newNotes);
                }
              }}
            />
          );
        }),
      )}
    </div>
  );
};

const SudokuCell = ({
  row,
  col,
  value,
  cellNotes,
  isLocked,
  isWrong,
  onCellClick,
}: {
  row: number;
  col: number;
  activeNumber: number | null;
  value: number | null;
  cellNotes: Set<number>;
  isNoting: boolean;
  isLocked: boolean;
  isWrong: boolean;
  onCellClick: () => void;
}) => {
  const borderClasses = [
    "border border-gray-400",
    col % 3 === 2 && col !== 8 ? "border-r-2 border-r-gray-800" : "",
    row % 3 === 2 && row !== 8 ? "border-b-2 border-b-gray-800" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const notePositions = [
    "top-0 left-0", // 1: top-left
    "top-0 left-1/2 -translate-x-1/2", // 2: top-mid
    "top-0 right-0", // 3: top-right
    "top-1/2 left-0 -translate-y-1/2", // 4: mid-left
    "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", // 5: mid
    "top-1/2 right-0 -translate-y-1/2", // 6: mid-right
    "bottom-0 left-0", // 7: bot-left
    "bottom-0 left-1/2 -translate-x-1/2", // 8: bot-mid
    "bottom-0 right-0", // 9: bot-right
  ];

  return (
    <div
      onClick={onCellClick}
      className={`${borderClasses} h-9 w-9 sm:h-12 sm:w-12 flex items-center justify-center text-base sm:text-lg font-normal ${isLocked ? "cursor-default bg-gray-100" : isWrong ? "bg-red-50 hover:cursor-pointer hover:bg-red-100" : "hover:cursor-pointer hover:bg-gray-200"} relative select-none`}
    >
      {value ? (
        <span
          className={`
            text-3xl sm:text-4xl
            ${isLocked
              ? "text-black"
              : isWrong
                ? "text-red-600"
                : "text-blue-600"
            }
          `}
        >
          {value}
        </span>
      ) : (
        <>
          {Array.from(cellNotes).map((note) => (
            <span
              key={note}
              className={`px-0.5 absolute font-bold text-[9px] sm:text-[10px] text-gray-500 ${notePositions[note - 1]}`}
            >
              {note}
            </span>
          ))}
        </>
      )}
    </div>
  );
};

export default SudokuBoard;
