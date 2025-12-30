interface NumbersProps {
  activeNumber: number | null;
  setActiveNumber: (value: number | null) => void;
}

const Numbers = ({ activeNumber, setActiveNumber }: NumbersProps) => {
  return (
    <div className="flex gap-0.5 sm:gap-1 mt-4 sm:mt-10">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          onClick={() => setActiveNumber(index + 1)}
          className={`w-9 h-9 sm:w-10 sm:h-10 border flex items-center justify-center font-bold text-base sm:text-lg cursor-pointer ${index + 1 === activeNumber ? "bg-blue-400" : "hover:bg-gray-200"}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Numbers;
