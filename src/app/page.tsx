"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  Shield,
  MapPin,
  Users,
  Activity,
  Clock,
  CheckCircle,
  Camera,
  Star,
  ChevronRight,
  Zap,
  TrendingUp,
} from "lucide-react";
import Navbar from "./components/Navbar";
import PriorityBadge from "./components/PriorityBadge";
import ConfidenceScore from "./components/ConfidenceScore";
import TimeAgo from "./components/TimeAgo";
import { MOCK_REPORTS, STATS, getTimeAgo, getCategoryIcon } from "./lib/mockData";
import styles from "./page.module.css";

// Animated counter hook
function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  const count = useCounter(value);
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ color, background: `${color}18` }}>
        {icon}
      </div>
      <div className={styles.statValue} style={{ color }}>
        {count.toLocaleString()}
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Camera size={28} />,
    title: "Live Evidence Only",
    description:
      "No gallery uploads. Every report requires live camera recording with automatic GPS and timestamp — impossible to fake.",
    color: "#DC2626",
    tag: "Anti-Fake",
  },
  {
    icon: <Shield size={28} />,
    title: "AI Confidence Score",
    description:
      "Every report gets a 0–100 trust score based on live video, GPS, timestamp, community confirmations, and volunteer verification.",
    color: "#3B82F6",
    tag: "Our Innovation",
  },
  {
    icon: <Zap size={28} />,
    title: "AI Prioritization",
    description:
      "Automatic classification into Critical, High, Medium, Low. Volunteers see what matters most, instantly.",
    color: "#F59E0B",
    tag: "AI-Powered",
  },
  {
    icon: <MapPin size={28} />,
    title: "Live Disaster Map",
    description:
      "Real-time OpenStreetMap view with color-coded incident markers. Rescue, medical, food, shelter — all in one view.",
    color: "#10B981",
    tag: "Real-Time",
  },
  {
    icon: <Users size={28} />,
    title: "Volunteer Coordination",
    description:
      "Volunteers can accept, update, and complete rescue requests. Full status tracking from assignment to resolution.",
    color: "#8B5CF6",
    tag: "Coordination",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "NGO Resource Management",
    description:
      "NGOs post available food, water, medical, shelter resources. Citizens nearby can instantly see what's available.",
    color: "#EC4899",
    tag: "Resources",
  },
];

const TOP_REPORTS = MOCK_REPORTS.slice(0, 4);

