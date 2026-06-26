"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MapPin,
  Clock,
  Filter,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Shield,
  ChevronDown,
  Play,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PriorityBadge from "../components/PriorityBadge";
import ConfidenceScore from "../components/ConfidenceScore";
import TimeAgo from "../components/TimeAgo";
import {
  getReports,
  updateReportStatus,
  confirmReport,
  syncStoreFromServer,
} from "../lib/store";
import {
  Report,
  Priority,
  Category,
  UserRole,
  getTimeAgo,
  getCategoryIcon,
  getCategoryLabel,
} from "../lib/mockData";
import { getRoleLabel, getSavedRole } from "../lib/roleStore";
import styles from "./volunteer.module.css";

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const STATUS_FLOW: Record<Report["status"], Report["status"] | null> = {
  pending: "assigned",
  verified: "assigned",
  assigned: "in-progress",
  "in-progress": "resolved",
  resolved: null,
};

const STATUS_LABEL: Record<Report["status"], string> = {
  pending: "Accept Request",
  verified: "Accept Request",
  assigned: "Mark En Route",
  "in-progress": "Mark Complete",
  resolved: "Completed ✓",
};

const VOLUNTEER_ROLE_HINT: Record<UserRole, string> = {
  citizen: "This dashboard is for triage and response. Switch roles above if you want the reporting flow.",
  volunteer: "You are in the right place: prioritize verified incidents, confirm reports, and advance rescue status.",
  ngo: "Use this queue only to coordinate with volunteers. The NGO portal is better for publishing resources.",
  admin: "This is the operational volunteer queue. Admin oversight lives in the live map dashboard.",
};

