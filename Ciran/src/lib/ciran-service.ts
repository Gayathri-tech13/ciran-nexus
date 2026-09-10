// Mock service layer. Every screen reads through these functions so a real
// backend (CCTNS/ICJS adapters) can replace the implementations later.

import {
  activity,
  alerts,
  crossCaseLinks,
  entities,
  entityResolution,
  evidence,
  patterns,
  relations,
  timeline,
  trend,
  type Entity,
  type EntityType,
  type Relation,
  type RelationType,
} from "./ciran-data";

export function getEntities(): Entity[] {
  return entities;
}

export function getEntity(id: string): Entity | undefined {
  return entities.find((e) => e.id === id);
}

export function searchEntities(query: string): Entity[] {
  const q = query.trim().toLowerCase();
  if (!q) return entities.filter((e) => e.type === "person").slice(0, 5);
  return entities
    .filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.subtitle.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q),
    )
    .slice(0, 8);
}

export function getCases(): Entity[] {
  return entities.filter((e) => e.type === "case");
}

export function getNetwork(filters?: {
  entityTypes?: EntityType[];
  relationTypes?: RelationType[];
}): { nodes: Entity[]; edges: Relation[] } {
  const et = filters?.entityTypes;
  const rt = filters?.relationTypes;
  const nodes = entities.filter((e) => !et || et.length === 0 || et.includes(e.type));
  const ids = new Set(nodes.map((n) => n.id));
  const edges = relations.filter(
    (r) =>
      ids.has(r.source) &&
      ids.has(r.target) &&
      (!rt || rt.length === 0 || rt.includes(r.type)),
  );
  return { nodes, edges };
}

export function getNeighbours(id: string): { relation: Relation; other: Entity }[] {
  return relations
    .filter((r) => r.source === id || r.target === id)
    .map((r) => {
      const otherId = r.source === id ? r.target : r.source;
      return { relation: r, other: getEntity(otherId)! };
    })
    .filter((x) => Boolean(x.other));
}

export function getTimeline(filters?: { categories?: RelationType[]; from?: string; to?: string }) {
  return timeline.filter((e) => {
    if (filters?.categories?.length && !filters.categories.includes(e.category)) return false;
    if (filters?.from && e.date < filters.from) return false;
    if (filters?.to && e.date > filters.to) return false;
    return true;
  });
}

export function getCrossCaseLinks() {
  return crossCaseLinks;
}

export function getIntelligenceAlerts() {
  return alerts;
}

export function getPatterns() {
  return patterns;
}

export function getEvidence() {
  return evidence;
}

export function getActivity() {
  return activity;
}

export function getTrend() {
  return trend;
}

export function getEntityResolution() {
  return entityResolution;
}

export function getKpis() {
  return [
    { label: "Active Investigations", value: 24, delta: "+3 this week", tone: "info" as const },
    { label: "High-Priority Intelligence Signals", value: 7, delta: "2 awaiting review", tone: "critical" as const },
    { label: "Newly Detected Relationships", value: 19, delta: "+6 in 24 hrs", tone: "high" as const },
    { label: "Cross-Case Connections", value: 11, delta: "3 unreviewed", tone: "medium" as const },
  ];
}

export interface CopilotResponse {
  summary: string;
  chips: string[];
  path?: string[];
  timeline?: { day: string; title: string }[];
  evidence: string[];
  confidence: number;
  caution?: string;
}

export function askCopilot(query: string): CopilotResponse {
  const q = query.toLowerCase();

  if (q.includes("203") && q.includes("ravi")) {
    return {
      summary:
        "Ravi Kumar is connected to Case 203 through a shared intermediary and a shared vehicle record. The link is indirect and requires analyst review.",
      chips: ["Ravi Kumar", "Karthik Raj", "TN-XX-1234", "Case 203"],
      path: ["Ravi Kumar", "Karthik Raj", "Vehicle TN-XX-1234", "Case 203"],
      timeline: [
        { day: "JAN 10", title: "Contact recorded with Karthik Raj" },
        { day: "JAN 20", title: "Vehicle TN-XX-1234 sighted at Location A" },
        { day: "JAN 22", title: "Case 203 registered" },
      ],
      evidence: ["CDR-1023", "Vehicle-445", "Case-203"],
      confidence: 84,
      caution: "Potential indirect association. Not a determination of involvement.",
    };
  }

  if (q.includes("indirect") || (q.includes("ravi") && q.includes("arjun"))) {
    return {
      summary:
        "One indirect connection path was found between Ravi Kumar and Arjun Kumar. No direct communication record exists between them.",
      chips: ["Ravi Kumar", "Arjun Kumar", "TN-XX-1234"],
      path: ["Ravi Kumar", "Karthik Raj", "Vehicle TN-XX-1234", "Arjun Kumar"],
      evidence: ["CDR-1023", "Vehicle-445"],
      confidence: 84,
      caution: "Potential association only — requires analyst review.",
    };
  }

  if (q.includes("30 days") || q.includes("changed")) {
    return {
      summary:
        "In the last 30 days the network gained 19 new relationships and 2 new clusters. The largest change is increased connectivity around phone XXXXX5678.",
      chips: ["XXXXX5678", "Location A", "Case 247"],
      timeline: [
        { day: "JAN 22", title: "Case 203 registered — 2 person records linked" },
        { day: "FEB 02", title: "Case 247 registered — vehicle overlap detected" },
        { day: "FEB 06", title: "Repeat financial transfer detected" },
      ],
      evidence: ["CDR-1188", "Case-247", "FIN-3345"],
      confidence: 72,
    };
  }

  if (q.includes("share") || q.includes("cases")) {
    return {
      summary:
        "Case 101, Case 156 and Case 203 share five entity attributes. Case 203 and Case 247 share a person and a vehicle record.",
      chips: ["Case 101", "Case 156", "Case 203", "Case 247"],
      path: ["Case 101", "Karthik Raj", "Case 156", "Ravi Kumar", "Case 203"],
      evidence: ["CDR-1023", "Vehicle-445", "GEO-771"],
      confidence: 81,
    };
  }

  if (q.includes("evidence")) {
    return {
      summary:
        "Three source records support this relationship, drawn from the connected investigation systems. Each record is traceable in Evidence & Audit.",
      chips: ["CDR-1023", "Vehicle-445", "Case-203"],
      evidence: ["CDR-1023", "Vehicle-445", "Case-203"],
      confidence: 84,
    };
  }

  return {
    summary:
      "I searched the connected investigation records for that query. Here is the closest intelligence context available in the current dataset.",
    chips: ["Ravi Kumar", "Case 203", "TN-XX-1234"],
    evidence: ["CDR-1023", "Case-203"],
    confidence: 61,
    caution: "Low confidence — narrow the query to an entity, case or time range.",
  };
}
