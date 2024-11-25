import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="text-4xl font-bold text-cyan-400">
          {timeLeft[interval]}
        </span>
        <span className="text-xs uppercase text-cyan-600">{interval}</span>
      </div>
    );
  });

  return (
    <div className="p-4 bg-gray-800 border rounded-lg shadow-lg border-cyan-500 shadow-cyan-500/50">
      <h3 className="mb-4 text-lg font-bold text-center text-cyan-300">
        Next check in
      </h3>
      <div className="flex justify-around">
        {timerComponents.length ? (
          timerComponents
        ) : (
          <span className="text-cyan-400">Checking...</span>
        )}
      </div>
    </div>
  );
}
