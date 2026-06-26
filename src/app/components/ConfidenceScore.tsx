"use client";
import { useEffect, useRef, useState } from "react";
import { getScoreColor } from "../lib/aiClassifier";
import styles from "./ConfidenceScore.module.css";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreLabel(score: number): string {
  if (score >= 80) return "Highly Trusted";
  if (score >= 60) return "Trusted";
  if (score >= 40) return "Moderate Trust";
  if (score >= 20) return "Low Trust";
  return "Unverified";
}

export default function ConfidenceScore({
  score,
  size = "md",
  showLabel = true,
  animate = true,
}: Props) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [score, animate]);

  const color = getScoreColor(score);
  const strokeDash = (displayScore / 100) * CIRCUMFERENCE;

  const svgSize = size === "lg" ? 100 : size === "sm" ? 60 : 80;
  const textSize = size === "lg" ? "20px" : size === "sm" ? "12px" : "16px";
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const r = (svgSize / 2) * 0.78;
  const circ = 2 * Math.PI * r;
  const dash = (displayScore / 100) * circ;

  return (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      <svg
        width={svgSize}
        height={svgSize}
        className={styles.svg}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
      >
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={size === "lg" ? 7 : 5}
        />
        {/* Score ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={size === "lg" ? 7 : 5}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset="0"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{
            filter: `drop-shadow(0 0 6px ${color}60)`,
            transition: animate ? "stroke-dasharray 0.05s" : "none",
          }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontSize={textSize}
          fontWeight="800"
          fontFamily="var(--font-display)"
        >
          {displayScore}%
        </text>
      </svg>
      {showLabel && (
        <div className={styles.label} style={{ color }}>
          {getScoreLabel(score)}
        </div>
      )}
    </div>
  );
}
