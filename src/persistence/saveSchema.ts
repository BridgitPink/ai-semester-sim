import type { InventoryItem } from "../game/types/item";
import type { CourseCompletion } from "../game/types/course";
import type { PlayerKnowledge, PlayerStats, ProjectState } from "../game/types/player";
import type { PracticeHistory, RelationshipState } from "../store/useGameStore";

export const GAME_SAVE_VERSION = 1;

export interface GameSavePayloadV1 {
  version: typeof GAME_SAVE_VERSION;
  savedAt: string;
  semesterId: string;
  day: number;
  week: number;
  dayType: "class" | "lab" | "off";
  mandatoryActivityComplete: boolean;
  freeActionsRemaining: number;
  completedMandatoryActivityId: string | null;
  labActivityStatus: "not-started" | "complete";
  currentLocation:
    | "dorm"
    | "classroom"
    | "library"
    | "cafe"
    | "campus-store"
    | "campus-food"
    | "lab"
    | "advisor-office"
    | null;
  currentScene: "GameScene" | "ClassroomScene";
  currentBuilding:
    | "dorm"
    | "classroom"
    | "library"
    | "cafe"
    | "campus-store"
    | "campus-food"
    | "lab"
    | "advisor-office"
    | null;
  playerPosition: { x: number; y: number } | null;
  knowledge: PlayerKnowledge;
  stats: PlayerStats;
  projectProgress: number;
  wallet: number;
  inventory: InventoryItem[];
  lastWeeklyPayWeek: number | null;
  courseCompletions: CourseCompletion[];
  completedLessons: string[];
  npcRelationshipState: Record<string, RelationshipState>;
  projectState: ProjectState;
  gradebookByCourse: Record<string, unknown>;
  practiceHistory: PracticeHistory;
  lessonWorkbenchBoostMultiplier: number;
  lessonWorkbenchBoostUsesRemaining: number;
}

export type GameSavePayload = GameSavePayloadV1;

export type SavePayloadValidationResult =
  | { ok: true; payload: GameSavePayload }
  | { ok: false; error: "invalid_payload" | "unsupported_version" | "malformed"; message: string };

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function hasV1CoreShape(value: unknown): value is GameSavePayloadV1 {
  if (!isObject(value)) {
    return false;
  }

  return (
    value.version === GAME_SAVE_VERSION &&
    typeof value.savedAt === "string" &&
    typeof value.semesterId === "string" &&
    isFiniteNumber(value.day) &&
    isFiniteNumber(value.week) &&
    typeof value.dayType === "string" &&
    typeof value.mandatoryActivityComplete === "boolean" &&
    isFiniteNumber(value.freeActionsRemaining) &&
    (value.completedMandatoryActivityId === null ||
      typeof value.completedMandatoryActivityId === "string") &&
    typeof value.labActivityStatus === "string" &&
    (value.currentLocation === null || typeof value.currentLocation === "string") &&
    typeof value.currentScene === "string" &&
    (value.currentBuilding === null || typeof value.currentBuilding === "string") &&
    (value.playerPosition === null || isObject(value.playerPosition)) &&
    isObject(value.knowledge) &&
    isObject(value.stats) &&
    isFiniteNumber(value.projectProgress) &&
    isFiniteNumber(value.wallet) &&
    Array.isArray(value.inventory) &&
    (value.lastWeeklyPayWeek === null || isFiniteNumber(value.lastWeeklyPayWeek)) &&
    Array.isArray(value.courseCompletions) &&
    isStringArray(value.completedLessons) &&
    isObject(value.npcRelationshipState) &&
    isObject(value.projectState) &&
    isObject(value.gradebookByCourse) &&
    isObject(value.practiceHistory) &&
    isFiniteNumber(value.lessonWorkbenchBoostMultiplier) &&
    isFiniteNumber(value.lessonWorkbenchBoostUsesRemaining)
  );
}

export function migrateGameSavePayload(raw: unknown): SavePayloadValidationResult {
  if (!isObject(raw)) {
    return { ok: false, error: "malformed", message: "Save payload must be an object." };
  }

  const version = raw.version;
  if (version !== GAME_SAVE_VERSION) {
    return {
      ok: false,
      error: "unsupported_version",
      message: `Unsupported save version: ${String(version)}.`,
    };
  }

  if (!hasV1CoreShape(raw)) {
    return {
      ok: false,
      error: "invalid_payload",
      message: "Save payload failed validation.",
    };
  }

  return { ok: true, payload: raw };
}

export function toStoredSaveRecord(payload: GameSavePayload): {
  save_version: number;
  save_payload: GameSavePayload;
} {
  return {
    save_version: payload.version,
    save_payload: payload,
  };
}
