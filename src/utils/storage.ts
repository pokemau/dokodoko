type GameState = {
  elapsedTime: number;
  solution: string;
  board: (number | null)[];
  notes: Set<number>[];
  wrongCells: boolean[];
  lockedCells: boolean[];
};

export const hasGameState = (): boolean => {
  const state = localStorage.getItem('game-state');
  return state != null;
}

export const getGameState = (): GameState | null => {
  const state = localStorage.getItem('game-state');
  if (!state) {
    return null;
  }
  const parsed = JSON.parse(state);
  return {
    ...parsed,
    notes: parsed.notes.map((noteArr: number[]) => new Set(noteArr))
  }
}

export const saveGameState = (elapsedTime: number, solution: string, board: (number | null)[], lockedCells: boolean[], wrongCells: boolean[], notes: Set<number>[]) => {

  const notesArr = notes.map(noteSet => Array.from(noteSet));

  localStorage.setItem('game-state', JSON.stringify({
    elapsedTime,
    solution,
    board,
    notes: notesArr,
    wrongCells,
    lockedCells
  }));
}

export const clearGameState = () => {
  localStorage.removeItem('game-state');
}
