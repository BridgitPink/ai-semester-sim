import type {
  PlayerKnowledge,
  PlayerKnowledgeDelta,
  PlayerStatDelta,
  PlayerStats,
} from "../types/player";

export const PLAYER_STAT_MIN = 0;
export const PLAYER_STAT_MAX = 100;

export const DEFAULT_PLAYER_KNOWLEDGE: PlayerKnowledge = {
  aiFoundations: 0,
  dataPrompting: 0,
  appliedAIBuilding: 0,
};

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  energy: 70,
  stress: 20,
  focus: 50,
  confidence: 40,
  charisma: 30,
  curiosity: 55,
  discipline: 45,
};

export function clampPlayerValue(value: number): number {
  return Math.max(PLAYER_STAT_MIN, Math.min(PLAYER_STAT_MAX, value));
}

export function applyPlayerStatDelta(current: PlayerStats, delta: PlayerStatDelta): PlayerStats {
  return {
    energy: clampPlayerValue(current.energy + (delta.energy ?? 0)),
    stress: clampPlayerValue(current.stress + (delta.stress ?? 0)),
    focus: clampPlayerValue(current.focus + (delta.focus ?? 0)),
    confidence: clampPlayerValue(current.confidence + (delta.confidence ?? 0)),
    charisma: clampPlayerValue(current.charisma + (delta.charisma ?? 0)),
    curiosity: clampPlayerValue(current.curiosity + (delta.curiosity ?? 0)),
    discipline: clampPlayerValue(current.discipline + (delta.discipline ?? 0)),
  };
}

export function applyPlayerKnowledgeDelta(
  current: PlayerKnowledge,
  delta: PlayerKnowledgeDelta
): PlayerKnowledge {
  return {
    aiFoundations: clampPlayerValue(current.aiFoundations + (delta.aiFoundations ?? 0)),
    dataPrompting: clampPlayerValue(current.dataPrompting + (delta.dataPrompting ?? 0)),
    appliedAIBuilding: clampPlayerValue(
      current.appliedAIBuilding + (delta.appliedAIBuilding ?? 0)
    ),
  };
}

export function getKnowledgeBranchForCourse(courseId: string): keyof PlayerKnowledge {
  switch (courseId) {
    case "ai-foundations":
      return "aiFoundations";
    case "data-prompting-basics":
      return "dataPrompting";
    case "systems-thinking-ai":
      return "appliedAIBuilding";
    default:
      return "aiFoundations";
  }
}

export function toKnowledgeDelta(
  branch: keyof PlayerKnowledge,
  amount: number
): PlayerKnowledgeDelta {
  if (branch === "aiFoundations") return { aiFoundations: amount };
  if (branch === "dataPrompting") return { dataPrompting: amount };
  return { appliedAIBuilding: amount };
}

export interface PlayerDeltaPayload {
  stats?: PlayerStatDelta;
  knowledge?: PlayerKnowledgeDelta;
  projectProgress?: number;
}
