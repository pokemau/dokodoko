interface NumbersProps {
  activeNumber: number | null;
  setActiveNumber: (value: number | null) => void;
  numberCounts: number[];
}

const Numbers = ({ activeNumber, setActiveNumber, numberCounts }: NumbersProps) => {
  return (
    <div className="flex gap-0.5 sm:gap-1 mt-4 sm:mt-10">
      {Array.from({ length: 9 }).map((_, index) => {
        const number = index + 1;
        const isDisabled = numberCounts[index] >= 9;

        return (
          <div
            key={index}
            onClick={() => !isDisabled && setActiveNumber(number)}
            className={`rounded text-4xl w-9 h-14 sm:w-10 sm:h-14 py-4 flex items-center justify-center ${isDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : number === activeNumber
                  ? "bg-blue-200 cursor-pointer"
                  : "hover:bg-gray-200 cursor-pointer"
              }`}
          >
            {number}
          </div>
        );
      })}
    </div>
  );
};

export default Numbers;
