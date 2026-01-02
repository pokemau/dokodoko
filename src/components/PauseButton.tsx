interface PauseButtonProps {
  isPaused: boolean;
  onToggle: () => void;
}

const PauseButton = ({ isPaused, onToggle }: PauseButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="min-w-30 ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-100 font-semibold transition-colors"
    >
      {isPaused ? "▶ Resume" : "⏸ Pause"}
    </button>
  );
};

export default PauseButton;
