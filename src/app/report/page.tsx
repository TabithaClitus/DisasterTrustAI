"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Video,
  StopCircle,
  Shield,
  Loader,
} from "lucide-react";
import Navbar from "../components/Navbar";
import RescueTracker from "../components/RescueTracker";
import { classifyReport, calculateConfidenceScore } from "../lib/aiClassifier";
import { addReport, generateReportId } from "../lib/store";
import { Category, Report, UserRole } from "../lib/mockData";
import { getRoleLabel, getSavedRole } from "../lib/roleStore";
import styles from "./report.module.css";

const CATEGORIES: { id: Category; label: string; icon: string; description: string }[] = [
  { id: "flood", label: "Flood", icon: "🌊", description: "Rising water, submerged areas" },
  { id: "rescue", label: "Rescue Needed", icon: "🆘", description: "Trapped or stranded persons" },
  { id: "medical", label: "Medical Emergency", icon: "🏥", description: "Injury, illness, urgent care" },
  { id: "cyclone", label: "Cyclone / Storm", icon: "🌀", description: "High winds, storm damage" },
  { id: "earthquake", label: "Earthquake", icon: "🫨", description: "Tremors, structural collapse" },
  { id: "food", label: "Food & Water", icon: "🍱", description: "Shortage of essential supplies" },
  { id: "shelter", label: "Shelter Needed", icon: "🏠", description: "Displaced, need accommodation" },
  { id: "fire", label: "Fire", icon: "🔥", description: "Structure or forest fire" },
];

type Step = 1 | 2 | 3 | 4;

const REPORT_ROLE_HINT: Record<UserRole, string> = {
  citizen: "This workspace is tuned for reporting an incident with live evidence and locked GPS.",
  volunteer: "You are in the citizen intake flow. Switch roles above if you want the volunteer queue.",
  ngo: "This is the incident intake flow. Use the NGO portal if you need to post resources instead.",
  admin: "This is the citizen reporting flow. Admin oversight lives in the live map dashboard.",
};