export default function Home() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className={styles.root}>
      <Navbar />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGlowBlue} />

        <div className={styles.heroContent}>
          {/* Status strip */}
          <div className={styles.statusStrip} role="status">
            <span className="live-dot" />
            <span className={styles.statusText}>
              LIVE SYSTEM ACTIVE &nbsp;·&nbsp;{" "}
              {currentTime
                ? currentTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }) + " IST"
                : "--:--:-- IST"}{" "}
              &nbsp;·&nbsp;{" "}
              <span style={{ color: "#FCA5A5" }}>
                {STATS.activeIncidents} Active Incidents
              </span>
            </span>
          </div>

          <h1 className={styles.heroTitle}>
            When Every Second Counts,
            <br />
            <span className={styles.heroTitleAccent}>Trust Matters</span>
          </h1>

          <p className={styles.heroSubtitle}>
            India&apos;s first AI-powered disaster response platform with{" "}
            <strong>verified confidence scoring</strong>. Real-time reporting,
            volunteer coordination, and resource management — all in one place.
          </p>

          <div className={styles.heroCTAs}>
            <Link href="/report" className="btn btn-emergency btn-lg">
              <AlertTriangle size={20} />
              Report Emergency
            </Link>
            <Link href="/admin" className="btn btn-secondary btn-lg">
              <Activity size={20} />
              View Live Map
            </Link>
          </div>

          {/* Trust score preview */}
          <div className={styles.trustPreview}>
            <div className={styles.trustPreviewLabel}>
              <Shield size={14} />
              DisasterTrust Score — Our Innovation
            </div>
            <div className={styles.trustPreviewRow}>
              <div className={styles.trustItem}>
                <CheckCircle size={14} style={{ color: "#10B981" }} />
                <span>Live Video</span>
                <strong style={{ color: "#10B981" }}>+35 pts</strong>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={14} style={{ color: "#10B981" }} />
                <span>GPS Lock</span>
                <strong style={{ color: "#10B981" }}>+25 pts</strong>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={14} style={{ color: "#10B981" }} />
                <span>Timestamp</span>
                <strong style={{ color: "#10B981" }}>+15 pts</strong>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={14} style={{ color: "#3B82F6" }} />
                <span>Community</span>
                <strong style={{ color: "#3B82F6" }}>+10 pts</strong>
              </div>
              <div className={styles.trustItem}>
                <CheckCircle size={14} style={{ color: "#8B5CF6" }} />
                <span>Volunteer</span>
                <strong style={{ color: "#8B5CF6" }}>+5 pts</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS ── */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <StatCard
              icon={<Activity size={22} />}
              value={STATS.activeIncidents}
              label="Active Incidents"
              color="#DC2626"
            />
            <StatCard
              icon={<Users size={22} />}
              value={STATS.volunteersDeployed}
              label="Volunteers Active"
              color="#3B82F6"
            />
            <StatCard
              icon={<Shield size={22} />}
              value={STATS.peopleHelped}
              label="People Helped"
              color="#10B981"
            />
            <StatCard
              icon={<CheckCircle size={22} />}
              value={STATS.resolvedToday}
              label="Resolved Today"
              color="#F59E0B"
            />
          </div>
        </div>
      </section>

      {/* ── LIVE REPORTS FEED ── */}
      <section className={styles.reportsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionTag}>
                <span className="live-dot" />
                Real-Time
              </div>
              <h2 className={styles.sectionTitle}>Latest Verified Reports</h2>
              <p className={styles.sectionSubtitle}>
                Live feed from ground — AI-classified, trust-scored
              </p>
            </div>
            <Link href="/volunteer" className="btn btn-ghost btn-sm">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.reportsGrid}>
            {TOP_REPORTS.map((report, i) => (
              <div
                key={report.id}
                className={`${styles.reportCard} ${report.priority === "critical" ? styles.criticalCard : ""} animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Header */}
                <div className={styles.reportHeader}>
                  <div className={styles.reportMeta}>
                    <span className={styles.reportCategory}>
                      {getCategoryIcon(report.category)}{" "}
                      {report.category.toUpperCase()}
                    </span>
                    <PriorityBadge
                      priority={report.priority}
                      pulse={report.priority === "critical"}
                    />
                  </div>
                  <ConfidenceScore
                    score={report.confidenceScore}
                    size="sm"
                    showLabel={false}
                  />
                </div>

                <h3 className={styles.reportTitle}>{report.title}</h3>
                <p className={styles.reportDesc}>{report.description}</p>

                {/* Footer */}
                <div className={styles.reportFooter}>
                  <div className={styles.reportLocation}>
                    <MapPin size={12} />
                    {report.location.name}
                  </div>
                  <div className={styles.reportTime}>
                    <Clock size={12} />
                    <TimeAgo timestamp={report.timestamp} />
                  </div>
                </div>

                {/* Evidence indicators */}
                <div className={styles.evidenceRow}>
                  {report.hasVideo && (
                    <span className={styles.evidenceBadge}>📹 Live Video</span>
                  )}
                  {report.hasGPS && (
                    <span className={styles.evidenceBadge}>📍 GPS</span>
                  )}
                  {report.communityConfirmations > 0 && (
                    <span className={styles.evidenceBadge}>
                      👥 {report.communityConfirmations} confirms
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.howSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionTag}>
                <Zap size={12} />
                Simple Process
              </div>
              <h2 className={styles.sectionTitle}>How DisasterTrust Works</h2>
              <p className={styles.sectionSubtitle}>
                From incident to resolved — in minutes
              </p>
            </div>
          </div>

          <div className={styles.stepsGrid}>
            {[
              {
                step: "01",
                title: "Citizen Reports",
                desc: "Open camera → Record live → GPS locks automatically → Submit",
                color: "#DC2626",
              },
              {
                step: "02",
                title: "AI Analyzes",
                desc: "Classifies category, assigns priority (Critical/High/Medium/Low), generates trust score",
                color: "#F59E0B",
              },
              {
                step: "03",
                title: "Community Confirms",
                desc: "Nearby users verify the report. Each confirmation raises confidence score",
                color: "#3B82F6",
              },
              {
                step: "04",
                title: "Volunteers Respond",
                desc: "Volunteers see high-confidence reports first, accept, deploy, and mark complete",
                color: "#10B981",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`${styles.stepCard} animate-fade-in`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className={styles.stepNumber}
                  style={{ color: s.color, borderColor: `${s.color}30`, background: `${s.color}10` }}
                >
                  {s.step}
                </div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
                <div
                  className={styles.stepLine}
                  style={{ background: `linear-gradient(to right, ${s.color}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <div className={styles.sectionTag}>
                <Star size={12} />
                Platform Features
              </div>
              <h2 className={styles.sectionTitle}>
                Built for Real Disaster Response
              </h2>
              <p className={styles.sectionSubtitle}>
                Every feature designed around the actual needs of citizens,
                volunteers, NGOs, and authorities
              </p>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className={`${styles.featureCard} animate-fade-in`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={styles.featureIcon}
                  style={{ color: feat.color, background: `${feat.color}15` }}
                >
                  {feat.icon}
                </div>
                <div
                  className={styles.featureTag}
                  style={{ color: feat.color, background: `${feat.color}12`, borderColor: `${feat.color}25` }}
                >
                  {feat.tag}
                </div>
                <h3 className={styles.featureTitle}>{feat.title}</h3>
                <p className={styles.featureDesc}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE CARDS ── */}
      <section className={styles.rolesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: 12 }}>
            Who Uses DisasterTrust AI?
          </h2>
          <p className={styles.sectionSubtitle} style={{ textAlign: "center", marginBottom: 48 }}>
            Four roles, one mission — faster, accurate disaster relief
          </p>

          <div className={styles.rolesGrid}>
            {[
              {
                emoji: "🆘",
                role: "Citizens",
                desc: "Report emergencies with live video and locked GPS. Your evidence gets a trust score instantly.",
                href: "/report",
                cta: "Report Emergency",
                color: "#DC2626",
              },
              {
                emoji: "🤝",
                role: "Volunteers",
                desc: "See prioritized, AI-verified requests. Accept, deploy, complete — track every rescue.",
                href: "/volunteer",
                cta: "Join Response",
                color: "#3B82F6",
              },
              {
                emoji: "🏥",
                role: "NGOs",
                desc: "Post food, water, medical, shelter availability. Connect your resources to people who need them.",
                href: "/ngo",
                cta: "Post Resources",
                color: "#10B981",
              },
              {
                emoji: "👮",
                role: "Authorities",
                desc: "Full situational awareness on the live map. AI-analyzed trends, hotspot detection, coordination tools.",
                href: "/admin",
                cta: "Open Dashboard",
                color: "#F59E0B",
              },
            ].map((r) => (
              <div key={r.role} className={styles.roleCard}>
                <div className={styles.roleEmoji}>{r.emoji}</div>
                <h3
                  className={styles.roleTitle}
                  style={{ color: r.color }}
                >
                  {r.role}
                </h3>
                <p className={styles.roleDesc}>{r.desc}</p>
                <Link
                  href={r.href}
                  className="btn btn-secondary btn-sm"
                  style={{ borderColor: `${r.color}30` }}
                >
                  {r.cta} <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <Shield size={18} />
                DisasterTrust AI
              </div>
              <p className={styles.footerTagline}>
                Community-powered. AI-verified. Lives saved.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/report">Report Emergency</Link>
              <Link href="/volunteer">Volunteer</Link>
              <Link href="/ngo">NGO Portal</Link>
              <Link href="/admin">Admin Map</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 DisasterTrust AI. Built to save lives.</span>
            <span style={{ color: "var(--text-muted)" }}>
              Powered by OpenStreetMap · AI Classification
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
