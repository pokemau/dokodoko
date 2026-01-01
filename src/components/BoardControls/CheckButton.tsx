import { FaCheck } from "react-icons/fa6";
import ControlButton from "./ControlButton";

interface CheckButtonProps {
  onClick: () => void;
}

export default function CheckButton({ onClick }: CheckButtonProps) {
  return (
    <ControlButton
      icon={<FaCheck />}
      onClick={onClick}
      variant="action"
      ariaLabel="Validate board"
      tooltip="Validate (C)"
    />
  );
}