export default function ReportPage() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<UserRole>(getSavedRole());
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState<ReturnType<typeof classifyReport> | null>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [gps, setGps] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setActiveRole(getSavedRole());
  }, []);

  // Get GPS
  const getGPS = useCallback(() => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setGps({ lat, lng, name: `${lat}°N, ${lng}°E` });
        setGpsLoading(false);
      },
      () => {
        // Fallback to Chennai coords for demo
        setGps({ lat: 13.0827, lng: 80.2707, name: "Chennai, Tamil Nadu (approx)" });
        setGpsLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  // AI classify on description change
  useEffect(() => {
    if (!description.trim()) {
      setAiResult(null);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const result = classifyReport(description);
      setAiResult(result);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [description]);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      alert("Camera access required to submit a report. Please allow camera permissions.");
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    const recorder = new MediaRecorder(streamRef.current);
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setRecordSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => {
        if (s >= 29) {
          stopRecording();
          return 30;
        }
        return s + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    setRecordingDone(true);
    setHasVideo(true);
  };

  useEffect(() => {
    if (step === 2) {
      startCamera();
      getGPS();
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, getGPS]);

  const confidenceScore = calculateConfidenceScore({
    hasVideo,
    hasGPS: !!gps,
    hasTimestamp: true,
    hasDescription: description.trim().length > 10,
    communityConfirmations: 0,
    volunteerVerified: false,
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));

    const report: Report = {
      id: generateReportId(),
      category: category!,
      priority: aiResult?.priority ?? "medium",
      status: "pending",
      title: description.slice(0, 60) + (description.length > 60 ? "..." : ""),
      description,
      location: {
        name: gps?.name ?? "Location unavailable",
        state: "Tamil Nadu",
        lat: gps?.lat ?? 13.0827,
        lng: gps?.lng ?? 80.2707,
      },
      timestamp: new Date().toISOString(),
      hasVideo,
      hasGPS: !!gps,
      hasTimestamp: true,
      communityConfirmations: 0,
      volunteerVerified: false,
      confidenceScore: confidenceScore.total,
      urgencyPercent: aiResult?.urgencyPercent ?? 50,
      reporterName: "You",
      aiAnalysis: {
        category: aiResult?.category ?? category ?? "flood",
        priority: aiResult?.priority ?? "medium",
        summary: aiResult?.summary ?? "Report submitted.",
        urgencyPercent: aiResult?.urgencyPercent ?? 50,
      },
    };

    await addReport(report);
    setSubmittedReportId(report.id);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.root}>
        <Navbar />
        <div className={styles.successScreen}>
          <div className={`${styles.successCard} ${styles.successCardWide}`}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} style={{ color: "#10B981" }} />
            </div>
            <h1 className={styles.successTitle}>Report Submitted!</h1>
            <p className={styles.successSubtitle}>
              Your emergency report has been received and assigned a trust score.
              Volunteers near you will be alerted immediately, and you can watch the rescue move live.
            </p>
            <div className={styles.successScore}>
              <Shield size={16} style={{ color: "#F59E0B" }} />
              <span>Confidence Score: </span>
              <strong style={{ color: "#10B981", fontSize: 18 }}>
                {confidenceScore.total}%
              </strong>
            </div>
            {submittedReportId && (
              <RescueTracker reportId={submittedReportId} />
            )}
            <div className={styles.successActions}>
              <button className="btn btn-primary" onClick={() => router.push("/volunteer")}>
                View All Reports
              </button>
              <button className="btn btn-ghost" onClick={() => router.push("/")}>
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h1 className={styles.title}>Report Emergency</h1>
              <p className={styles.subtitle}>
                Live evidence required — GPS and timestamp are captured
                automatically
              </p>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: 20, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-blue-light)", marginBottom: 6 }}>
              Active Role: {getRoleLabel(activeRole)}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {REPORT_ROLE_HINT[activeRole]}
            </div>
          </div>

          {/* Progress */}
          <div className={styles.progress}>
            {([1, 2, 3, 4] as Step[]).map((s) => (
              <div key={s} className={styles.progressItem}>
                <div
                  className={`${styles.progressDot} ${step >= s ? styles.progressActive : ""} ${step > s ? styles.progressDone : ""}`}
                >
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                <span className={styles.progressLabel}>
                  {["Category", "Live Evidence", "Describe", "Review"][s - 1]}
                </span>
                {s < 4 && (
                  <div
                    className={`${styles.progressLine} ${step > s ? styles.progressLineDone : ""}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.content}>
            {/* STEP 1 — Category */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>What type of emergency?</h2>
                <div className={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      className={`${styles.categoryCard} ${category === cat.id ? styles.categorySelected : ""}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span className={styles.categoryIcon}>{cat.icon}</span>
                      <span className={styles.categoryLabel}>{cat.label}</span>
                      <span className={styles.categoryDesc}>{cat.description}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.stepActions}>
                  <button
                    className="btn btn-emergency btn-lg"
                    disabled={!category}
                    onClick={() => setStep(2)}
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Live Evidence */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Capture Live Evidence</h2>
                <p className={styles.stepHint}>
                  📸 Only live camera recording is accepted — no gallery uploads.
                  This is what makes your report trustworthy.
                </p>

                <div className={styles.evidenceLayout}>
                  {/* Camera */}
                  <div className={styles.cameraSection}>
                    <div className={styles.cameraBox}>
                      <video
                        ref={videoRef}
                        className={styles.cameraStream}
                        muted
                        playsInline
                        autoPlay
                      />
                      {recordingDone && (
                        <div className={styles.cameraOverlay}>
                          <CheckCircle size={40} style={{ color: "#10B981" }} />
                          <span>Video Recorded ✓</span>
                        </div>
                      )}
                      {recording && (
                        <div className={styles.recordingBadge}>
                          <span className="live-dot" />
                          REC {recordSeconds}s / 30s
                        </div>
                      )}
                    </div>

                    <div className={styles.cameraControls}>
                      {!recording && !recordingDone && (
                        <button
                          className="btn btn-emergency btn-lg"
                          onClick={startRecording}
                        >
                          <Video size={20} />
                          Start Recording
                        </button>
                      )}
                      {recording && (
                        <button
                          className="btn btn-secondary btn-lg"
                          onClick={stopRecording}
                        >
                          <StopCircle size={20} />
                          Stop Recording ({30 - recordSeconds}s left)
                        </button>
                      )}
                      {recordingDone && (
                        <div className={styles.recordDone}>
                          <CheckCircle size={20} style={{ color: "#10B981" }} />
                          <span>Live video captured successfully</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GPS & Timestamp */}
                  <div className={styles.evidenceInfo}>
                    <div className={styles.evidenceItem}>
                      <div className={styles.evidenceItemHeader}>
                        <MapPin size={16} />
                        <span>GPS Location</span>
                        {gps && <CheckCircle size={14} style={{ color: "#10B981" }} />}
                      </div>
                      {gpsLoading ? (
                        <div className={styles.evidenceValue}>
                          <Loader size={14} className={styles.spin} /> Acquiring GPS...
                        </div>
                      ) : gps ? (
                        <div className={styles.evidenceValue} style={{ color: "#10B981" }}>
                          📍 {gps.name}
                          <span className={styles.evidenceLock}>🔒 Locked</span>
                        </div>
                      ) : (
                        <div className={styles.evidenceValue}>Waiting for GPS...</div>
                      )}
                    </div>

                    <div className={styles.evidenceItem}>
                      <div className={styles.evidenceItemHeader}>
                        <Clock size={16} />
                        <span>Timestamp</span>
                        <CheckCircle size={14} style={{ color: "#10B981" }} />
                      </div>
                      <div className={styles.evidenceValue} style={{ color: "#10B981" }}>
                        {new Date().toLocaleString("en-IN")}
                        <span className={styles.evidenceLock}>🔒 Locked</span>
                      </div>
                    </div>

                    {/* Live Trust Score Preview */}
                    <div className={styles.trustPreview}>
                      <div className={styles.trustPreviewTitle}>
                        <Shield size={14} />
                        Trust Score Preview
                      </div>
                      {[
                        { label: "Live Video", pts: confidenceScore.liveVideo.points, max: 35, done: hasVideo },
                        { label: "GPS", pts: confidenceScore.gpsLocation.points, max: 25, done: !!gps },
                        { label: "Timestamp", pts: confidenceScore.timestamp.points, max: 15, done: true },
                      ].map((item) => (
                        <div key={item.label} className={styles.trustRow}>
                          <span>{item.label}</span>
                          <div className={styles.trustBar}>
                            <div
                              className={styles.trustBarFill}
                              style={{
                                width: `${(item.pts / item.max) * 100}%`,
                                background: item.done ? "#10B981" : "#DC2626",
                              }}
                            />
                          </div>
                          <span className={styles.trustPts} style={{ color: item.done ? "#10B981" : "#DC2626" }}>
                            {item.done ? `+${item.pts}` : "0"}
                          </span>
                        </div>
                      ))}
                      <div className={styles.trustTotal}>
                        Total: <strong>{confidenceScore.total}%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button
                    className="btn btn-emergency btn-lg"
                    disabled={!recordingDone || !gps}
                    onClick={() => setStep(3)}
                  >
                    Continue <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 — Description */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Describe the Situation</h2>

                <div className={styles.descLayout}>
                  <div>
                    <textarea
                      className="form-textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Example: Grandmother and 2 children trapped on rooftop. Water level rising. Cannot reach ground floor. Need boat rescue urgently."
                      rows={6}
                      style={{ minHeight: 160 }}
                      autoFocus
                    />
                    <p className={styles.charCount}>
                      {description.length} characters
                    </p>
                  </div>

                  {/* AI Analysis Panel */}
                  {aiResult && (
                    <div className={styles.aiPanel}>
                      <div className={styles.aiPanelHeader}>
                        <Shield size={14} />
                        <span>AI Analysis</span>
                        <span className={styles.aiLive}>Live</span>
                      </div>

                      <div className={styles.aiRow}>
                        <span className={styles.aiLabel}>Category</span>
                        <span className={styles.aiValue}>
                          {aiResult.category.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.aiRow}>
                        <span className={styles.aiLabel}>Priority</span>
                        <span
                          className={styles.aiValue}
                          style={{
                            color:
                              aiResult.priority === "critical"
                                ? "#DC2626"
                                : aiResult.priority === "high"
                                ? "#EA580C"
                                : aiResult.priority === "medium"
                                ? "#D97706"
                                : "#16A34A",
                          }}
                        >
                          {aiResult.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.aiRow}>
                        <span className={styles.aiLabel}>Urgency</span>
                        <div className={styles.urgencyBar}>
                          <div
                            className={styles.urgencyFill}
                            style={{
                              width: `${aiResult.urgencyPercent}%`,
                              background:
                                aiResult.urgencyPercent > 75
                                  ? "#DC2626"
                                  : aiResult.urgencyPercent > 50
                                  ? "#D97706"
                                  : "#16A34A",
                            }}
                          />
                        </div>
                        <span className={styles.urgencyPct}>
                          {aiResult.urgencyPercent}%
                        </span>
                      </div>
                      <div className={styles.aiSummary}>{aiResult.summary}</div>
                    </div>
                  )}
                </div>

                <div className={styles.stepActions}>
                  <button className="btn btn-ghost" onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button
                    className="btn btn-emergency btn-lg"
                    disabled={description.trim().length < 10}
                    onClick={() => setStep(4)}
                  >
                    Review Report <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Review & Submit */}
            {step === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Review & Submit</h2>

                <div className={styles.reviewLayout}>
                  <div className={styles.reviewCard}>
                    <div className={styles.reviewSection}>
                      <div className={styles.reviewLabel}>Category</div>
                      <div className={styles.reviewValue}>
                        {CATEGORIES.find((c) => c.id === category)?.icon}{" "}
                        {CATEGORIES.find((c) => c.id === category)?.label}
                      </div>
                    </div>
                    <div className={styles.reviewSection}>
                      <div className={styles.reviewLabel}>Description</div>
                      <div className={styles.reviewValue}>{description}</div>
                    </div>
                    <div className={styles.reviewSection}>
                      <div className={styles.reviewLabel}>Location (GPS Locked)</div>
                      <div className={styles.reviewValue} style={{ color: "#10B981" }}>
                        📍 {gps?.name} 🔒
                      </div>
                    </div>
                    <div className={styles.reviewSection}>
                      <div className={styles.reviewLabel}>Timestamp (Locked)</div>
                      <div className={styles.reviewValue} style={{ color: "#10B981" }}>
                        🕐 {new Date().toLocaleString("en-IN")} 🔒
                      </div>
                    </div>
                    <div className={styles.reviewSection}>
                      <div className={styles.reviewLabel}>Live Video</div>
                      <div className={styles.reviewValue} style={{ color: "#10B981" }}>
                        ✅ Recorded
                      </div>
                    </div>
                  </div>

                  {/* Final Score */}
                  <div className={styles.finalScore}>
                    <div className={styles.finalScoreTitle}>
                      <Shield size={16} />
                      Your Trust Score
                    </div>
                    <div className={styles.finalScoreValue}>
                      <span
                        style={{
                          fontSize: 64,
                          fontWeight: 900,
                          fontFamily: "var(--font-display)",
                          color: "#10B981",
                          lineHeight: 1,
                        }}
                      >
                        {confidenceScore.total}
                      </span>
                      <span style={{ fontSize: 24, color: "#10B981" }}>%</span>
                    </div>
                    <div className={styles.finalScoreLabel}>
                      {confidenceScore.label}
                    </div>

                    {aiResult && (
                      <div className={styles.finalAI}>
                        <div className={styles.aiPanelHeader}>
                          <Shield size={12} />
                          <span>AI Assessment</span>
                        </div>
                        <div
                          className={styles.aiValue}
                          style={{
                            color:
                              aiResult.priority === "critical"
                                ? "#DC2626"
                                : aiResult.priority === "high"
                                ? "#EA580C"
                                : "#D97706",
                            fontWeight: 700,
                            fontSize: 18,
                          }}
                        >
                          {aiResult.priority.toUpperCase()} PRIORITY
                        </div>
                        <div className={styles.aiSummary}>{aiResult.summary}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.stepActions}>
                  <button className="btn btn-ghost" onClick={() => setStep(3)}>
                    Back
                  </button>
                  <button
                    className="btn btn-emergency btn-lg"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader size={18} className={styles.spin} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} />
                        Submit Emergency Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
