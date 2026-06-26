"use client";

import { useEffect, useState } from "react";
import { getTimeAgo } from "../lib/mockData";

type Props = {
  timestamp: string;
  className?: string;
};

export default function TimeAgo({ timestamp, className }: Props) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const updateLabel = () => setLabel(getTimeAgo(timestamp));
    updateLabel();
    const interval = window.setInterval(updateLabel, 30000);
    return () => window.clearInterval(interval);
  }, [timestamp]);

  if (!label) {
    return (
      <span className={className} suppressHydrationWarning>
        --
      </span>
    );
  }

  return <span className={className}>{label}</span>;
}
