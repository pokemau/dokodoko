import { FaPlus } from "react-icons/fa6";
import ControlButton from "./ControlButton";

interface NewGameButtonProps {
  onClick: () => void;
}

export default function NewGameButton({ onClick }: NewGameButtonProps) {
  return (
    <ControlButton
      icon={<FaPlus/>}
      onClick={onClick}
      variant="action"
      ariaLabel="Create new game"
      tooltip="New Game"
    />
  );
}
