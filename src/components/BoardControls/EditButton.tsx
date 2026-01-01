import { MdModeEditOutline } from "react-icons/md";
import ControlButton from "./ControlButton";

interface EditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
}

export default function EditButton({ isEditing, onToggle }: EditButtonProps) {
  return (
    <ControlButton
      icon={<MdModeEditOutline />}
      isActive={isEditing}
      onClick={onToggle}
      variant="toggle"
      ariaLabel="Toggle edit mode"
      tooltip="Edit mode (E)"
    />
  );
}
