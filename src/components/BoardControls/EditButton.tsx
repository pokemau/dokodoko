import { MdModeEditOutline } from "react-icons/md";
import ControlButton from "./ControlButton";

interface EditButtonProps {
  isTakingNotes: boolean;
  onToggle: () => void;
}

export default function EditButton({ isTakingNotes, onToggle }: EditButtonProps) {
  return (
    <ControlButton
      icon={<MdModeEditOutline />}
      isActive={isTakingNotes}
      onClick={onToggle}
      variant="toggle"
      ariaLabel="Toggle edit mode"
      tooltip="Edit mode (E)"
    />
  );
}