export default function VolunteerPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>(getSavedRole());
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [sortBy, setSortBy] = useState<"confidence" | "urgency" | "time">("confidence");
  const [myName] = useState("Volunteer");
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = async () => {
      await syncStoreFromServer();
      setReports(getReports());
      setActiveRole(getSavedRole());
    };

    void refresh();
    const interval = setInterval(() => {
      void refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = reports
    .filter((r) => {
      if (filterPriority !== "all" && r.priority !== filterPriority) return false;
      if (filterCategory !== "all" && r.category !== filterCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "confidence") return b.confidenceScore - a.confidenceScore;
      if (sortBy === "urgency") return b.urgencyPercent - a.urgencyPercent;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const handleAction = async (report: Report) => {
    const nextStatus = STATUS_FLOW[report.status];
    if (!nextStatus) return;
    await updateReportStatus(report.id, nextStatus, myName);
    await syncStoreFromServer();
    setReports(getReports());
  };

  const handleConfirm = async (id: string) => {
    if (confirmedIds.has(id)) return;
    await confirmReport(id);
    await syncStoreFromServer();
    setConfirmedIds((prev) => new Set([...prev, id]));
    setReports(getReports());
  };

  const counts = {
    critical: reports.filter((r) => r.priority === "critical" && r.status !== "resolved").length,
    high: reports.filter((r) => r.priority === "high" && r.status !== "resolved").length,
    medium: reports.filter((r) => r.priority === "medium" && r.status !== "resolved").length,
    total: reports.filter((r) => r.status !== "resolved").length,
  };

  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <Users size={24} />
              </div>
              <div>
                <h1 className={styles.title}>Volunteer Dashboard</h1>
                <p className={styles.subtitle}>
                  AI-prioritized reports — highest confidence first
                </p>
              </div>
            </div>
            <Link href="/admin" className="btn btn-ghost btn-sm">
              <Navigation size={14} />
              Live Map
            </Link>
          </div>

          <div className="glass-card" style={{ marginBottom: 20, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-blue-light)", marginBottom: 6 }}>
              Active Role: {getRoleLabel(activeRole)}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {VOLUNTEER_ROLE_HINT[activeRole]}
            </div>
          </div>

          {/* Priority Counts */}
          <div className={styles.countsRow}>
            <div className={`${styles.countCard} ${styles.countCritical}`}>
              <span className={styles.countValue}>{counts.critical}</span>
              <span className={styles.countLabel}>Critical</span>
            </div>
            <div className={`${styles.countCard} ${styles.countHigh}`}>
              <span className={styles.countValue}>{counts.high}</span>
              <span className={styles.countLabel}>High</span>
            </div>
            <div className={`${styles.countCard} ${styles.countMedium}`}>
              <span className={styles.countValue}>{counts.medium}</span>
              <span className={styles.countLabel}>Medium</span>
            </div>
            <div className={`${styles.countCard} ${styles.countTotal}`}>
              <span className={styles.countValue}>{counts.total}</span>
              <span className={styles.countLabel}>Total Active</span>
            </div>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <Filter size={14} />
              <span className={styles.filterLabel}>Priority:</span>
              {(["all", "critical", "high", "medium", "low"] as const).map((p) => (
                <button
                  key={p}
                  className={`${styles.filterBtn} ${filterPriority === p ? styles.filterActive : ""}`}
                  onClick={() => setFilterPriority(p)}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <ChevronDown size={14} />
              <span className={styles.filterLabel}>Sort:</span>
              <select
                className={styles.filterSelect}
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "confidence" | "urgency" | "time")
                }
              >
                <option value="confidence">Confidence Score</option>
                <option value="urgency">Urgency %</option>
                <option value="time">Most Recent</option>
              </select>
            </div>
          </div>

          {/* Report Cards */}
          <div className={styles.reportsList}>
            {filtered.map((report, i) => (
              <div
                key={report.id}
                className={`${styles.reportCard} ${report.priority === "critical" ? styles.criticalCard : ""} animate-fade-in`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {/* Left: Confidence Score */}
                <div className={styles.scoreSection}>
                  <ConfidenceScore score={report.confidenceScore} size="md" />
                </div>

                {/* Center: Details */}
                <div className={styles.detailsSection}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardId}>{report.id}</span>
                    <span className={styles.cardCategory}>
                      {getCategoryIcon(report.category)}{" "}
                      {getCategoryLabel(report.category)}
                    </span>
                    <PriorityBadge
                      priority={report.priority}
                      pulse={report.priority === "critical"}
                    />
                    <span
                      className={`${styles.statusBadge} ${styles[`status_${report.status.replace("-", "_")}`]}`}
                    >
                      {report.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  <h3 className={styles.reportTitle}>{report.title}</h3>
                  <p className={styles.reportDesc}>{report.description}</p>

                  {/* AI Analysis */}
                  <div className={styles.aiSummary}>
                    <Shield size={12} />
                    <span>{report.aiAnalysis.summary}</span>
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <MapPin size={12} />
                      {report.location.name}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock size={12} />
                      <TimeAgo timestamp={report.timestamp} />
                    </span>
                    {report.volunteerAssigned && (
                      <span className={styles.metaItem}>
                        <Users size={12} />
                        {report.volunteerAssigned}
                      </span>
                    )}
                  </div>

                  {/* Evidence Tags */}
                  <div className={styles.evidenceTags}>
                    {report.hasVideo && (
                      <span className={styles.evidenceTag} style={{ color: "#10B981" }}>
                        📹 Live Video
                      </span>
                    )}
                    {report.hasGPS && (
                      <span className={styles.evidenceTag} style={{ color: "#3B82F6" }}>
                        📍 GPS Verified
                      </span>
                    )}
                    {report.volunteerVerified && (
                      <span className={styles.evidenceTag} style={{ color: "#8B5CF6" }}>
                        ✅ Volunteer Verified
                      </span>
                    )}
                    {report.communityConfirmations > 0 && (
                      <span className={styles.evidenceTag} style={{ color: "#F59E0B" }}>
                        👥 {report.communityConfirmations} Confirmations
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className={styles.actionsSection}>
                  {/* Urgency */}
                  <div className={styles.urgencyDisplay}>
                    <div className={styles.urgencyLabel}>Urgency</div>
                    <div
                      className={styles.urgencyValue}
                      style={{
                        color:
                          report.urgencyPercent > 75
                            ? "#DC2626"
                            : report.urgencyPercent > 50
                            ? "#D97706"
                            : "#16A34A",
                      }}
                    >
                      {report.urgencyPercent}%
                    </div>
                    <div className={styles.urgencyBarWrap}>
                      <div
                        className={styles.urgencyBarFill}
                        style={{
                          height: `${report.urgencyPercent}%`,
                          background:
                            report.urgencyPercent > 75
                              ? "#DC2626"
                              : report.urgencyPercent > 50
                              ? "#D97706"
                              : "#16A34A",
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className={`btn ${report.status === "resolved" ? "btn-ghost" : report.priority === "critical" ? "btn-emergency" : "btn-primary"} btn-sm`}
                    onClick={() => void handleAction(report)}
                    disabled={report.status === "resolved"}
                    style={{ width: "100%" }}
                  >
                    {report.status !== "resolved" && <Play size={13} />}
                    {STATUS_LABEL[report.status]}
                  </button>

                  {/* Confirm Button */}
                  {report.status !== "resolved" && (
                    <button
                      className={`btn btn-ghost btn-sm ${confirmedIds.has(report.id) ? styles.confirmed : ""}`}
                      onClick={() => void handleConfirm(report.id)}
                      disabled={confirmedIds.has(report.id)}
                      style={{ width: "100%", fontSize: 12 }}
                    >
                      <CheckCircle size={12} />
                      {confirmedIds.has(report.id) ? "Confirmed!" : "Confirm Report"}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className={styles.emptyState}>
                <AlertTriangle size={40} style={{ color: "var(--text-muted)" }} />
                <p>No reports match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
