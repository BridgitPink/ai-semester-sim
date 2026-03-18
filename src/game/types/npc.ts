export type CampusLocationId =
  | "dorm"
  | "classroom"
  | "library"
  | "cafe"
  | "campus-store"
  | "campus-food"
  | "lab"
  | "advisor-office";

export type DayType = "class" | "lab" | "off";
export type DayPhase = "academic" | "free";

export type NpcTier = "active" | "ambient" | "staff";
export type NpcInteractionMode = "static-dialogue" | "stateful-dialogue" | "ai-ready";

export type NpcMood = "focused" | "tired" | "social" | "stressed" | "relaxed";

export interface NpcRelationshipState {
  affinity: number; // 0-100
  familiarity: number; // 0-100
}

export type NpcRole =
  | "roommate"
  | "classmate"
  | "student-lab"
  | "student-cafe"
  | "student-library"
  | "advisor"
  | "teacher-classroom"
  | "teacher-library"
  | "worker-cafe"
  | "worker-store"
  | "worker-food"
  | "tech-lab";

export type NpcRoutineTemplateId =
  | "routine-roommate"
  | "routine-classmate"
  | "routine-lab-student"
  | "routine-cafe-student"
  | "routine-library-student"
  | "routine-advisor"
  | "routine-teacher-classroom"
  | "routine-teacher-library"
  | "routine-worker-cafe"
  | "routine-worker-store"
  | "routine-worker-food"
  | "routine-tech-lab";

export type NpcBehaviorProfileId =
  | "behavior-roommate"
  | "behavior-studious"
  | "behavior-social"
  | "behavior-lab"
  | "behavior-library"
  | "behavior-staff";

export type NpcDialogueSetId =
  | "dialogue-roommate"
  | "dialogue-classmate"
  | "dialogue-lab-student"
  | "dialogue-cafe-student"
  | "dialogue-library-student"
  | "dialogue-advisor"
  | "dialogue-teacher"
  | "dialogue-worker"
  | "dialogue-lab-tech";

export interface NpcAiHooks {
  enabled: boolean;
  personaKey?: string;
  memoryKey?: string;
  goalKey?: string;
}

export interface NpcPreferredRoutine {
  classDay: NpcRoutineTemplateId;
  labDay: NpcRoutineTemplateId;
  offDay: NpcRoutineTemplateId;
}

export interface NpcDefinition {
  id: string;
  name: string;
  role: NpcRole;
  tier: NpcTier;
  interactionMode: NpcInteractionMode;

  traits: string[];

  defaultMood: NpcMood;

  preferredRoutine: NpcPreferredRoutine;
  behaviorProfileId: NpcBehaviorProfileId;
  dialogueSetId: NpcDialogueSetId;

  aiHooks: NpcAiHooks;
}

// Backwards-compatible alias: Phase 5 treats every NPC as a unified definition.
export type NpcProfile = NpcDefinition;