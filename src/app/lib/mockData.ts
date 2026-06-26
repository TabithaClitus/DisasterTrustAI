// =============================================
// DISASTERTRUST AI — MOCK DATA
// Realistic disaster reports across India
// =============================================

export type Priority = "critical" | "high" | "medium" | "low";

export type Category =
  | "flood"
  | "earthquake"
  | "cyclone"
  | "medical"
  | "rescue"
  | "food"
  | "shelter"
  | "fire";

export type UserRole = "citizen" | "volunteer" | "ngo" | "admin";

export type ReportStatus =
  | "pending"
  | "verified"
  | "assigned"
  | "in-progress"
  | "resolved";

export interface Report {
  id: string;
  category: Category;
  priority: Priority;
  status: ReportStatus;
  title: string;
  description: string;
  location: {
    name: string;
    state: string;
    lat: number;
    lng: number;
  };
  timestamp: string;
  hasVideo: boolean;
  hasGPS: boolean;
  hasTimestamp: boolean;
  communityConfirmations: number;
  volunteerVerified: boolean;
  confidenceScore: number;
  urgencyPercent: number;
  reporterName: string;
  volunteerAssigned?: string;
  aiAnalysis: {
    category: string;
    priority: string;
    summary: string;
    urgencyPercent: number;
  };
}

export interface Resource {
  id: string;
  ngoName: string;
  type: "food" | "water" | "medical" | "shelter" | "rescue";
  description: string;
  quantity: string;
  location: {
    name: string;
    state: string;
    lat: number;
    lng: number;
  };
  available: boolean;
  timestamp: string;
  contactPhone: string;
}

