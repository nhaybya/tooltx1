import { useEffect, useState } from "react";

interface KeyTimerProps {
  expiryTime: number;
  showFullTimer?: boolean;
}

export default function KeyTimer({ expiryTime, showFullTimer = false }: KeyTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  useEffect(() => {
    // Ensure expiryTime is a valid number
    const expiry = typeof expiryTime === 'number' ? expiryTime : 
                  typeof expiryTime === 'string' ? new Date(expiryTime).getTime() : 0;
    
    const calculateTimeLeft = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiry - now);
      setTimeLeft(remaining);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [expiryTime]);
  
  const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  
  let timeStr = '';
  if (days > 0) {
    timeStr = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else if (hours > 0) {
    timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Always show a full circle when time is remaining, empty when expired
  const progress = timeLeft > 0 ? 1 : 0;
  const dashoffset = progress ? 0 : 283; // Fixed value to prevent NaN
  
  if (showFullTimer) {
    return <span id="time-remaining-full" className="text-white font-medium">{timeStr}</span>;
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-8 w-8">
        <svg className="w-8 h-8" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#2C3E50" strokeWidth="8" />
          <circle 
            className="timer-circle" 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="#F39C12" 
            strokeWidth="8" 
            strokeDasharray="283" 
            strokeDashoffset={dashoffset} 
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-key text-primary text-xs"></i>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="text-xs text-gray-400">Thời gian còn lại</div>
        <div id="time-remaining" className="text-white font-medium">{timeStr}</div>
      </div>
    </div>
  );
}
