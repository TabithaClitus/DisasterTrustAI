"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  CheckCircle,
  Package,
  MapPin,
  Clock,
  Shield,
  RefreshCw,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PriorityBadge from "../components/PriorityBadge";
import ConfidenceScore from "../components/ConfidenceScore";
import TimeAgo from "../components/TimeAgo";
import { getReports, getResources, syncStoreFromServer } from "../lib/store";
import { Report, Resource, STATS, getTimeAgo, getCategoryIcon } from "../lib/mockData";
import styles from "./admin.module.css";

// Dynamic import for Leaflet (no SSR)
const LiveMap = dynamic(() => import("./LiveMap"), { ssr: false });

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [showCategory, setShowCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(async () => {
      await syncStoreFromServer();
      setReports(getReports());
      setResources(getResources());
      setLastRefresh(new Date());
      setRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeReports = reports.filter((r) => r.status !== "resolved");
  const critical = activeReports.filter((r) => r.priority === "critical");

  const filtered = activeReports.filter((r) => {
    if (showCategory !== "all" && r.category !== showCategory) return false;
    return true;
  });

  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Activity size={24} />
            </div>
            <div>
              <h1 className={styles.title}>Admin Command Center</h1>
              <p className={styles.subtitle}>
                Live situational awareness — updated every 30 seconds
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.refreshInfo}>
              <Clock size={12} />
              Last refresh: {" "}
              {lastRefresh ? lastRefresh.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }) : "N/A"}
            </div>
            <button
              className={`btn btn-ghost btn-sm ${refreshing ? styles.spinning : ""}`}
              onClick={refresh}
            >
              <RefreshCw size={14} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          {[
            { icon: <Activity size={18} />, value: activeReports.length, label: "Active Incidents", color: "#DC2626" },
            { icon: <Users size={18} />, value: STATS.volunteersDeployed, label: "Volunteers Active", color: "#3B82F6" },
            { icon: <Package size={18} />, value: resources.filter(r => r.available).length, label: "Resources Available", color: "#10B981" },
            { icon: <CheckCircle size={18} />, value: STATS.resolvedToday, label: "Resolved Today", color: "#F59E0B" },
            { icon: <Shield size={18} />, value: STATS.verificationRate, label: "Verification Rate %", color: "#8B5CF6" },
          ].map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <div className={styles.statIcon} style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <div className={styles.statValue} style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Critical Alert */}
        {critical.length > 0 && (
          <div className={styles.criticalAlert}>
            <span className="live-dot" />
            <strong>{critical.length} CRITICAL</strong> incident
            {critical.length > 1 ? "s" : ""} requiring immediate response —{" "}
            {critical.map((r) => r.location.name).join(", ")}
          </div>
        )}

        {/* Main Layout */}
        <div className={styles.mainLayout}>
          {/* Map */}
          <div className={styles.mapSection}>
            <div className={styles.mapHeader}>
              <div className={styles.mapTitle}>
                <MapPin size={16} />
                Live Disaster Map — India
              </div>
              <div className={styles.mapLegend}>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#DC2626" }} />Critical</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#EA580C" }} />High</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#D97706" }} />Medium</span>
                <span className={styles.legendItem}><span className={styles.legendDot} style={{ background: "#10B981" }} />Resources</span>
              </div>
            </div>
            <div className={styles.mapContainer}>
              <LiveMap
                reports={reports}
                resources={resources}
                onSelectReport={setSelectedReport}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            {/* Category Filter */}
            <div className={styles.filterRow}>
              {["all", "rescue", "medical", "flood", "food", "shelter"].map((cat) => (
                <button
                  key={cat}
                  className={`${styles.filterChip} ${showCategory === cat ? styles.filterActive : ""}`}
                  onClick={() => setShowCategory(cat)}
                >
                  {cat === "all" ? "All" : `${getCategoryIcon(cat as Report["category"])} ${cat}`}
                </button>
              ))}
            </div>

            {/* Selected Report Detail */}
            {selectedReport && (
              <div className={styles.selectedReport}>
                <div className={styles.selectedHeader}>
                  <span className={styles.selectedId}>{selectedReport.id}</span>
                  <button
                    className={styles.closeBtn}
                    onClick={() => setSelectedReport(null)}
                  >
                    ×
                  </button>
                </div>
                <h3 className={styles.selectedTitle}>{selectedReport.title}</h3>
                <p className={styles.selectedDesc}>{selectedReport.description}</p>
                <div className={styles.selectedMeta}>
                  <PriorityBadge priority={selectedReport.priority} pulse />
                  <ConfidenceScore
                    score={selectedReport.confidenceScore}
                    size="sm"
                  />
                </div>
                <div className={styles.aiBox}>
                  <Shield size={12} />
                  <span>{selectedReport.aiAnalysis.summary}</span>
                </div>
                <div className={styles.selectedLocation}>
                  <MapPin size={12} />
                  {selectedReport.location.name}, {selectedReport.location.state}
                </div>
                <div className={styles.selectedTime}>
                  <Clock size={12} />
                  <TimeAgo timestamp={selectedReport.timestamp} />
                </div>
              </div>
            )}

            {/* Live Feed */}
            <div className={styles.feedTitle}>
              <span className="live-dot" />
              Live Incident Feed
            </div>
            <div className={styles.feed}>
              {filtered.slice(0, 12).map((report) => (
                <div
                  key={report.id}
                  className={`${styles.feedItem} ${selectedReport?.id === report.id ? styles.feedItemActive : ""}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className={styles.feedItemLeft}>
                    <span className={styles.feedIcon}>
                      {getCategoryIcon(report.category)}
                    </span>
                    <div className={styles.feedItemInfo}>
                      <div className={styles.feedItemTitle}>{report.title}</div>
                      <div className={styles.feedItemMeta}>
                        <MapPin size={10} />
                        {report.location.name}
                        <span className={styles.feedItemTime}>
                          <Clock size={10} />
                          <TimeAgo timestamp={report.timestamp} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.feedItemRight}>
                    <PriorityBadge priority={report.priority} size="sm" />
                    <span className={styles.feedScore}>
                      {report.confidenceScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
