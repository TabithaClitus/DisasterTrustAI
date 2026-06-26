"use client";
import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  MapPin,
  Phone,
  CheckCircle,
  Package,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {
  getResources,
  addResource,
  generateResourceId,
  syncStoreFromServer,
} from "../lib/store";
import TimeAgo from "../components/TimeAgo";
import { Resource, UserRole, getTimeAgo, getResourceIcon } from "../lib/mockData";
import { getRoleLabel, getSavedRole } from "../lib/roleStore";
import styles from "./ngo.module.css";

const RESOURCE_TYPES: { id: Resource["type"]; label: string; icon: string }[] = [
  { id: "food", label: "Food & Rations", icon: "🍱" },
  { id: "water", label: "Clean Water", icon: "💧" },
  { id: "medical", label: "Medical Supplies", icon: "🏥" },
  { id: "shelter", label: "Shelter Space", icon: "🏠" },
  { id: "rescue", label: "Rescue Equipment", icon: "⛵" },
];

const NGO_NAMES = [
  "Goonj India",
  "Red Cross India",
  "Akshaya Patra",
  "iCall",
  "Habitat for Humanity",
  "Direct Relief India",
];

const NGO_ROLE_HINT: Record<UserRole, string> = {
  citizen: "This portal is for organizations posting supplies. Citizens should use the reporting flow instead.",
  volunteer: "You are in the resource publishing view. Switch roles if you need the volunteer queue.",
  ngo: "You are in the right place: publish food, water, shelter, and medical resources here.",
  admin: "This portal is for resource publishing. Admin oversight lives in the live map dashboard.",
};

export default function NGOPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeRole, setActiveRole] = useState<UserRole>(getSavedRole());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ngoName: NGO_NAMES[0],
    type: "food" as Resource["type"],
    description: "",
    quantity: "",
    locationName: "",
    contactPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const refresh = async () => {
      await syncStoreFromServer();
      setResources(getResources());
      setActiveRole(getSavedRole());
    };

    void refresh();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    const resource: Resource = {
      id: generateResourceId(),
      ngoName: form.ngoName,
      type: form.type,
      description: form.description,
      quantity: form.quantity,
      location: {
        name: form.locationName,
        state: "Tamil Nadu",
        lat: 13.0827 + (Math.random() - 0.5) * 0.2,
        lng: 80.2707 + (Math.random() - 0.5) * 0.2,
      },
      available: true,
      timestamp: new Date().toISOString(),
      contactPhone: form.contactPhone,
    };

    await addResource(resource);
    await syncStoreFromServer();
    setResources(getResources());
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);

    setTimeout(() => setSubmitted(false), 4000);
    setForm({
      ngoName: NGO_NAMES[0],
      type: "food",
      description: "",
      quantity: "",
      locationName: "",
      contactPhone: "",
    });
  };

  const activeResources = resources.filter((r) => r.available);

  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.page}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <Building2 size={24} />
              </div>
              <div>
                <h1 className={styles.title}>NGO Resource Portal</h1>
                <p className={styles.subtitle}>
                  Post available resources — connect them to people in need
                </p>
              </div>
            </div>
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} />
              Post Resources
            </button>
          </div>

          <div className="glass-card" style={{ marginBottom: 20, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent-blue-light)", marginBottom: 6 }}>
              Active Role: {getRoleLabel(activeRole)}
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {NGO_ROLE_HINT[activeRole]}
            </div>
          </div>

          {/* Success Toast */}
          {submitted && (
            <div className={styles.successToast}>
              <CheckCircle size={18} style={{ color: "#10B981" }} />
              Resource posted successfully! Volunteers and citizens can now see
              it on the map.
            </div>
          )}

          {/* Post Form */}
          {showForm && (
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>
                <Plus size={18} />
                Post Available Resource
              </h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">NGO / Organization Name</label>
                    <select
                      className="form-select"
                      value={form.ngoName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, ngoName: e.target.value }))
                      }
                    >
                      {NGO_NAMES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Resource Type</label>
                    <div className={styles.typeGrid}>
                      {RESOURCE_TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`${styles.typeBtn} ${form.type === t.id ? styles.typeSelected : ""}`}
                          onClick={() =>
                            setForm((f) => ({ ...f, type: t.id }))
                          }
                        >
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input
                      className="form-input"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      placeholder="E.g. Cooked meals + dry rations for 500 people"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity Available</label>
                    <input
                      className="form-input"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quantity: e.target.value }))
                      }
                      placeholder="E.g. 500 packets, 200 beds, 3 doctors"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Distribution Location</label>
                    <input
                      className="form-input"
                      value={form.locationName}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          locationName: e.target.value,
                        }))
                      }
                      placeholder="E.g. Anna Nagar Community Hall, Chennai"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      className="form-input"
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          contactPhone: e.target.value,
                        }))
                      }
                      placeholder="+91-XXXXX-XXXXX"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? "Posting..." : "Post Resource"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Stats */}
          <div className={styles.statsRow}>
            {RESOURCE_TYPES.map((t) => {
              const count = activeResources.filter((r) => r.type === t.id).length;
              return (
                <div key={t.id} className={styles.statCard}>
                  <span className={styles.statIcon}>{t.icon}</span>
                  <span className={styles.statCount}>{count}</span>
                  <span className={styles.statLabel}>{t.label}</span>
                </div>
              );
            })}
          </div>

          {/* Resources Grid */}
          <div className={styles.resourcesGrid}>
            {activeResources.map((resource, i) => (
              <div
                key={resource.id}
                className={`${styles.resourceCard} animate-fade-in`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.resourceHeader}>
                  <span className={styles.resourceIcon}>
                    {getResourceIcon(resource.type)}
                  </span>
                  <div className={styles.resourceMeta}>
                    <div className={styles.resourceNgo}>{resource.ngoName}</div>
                    <div className={styles.resourceTime}>
                      <TimeAgo timestamp={resource.timestamp} />
                    </div>
                  </div>
                  <span className={styles.availableBadge}>
                    <span className="live-dot-green" />
                    Available
                  </span>
                </div>

                <h3 className={styles.resourceTitle}>{resource.description}</h3>

                <div className={styles.resourceQty}>
                  <Package size={14} />
                  <span>{resource.quantity}</span>
                </div>

                <div className={styles.resourceFooter}>
                  <div className={styles.resourceLocation}>
                    <MapPin size={12} />
                    {resource.location.name}
                  </div>
                  <a
                    href={`tel:${resource.contactPhone}`}
                    className={`btn btn-secondary btn-sm ${styles.callBtn}`}
                  >
                    <Phone size={12} />
                    Call
                  </a>
                </div>
              </div>
            ))}

            {activeResources.length === 0 && (
              <div className={styles.emptyState}>
                <Building2 size={40} style={{ color: "var(--text-muted)" }} />
                <p>No resources posted yet. Be the first to post!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
