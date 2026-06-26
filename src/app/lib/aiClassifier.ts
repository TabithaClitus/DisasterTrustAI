// =============================================
// DISASTERTRUST AI — AI CLASSIFIER
// Rule-based AI engine that mimics real AI
// (Drop in Gemini API key to use real AI)
// =============================================

import { Category, Priority } from "./mockData";

export interface ClassificationResult {
  category: Category;
  priority: Priority;
  urgencyPercent: number;
  summary: string;
  tags: string[];
}

export interface ConfidenceBreakdown {
  liveVideo: { present: boolean; points: number; maxPoints: number };
  gpsLocation: { present: boolean; points: number; maxPoints: number };
  timestamp: { present: boolean; points: number; maxPoints: number };
  description: { present: boolean; points: number; maxPoints: number };
  communityConfirms: { count: number; points: number; maxPoints: number };
  volunteerVerified: { present: boolean; points: number; maxPoints: number };
  total: number;
  label: string;
}

// Keyword mappings for rule-based classification
const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  rescue: [
    "trapped",
    "stuck",
    "stranded",
    "rescue",
    "save",
    "help",
    "rooftop",
    "swept",
    "current",
    "drowning",
    "sinking",
  ],
  medical: [
    "medical",
    "hospital",
    "injury",
    "hurt",
    "wound",
    "bleeding",
    "unconscious",
    "sick",
    "pregnant",
    "heart",
    "snake",
    "bite",
    "antivenom",
    "doctor",
  ],
  flood: [
    "flood",
    "water",
    "submerged",
    "inundated",
    "rising water",
    "waterlogged",
    "overflow",
    "deluge",
  ],
  earthquake: [
    "earthquake",
    "tremor",
    "quake",
    "collapsed",
    "building fell",
    "rubble",
    "aftershock",
  ],
  cyclone: [
    "cyclone",
    "storm",
    "hurricane",
    "typhoon",
    "wind",
    "gale",
    "tornado",
    "storm surge",
  ],
  food: [
    "food",
    "hungry",
    "starving",
    "eating",
    "water",
    "drinking",
    "ration",
    "supplies",
    "provisions",
  ],
  shelter: [
    "shelter",
    "home",
    "house",
    "roof",
    "accommodation",
    "place to stay",
    "displaced",
    "evacuated",
  ],
  fire: [
    "fire",
    "burning",
    "flames",
    "smoke",
    "blaze",
    "inferno",
    "arson",
  ],
};

const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  critical: [
    "trapped",
    "dying",
    "unconscious",
    "rooftop",
    "swept",
    "drowning",
    "immediately",
    "urgent",
    "life",
    "death",
    "critical",
    "emergency",
    "stranded",
    "elderly",
    "child",
    "children",
    "pregnant",
    "rising",
    "imminent",
  ],
  high: [
    "hurt",
    "injured",
    "medical",
    "need help",
    "quickly",
    "soon",
    "hospital",
    "blocked",
    "50",
    "100",
    "many people",
  ],
  medium: [
    "food",
    "water",
    "shelter",
    "need",
    "require",
    "families",
    "several",
    "days",
  ],
  low: ["minor", "small", "little", "parking", "inconvenient", "possible"],
};

const PRIORITY_URGENCY_BASE: Record<Priority, number> = {
  critical: 92,
  high: 72,
  medium: 50,
  low: 18,
};

function countKeywordMatches(text: string, keywords: string[]): number {
  return keywords.reduce((count, keyword) => (text.includes(keyword) ? count + 1 : count), 0);
}

