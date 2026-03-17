/**
 * NPC System (Phase 5)
 *
 * Deterministic, data-driven NPC presence + lightweight AI for MVP.
 *
 * Design goals:
 * - No backend, no LLM APIs
 * - Deterministic (no true randomness)
 * - Tiered behavior on a single unified model
 * - Integrates with Phase 4: dayType + mandatoryActivityComplete + building open rules
 */

import { useGameStore } from "../../store/useGameStore";
import type {
  CampusLocationId,
  DayPhase,
  DayType,
  NpcDefinition,
  NpcMood,
  NpcTier,
} from "../types/npc";
import { npcDefinitions, getNpcDefinitionById } from "../data/npcProfiles";
import { npcRoutineTemplates } from "../data/npcRoutineTemplates";
import { npcBehaviorProfiles } from "../data/npcBehaviorProfiles";
import { npcDialogueSets, pickDialogueLines, type RelationshipBand } from "../data/npcDialogue";
import { getCurrentDayType, isClassroomOpen, isLabOpen } from "./timeSystem";

export interface NpcDecision {
  npcId: string;
  name: string;
  tier: NpcTier;
  locationId: CampusLocationId;
  activity: string;
  mood: NpcMood;
  affinity: number;
  familiarity: number;
}

export interface NpcInteractionView {
  npcId: string;
  name: string;
  subtitle: string;
  mood: NpcMood;
  affinity: number;
  familiarity: number;
  lines: string[];
}

export interface NpcInteractionOutcome {
  relationshipDelta: number;
  familiarityDelta: number;
  statDelta?: {
    stress?: number;
    confidence?: number;
    focus?: number;
    energy?: number;
    knowledge?: number;
    projectProgress?: number;
  };
}

