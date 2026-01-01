import { type ReactNode } from "react";

interface ControlButtonProps {
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
  variant: "toggle" | "action";
  ariaLabel: string;
  tooltip: string;
}

export default function ControlButton({
  icon,
  isActive = false,
  onClick,
  variant,
  ariaLabel,
  tooltip,
}: ControlButtonProps) {
  const baseClasses =
    "relative group w-14 h-10 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-200 ease-in-out border-2";

  const variantClasses = {
    toggle: isActive
      ? "bg-blue-500 text-white border-blue-500 shadow-md hover:shadow-lg hover:bg-blue-600"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm",
    action:
      "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-400 hover:shadow-sm active:bg-green-100",
  };

  const iconClasses = "text-xl transition-transform duration-200 group-hover:scale-110";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
      aria-label={ariaLabel}
      title={tooltip}
    >
      <span className={iconClasses}>{icon}</span>

      {/* Tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tooltip}
      </div>
    </button>
  );
}
