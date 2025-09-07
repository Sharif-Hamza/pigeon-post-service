import { motion } from 'framer-motion';

interface PigeonLogoProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

export default function PigeonLogo({ size = 48, className = '', animate = true }: PigeonLogoProps) {
  const MotionSVG = motion.svg;
  const MotionPath = motion.path;
  const MotionCircle = motion.circle;


  return (
    <MotionSVG
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={animate ? { scale: 0.8, rotate: -10, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
      whileHover={animate ? { scale: 1.05, rotate: 2 } : undefined}
      transition={animate ? { duration: 0.8 } : undefined}
    >
      {/* Pigeon Body */}
      <MotionPath
        d="M30 45 Q25 35 35 30 Q45 25 55 30 Q65 35 60 45 Q58 55 50 58 Q42 55 40 50 Q35 52 30 45"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="1"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={animate ? { duration: 1, delay: 0.2 } : undefined}
      />

      {/* Pigeon Head */}
      <MotionCircle
        cx="60"
        cy="35"
        r="12"
        fill="#A0522D"
        stroke="#654321"
        strokeWidth="1"
        initial={animate ? { scale: 0 } : undefined}
        animate={animate ? { scale: 1 } : undefined}
        transition={animate ? { duration: 0.5, delay: 0.3 } : undefined}
      />

      {/* Beak */}
      <MotionPath
        d="M70 35 L78 33 L75 37 Z"
        fill="#FFA500"
        stroke="#FF8C00"
        strokeWidth="0.5"
        initial={animate ? { scale: 0 } : undefined}
        animate={animate ? { scale: 1 } : undefined}
        transition={animate ? { duration: 0.3, delay: 0.6 } : undefined}
      />

      {/* Wing */}
      <MotionPath
        d="M40 40 Q35 35 30 40 Q28 45 32 48 Q38 50 42 47 Q40 43 40 40"
        fill="#654321"
        stroke="#4A4A4A"
        strokeWidth="1"
        initial={animate ? { rotate: 0 } : undefined}
        animate={animate ? { rotate: [0, 10, -5, 0] } : undefined}
        transition={animate ? { duration: 2, repeat: Infinity } : undefined}
        style={{ transformOrigin: "36px 44px" }}
      />

      {/* Tail Feathers */}
      <MotionPath
        d="M25 50 Q20 45 15 50 Q18 55 22 53 Q25 52 25 50"
        fill="#654321"
        stroke="#4A4A4A"
        strokeWidth="1"
        initial={animate ? { rotate: -20, opacity: 0 } : undefined}
        animate={animate ? { rotate: 0, opacity: 1 } : undefined}
        transition={animate ? { duration: 0.5, delay: 0.8 } : undefined}
        style={{ transformOrigin: "20px 50px" }}
      />

      {/* Eye */}
      <MotionCircle
        cx="65"
        cy="32"
        r="2"
        fill="#000"
        initial={animate ? { scale: 0 } : undefined}
        animate={animate ? { scale: 1 } : undefined}
        transition={animate ? { delay: 0.5, duration: 0.3 } : undefined}
      />

      {/* Letter/Message */}
      <MotionPath
        d="M45 65 L55 65 L55 75 L45 75 Z"
        fill="#F5F5DC"
        stroke="#D2B48C"
        strokeWidth="1"
        initial={animate ? { y: 10, opacity: 0 } : undefined}
        animate={animate ? { y: 0, opacity: 1 } : undefined}
        transition={animate ? { duration: 0.5, delay: 1 } : undefined}
      />

      {/* Message Seal */}
      <MotionCircle
        cx="50"
        cy="70"
        r="3"
        fill="#DC143C"
        initial={animate ? { scale: 0 } : undefined}
        animate={animate ? { scale: 1 } : undefined}
        transition={animate ? { duration: 0.3, delay: 1.2 } : undefined}
      />

      {/* Decorative Sparkles */}
      <MotionCircle
        cx="75"
        cy="25"
        r="1"
        fill="#FFD700"
        initial={animate ? { scale: 0, opacity: 0 } : undefined}
        animate={animate ? { scale: [0, 1.5, 1], opacity: [0, 1, 0.7] } : undefined}
        transition={animate ? { duration: 1.5, delay: 1.5, repeat: Infinity, repeatDelay: 3 } : undefined}
      />
      
      <MotionCircle
        cx="20"
        cy="30"
        r="0.8"
        fill="#FFD700"
        initial={animate ? { scale: 0, opacity: 0 } : undefined}
        animate={animate ? { scale: [0, 1.2, 1], opacity: [0, 1, 0.8] } : undefined}
        transition={animate ? { duration: 1.5, delay: 2, repeat: Infinity, repeatDelay: 3 } : undefined}
      />
    </MotionSVG>
  );
}