function stableHash(input: string): number {
  // Small, stable string hash (deterministic across sessions).
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp01To100(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getDayPhase(dayType: DayType, mandatoryActivityComplete: boolean): DayPhase {
  if (dayType === "off") return "free";
  return mandatoryActivityComplete ? "free" : "academic";
}

function getRelationshipBand(affinity: number): RelationshipBand {
  if (affinity < 35) return "low";
  if (affinity < 70) return "mid";
  return "high";
}

function isLocationAvailable(locationId: CampusLocationId): boolean {
  if (locationId === "classroom") return isClassroomOpen();
  if (locationId === "lab") return isLabOpen();
  return true;
}

function computeMood(npc: NpcDefinition, seed: string): NpcMood {
  const moods: NpcMood[] = ["focused", "tired", "social", "stressed", "relaxed"];
  const h = stableHash(seed);

  // Bias toward default mood to keep behavior readable and maintainable.
  const shouldDeviate = (h % 5) === 0; // 20% deviation
  if (!shouldDeviate) return npc.defaultMood;

  const idx = h % moods.length;
  return moods[idx];
}

function locationCategoryWeight(locationId: CampusLocationId):
  | "socialWeight"
  | "studyWeight"
  | "labWeight"
  | "restWeight"
  | "routineWeight" {
  switch (locationId) {
    case "cafe":
      return "socialWeight";
    case "library":
    case "classroom":
    case "advisor-office":
      return "studyWeight";
    case "lab":
      return "labWeight";
    case "dorm":
      return "restWeight";
    default:
      return "routineWeight";
  }
}

function scoreCandidate(
  npc: NpcDefinition,
  candidate: { locationId: CampusLocationId; activity: string; base: number },
  mood: NpcMood,
  affinity: number
): number {
  const behavior = npcBehaviorProfiles[npc.behaviorProfileId];
  if (!behavior) return candidate.base;

  const categoryKey = locationCategoryWeight(candidate.locationId);
  let categoryWeight = behavior[categoryKey];

  const moodDelta = behavior.moodToWeightDelta?.[mood]?.[categoryKey] ?? 0;
  categoryWeight += moodDelta;

  // Relationship influences: if you know the NPC better, they're slightly more likely to go somewhere social.
  const relationshipBand = getRelationshipBand(affinity);
  const socialDelta = relationshipBand === "high" ? 0.08 : relationshipBand === "low" ? -0.05 : 0;
  if (categoryKey === "socialWeight") {
    categoryWeight += socialDelta;
  }

  // Routine adherence: multiply base utility.
  const routineWeight = behavior.routineWeight;

  return candidate.base * routineWeight * categoryWeight;
}

export function getNpcRoster(): NpcDefinition[] {
  return npcDefinitions;
}

export function getNpcById(npcId: string): NpcDefinition | undefined {
  return getNpcDefinitionById(npcId);
}

export function decideNpcNow(npcId: string): NpcDecision | null {
  const npc = getNpcById(npcId);
  if (!npc) return null;

  const state = useGameStore.getState();
  const dayType = getCurrentDayType();
  const phase = getDayPhase(dayType, state.mandatoryActivityComplete);

  const rel = state.npcRelationshipState[npcId] ?? { affinity: 50, familiarity: 0 };
  const affinity = rel.affinity;
  const familiarity = rel.familiarity;

  const moodSeed = `${npc.id}:${state.week}:${state.day}:${dayType}:${phase}:${affinity}`;
  const mood = computeMood(npc, moodSeed);

  const routineTemplateId =
    dayType === "class"
      ? npc.preferredRoutine.classDay
      : dayType === "lab"
        ? npc.preferredRoutine.labDay
        : npc.preferredRoutine.offDay;

  const template = npcRoutineTemplates[routineTemplateId];
  if (!template) {
    return {
      npcId: npc.id,
      name: npc.name,
      tier: npc.tier,
      locationId: "dorm",
      activity: "laying low",
      mood,
      affinity,
      familiarity,
    };
  }

  const candidates = template.dayTypeToPhaseCandidates[dayType][phase].filter((c) =>
    isLocationAvailable(c.locationId)
  );

  const safeCandidates =
    candidates.length > 0
      ? candidates
      : npc.tier === "staff"
        ? [{ locationId: "advisor-office" as const, activity: "checking in", base: 50 }]
        : [{ locationId: "dorm" as const, activity: "taking it easy", base: 50 }];

  let best = safeCandidates[0];
  if (npc.tier === "active") {
    const scored = safeCandidates
      .map((c) => ({ c, score: scoreCandidate(npc, c, mood, affinity) }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.c.locationId !== b.c.locationId) return a.c.locationId.localeCompare(b.c.locationId);
        return a.c.activity.localeCompare(b.c.activity);
      });

    // Deterministic tie-break by hash.
    const topScore = scored[0]?.score ?? 0;
    const top = scored.filter((s) => Math.abs(s.score - topScore) < 0.001);
    const pick = top[stableHash(`${npcId}:${state.day}:${phase}`) % top.length];
    best = (pick ?? scored[0]).c;
  }

  // Tightening pass: staff should never end up in dorm in the overworld loop.
  if (npc.tier === "staff" && best.locationId === "dorm") {
    best = { locationId: "advisor-office", activity: "on duty", base: best.base };
  }

  return {
    npcId: npc.id,
    name: npc.name,
    tier: npc.tier,
    locationId: best.locationId,
    activity: best.activity,
    mood,
    affinity,
    familiarity,
  };
}

export function getVisibleOverworldNpcIds(): string[] {
  // MVP requirement: keep total NPCs low (4–6).
  // For now we show the 6 Tier-A (active) NPCs only.
  return npcDefinitions.filter((n) => n.tier === "active").map((n) => n.id).slice(0, 6);
}

export function getNpcInteractionView(npcId: string): NpcInteractionView | null {
  const decision = decideNpcNow(npcId);
  if (!decision) return null;

  const state = useGameStore.getState();
  const dayType = getCurrentDayType();
  const phase = getDayPhase(dayType, state.mandatoryActivityComplete);

  const relationshipBand = getRelationshipBand(decision.affinity);
  const ctx = {
    dayType,
    phase,
    locationId: decision.locationId,
    mood: decision.mood,
    relationshipBand,
    beforeAcademic: phase === "academic",
  };

  const npc = getNpcById(npcId);
  if (!npc) return null;

  const set = npcDialogueSets[npc.dialogueSetId];
  const stableIndex = stableHash(`${npcId}:${state.week}:${state.day}:${decision.locationId}:${decision.mood}:${relationshipBand}`);
  const lines = pickDialogueLines(set, ctx, stableIndex, 2);

  const subtitle = `${decision.mood} • ${decision.activity}`;

  return {
    npcId,
    name: decision.name,
    subtitle,
    mood: decision.mood,
    affinity: decision.affinity,
    familiarity: decision.familiarity,
    lines,
  };
}

export function performNpcInteraction(npcId: string): NpcInteractionOutcome {
  const state = useGameStore.getState();
  const view = getNpcInteractionView(npcId);

  // Deterministic small effects; keep it meaningful but not balance-heavy.
  const mood = view?.mood ?? "relaxed";

  const baseRel = 4;
  const relationshipDelta = mood === "social" ? baseRel + 2 : mood === "stressed" ? baseRel - 1 : baseRel;
  const familiarityDelta = 2;

  // Small stat nudge to reinforce meaning.
  const statDelta: NpcInteractionOutcome["statDelta"] =
    mood === "social"
      ? { stress: -3, confidence: 3 }
      : mood === "focused"
        ? { focus: 2, knowledge: 2 }
        : mood === "tired"
          ? { stress: -1, energy: -1 }
          : mood === "stressed"
            ? { stress: -1, confidence: 1 }
            : { stress: -2 };

  // Apply effects in store.
  state.updateNpcRelationship(npcId, relationshipDelta);

  if (statDelta) {
    const current = state.stats;
    state.updateStats({
      stress: statDelta.stress !== undefined ? clamp01To100(current.stress + statDelta.stress) : current.stress,
      confidence:
        statDelta.confidence !== undefined
          ? clamp01To100(current.confidence + statDelta.confidence)
          : current.confidence,
      focus: statDelta.focus !== undefined ? clamp01To100(current.focus + statDelta.focus) : current.focus,
      energy: statDelta.energy !== undefined ? clamp01To100(current.energy + statDelta.energy) : current.energy,
      knowledge:
        statDelta.knowledge !== undefined ? clamp01To100(current.knowledge + statDelta.knowledge) : current.knowledge,
      projectProgress:
        statDelta.projectProgress !== undefined
          ? clamp01To100(current.projectProgress + statDelta.projectProgress)
          : current.projectProgress,
    });
  }

  return { relationshipDelta, familiarityDelta, statDelta };
}

export const NPC_LOCATION_ANCHORS: Record<CampusLocationId, Array<{ dx: number; dy: number }>> = {
  dorm: [
    { dx: -70, dy: -30 },
    { dx: 70, dy: -25 },
    { dx: -65, dy: 35 },
    { dx: 65, dy: 35 },
  ],
  "advisor-office": [
    { dx: -60, dy: -20 },
    { dx: 60, dy: -20 },
    { dx: -55, dy: 30 },
  ],
  classroom: [
    { dx: -90, dy: -35 },
    { dx: 90, dy: -35 },
    { dx: -85, dy: 45 },
    { dx: 85, dy: 45 },
  ],
  library: [
    { dx: -75, dy: -25 },
    { dx: 75, dy: -25 },
    { dx: -70, dy: 35 },
    { dx: 70, dy: 35 },
  ],
  cafe: [
    { dx: -80, dy: -25 },
    { dx: 80, dy: -25 },
    { dx: -75, dy: 35 },
    { dx: 75, dy: 35 },
    { dx: 0, dy: 45 },
  ],
  lab: [
    { dx: -85, dy: -30 },
    { dx: 85, dy: -30 },
    { dx: -80, dy: 40 },
    { dx: 80, dy: 40 },
  ],
};

export function pickAnchorSlotIndex(npcId: string, locationId: CampusLocationId): number {
  const state = useGameStore.getState();
  const dayType = getCurrentDayType();
  const phase = getDayPhase(dayType, state.mandatoryActivityComplete);
  const anchors = NPC_LOCATION_ANCHORS[locationId];
  const h = stableHash(`${npcId}:${state.week}:${state.day}:${dayType}:${phase}:${locationId}`);
  return anchors.length === 0 ? 0 : h % anchors.length;
}
