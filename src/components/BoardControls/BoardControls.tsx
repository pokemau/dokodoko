import EditButton from "./EditButton";
import ClearButton from "./ClearButton";
import CheckButton from "./CheckButton";

interface BoardControlsProps {
  isEditing: boolean;
  onEditToggle: () => void;
  isClearing: boolean;
  onClearToggle: () => void;
  onValidate: () => void;
}

export default function BoardControls({
  isEditing,
  onEditToggle,
  isClearing,
  onClearToggle,
  onValidate,
}: BoardControlsProps) {
  return (
    <div className="flex gap-2 mt-8">
      <EditButton isEditing={isEditing} onToggle={onEditToggle} />
      <ClearButton isClearing={isClearing} onToggle={onClearToggle} />
      <CheckButton onClick={onValidate} />
    </div>
  );
}
