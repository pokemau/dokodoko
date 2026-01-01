import { MdClear } from "react-icons/md";
import ControlButton from "./ControlButton";

interface ClearButtonProps {
  isClearing: boolean;
  onToggle: () => void;
}

export default function ClearButton({
  isClearing,
  onToggle,
}: ClearButtonProps) {
  return (
    <ControlButton
      icon={<MdClear />}
      isActive={isClearing}
      onClick={onToggle}
      variant="toggle"
      ariaLabel="Toggle clear mode"
      tooltip="Clear mode (X)"
    />
  );
}
