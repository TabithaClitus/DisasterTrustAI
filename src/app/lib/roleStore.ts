import { UserRole } from "./mockData";

export type RoleOption = {
  id: UserRole;
  label: string;
  shortLabel: string;
};

export const ROLE_OPTIONS: RoleOption[] = [
  { id: "citizen", label: "Citizen", shortLabel: "Citizen" },
  { id: "volunteer", label: "Volunteer", shortLabel: "Volunteer" },
  { id: "ngo", label: "NGO", shortLabel: "NGO" },
  { id: "admin", label: "Admin", shortLabel: "Admin" },
];

const ROLE_STORAGE_KEY = "disastertrust-ai-role";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedRole(): UserRole {
  if (!canUseStorage()) return "citizen";

  const saved = window.localStorage.getItem(ROLE_STORAGE_KEY);
  if (saved === "citizen" || saved === "volunteer" || saved === "ngo" || saved === "admin") {
    return saved;
  }

  return "citizen";
}

export function saveRole(role: UserRole): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_OPTIONS.find((option) => option.id === role)?.label ?? "Citizen";
}