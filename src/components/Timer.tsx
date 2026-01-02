interface TimerProps {
  elapsedTime: number;
}

const Timer = ({ elapsedTime }: TimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-2xl sm:text-3xl font-mono font-semibold text-gray-800">
      {formatTime(elapsedTime)}
    </div>
  );
};

export default Timer;
