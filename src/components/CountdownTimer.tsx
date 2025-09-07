import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  onComplete?: () => void;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ 
  targetDate, 
  label = "Estimated Delivery", 
  onComplete,
  className = "" 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  
  // Memoize target timestamp to prevent unnecessary recalculations
  const targetTimestamp = useMemo(() => targetDate.getTime(), [targetDate]);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      
      // Check if time is up
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        if (!isComplete) {
          setIsComplete(true);
          if (onComplete) onComplete();
        }
        return;
      }

      // Only update if there's an actual change to prevent unnecessary re-renders
      setTimeLeft(prevTime => {
        if (
          prevTime.days !== newTimeLeft.days ||
          prevTime.hours !== newTimeLeft.hours ||
          prevTime.minutes !== newTimeLeft.minutes ||
          prevTime.seconds !== newTimeLeft.seconds
        ) {
          return newTimeLeft;
        }
        return prevTime;
      });
    };

    // Calculate immediately
    updateTimer();

    // Set up interval
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [targetTimestamp, onComplete, isComplete]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const TimeUnit = React.memo(({ value, unit, delay }: { value: number; unit: string; delay: number }) => (
    <motion.div
      className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg border border-amber-200"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="text-2xl sm:text-3xl font-bold text-amber-900 font-mono">
        {formatNumber(value)}
      </div>
      <div className="text-xs sm:text-sm text-amber-700 font-medium uppercase tracking-wide">
        {unit}
      </div>
    </motion.div>
  ));

  if (isComplete) {
    return (
      <motion.div
        className={`flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle className="h-6 w-6 text-green-600" />
        <span className="text-green-800 font-semibold">
          Delivery time reached! 🎉
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center gap-2 text-amber-800">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">{label} in:</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
        <TimeUnit value={timeLeft.days} unit="Days" delay={0.1} />
        <TimeUnit value={timeLeft.hours} unit="Hours" delay={0.2} />
        <TimeUnit value={timeLeft.minutes} unit="Minutes" delay={0.3} />
        <TimeUnit value={timeLeft.seconds} unit="Seconds" delay={0.4} />
      </div>

      <motion.div
        className="text-center text-sm text-amber-600 bg-amber-50 p-2 rounded border border-amber-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        Your delivery is being processed by our pigeon post service 🕊️
      </motion.div>
    </motion.div>
  );
}
