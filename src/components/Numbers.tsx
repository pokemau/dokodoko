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
          className={`text-4xl w-9 h-14 sm:w-10 sm:h-14 py-4 flex items-center justify-center cursor-pointer ${index + 1 === activeNumber ? "bg-blue-200" : "hover:bg-gray-200"}`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default Numbers;