export function classifyReport(text: string): ClassificationResult {
  const lower = text.toLowerCase();

  // Score each category
  const categoryScores: Record<Category, number> = {} as Record<Category, number>;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    categoryScores[cat as Category] = countKeywordMatches(lower, keywords);
  }

  // Pick highest scoring category
  let category: Category = "flood";
  let maxScore = 0;
  for (const [cat, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      category = cat as Category;
    }
  }

  // Score priority
  const priorityScores: Record<Priority, number> = {} as Record<Priority, number>;
  for (const [pri, keywords] of Object.entries(PRIORITY_KEYWORDS)) {
    priorityScores[pri as Priority] = countKeywordMatches(lower, keywords);
  }

  let priority: Priority = "medium";
  let maxPriScore = 0;
  for (const [pri, score] of Object.entries(priorityScores)) {
    if (score > maxPriScore) {
      maxPriScore = score;
      priority = pri as Priority;
    }
  }

  // Deterministic urgency score so the same report always yields the same result.
  const urgencyPercent = Math.min(
    99,
    PRIORITY_URGENCY_BASE[priority] + Math.min(maxPriScore * 4, 8)
  );

  // Generate AI summary
  const summaries: Record<Priority, string[]> = {
    critical: [
      "Immediate life-threatening situation detected. Deploy resources urgently.",
      "Critical emergency — human life at immediate risk. Prioritize rescue.",
      "Highest urgency classification. All available responders needed.",
    ],
    high: [
      "High priority situation requiring prompt response within 1–2 hours.",
      "Significant risk to safety. Coordinate volunteer + NGO response.",
      "Time-sensitive emergency. Assign responders immediately.",
    ],
    medium: [
      "Moderate situation. Coordinate resources within 4–6 hours.",
      "Ongoing need but not immediately life-threatening. Schedule response.",
      "Community support needed. Match with available NGO resources.",
    ],
    low: [
      "Low urgency situation. Monitor and respond when resources allow.",
      "Minor incident. Standard response protocol applies.",
      "Routine monitoring recommended.",
    ],
  };

  const summaryList = summaries[priority];
  const summary = summaryList[Math.floor(Math.random() * summaryList.length)];

  const tags: string[] = [category, priority];
  if (lower.includes("child") || lower.includes("children")) tags.push("children");
  if (lower.includes("elderly") || lower.includes("old")) tags.push("elderly");
  if (lower.includes("medical") || lower.includes("doctor")) tags.push("medical-needed");

  return {
    category,
    priority,
    urgencyPercent,
    summary,
    tags,
  };
}

export function calculateConfidenceScore(params: {
  hasVideo: boolean;
  hasGPS: boolean;
  hasTimestamp: boolean;
  hasDescription: boolean;
  communityConfirmations: number;
  volunteerVerified: boolean;
}): ConfidenceBreakdown {
  const {
    hasVideo,
    hasGPS,
    hasTimestamp,
    hasDescription,
    communityConfirmations,
    volunteerVerified,
  } = params;

  const confirmPoints = Math.min(communityConfirmations * 2, 10);

  const breakdown: ConfidenceBreakdown = {
    liveVideo: { present: hasVideo, points: hasVideo ? 35 : 0, maxPoints: 35 },
    gpsLocation: { present: hasGPS, points: hasGPS ? 25 : 0, maxPoints: 25 },
    timestamp: {
      present: hasTimestamp,
      points: hasTimestamp ? 15 : 0,
      maxPoints: 15,
    },
    description: {
      present: hasDescription,
      points: hasDescription ? 10 : 0,
      maxPoints: 10,
    },
    communityConfirms: {
      count: communityConfirmations,
      points: confirmPoints,
      maxPoints: 10,
    },
    volunteerVerified: {
      present: volunteerVerified,
      points: volunteerVerified ? 5 : 0,
      maxPoints: 5,
    },
    total: 0,
    label: "",
  };

  breakdown.total =
    breakdown.liveVideo.points +
    breakdown.gpsLocation.points +
    breakdown.timestamp.points +
    breakdown.description.points +
    breakdown.communityConfirms.points +
    breakdown.volunteerVerified.points;

  if (breakdown.total >= 80) breakdown.label = "Highly Trusted";
  else if (breakdown.total >= 60) breakdown.label = "Trusted";
  else if (breakdown.total >= 40) breakdown.label = "Moderate Trust";
  else if (breakdown.total >= 20) breakdown.label = "Low Trust";
  else breakdown.label = "Unverified";

  return breakdown;
}

export function getPriorityColor(priority: Priority): string {
  return {
    critical: "#DC2626",
    high: "#EA580C",
    medium: "#D97706",
    low: "#16A34A",
  }[priority];
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#10B981";
  if (score >= 40) return "#D97706";
  return "#DC2626";
}
