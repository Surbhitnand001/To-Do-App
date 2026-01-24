import { useState, useEffect } from "react";

interface TimerProps {
  deadline: Date;
  isCompleted?: boolean;
}

const Timer = ({ deadline, isCompleted = false }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const difference = deadlineTime - now;

      if (difference <= 0) {
        setIsOverdue(true);
        setTimeRemaining("Overdue");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeString = "";
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setTimeRemaining(timeString);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Don't update if task is completed
    if (isCompleted) {
      return;
    }

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [deadline, isCompleted]);

  return (
    <div
      className={`timer ${isOverdue ? "overdue" : ""} ${isCompleted ? "completed" : ""}`}
    >
      {isCompleted ? "✓ Completed" : `⏰ ${timeRemaining}`}
    </div>
  );
};

export default Timer;
