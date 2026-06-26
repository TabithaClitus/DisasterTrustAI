"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Report, Resource } from "../lib/mockData";
import TimeAgo from "../components/TimeAgo";

interface Props {
  reports: Report[];
  resources: Resource[];
  onSelectReport: (r: Report) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "#DC2626",
  high: "#EA580C",
  medium: "#D97706",
  low: "#16A34A",
};

export default function LiveMap({ reports, resources, onSelectReport }: Props) {
  useEffect(() => {
    // Fix Leaflet default icon issue in Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).L?.Icon?.Default?.prototype?._getIconUrl;
  }, []);

  const activeReports = reports.filter((r) => r.status !== "resolved");

  return (
    <MapContainer
      center={[13.0827, 80.2707]}
      zoom={8}
      style={{ height: "100%", width: "100%", borderRadius: "12px" }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Report Markers */}
      {activeReports.map((report) => (
        <CircleMarker
          key={report.id}
          center={[report.location.lat, report.location.lng]}
          radius={report.priority === "critical" ? 14 : report.priority === "high" ? 11 : 8}
          pathOptions={{
            color: PRIORITY_COLORS[report.priority],
            fillColor: PRIORITY_COLORS[report.priority],
            fillOpacity: 0.8,
            weight: 2,
          }}
          eventHandlers={{
            click: () => onSelectReport(report),
          }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                {report.title}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
                📍 {report.location.name}
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 8 }}>
                🕐 <TimeAgo timestamp={report.timestamp} />
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: `${PRIORITY_COLORS[report.priority]}20`,
                  color: PRIORITY_COLORS[report.priority],
                  border: `1px solid ${PRIORITY_COLORS[report.priority]}40`,
                  borderRadius: 12,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  marginRight: 6,
                }}
              >
                {report.priority.toUpperCase()}
              </div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(16,185,129,0.12)",
                  color: "#10B981",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 12,
                  padding: "2px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Trust: {report.confidenceScore}%
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* Resource Markers */}
      {resources
        .filter((r) => r.available)
        .map((resource) => (
          <CircleMarker
            key={resource.id}
            center={[resource.location.lat, resource.location.lng]}
            radius={9}
            pathOptions={{
              color: "#10B981",
              fillColor: "#10B981",
              fillOpacity: 0.7,
              weight: 2,
              dashArray: "4 2",
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                  {resource.ngoName}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
                  {resource.description}
                </div>
                <div style={{ fontSize: 12, color: "#10B981", fontWeight: 600 }}>
                  ✓ {resource.quantity} available
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>
                  📞 {resource.contactPhone}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
