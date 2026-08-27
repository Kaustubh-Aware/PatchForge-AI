import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function CircularScore({ score = 100, size = 160, stroke = 10, showLabel = true }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 80, damping: 18 });

  // Map progress (0 -> score) to strokeDashoffset
  const strokeDashoffset = useTransform(
    spring,
    (val) => circumference - (Math.min(100, Math.max(0, val)) / 100) * circumference
  );

  useEffect(() => {
    if (inView) {
      progress.set(score);
    }
  }, [inView, score, progress]);

  const color =
    score >= 90
      ? "#22c55e"
      : score >= 75
      ? "#3b82f6"
      : score >= 50
      ? "#f59e0b"
      : score >= 25
      ? "#f97316"
      : "#ef4444";

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            filter: "drop-shadow(0 0 8px " + color + ")",
          }}
        />
      </svg>

      {showLabel && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          <span
            style={{
              fontSize: size * 0.24 + "px",
              fontWeight: 800,
              color: "#f8fafc",
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontSize: size * 0.085 + "px",
              color: "#94a3b8",
              fontWeight: 600,
              marginTop: "2px",
            }}
          >
            / 100
          </span>
        </div>
      )}
    </div>
  );
}