export const MOCK_REPORTS: Report[] = [
  {
    id: "RPT-001",
    category: "rescue",
    priority: "critical",
    status: "verified",
    title: "Family trapped on rooftop — water rising",
    description:
      "Grandmother (75 yrs), mother, and 2 children trapped on rooftop. Ground floor fully submerged. Water rising rapidly. Need boat rescue urgently.",
    location: {
      name: "Kodungaiyur, Chennai",
      state: "Tamil Nadu",
      lat: 13.1254,
      lng: 80.2637,
    },
    timestamp: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    hasVideo: true,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 12,
    volunteerVerified: true,
    confidenceScore: 96,
    urgencyPercent: 98,
    reporterName: "Ramesh K.",
    aiAnalysis: {
      category: "Rescue Request",
      priority: "CRITICAL",
      summary:
        "Elderly person + children in immediate danger. Rising water level confirmed by multiple nearby reports. Immediate boat deployment required.",
      urgencyPercent: 98,
    },
  },
  {
    id: "RPT-002",
    category: "medical",
    priority: "critical",
    status: "assigned",
    title: "Pregnant woman needs emergency evacuation",
    description:
      "9-month pregnant woman. Hospital road blocked by flood. Ambulance cannot reach. Need immediate evacuation assistance.",
    location: {
      name: "Perambur, Chennai",
      state: "Tamil Nadu",
      lat: 13.1163,
      lng: 80.243,
    },
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    hasVideo: true,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 8,
    volunteerVerified: true,
    confidenceScore: 94,
    urgencyPercent: 95,
    reporterName: "Siva P.",
    volunteerAssigned: "Dr. Meena Volunteer",
    aiAnalysis: {
      category: "Medical Emergency",
      priority: "CRITICAL",
      summary:
        "Life-threatening medical situation. Obstetric emergency. Requires medical personnel + transport. High confidence — live video + GPS confirmed.",
      urgencyPercent: 95,
    },
  },
  {
    id: "RPT-003",
    category: "flood",
    priority: "high",
    status: "verified",
    title: "Street submerged — 50+ residents stranded",
    description:
      "Entire street under 4 feet of water. 50+ residents on upper floors. Electricity cut. Running low on food and water.",
    location: {
      name: "Velachery, Chennai",
      state: "Tamil Nadu",
      lat: 12.9815,
      lng: 80.2176,
    },
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    hasVideo: true,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 19,
    volunteerVerified: false,
    confidenceScore: 89,
    urgencyPercent: 82,
    reporterName: "Arun V.",
    aiAnalysis: {
      category: "Flood Report",
      priority: "HIGH",
      summary:
        "Large-scale flooding affecting many residents. Food/water depletion imminent. Coordination with NGO resources recommended.",
      urgencyPercent: 82,
    },
  },
  {
    id: "RPT-004",
    category: "food",
    priority: "medium",
    status: "pending",
    title: "Food and drinking water needed",
    description:
      "Around 30 families with no food for 2 days. Children present. Clean drinking water urgently needed.",
    location: {
      name: "Tambaram, Chennai",
      state: "Tamil Nadu",
      lat: 12.9229,
      lng: 80.1275,
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    hasVideo: false,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 6,
    volunteerVerified: false,
    confidenceScore: 62,
    urgencyPercent: 65,
    reporterName: "Priya S.",
    aiAnalysis: {
      category: "Resource Request",
      priority: "MEDIUM",
      summary:
        "Food and water scarcity affecting families with children. No video evidence — confirmation via GPS + community. Connect with NGO food resources.",
      urgencyPercent: 65,
    },
  },
  {
    id: "RPT-005",
    category: "rescue",
    priority: "critical",
    status: "in-progress",
    title: "Elderly man swept by current — holding on to pole",
    description:
      "65-year-old man swept by floodwater, holding on to electricity pole. Crowd watching but unable to help. Life at risk.",
    location: {
      name: "Kochi, Ernakulam",
      state: "Kerala",
      lat: 9.9312,
      lng: 76.2673,
    },
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    hasVideo: true,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 24,
    volunteerVerified: true,
    confidenceScore: 98,
    urgencyPercent: 99,
    reporterName: "Thomas M.",
    volunteerAssigned: "Rescue Team Kerala-4",
    aiAnalysis: {
      category: "Rescue Request",
      priority: "CRITICAL",
      summary:
        "Imminent life-threatening situation. 24 community confirmations + live video. Rescue team dispatched. Highest priority.",
      urgencyPercent: 99,
    },
  },
  {
    id: "RPT-006",
    category: "shelter",
    priority: "medium",
    status: "pending",
    title: "200+ people need shelter — school building damaged",
    description:
      "School being used as shelter but roof damaged. Rain entering. Need alternative safe shelter for 200+ people including elderly.",
    location: {
      name: "Visakhapatnam",
      state: "Andhra Pradesh",
      lat: 17.6868,
      lng: 83.2185,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    hasVideo: false,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 3,
    volunteerVerified: false,
    confidenceScore: 47,
    urgencyPercent: 55,
    reporterName: "Lakshmi R.",
    aiAnalysis: {
      category: "Shelter Request",
      priority: "MEDIUM",
      summary:
        "Moderate confidence — no video evidence. GPS matches flood zone. Coordinate with local authorities for shelter relocation.",
      urgencyPercent: 55,
    },
  },
  {
    id: "RPT-007",
    category: "medical",
    priority: "high",
    status: "verified",
    title: "Snake bite victim — antivenom needed",
    description:
      "12-year-old bitten by snake while evacuating through floodwaters. Hospital 20km away. Need medical team with antivenom.",
    location: {
      name: "Alappuzha",
      state: "Kerala",
      lat: 9.4981,
      lng: 76.3388,
    },
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    hasVideo: true,
    hasGPS: true,
    hasTimestamp: true,
    communityConfirmations: 5,
    volunteerVerified: true,
    confidenceScore: 91,
    urgencyPercent: 88,
    reporterName: "Biju K.",
    aiAnalysis: {
      category: "Medical Emergency",
      priority: "HIGH",
      summary:
        "Child victim requiring urgent antivenom. Remote location + flooding complicating access. Helicopter medical response advised.",
      urgencyPercent: 88,
    },
  },
  {
    id: "RPT-008",
    category: "flood",
    priority: "low",
    status: "pending",
    title: "Minor flooding in parking area",
    description: "Car parking area has some water. Access difficult but residents safe.",
    location: {
      name: "Anna Nagar, Chennai",
      state: "Tamil Nadu",
      lat: 13.0878,
      lng: 80.2097,
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    hasVideo: false,
    hasGPS: false,
    hasTimestamp: true,
    communityConfirmations: 1,
    volunteerVerified: false,
    confidenceScore: 22,
    urgencyPercent: 15,
    reporterName: "Anonymous",
    aiAnalysis: {
      category: "Flood Report",
      priority: "LOW",
      summary:
        "Low confidence — no video, no GPS, minimal confirmations. Likely minor situation. Monitor but deprioritize.",
      urgencyPercent: 15,
    },
  },
];

export const MOCK_RESOURCES: Resource[] = [
  {
    id: "RES-001",
    ngoName: "Goonj India",
    type: "food",
    description: "Cooked food packets + dry rations",
    quantity: "2,000 packets",
    location: {
      name: "Anna Nagar Relief Camp",
      state: "Tamil Nadu",
      lat: 13.0878,
      lng: 80.2097,
    },
    available: true,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    contactPhone: "+91-98765-43210",
  },
  {
    id: "RES-002",
    ngoName: "Red Cross India",
    type: "medical",
    description: "Medical camp with doctors, medicine, first aid",
    quantity: "3 doctors, 200 med kits",
    location: {
      name: "Velachery Community Hall",
      state: "Tamil Nadu",
      lat: 12.9815,
      lng: 80.2176,
    },
    available: true,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    contactPhone: "+91-98765-11111",
  },
  {
    id: "RES-003",
    ngoName: "Kerala Flood Relief",
    type: "rescue",
    description: "Rescue boats + trained operators",
    quantity: "8 boats, 16 personnel",
    location: {
      name: "Ernakulam Boat Dock",
      state: "Kerala",
      lat: 9.9312,
      lng: 76.2673,
    },
    available: true,
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    contactPhone: "+91-98765-22222",
  },
  {
    id: "RES-004",
    ngoName: "Akshaya Patra",
    type: "water",
    description: "Clean drinking water + water purification tablets",
    quantity: "10,000 litres",
    location: {
      name: "Tambaram Distribution Point",
      state: "Tamil Nadu",
      lat: 12.9229,
      lng: 80.1275,
    },
    available: true,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    contactPhone: "+91-98765-33333",
  },
  {
    id: "RES-005",
    ngoName: "Andhra Pradesh Disaster Authority",
    type: "shelter",
    description: "Government cyclone shelter — 500 capacity",
    quantity: "200 spaces available",
    location: {
      name: "Vizag Cyclone Shelter",
      state: "Andhra Pradesh",
      lat: 17.6868,
      lng: 83.2185,
    },
    available: true,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    contactPhone: "+91-98765-44444",
  },
];

export const STATS = {
  activeIncidents: 247,
  volunteersDeployed: 1284,
  peopleHelped: 8932,
  resourcesAvailable: 43,
  reportsToday: 312,
  resolvedToday: 185,
  avgResponseTime: "8 min",
  verificationRate: 78,
};

export function getTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function getCategoryIcon(category: Category): string {
  const icons: Record<Category, string> = {
    flood: "🌊",
    earthquake: "🫨",
    cyclone: "🌀",
    medical: "🏥",
    rescue: "🆘",
    food: "🍱",
    shelter: "🏠",
    fire: "🔥",
  };
  return icons[category];
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    flood: "Flood",
    earthquake: "Earthquake",
    cyclone: "Cyclone",
    medical: "Medical Emergency",
    rescue: "Rescue Needed",
    food: "Food & Water",
    shelter: "Shelter",
    fire: "Fire",
  };
  return labels[category];
}

export function getResourceIcon(type: Resource["type"]): string {
  const icons: Record<Resource["type"], string> = {
    food: "🍱",
    water: "💧",
    medical: "🏥",
    shelter: "🏠",
    rescue: "⛵",
  };
  return icons[type];
}
