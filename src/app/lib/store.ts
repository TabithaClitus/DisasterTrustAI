// =============================================
// DISASTERTRUST AI — IN-MEMORY STORE
// Shared state for the full app
// =============================================

import { Report, Resource, MOCK_REPORTS, MOCK_RESOURCES } from "./mockData";

// Simple in-memory store (no backend needed for MVP)
const REPORTS_STORAGE_KEY = "disastertrust-ai-reports";
const RESOURCES_STORAGE_KEY = "disastertrust-ai-resources";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadReports(): Report[] {
  if (!canUseStorage()) return [...MOCK_REPORTS];

  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    if (!raw) return [...MOCK_REPORTS];
    const parsed = JSON.parse(raw) as Report[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...MOCK_REPORTS];

    const hasActiveReport = parsed.some(
      (report) => report && typeof report === "object" && report.status !== "resolved"
    );

    return hasActiveReport ? parsed : [...MOCK_REPORTS];
  } catch {
    return [...MOCK_REPORTS];
  }
}

function loadResources(): Resource[] {
  if (!canUseStorage()) return [...MOCK_RESOURCES];

  try {
    const raw = window.localStorage.getItem(RESOURCES_STORAGE_KEY);
    if (!raw) return [...MOCK_RESOURCES];
    const parsed = JSON.parse(raw) as Resource[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...MOCK_RESOURCES];

    const hasAvailableResource = parsed.some(
      (resource) => resource && typeof resource === "object" && resource.available
    );

    return hasAvailableResource ? parsed : [...MOCK_RESOURCES];
  } catch {
    return [...MOCK_RESOURCES];
  }
}

function persistReports(nextReports: Report[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(nextReports));
}

function persistResources(nextResources: Resource[]): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(RESOURCES_STORAGE_KEY, JSON.stringify(nextResources));
}

async function postStateAction(payload: Record<string, unknown>): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Ignore network failures and keep the local cache usable.
  }
}

export async function syncStoreFromServer(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) return;

    const data = (await response.json()) as Partial<{ reports: Report[]; resources: Resource[] }>;

    if (Array.isArray(data.reports)) {
      reports = data.reports;
      persistReports(reports);
    }

    if (Array.isArray(data.resources)) {
      resources = data.resources;
      persistResources(resources);
    }
  } catch {
    // Ignore sync failures and continue using the last known cache.
  }
}

let reports: Report[] = loadReports();
let resources: Resource[] = loadResources();

export function getReports(): Report[] {
  return [...reports].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id);
}

export async function addReport(report: Report): Promise<void> {
  reports = [report, ...reports];
  persistReports(reports);
  await postStateAction({ action: "addReport", report });
}

export async function updateReportStatus(
  id: string,
  status: Report["status"],
  volunteerName?: string
): Promise<void> {
  reports = reports.map((r) => {
    if (r.id === id) {
      return {
        ...r,
        status,
        volunteerAssigned: volunteerName ?? r.volunteerAssigned,
      };
    }
    return r;
  });
  persistReports(reports);
  await postStateAction({ action: "updateReportStatus", id, status, volunteerName });
}

export async function confirmReport(id: string): Promise<void> {
  reports = reports.map((r) => {
    if (r.id === id) {
      const newConfirmations = r.communityConfirmations + 1;
      const newScore = Math.min(
        r.confidenceScore + 2,
        100
      );
      return {
        ...r,
        communityConfirmations: newConfirmations,
        confidenceScore: newScore,
      };
    }
    return r;
  });
  persistReports(reports);
  await postStateAction({ action: "confirmReport", id });
}

export function getResources(): Resource[] {
  return [...resources];
}

export async function addResource(resource: Resource): Promise<void> {
  resources = [resource, ...resources];
  persistResources(resources);
  await postStateAction({ action: "addResource", resource });
}

export function generateReportId(): string {
  const num = String(reports.length + 1).padStart(3, "0");
  return `RPT-${num}`;
}

export function generateResourceId(): string {
  const num = String(resources.length + 1).padStart(3, "0");
  return `RES-${num}`;
}
