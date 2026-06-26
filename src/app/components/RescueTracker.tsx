"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, CheckCircle, MapPin, Navigation, Shield, AlertTriangle } from "lucide-react";
import { getReportById, syncStoreFromServer } from "../lib/store";
import { Report } from "../lib/mockData";
import styles from "./RescueTracker.module.css";

type Props = {
  reportId: string;
};

const PHASES: Record<
  Report["status"],
  { label: string; detail: string; target: number; eta: string; tone: string }
> = {
  pending: {
    label: "Waiting for volunteer",
    detail: "Nearby volunteers are being alerted now.",
    target: 18,
    eta: "8-12 min",
    tone: "var(--text-secondary)",
  },
  verified: {
    label: "Volunteer assigned",
    detail: "Your incident has been verified and queued for response.",
    target: 28,
    eta: "6-10 min",
    tone: "#F59E0B",
  },
  assigned: {
    label: "Volunteer is on the way",
    detail: "The responder has accepted the request and is moving to you.",
    target: 52,
    eta: "4-7 min",
    tone: "#3B82F6",
  },
  "in-progress": {
    label: "Volunteer nearby",
    detail: "The rescue team is approaching your location live on the route.",
    target: 82,
    eta: "1-3 min",
    tone: "#10B981",
  },
  resolved: {
    label: "Help reached you",
    detail: "The rescue has arrived. Stay where you are and follow instructions.",
    target: 100,
    eta: "Arrived",
    tone: "#10B981",
  },
};

function getRemainingKm(progress: number): string {
  const remaining = Math.max(0.2, ((100 - progress) / 100) * 2.4);
  return `${remaining.toFixed(1)} km`;
}

export default function RescueTracker({ reportId }: Props) {
  const [report, setReport] = useState<Report | null>(() => getReportById(reportId) ?? null);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    const refresh = async () => {
      await syncStoreFromServer();
      setReport(getReportById(reportId) ?? null);
    };

    void refresh();
    const interval = window.setInterval(() => {
      void refresh();
    }, 2000);
    return () => window.clearInterval(interval);
  }, [reportId]);

  const phase = useMemo(() => {
    if (!report) return PHASES.pending;
    return PHASES[report.status];
  }, [report]);

  useEffect(() => {
    const target = phase.target;
    const timer = window.setInterval(() => {
      setDisplayProgress((current) => {
        if (current >= target) {
          window.clearInterval(timer);
          return target;
        }

        return Math.min(current + 1, target);
      });
    }, 45);

    return () => window.clearInterval(timer);
  }, [phase.target]);

  const volunteerLabel = report?.volunteerAssigned ?? "Volunteer team";
  const progressLeft = `${Math.max(12, Math.min(88, 14 + displayProgress * 0.72))}%`;
  const progressTop = `${Math.max(18, Math.min(78, 72 - displayProgress * 0.42))}%`;

  return (
    <div className={styles.trackerCard}>
      <div className={styles.trackerHeader}>
        <div>
          <div className={styles.trackerKicker}>
            <Navigation size={12} /> Live Rescue Tracker
          </div>
          <h2 className={styles.trackerTitle}>Your rescue is being tracked live</h2>
          <p className={styles.trackerSubtitle}>
            Like a delivery map, you can watch the responder approach in real time.
          </p>
        </div>
        <div className={styles.trackerStatus} style={{ color: phase.tone }}>
          <Clock size={14} />
          {phase.label}
        </div>
      </div>

      <div className={styles.routeMap}>
        <div className={styles.routeGrid} />
        <svg className={styles.routePath} viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.15)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.65)" />
            </linearGradient>
          </defs>
          <path d="M 110 275 C 240 240, 310 150, 440 165 S 700 125, 865 90" />
          <path d="M 110 275 C 240 240, 310 150, 440 165 S 700 125, 865 90" className={styles.routeGlow} />
        </svg>

        <div className={styles.baseNode}>
          <div className={styles.nodeIcon}><Shield size={14} /></div>
          <div>
            <div className={styles.nodeLabel}>Responder base</div>
            <div className={styles.nodeMeta}>{volunteerLabel}</div>
          </div>
        </div>

        <div className={styles.destinationNode}>
          <div className={styles.nodeIcon}><MapPin size={14} /></div>
          <div>
            <div className={styles.nodeLabel}>Your location</div>
            <div className={styles.nodeMeta}>{report?.location.name ?? "Waiting for location"}</div>
          </div>
        </div>

        <div className={styles.vehicleNode} style={{ left: progressLeft, top: progressTop }}>
          <div className={styles.vehiclePulse} />
          <div className={styles.vehicleCore}>
            <Navigation size={14} />
          </div>
          <div className={styles.vehicleTag}>
            {displayProgress >= 100 ? "Arrived" : `ETA ${phase.eta}`}
          </div>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Live progress</span>
          <strong className={styles.metricValue}>{displayProgress}%</strong>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Remaining distance</span>
          <strong className={styles.metricValue}>{getRemainingKm(displayProgress)}</strong>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Arrival window</span>
          <strong className={styles.metricValue}>{phase.eta}</strong>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Confidence</span>
          <strong className={styles.metricValue}>{report?.confidenceScore ?? 0}%</strong>
        </div>
      </div>

      <div className={styles.timeline}>
        {[
          { key: "report", label: "Request sent" },
          { key: "assigned", label: "Volunteer assigned" },
          { key: "travel", label: "On the way" },
          { key: "arrive", label: "Arriving" },
        ].map((step, index) => {
          const active =
            (index === 0 && displayProgress >= 0) ||
            (index === 1 && ["verified", "assigned", "in-progress", "resolved"].includes(report?.status ?? "pending")) ||
            (index === 2 && ["assigned", "in-progress", "resolved"].includes(report?.status ?? "pending")) ||
            (index === 3 && report?.status === "resolved");

          return (
            <div key={step.key} className={`${styles.timelineStep} ${active ? styles.timelineStepActive : ""}`}>
              <div className={styles.timelineDot}>{active ? <CheckCircle size={12} /> : index + 1}</div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      {!report && (
        <div className={styles.trackerEmpty}>
          <AlertTriangle size={16} />
          <span>Waiting for your submitted report to sync.</span>
        </div>
      )}
    </div>
  );
}