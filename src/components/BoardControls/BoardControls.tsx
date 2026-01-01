import EditButton from "./EditButton";
import ClearButton from "./ClearButton";
import CheckButton from "./CheckButton";

interface BoardControlsProps {
  isTakingNotes: boolean;
  onEditToggle: () => void;
  isClearing: boolean;
  onClearToggle: () => void;
  onValidate: () => void;
}

export default function BoardControls({
  isTakingNotes,
  onEditToggle,
  isClearing,
  onClearToggle,
  onValidate,
}: BoardControlsProps) {
  return (
    <div className="flex gap-2 mt-8">
      <EditButton isTakingNotes={isTakingNotes} onToggle={onEditToggle} />
      <ClearButton isClearing={isClearing} onToggle={onClearToggle} />
      <CheckButton onClick={onValidate} />
    </div>
  );
}
