"use client";
import { Priority } from "../lib/mockData";
import styles from "./PriorityBadge.module.css";

interface Props {
  priority: Priority;
  size?: "sm" | "md";
  pulse?: boolean;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; dot: string }> = {
  critical: { label: "CRITICAL", dot: "🔴" },
  high: { label: "HIGH", dot: "🟠" },
  medium: { label: "MEDIUM", dot: "🟡" },
  low: { label: "LOW", dot: "🟢" },
};

export default function PriorityBadge({
  priority,
  size = "md",
  pulse = false,
}: Props) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={`${styles.badge} ${styles[priority]} ${size === "sm" ? styles.sm : ""} ${pulse && priority === "critical" ? styles.pulse : ""}`}
    >
      <span className={styles.dot} />
      {config.label}
    </span>
  );
}
