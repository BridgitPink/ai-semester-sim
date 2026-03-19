import { create } from "zustand";
import type {
  AssistantProjectPhase,
  ProjectCapabilitiesState,
  ProjectCapabilityKey,
  PlayerKnowledge,
  PlayerKnowledgeDelta,
  ProjectMilestoneState,
  ProjectProgressCategoryKey,
  ProjectProgressState,
  PlayerStatDelta,
  PlayerStats,
  ProjectState,
} from "../game/types/player";
import type { BasketItem, EconomyActionResult, InventoryItem } from "../game/types/item";
import type { Semester } from "../game/types/semester";
import type { CourseCompletion, CourseId, Lesson } from "../game/types/course";
import type { InteriorObject, ObjectInteractionType } from "../game/types/interiorObject";
import type {
  Assessment,
  AssessmentAnswerValue,
  AssessmentAnswers,
  AssessmentResult,
  GradedAttemptRecord,
  PracticeAttemptRecord,
} from "../game/types/assessment";
import { getDefaultAssessmentWeight, scoreAssessment, validateAssessment } from "../game/systems/assessmentSystem";
import {
  applyPlayerKnowledgeDelta,
  applyPlayerStatDelta,
  clampPlayerValue,
  DEFAULT_PLAYER_KNOWLEDGE,
  DEFAULT_PLAYER_STATS,
  type PlayerDeltaPayload,
} from "../game/systems/playerStatSystem";
import {
  STARTING_WALLET,
  WEEKLY_PAY_AMOUNT,
  addToBasket,
  addToInventory,
  calculateBasketTotal,
  canAffordAmount,
  purchaseBasketItems,
  purchaseDirect,
  removeFromBasket,
  removeFromInventory,
  shouldGrantWeeklyPay as isEligibleForWeeklyPay,
} from "../game/systems/economySystem";
import {
  applyItemEffects,
  canUseInventoryItemById,
  consumeInventoryItemUnit,
  getItemUsePreview as getItemUsePreviewText,
  getUsableInventoryEntries,
  hasStatDelta,
} from "../game/systems/itemUseSystem";
import { getItemEffects } from "../game/data/items/catalog";
import { canUseWorkbench } from "../game/systems/playerSelectors";
import {
  getActiveLabProjectCategory,
  getWorkbenchProgressGain,
} from "../game/systems/projectSystem";
import {
  ASSISTANT_PROJECT_DEFINITIONS,
  getAssistantProjectDefinition,
} from "../game/data/projects";
import type { AssistantProjectDefinition } from "../game/types/project";

const PROJECT_PROGRESS_KEYS: ProjectProgressCategoryKey[] = [
  "prompting",
  "retrieval",
  "knowledgeBase",
  "evaluation",
  "interface",
];

function createDefaultProjectProgress(): ProjectProgressState {
  return {
    overall: 0,
    prompting: 0,
    retrieval: 0,
    knowledgeBase: 0,
    evaluation: 0,
    interface: 0,
  };
}

function createDefaultProjectCapabilities(): ProjectCapabilitiesState {
  return {
    hasPromptTemplates: false,
    hasKnowledgeSource: false,
    hasRetrievalLayer: false,
    hasEmbeddings: false,
    hasVectorDb: false,
    hasDocumentUpload: false,
    hasDashboard: false,
    hasEvaluationMetrics: false,
  };
}

function computeProjectOverallProgress(
  progress: ProjectProgressState,
  semester: Semester | null
): number {
  const categories = semester?.finalProjectTemplate.progressCategories;
  if (!categories || categories.length === 0) {
    const total = PROJECT_PROGRESS_KEYS.reduce((sum, key) => sum + progress[key], 0);
    return Math.round(total / PROJECT_PROGRESS_KEYS.length);
  }

  const totalWeight = categories.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
  if (totalWeight <= 0) {
    const total = PROJECT_PROGRESS_KEYS.reduce((sum, key) => sum + progress[key], 0);
    return Math.round(total / PROJECT_PROGRESS_KEYS.length);
  }

  const weightedTotal = categories.reduce((sum, item) => {
    const safeWeight = Math.max(0, item.weight);
    return sum + progress[item.id] * safeWeight;
  }, 0);
  return Math.round(weightedTotal / totalWeight);
}

function computeProjectMilestones(
  semester: Semester | null,
  progress: ProjectProgressState,
  capabilities: ProjectCapabilitiesState,
  previousMilestones: ProjectMilestoneState[]
): ProjectMilestoneState[] {
  const templateMilestones = semester?.finalProjectTemplate.milestones ?? [];
  return templateMilestones.map((milestone) => {
    const hasOverall =
      milestone.requiredOverallProgress === undefined ||
      progress.overall >= milestone.requiredOverallProgress;
    const hasCapabilities =
      !milestone.requiredCapabilities ||
      milestone.requiredCapabilities.every((key) => capabilities[key]);
    const existing = previousMilestones.find((item) => item.id === milestone.id);
    return {
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      requiredOverallProgress: milestone.requiredOverallProgress,
      requiredCapabilities: milestone.requiredCapabilities,
      isCompleted: (existing?.isCompleted ?? false) || (hasOverall && hasCapabilities),
    };
  });
}

function computeRuleDrivenCapabilities(
  semester: Semester | null,
  progress: ProjectProgressState,
  milestones: ProjectMilestoneState[]
): Partial<ProjectCapabilitiesState> {
  const rules = semester?.finalProjectTemplate.capabilityRules ?? [];
  if (rules.length === 0) {
    return {};
  }

  const completedMilestoneIds = new Set(
    milestones.filter((item) => item.isCompleted).map((item) => item.id)
  );

  const enabledByRules: Partial<ProjectCapabilitiesState> = {};
  rules.forEach((rule) => {
    const meetsCategoryMinimums =
      !rule.requiredCategoryMinimums ||
      Object.entries(rule.requiredCategoryMinimums).every(([key, min]) => {
        const categoryKey = key as ProjectProgressCategoryKey;
        return progress[categoryKey] >= (min ?? 0);
      });
    const meetsOverall =
      rule.requiredOverallProgress === undefined ||
      progress.overall >= rule.requiredOverallProgress;
    const meetsMilestones =
      !rule.requiredMilestoneIds ||
      rule.requiredMilestoneIds.every((id) => completedMilestoneIds.has(id));

    enabledByRules[rule.capability] = meetsCategoryMinimums && meetsOverall && meetsMilestones;
  });

  return enabledByRules;
}

function getFirstAssistantProjectId() {
  return ASSISTANT_PROJECT_DEFINITIONS[0]?.id ?? null;
}

function getFirstAssistantProjectDefinition(): AssistantProjectDefinition {
  return (
    ASSISTANT_PROJECT_DEFINITIONS[0] ?? {
      id: "ai-study-helper",
      title: "AI Study Helper",
      shortDescription: "Build an AI assistant-style study support product.",
      domainFocus: "Academic support",
      outputType: "Structured assistant output",
      learningGoals: [],
      phases: [],
      finalDeliverableDescription: "",
      lessonPhaseGuidance: {},
    }
  );
}

function getPhaseCompletionTarget(
  definition: AssistantProjectDefinition | null,
  phase: AssistantProjectPhase
): number {
  const phaseConfig = definition?.phases.find((item) => item.id === phase);
  return phaseConfig?.completionOverallProgress ?? 100;
}

function createProjectStateFromDefinition(
  projectDefinition: AssistantProjectDefinition,
  semester: Semester | null
): ProjectState {
  const milestones = semester?.finalProjectTemplate.milestones ?? [];
  return {
    id: projectDefinition.id,
    name: projectDefinition.title,
    description: projectDefinition.shortDescription,
    progress: createDefaultProjectProgress(),
    capabilities: createDefaultProjectCapabilities(),
    milestones: milestones.map((milestone) => ({
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      requiredOverallProgress: milestone.requiredOverallProgress,
      requiredCapabilities: milestone.requiredCapabilities,
      isCompleted: false,
    })),
    phase: "selected",
    phaseProgress: 0,
    completedPhaseMilestoneIds: [],
    submitted: false,
    workbenchSubmissions: 0,
    lastUpdatedAt: null,
    unlockedFeatures: [],
    selectedFeatures: [],
  };
}

function createProjectStatesFromDefinitions(
  semester: Semester | null
): Record<string, ProjectState> {
  return ASSISTANT_PROJECT_DEFINITIONS.reduce<Record<string, ProjectState>>((acc, definition) => {
    acc[definition.id] = createProjectStateFromDefinition(definition, semester);
    return acc;
  }, {});
}

function getProjectStateById(
  projectStatesById: Record<string, ProjectState>,
  projectId: string | null
): ProjectState | null {
  if (!projectId) {
    return null;
  }
  return projectStatesById[projectId] ?? null;
}

function getSafeActiveProjectId(
  projectStatesById: Record<string, ProjectState>,
  selectedProjectId: string | null
): string | null {
  if (selectedProjectId && projectStatesById[selectedProjectId]) {
    return selectedProjectId;
  }
  return getFirstAssistantProjectId();
}

async function saveCheckpointAfterSleep() {
  try {
    const [{ createGameSavePayload }, { saveGameToServer }] = await Promise.all([
      import("../persistence/storeSaveAdapter"),
      import("../persistence/persistenceService"),
    ]);

    const payload = createGameSavePayload();
    if (!payload) {
      return;
    }

    await saveGameToServer(payload);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[persistence] Failed to save sleep checkpoint.", error);
    }
  }
}

export type LocationId =
  | "dorm"
  | "classroom"
  | "library"
  | "cafe"
  | "campus-store"
  | "campus-food"
  | "lab"
  | "advisor-office"
  | null;
type PanelType =
  | "none"
  | "intro"
  | "location"
  | "npc"
  | "course"
  | "project"
  | "object"
  | "inventory";
type SceneKey = "GameScene" | "ClassroomScene";
type DayType = "class" | "lab" | "off";
type FreeActionType = "rest" | "social" | "project" | "study" | "skip";

type LessonSessionKind = "official" | "study";
type LessonSessionPhase = "intro" | "content" | "assessment" | "results";

type OpenOfficialLessonSessionOptions = {
  startPhase?: LessonSessionPhase;
};

interface LessonSessionState {
  kind: LessonSessionKind;
  phase: LessonSessionPhase;
  lessonId: string;
  assessmentId?: string;
  answers: AssessmentAnswers;
  result?: AssessmentResult;
  source?: "teacher-desk" | "course-panel" | "study";
}

interface CourseGradebook {
  courseId: CourseId;
  gradedAttempts: Record<string, GradedAttemptRecord>; // assessmentId -> record
}

export interface PracticeHistory {
  practiceAttempts: Record<string, PracticeAttemptRecord>; // assessmentId -> record
}

export interface RelationshipState {
  affinity: number; // 0-100
  familiarity: number; // 0-100
}

interface WorkbenchSubmissionResult {
  success: boolean;
  message: string;
  responseText?: string;
  category?: ProjectProgressCategoryKey;
  progressGain?: number;
}

interface WorkbenchSubmissionState {
  message: string | null;
  responseText: string | null;
  category: ProjectProgressCategoryKey | null;
  progressGain: number;
}

type ObjectModalVariant =
  | "placeholder"
  | "info"
  | "extra-credit"
  | "lab"
  | "project-workbench"
  | "direct-purchase"
  | "shelf-browse"
  | "checkout";

type ProjectPanelMode = "board" | "status";

interface ObjectModalContext {
  variant: ObjectModalVariant;
  interactionType: ObjectInteractionType;
  object: InteriorObject;
  title?: string;
  subtitle?: string;
  body?: string;
}

interface PlayerPosition {
  x: number;
  y: number;
}

interface GameStore {
  // Progression
  day: number;
  week: number;
  currentSemester: Semester | null;
  dayType: DayType; // class | lab | off
  mandatoryActivityComplete: boolean; // true if mandatory lesson/lab completed for current day
  freeActionsRemaining: number; // 0-3, decrements when free action used
  sleepConfirmationOpen: boolean; // true when sleep confirmation modal should show
  completedMandatoryActivityId: string | null; // lesson or lab id that satisfied today's mandatory activity
  labActivityStatus: "not-started" | "complete"; // current day's lab activity status (Thu only)
  
  // Location & UI
  currentLocation: LocationId;
  activePanel: PanelType;
  selectedNpcId: string | null;
  menuOpen: boolean;

  // Object interaction modal (placeholder/info/extra-credit/lab)
  objectModal: ObjectModalContext | null;
  
  // Lesson modal
  currentLesson: Lesson | null;
  lessonModalOpen: boolean;

  // Lesson session flow (official lesson or study session)
  lessonSession: LessonSessionState | null;

  // Grade/progression records
  gradebookByCourse: Partial<Record<CourseId, CourseGradebook>>;
  practiceHistory: PracticeHistory;
  
  // Scene & world state
  currentScene: SceneKey;
  currentBuilding: LocationId; // which building is the player in (for ClassroomScene context)
  playerPosition: PlayerPosition | null; // saved position for returning to GameScene
  
  // Player state
  knowledge: PlayerKnowledge;
  stats: PlayerStats;
  projectProgress: number;
  wallet: number;
  inventory: InventoryItem[];
  storeBasket: BasketItem[];
  lastWeeklyPayWeek: number | null;
  
  // Course & learning progress
  courseCompletions: CourseCompletion[];
  completedLessons: string[];
  
  // Relationships & projects
  npcRelationshipState: Record<string, RelationshipState>; // npcId -> relationship state
  selectedProjectId: string | null;
  projectStatesById: Record<string, ProjectState>;
  projectState: ProjectState;
  projectPanelMode: ProjectPanelMode;
  workbenchSubmission: WorkbenchSubmissionState;
  lessonWorkbenchBoostMultiplier: number;
  lessonWorkbenchBoostUsesRemaining: number;
  
  // Actions
  setLocation: (location: LocationId) => void;
  openIntroPanel: () => void;
  openLocationPanel: (location: LocationId) => void;
  openNpcPanel: (npcId: string) => void;
  openCoursePanel: () => void;
  openProjectPanel: (mode?: ProjectPanelMode) => void;
  openInventoryPanel: () => void;
  closePanel: () => void;
  toggleMenu: () => void;

  // Object modal actions
  openObjectModal: (ctx: ObjectModalContext) => void;
  clearObjectModal: () => void;
  
  // Lesson modal actions
  openLessonModal: (lesson: Lesson) => void;
  closeLessonModal: () => void;

  // Lesson session actions
  openOfficialLessonSession: (
    lessonId: string,
    source?: LessonSessionState["source"],
    options?: OpenOfficialLessonSessionOptions
  ) => void;
  openStudyLessonSession: (lessonId: string) => void;
  setLessonSessionPhase: (phase: LessonSessionPhase) => void;
  setAssessmentAnswer: (questionId: string, value: AssessmentAnswerValue) => void;
  submitLessonSessionAssessment: () => { success: boolean; message: string };
  getCourseGradePercent: (courseId: CourseId) => number | null;
  
  // Scene & building actions
  enterBuilding: (buildingId: LocationId, playerPos: PlayerPosition) => void;
  exitBuilding: () => void;
  
  advanceWeek: () => void;
  completeMandatoryActivity: (activityId: string) => void;
  skipMandatoryActivityForToday: () => void;
  completeLabActivityForToday: () => void;
  openSleepConfirmation: () => void;
  confirmSleep: (energyRecovery: number) => void;
  cancelSleepConfirmation: () => void;
  advanceToNextDay: () => void;
  useFreeAction: (actionType: FreeActionType, effects: PlayerDeltaPayload) => void;
  
  addCompletedLesson: (lessonId: string, courseId: string) => void;
  applyLessonWorkbenchHooks: (lessonId: string) => void;
  clearWorkbenchSubmissionFeedback: () => void;
  submitProjectWorkbenchInput: (inputText: string) => WorkbenchSubmissionResult;
  canAfford: (amount: number) => boolean;
  getBasketTotal: () => number;
  addItemToInventory: (itemId: string, quantity?: number) => EconomyActionResult;
  removeItemFromInventory: (itemId: string, quantity?: number) => EconomyActionResult;
  addItemToBasket: (itemId: string, quantity?: number) => EconomyActionResult;
  removeItemFromBasket: (itemId: string, quantity?: number) => EconomyActionResult;
  clearBasket: () => void;
  purchaseDirectItem: (itemId: string, quantity?: number) => EconomyActionResult;
  purchaseBasket: () => EconomyActionResult;
  canUseItem: (itemId: string) => boolean;
  getUsableInventoryItems: () => InventoryItem[];
  getItemUsePreview: (itemId: string) => string | null;
  useInventoryItem: (itemId: string) => EconomyActionResult;
  shouldGrantWeeklyPay: (newDay: number, newWeek: number) => boolean;
  grantWeeklyPayIfEligible: (newDay: number, newWeek: number) => boolean;
  applyPlayerStatDelta: (delta: PlayerStatDelta) => void;
  applyPlayerKnowledgeDelta: (delta: PlayerKnowledgeDelta) => void;
  applyPlayerDeltas: (payload: PlayerDeltaPayload) => void;
  applyProjectProgressDelta: (
    delta: Partial<Record<ProjectProgressCategoryKey, number>>,
    capabilityUnlocks?: ProjectCapabilityKey[]
  ) => void;
  setActiveProject: (projectId: string) => { success: boolean; message: string };
  advanceActiveProjectPhaseFromWorkbench: () => {
    advanced: boolean;
    phase: AssistantProjectPhase | null;
    message: string;
  };
  setProjectCapability: (capability: ProjectCapabilityKey, enabled: boolean) => void;
  recomputeProjectState: () => void;
  markCourseMilestoneUnlocked: (courseId: string) => void;
  setProjectProgress: (value: number) => void;
  unlockProjectFeature: (featureId: string) => void;
  setProjectState: (state: Partial<ProjectState>) => void;
  updateNpcRelationship: (npcId: string, delta: number) => void;
  
  initializeSemester: (semester: Semester) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Progression state
  day: 1,
  week: 1,
  currentSemester: null,
  dayType: "class" as DayType, // Monday = class
  mandatoryActivityComplete: false,
  freeActionsRemaining: 3,
  sleepConfirmationOpen: false,
  completedMandatoryActivityId: null,
  labActivityStatus: "not-started",
  
  // Location & UI state
  currentLocation: null,
  activePanel: "none",
  selectedNpcId: null,
  menuOpen: false,

  objectModal: null,
  
  // Lesson modal state
  currentLesson: null,
  lessonModalOpen: false,
  lessonSession: null,
  gradebookByCourse: {},
  practiceHistory: {
    practiceAttempts: {},
  },
  
  // Scene & world state
  currentScene: "GameScene",
  currentBuilding: null,
  playerPosition: null,
  
  // Player stats
  knowledge: DEFAULT_PLAYER_KNOWLEDGE,
  stats: DEFAULT_PLAYER_STATS,
  projectProgress: 0,
  wallet: STARTING_WALLET,
  inventory: [],
  storeBasket: [],
  lastWeeklyPayWeek: null,
  
  // Course & learning state
  courseCompletions: [],
  completedLessons: [],
  
  // Relationship & project state
  npcRelationshipState: {},
  selectedProjectId: null,
  projectStatesById: createProjectStatesFromDefinitions(null),
  projectState: createProjectStateFromDefinition(getFirstAssistantProjectDefinition(), null),
  projectPanelMode: "status",
  workbenchSubmission: {
    message: null,
    responseText: null,
    category: null,
    progressGain: 0,
  },
  lessonWorkbenchBoostMultiplier: 1,
  lessonWorkbenchBoostUsesRemaining: 0,
  
  // Action: movement & location
  setLocation: (location) => set({ currentLocation: location }),
  
  // Action: panels
  openIntroPanel: () =>
    set({
      activePanel: "intro",
      selectedNpcId: null,
      sleepConfirmationOpen: false,
      objectModal: null,
    }),
  openLocationPanel: (location) =>
    set({
      currentLocation: location,
      activePanel: "location",
      selectedNpcId: null,
    }),
  openNpcPanel: (npcId) =>
    set({
      activePanel: "npc",
      selectedNpcId: npcId,
    }),
  openCoursePanel: () =>
    set({
      activePanel: "course",
      selectedNpcId: null,
    }),
  openProjectPanel: (mode = "status") =>
    set({
      activePanel: "project",
      selectedNpcId: null,
      projectPanelMode: mode,
    }),
  openInventoryPanel: () =>
    set({
      activePanel: "inventory",
      selectedNpcId: null,
      sleepConfirmationOpen: false,
      objectModal: null,
    }),
  closePanel: () =>
    set({
      activePanel: "none",
      selectedNpcId: null,
      sleepConfirmationOpen: false,
      objectModal: null,
    }),
  
  // Action: menu
  toggleMenu: () => {
    const state = get();
    set({ menuOpen: !state.menuOpen });
  },

  openObjectModal: (ctx) =>
    set({
      activePanel: "object",
      objectModal: ctx,
      sleepConfirmationOpen: false,
      workbenchSubmission: {
        message: null,
        responseText: null,
        category: null,
        progressGain: 0,
      },
    }),

  clearObjectModal: () =>
    set({
      objectModal: null,
      activePanel: "none",
      workbenchSubmission: {
        message: null,
        responseText: null,
        category: null,
        progressGain: 0,
      },
    }),
  
  // Action: lesson modal
  openLessonModal: (lesson) => {
    // Preserve existing call sites, but treat this as an official lesson session.
    get().openOfficialLessonSession(lesson.id, "course-panel");
  },
  closeLessonModal: () =>
    set({
      currentLesson: null,
      lessonModalOpen: false,
      lessonSession: null,
    }),

  openOfficialLessonSession: (lessonId, source = "teacher-desk", options) => {
    const state = get();
    const lesson = state.currentSemester?.courses
      .flatMap((course) => course.lessons)
      .find((item) => item.id === lessonId);

    if (!lesson) {
      console.warn(`Lesson not found: ${lessonId}`);
      return;
    }

    // Clear interaction modal state to avoid overlapping overlays.
    set({
      activePanel: "none",
      objectModal: null,
      sleepConfirmationOpen: false,
      currentLesson: lesson,
      lessonModalOpen: true,
      lessonSession: {
        kind: "official",
        phase: options?.startPhase ?? "intro",
        lessonId,
        answers: {},
        source,
      },
    });
  },

  openStudyLessonSession: (lessonId) => {
    const state = get();
    const lesson = state.currentSemester?.courses
      .flatMap((course) => course.lessons)
      .find((item) => item.id === lessonId);

    if (!lesson) {
      console.warn(`Lesson not found: ${lessonId}`);
      return;
    }

    if (!state.completedLessons.includes(lessonId)) {
      console.warn(`Study disallowed for incomplete lesson: ${lessonId}`);
      return;
    }

    set({
      activePanel: "none",
      objectModal: null,
      sleepConfirmationOpen: false,
      currentLesson: lesson,
      lessonModalOpen: true,
      lessonSession: {
        kind: "study",
        phase: "intro",
        lessonId,
        answers: {},
        source: "study",
      },
    });
  },

  setLessonSessionPhase: (phase) => {
    const state = get();
    if (!state.lessonSession) return;
    set({ lessonSession: { ...state.lessonSession, phase } });
  },

  setAssessmentAnswer: (questionId, value) => {
    const state = get();
    if (!state.lessonSession) return;
    set({
      lessonSession: {
        ...state.lessonSession,
        answers: {
          ...state.lessonSession.answers,
          [questionId]: value,
        },
      },
    });
  },

  submitLessonSessionAssessment: () => {
    const state = get();
    const session = state.lessonSession;
    if (!session) {
      return { success: false, message: "No active lesson session." };
    }

    const lesson = state.currentSemester?.courses
      .flatMap((course) => course.lessons)
      .find((item) => item.id === session.lessonId);
    if (!lesson) {
      return { success: false, message: "Lesson data not found." };
    }

    const assessment: Assessment | undefined =
      session.kind === "official" ? lesson.gradedAssessment : lesson.studyExtension?.practiceAssessment;

    const validation = validateAssessment(assessment);
    if (!assessment || !validation.isValid) {
      // Fail gracefully: show a safe fallback results state.
      set({
        lessonSession: {
          ...session,
          phase: "results",
          result: {
            assessmentId: assessment?.id ?? "missing",
            mode: session.kind === "official" ? "graded" : "practice",
            breakdown: { correctCount: 0, totalCount: 0, scorePercent: 0 },
            passed: undefined,
            revealSolutions: true,
            submittedAt: Date.now(),
          },
        },
      });
      return { success: false, message: "Assessment unavailable." };
    }

    if (session.kind === "official" && assessment.mode !== "graded") {
      return { success: false, message: "Official sessions require graded assessments." };
    }
    if (session.kind === "study" && assessment.mode !== "practice") {
      return { success: false, message: "Study sessions require practice assessments." };
    }

    // One-attempt lock for graded.
    if (session.kind === "official") {
      const existing = state.gradebookByCourse[assessment.courseId]?.gradedAttempts?.[assessment.id];
      if (existing) {
        set({
          lessonSession: {
            ...session,
            phase: "results",
            assessmentId: assessment.id,
            result: existing.result,
          },
        });
        return { success: true, message: "Assessment already submitted." };
      }
    }

    const result = scoreAssessment(assessment, session.answers, {
      revealSolutions: true,
      submittedAt: Date.now(),
    });

    if (session.kind === "official") {
      const weight = getDefaultAssessmentWeight(assessment);
      const record: GradedAttemptRecord = {
        assessmentId: assessment.id,
        courseId: assessment.courseId,
        lessonId: assessment.lessonId,
        week: assessment.week,
        type: assessment.type,
        weight,
        result,
      };

      const existingBook = state.gradebookByCourse[assessment.courseId];
      const nextBook: CourseGradebook = {
        courseId: assessment.courseId,
        gradedAttempts: {
          ...(existingBook?.gradedAttempts ?? {}),
          [assessment.id]: record,
        },
      };

      set({
        gradebookByCourse: {
          ...state.gradebookByCourse,
          [assessment.courseId]: nextBook,
        },
      });
    } else {
      const record: PracticeAttemptRecord = {
        assessmentId: assessment.id,
        courseId: assessment.courseId,
        lessonId: assessment.lessonId,
        week: assessment.week,
        type: assessment.type,
        result,
      };

      set({
        practiceHistory: {
          practiceAttempts: {
            ...state.practiceHistory.practiceAttempts,
            [assessment.id]: record,
          },
        },
      });
    }

    set({
      lessonSession: {
        ...session,
        phase: "results",
        assessmentId: assessment.id,
        result,
      },
    });

    return { success: true, message: "Assessment submitted." };
  },

  getCourseGradePercent: (courseId) => {
    const state = get();
    const attempts = state.gradebookByCourse[courseId]?.gradedAttempts;
    if (!attempts) return null;

    const rows = Object.values(attempts);
    if (rows.length === 0) return null;

    const totalWeight = rows.reduce((sum, row) => sum + Math.max(0, row.weight ?? 0), 0);
    if (totalWeight <= 0) return null;

    const weighted = rows.reduce(
      (sum, row) => sum + row.result.breakdown.scorePercent * Math.max(0, row.weight ?? 0),
      0
    );
    return Math.round(weighted / totalWeight);
  },
  
  // Action: scene & building transitions
  enterBuilding: (buildingId, playerPos) =>
    set({
      currentScene: "ClassroomScene",
      currentBuilding: buildingId,
      playerPosition: playerPos,
      activePanel: "none", // close any open panels
    }),
  exitBuilding: () =>
    set({
      currentScene: "GameScene",
      currentBuilding: null,
      playerPosition: null,
      activePanel: "none",
      sleepConfirmationOpen: false,
      objectModal: null,
    }),
  
  // Action: progression
  advanceWeek: () => {
    const state = get();
    const newWeek = state.week + 1;
    const newDay = 1;
    
    // Check if semester ends (MVP: 8 weeks total)
    if (newWeek > 8) {
      console.log("Semester ended!");
      return; // Handle semester end in a system
    }
    
    set({ week: newWeek, day: newDay });
  },
  
  // Mark mandatory activity (lesson or lab) as complete for the day
  completeMandatoryActivity: (activityId) => {
    set({
      mandatoryActivityComplete: true,
      completedMandatoryActivityId: activityId,
    });
  },

  // Skip today's mandatory academic activity with consequences
  // This exists to keep sleep as the only day-advance action while still allowing the player to opt out.
  skipMandatoryActivityForToday: () => {
    const state = get();
    set({
      mandatoryActivityComplete: true,
      completedMandatoryActivityId: "skipped",
    });

    // Consequences (kept simple and clearly negative)
    state.applyPlayerDeltas({
      stats: {
        stress: 12,
        confidence: -10,
        discipline: -3,
      },
      knowledge: {
        aiFoundations: -2,
      },
    });
  },

  // Complete today's lab activity (Thu)
  completeLabActivityForToday: () => {
    const state = get();
    const lessonBoostUses = state.currentSemester?.finalProjectTemplate.workbenchConfig.lessonBoostUses ?? 1;
    set({
      labActivityStatus: "complete",
      lessonWorkbenchBoostMultiplier: 1.1,
      lessonWorkbenchBoostUsesRemaining: Math.max(1, lessonBoostUses),
    });
    state.completeMandatoryActivity("lab-build-study-helper");

    // Small, positive reward
    state.applyPlayerDeltas({
      knowledge: {
        appliedAIBuilding: 10,
      },
      stats: {
        focus: -5,
        confidence: 2,
      },
      projectProgress: 8,
    });
  },
  
  // Open sleep confirmation modal
  openSleepConfirmation: () => {
    set({ sleepConfirmationOpen: true, activePanel: "object", objectModal: null });
  },
  
  // Close sleep confirmation modal without advancing
  cancelSleepConfirmation: () => {
    set({ sleepConfirmationOpen: false, activePanel: "none" });
  },
  
  // Confirm sleep: apply energy recovery, advance day, reset daily state
  confirmSleep: (energyRecovery) => {
    const state = get();

    // Advance to next day
    state.advanceToNextDay();

    // Update energy and close modal
    set({ sleepConfirmationOpen: false, activePanel: "none" });
    state.applyPlayerStatDelta({ energy: energyRecovery });

    // Sleep is a critical progression checkpoint, so persist immediately.
    void saveCheckpointAfterSleep();
  },
  
  // Advance to next day: increment day, or week+day if week ends
  advanceToNextDay: () => {
    const state = get();
    let newDay = state.day + 1;
    let newWeek = state.week;
    
    // Determine day type for new day
    const getDayType = (d: number): DayType => {
      const dayOfWeek = ((d - 1) % 7) + 1; // 1-7 (Mon-Sun)
      if (dayOfWeek >= 1 && dayOfWeek <= 3) return "class"; // Mon-Wed
      if (dayOfWeek === 4) return "lab"; // Thu
      return "off"; // Fri-Sun
    };
    
    // End of week? Advance to next week
    if (newDay > 7) {
      newDay = 1;
      newWeek = state.week + 1;
      
      // Semester ends after week 8
      if (newWeek > 8) {
        console.log("✓ Semester ended!");
        newWeek = 8; // Clamp to prevent further advancement
      }
    }

    state.grantWeeklyPayIfEligible(newDay, newWeek);
    
    // Reset daily state for new day
    const newDayType = getDayType(newDay);
    set({
      day: newDay,
      week: newWeek,
      dayType: newDayType,
      mandatoryActivityComplete: false,
      freeActionsRemaining: 3,
      completedMandatoryActivityId: null,
      labActivityStatus: "not-started",
      lessonWorkbenchBoostMultiplier: 1,
      lessonWorkbenchBoostUsesRemaining: 0,
    });
    
    console.log(`✓ Advanced to Week ${newWeek} Day ${newDay} (${newDayType})`);
  },
  
  // Use a free action and apply its effects
  useFreeAction: (actionType, effects) => {
    const state = get();
    
    // Check if free actions available
    if (state.freeActionsRemaining <= 0) {
      console.warn("No free actions remaining for today");
      return;
    }
    
    // Apply effects to player profile
    state.applyPlayerDeltas(effects);

    const freeActionRule = state.currentSemester?.finalProjectTemplate.freeActionProgressRules.find(
      (rule) => rule.actionType === actionType
    );
    if (freeActionRule) {
      state.applyProjectProgressDelta(freeActionRule.progressDelta);
    }
    
    // Decrement free actions
    set({ freeActionsRemaining: state.freeActionsRemaining - 1 });
    
    console.log(`✓ Free action used: ${actionType}. Remaining: ${state.freeActionsRemaining - 1}`);
  },
  
  // Action: learning & courses
  addCompletedLesson: (lessonId, courseId) => {
    const state = get();
    
    if (state.completedLessons.includes(lessonId)) {
      return; // already completed
    }
    
    // Add the lesson
    const newCompletedLessons = [...state.completedLessons, lessonId];
    
    // Update course completion
    const courseCompletion = state.courseCompletions.find(
      (c) => c.courseId === courseId
    );
    if (courseCompletion) {
      const newCompletions = state.courseCompletions.map((c) =>
        c.courseId === courseId
          ? {
              ...c,
              lessonsCompleted: [...c.lessonsCompleted, lessonId],
              progressPercent: Math.round(
                ((c.lessonsCompleted.length + 1) /
                  (state.currentSemester?.courses.find((co) => co.id === courseId)?.lessons.length || 1)) *
                100
              ),
              isCompleted:
                c.lessonsCompleted.length + 1 ===
                state.currentSemester?.courses.find((co) => co.id === courseId)?.lessons.length,
            }
          : c
      );
      
      set({ completedLessons: newCompletedLessons, courseCompletions: newCompletions });
    }
  },

  applyLessonWorkbenchHooks: (lessonId) => {
    const state = get();
    const template = state.currentSemester?.finalProjectTemplate;
    const lesson = state.currentSemester?.courses
      .flatMap((course) => course.lessons)
      .find((item) => item.id === lessonId);

    if (!lesson?.workbenchHooks) return;

    const hookMultiplier = Math.max(1, lesson.workbenchHooks.progressMultiplier ?? 1);
    if (hookMultiplier <= 1) return;

    set({
      lessonWorkbenchBoostMultiplier: hookMultiplier,
      lessonWorkbenchBoostUsesRemaining: template?.workbenchConfig.lessonBoostUses ?? 1,
    });
  },

  clearWorkbenchSubmissionFeedback: () => {
    set({
      workbenchSubmission: {
        message: null,
        responseText: null,
        category: null,
        progressGain: 0,
      },
    });
  },

  submitProjectWorkbenchInput: (inputText) => {
    const state = get();
    const trimmedInput = inputText.trim();
    const template = state.currentSemester?.finalProjectTemplate;
    const placeholderResponse = template?.workbenchConfig.placeholderResponse ?? "ok..";

    if (!trimmedInput) {
      const result: WorkbenchSubmissionResult = {
        success: false,
        message: "Enter project work before submitting.",
      };
      set({
        workbenchSubmission: {
          message: result.message,
          responseText: null,
          category: null,
          progressGain: 0,
        },
      });
      return result;
    }

    const eligibility = canUseWorkbench();
    if (!eligibility.canUse) {
      const result: WorkbenchSubmissionResult = {
        success: false,
        message: eligibility.reason ?? "Workbench is unavailable right now.",
      };
      set({
        workbenchSubmission: {
          message: result.message,
          responseText: null,
          category: null,
          progressGain: 0,
        },
      });
      return result;
    }

    if (!state.selectedProjectId) {
      const result: WorkbenchSubmissionResult = {
        success: false,
        message: "No active project. Use the Project Board to select one first.",
      };
      set({
        workbenchSubmission: {
          message: result.message,
          responseText: null,
          category: null,
          progressGain: 0,
        },
      });
      return result;
    }

    const activeCategory = getActiveLabProjectCategory();
    const gain = getWorkbenchProgressGain(
      template?.workbenchConfig.baseProgressGain,
      state.lessonWorkbenchBoostUsesRemaining > 0 ? state.lessonWorkbenchBoostMultiplier : 1
    );

    state.applyProjectProgressDelta({
      [activeCategory]: gain,
    });

    const progressedState = get();
    const progressedProject = getProjectStateById(
      progressedState.projectStatesById,
      progressedState.selectedProjectId
    );
    if (progressedProject) {
      const submissionUpdatedProject: ProjectState = {
        ...progressedProject,
        workbenchSubmissions: progressedProject.workbenchSubmissions + 1,
        lastUpdatedAt: new Date().toISOString(),
      };
      set({
        projectStatesById: {
          ...progressedState.projectStatesById,
          [submissionUpdatedProject.id]: submissionUpdatedProject,
        },
        projectState: submissionUpdatedProject,
      });
    }

    const phaseResult = get().advanceActiveProjectPhaseFromWorkbench();

    const nextBoostUses = Math.max(0, state.lessonWorkbenchBoostUsesRemaining - 1);
    const message = `Applied +${gain} to ${activeCategory}. ${phaseResult.message}`;

    set({
      freeActionsRemaining: state.freeActionsRemaining - 1,
      lessonWorkbenchBoostUsesRemaining: nextBoostUses,
      lessonWorkbenchBoostMultiplier: nextBoostUses > 0 ? state.lessonWorkbenchBoostMultiplier : 1,
      workbenchSubmission: {
        message,
        responseText: placeholderResponse,
        category: activeCategory,
        progressGain: gain,
      },
    });

    return {
      success: true,
      message,
      responseText: placeholderResponse,
      category: activeCategory,
      progressGain: gain,
    };
  },

  canAfford: (amount) => {
    const state = get();
    return canAffordAmount(state.wallet, amount);
  },

  getBasketTotal: () => {
    const state = get();
    return calculateBasketTotal(state.storeBasket);
  },

  addItemToInventory: (itemId, quantity = 1) => {
    const state = get();
    if (quantity <= 0) {
      return { success: false, message: "Quantity must be at least 1." };
    }

    set({ inventory: addToInventory(state.inventory, itemId, quantity) });
    return { success: true, message: "Added item to inventory." };
  },

  removeItemFromInventory: (itemId, quantity = 1) => {
    const state = get();
    if (quantity <= 0) {
      return { success: false, message: "Quantity must be at least 1." };
    }

    const hasItem = state.inventory.some((entry) => entry.itemId === itemId);
    if (!hasItem) {
      return { success: false, message: "Item is not in inventory." };
    }

    set({ inventory: removeFromInventory(state.inventory, itemId, quantity) });
    return { success: true, message: "Removed item from inventory." };
  },

  addItemToBasket: (itemId, quantity = 1) => {
    const state = get();
    if (quantity <= 0) {
      return { success: false, message: "Quantity must be at least 1." };
    }

    set({ storeBasket: addToBasket(state.storeBasket, itemId, quantity) });
    return { success: true, message: "Added item to basket." };
  },

  removeItemFromBasket: (itemId, quantity = 1) => {
    const state = get();
    if (quantity <= 0) {
      return { success: false, message: "Quantity must be at least 1." };
    }

    const hasItem = state.storeBasket.some((entry) => entry.itemId === itemId);
    if (!hasItem) {
      return { success: false, message: "Item is not in basket." };
    }

    set({ storeBasket: removeFromBasket(state.storeBasket, itemId, quantity) });
    return { success: true, message: "Removed item from basket." };
  },

  clearBasket: () => {
    set({ storeBasket: [] });
  },

  purchaseDirectItem: (itemId, quantity = 1) => {
    const state = get();
    const next = purchaseDirect(state.wallet, state.inventory, itemId, quantity);

    if (next.result.success) {
      set({
        wallet: next.wallet,
        inventory: next.inventory,
      });
    }

    return next.result;
  },

  purchaseBasket: () => {
    const state = get();
    const next = purchaseBasketItems(state.wallet, state.inventory, state.storeBasket);

    if (next.result.success) {
      set({
        wallet: next.wallet,
        inventory: next.inventory,
        storeBasket: next.basket,
      });
    }

    return next.result;
  },

  canUseItem: (itemId) => {
    const state = get();
    return canUseInventoryItemById(state.inventory, itemId).canUse;
  },

  getUsableInventoryItems: () => {
    const state = get();
    return getUsableInventoryEntries(state.inventory);
  },

  getItemUsePreview: (itemId) => getItemUsePreviewText(itemId),

  useInventoryItem: (itemId) => {
    const state = get();
    const eligibility = canUseInventoryItemById(state.inventory, itemId);
    if (!eligibility.canUse || !eligibility.item) {
      return {
        success: false,
        message: eligibility.reason ?? "Item cannot be used.",
      };
    }

    const effects = getItemEffects(eligibility.item);
    const statDelta = applyItemEffects(effects);
    if (!hasStatDelta(statDelta)) {
      return {
        success: false,
        message: `${eligibility.item.name} has no effect to apply.`,
      };
    }

    const consumed = consumeInventoryItemUnit(state.inventory, itemId);
    if (!consumed.result.success) {
      return consumed.result;
    }

    set({
      stats: applyPlayerStatDelta(state.stats, statDelta),
      inventory: consumed.inventory,
    });

    return consumed.result;
  },

  shouldGrantWeeklyPay: (newDay, newWeek) => {
    const state = get();
    return isEligibleForWeeklyPay(newDay, newWeek, state.lastWeeklyPayWeek);
  },

  grantWeeklyPayIfEligible: (newDay, newWeek) => {
    const state = get();
    if (!state.shouldGrantWeeklyPay(newDay, newWeek)) {
      return false;
    }

    set({
      wallet: state.wallet + WEEKLY_PAY_AMOUNT,
      lastWeeklyPayWeek: newWeek,
    });
    return true;
  },
  
  applyPlayerStatDelta: (delta) => {
    const state = get();
    set({
      stats: applyPlayerStatDelta(state.stats, delta),
    });
  },

  applyPlayerKnowledgeDelta: (delta) => {
    const state = get();
    set({
      knowledge: applyPlayerKnowledgeDelta(state.knowledge, delta),
    });
  },

  applyPlayerDeltas: (payload) => {
    const state = get();
    set({
      stats: payload.stats ? applyPlayerStatDelta(state.stats, payload.stats) : state.stats,
      knowledge: payload.knowledge
        ? applyPlayerKnowledgeDelta(state.knowledge, payload.knowledge)
        : state.knowledge,
      projectProgress:
        payload.projectProgress !== undefined
          ? clampPlayerValue(state.projectProgress + payload.projectProgress)
          : state.projectProgress,
    });
  },

  applyProjectProgressDelta: (delta, capabilityUnlocks) => {
    const state = get();
    if (!state.selectedProjectId) {
      return;
    }

    const current = state.projectStatesById[state.selectedProjectId];
    if (!current) {
      return;
    }

    const nextProgress: ProjectProgressState = {
      ...current.progress,
      prompting: clampPlayerValue(current.progress.prompting + (delta.prompting ?? 0)),
      retrieval: clampPlayerValue(current.progress.retrieval + (delta.retrieval ?? 0)),
      knowledgeBase: clampPlayerValue(
        current.progress.knowledgeBase + (delta.knowledgeBase ?? 0)
      ),
      evaluation: clampPlayerValue(current.progress.evaluation + (delta.evaluation ?? 0)),
      interface: clampPlayerValue(current.progress.interface + (delta.interface ?? 0)),
      overall: current.progress.overall,
    };

    const nextCapabilities: ProjectCapabilitiesState = {
      ...current.capabilities,
    };
    (capabilityUnlocks ?? []).forEach((capability) => {
      nextCapabilities[capability] = true;
    });

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [current.id]: {
          ...current,
          progress: nextProgress,
          capabilities: nextCapabilities,
          lastUpdatedAt: new Date().toISOString(),
        },
      },
      projectState: {
        ...current,
        progress: nextProgress,
        capabilities: nextCapabilities,
        lastUpdatedAt: new Date().toISOString(),
      },
    });

    get().recomputeProjectState();
  },

  setActiveProject: (projectId) => {
    const state = get();
    const project = state.projectStatesById[projectId];
    if (!project) {
      return {
        success: false,
        message: "That project is unavailable.",
      };
    }

    set({
      selectedProjectId: projectId,
      projectState: project,
      projectPanelMode: "board",
    });

    get().recomputeProjectState();
    return {
      success: true,
      message: `${project.name} is now your active project.`,
    };
  },

  advanceActiveProjectPhaseFromWorkbench: () => {
    const state = get();
    if (!state.selectedProjectId) {
      return {
        advanced: false,
        phase: null,
        message: "Choose a project at the Project Board first.",
      };
    }

    const project = state.projectStatesById[state.selectedProjectId];
    if (!project) {
      return {
        advanced: false,
        phase: null,
        message: "Active project data is unavailable.",
      };
    }

    const definition = getAssistantProjectDefinition(project.id);
    if (!definition || definition.phases.length === 0) {
      return {
        advanced: false,
        phase: project.phase,
        message: "Project phase data is not configured.",
      };
    }

    const phaseIndex = definition.phases.findIndex((phase) => phase.id === project.phase);
    if (phaseIndex === -1 || phaseIndex >= definition.phases.length - 1) {
      const submittedProject: ProjectState = {
        ...project,
        phase: "submitted",
        submitted: true,
        phaseProgress: 100,
        lastUpdatedAt: new Date().toISOString(),
      };
      set({
        projectStatesById: {
          ...state.projectStatesById,
          [submittedProject.id]: submittedProject,
        },
        projectState: submittedProject,
      });
      return {
        advanced: false,
        phase: submittedProject.phase,
        message: "Project is already submitted.",
      };
    }

    const currentPhase = definition.phases[phaseIndex];
    const requiredProgress = currentPhase.completionOverallProgress ?? 100;
    const needsMoreProgress = project.progress.overall < requiredProgress;
    if (needsMoreProgress) {
      const remaining = Math.max(0, requiredProgress - project.progress.overall);
      const phaseProgress = Math.max(
        0,
        Math.min(99, Math.round((project.progress.overall / requiredProgress) * 100))
      );
      const updatedProject: ProjectState = {
        ...project,
        phaseProgress,
        lastUpdatedAt: new Date().toISOString(),
      };

      set({
        projectStatesById: {
          ...state.projectStatesById,
          [updatedProject.id]: updatedProject,
        },
        projectState: updatedProject,
      });

      return {
        advanced: false,
        phase: updatedProject.phase,
        message: `${remaining} more overall progress needed to finish ${currentPhase.label}.`,
      };
    }

    const nextPhase = definition.phases[phaseIndex + 1];
    const completedMilestones = project.completedPhaseMilestoneIds.includes(currentPhase.id)
      ? project.completedPhaseMilestoneIds
      : [...project.completedPhaseMilestoneIds, currentPhase.id];
    const movedToSubmitted = nextPhase.id === "submitted";
    const updatedProject: ProjectState = {
      ...project,
      phase: nextPhase.id,
      phaseProgress: movedToSubmitted ? 100 : 0,
      completedPhaseMilestoneIds: completedMilestones,
      submitted: movedToSubmitted,
      lastUpdatedAt: new Date().toISOString(),
    };

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [updatedProject.id]: updatedProject,
      },
      projectState: updatedProject,
    });

    return {
      advanced: true,
      phase: updatedProject.phase,
      message: `Phase advanced to ${nextPhase.label}.`,
    };
  },

  setProjectCapability: (capability, enabled) => {
    const state = get();
    if (!state.selectedProjectId) {
      return;
    }

    const current = state.projectStatesById[state.selectedProjectId];
    if (!current || current.capabilities[capability] === enabled) {
      return;
    }

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [current.id]: {
          ...current,
          capabilities: {
            ...current.capabilities,
            [capability]: enabled,
          },
          lastUpdatedAt: new Date().toISOString(),
        },
      },
      projectState: {
        ...current,
        capabilities: {
          ...current.capabilities,
          [capability]: enabled,
        },
        lastUpdatedAt: new Date().toISOString(),
      },
    });

    get().recomputeProjectState();
  },

  recomputeProjectState: () => {
    const state = get();
    if (!state.selectedProjectId) {
      set({ projectProgress: 0 });
      return;
    }

    const activeProject = state.projectStatesById[state.selectedProjectId];
    if (!activeProject) {
      set({ projectProgress: 0 });
      return;
    }

    const overall = computeProjectOverallProgress(activeProject.progress, state.currentSemester);
    const progress: ProjectProgressState = {
      ...activeProject.progress,
      overall,
    };

    const interimMilestones = computeProjectMilestones(
      state.currentSemester,
      progress,
      activeProject.capabilities,
      activeProject.milestones
    );

    const ruleDriven = computeRuleDrivenCapabilities(state.currentSemester, progress, interimMilestones);
    const capabilities: ProjectCapabilitiesState = {
      ...createDefaultProjectCapabilities(),
      ...activeProject.capabilities,
      ...ruleDriven,
    };

    const milestones = computeProjectMilestones(
      state.currentSemester,
      progress,
      capabilities,
      activeProject.milestones
    );

    const definition = getAssistantProjectDefinition(activeProject.id);
    const phaseTarget = getPhaseCompletionTarget(definition, activeProject.phase);
    const phaseProgress =
      activeProject.phase === "submitted"
        ? 100
        : Math.max(0, Math.min(99, Math.round((progress.overall / Math.max(1, phaseTarget)) * 100)));

    const nextProjectState: ProjectState = {
      ...activeProject,
      progress,
      capabilities,
      milestones,
      phaseProgress,
      submitted: activeProject.phase === "submitted" || activeProject.submitted,
      lastUpdatedAt: new Date().toISOString(),
    };

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [nextProjectState.id]: nextProjectState,
      },
      projectState: nextProjectState,
      projectProgress: progress.overall,
    });
  },

  markCourseMilestoneUnlocked: (courseId) => {
    const state = get();
    const updated = state.courseCompletions.map((completion) =>
      completion.courseId === courseId
        ? {
            ...completion,
            milestoneUnlocked: true,
          }
        : completion
    );
    set({ courseCompletions: updated });
  },

  setProjectProgress: (value) => {
    const state = get();
    if (!state.selectedProjectId) {
      return;
    }

    const current = state.projectStatesById[state.selectedProjectId];
    if (!current) {
      return;
    }

    const clamped = clampPlayerValue(value);
    const updatedProject: ProjectState = {
      ...current,
      progress: {
        ...current.progress,
        overall: clamped,
      },
      lastUpdatedAt: new Date().toISOString(),
    };

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [updatedProject.id]: updatedProject,
      },
      projectProgress: clamped,
      projectState: updatedProject,
    });
  },
  
  // Action: project
  unlockProjectFeature: (featureId) => {
    const state = get();
    if (!state.selectedProjectId) {
      return;
    }

    const current = state.projectStatesById[state.selectedProjectId];
    if (!current || current.unlockedFeatures.includes(featureId)) {
      return;
    }

    const updatedProject: ProjectState = {
      ...current,
      unlockedFeatures: [...current.unlockedFeatures, featureId],
      lastUpdatedAt: new Date().toISOString(),
    };

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [updatedProject.id]: updatedProject,
      },
      projectState: updatedProject,
    });
  },
  
  setProjectState: (updates) => {
    const state = get();
    if (!state.selectedProjectId) {
      return;
    }

    const current = state.projectStatesById[state.selectedProjectId];
    if (!current) {
      return;
    }

    const updatedProject: ProjectState = {
      ...current,
      ...updates,
      lastUpdatedAt: new Date().toISOString(),
    };

    set({
      projectStatesById: {
        ...state.projectStatesById,
        [updatedProject.id]: updatedProject,
      },
      projectState: updatedProject,
    });
  },
  
  // Action: relationships
  updateNpcRelationship: (npcId, delta) => {
    const state = get();
    const current = state.npcRelationshipState[npcId] ?? { affinity: 50, familiarity: 0 };
    set({
      npcRelationshipState: {
        ...state.npcRelationshipState,
        [npcId]: {
          affinity: Math.max(0, Math.min(100, current.affinity + delta)),
          familiarity:
            delta === 0
              ? current.familiarity
              : Math.max(0, Math.min(100, current.familiarity + 2)),
        },
      },
    });
  },
  
  // Action: initialization
  initializeSemester: (semester) => {
    const courseCompletions: CourseCompletion[] = semester.courses.map((course) => ({
      courseId: course.id,
      lessonsCompleted: [],
      isCompleted: false,
      milestoneUnlocked: false,
      progressPercent: 0,
    }));
    
    const npcRelationshipState: Record<string, RelationshipState> = {};
    
    const projectStatesById = createProjectStatesFromDefinitions(semester);
    const fallbackProjectId = getSafeActiveProjectId(projectStatesById, null);
    const fallbackProject = getProjectStateById(projectStatesById, fallbackProjectId);

    set({
      currentSemester: semester,
      courseCompletions,
      npcRelationshipState,
      day: 1,
      week: 1,
      dayType: "class", // Day 1 is Monday = class day
      mandatoryActivityComplete: false,
      freeActionsRemaining: 3,
      completedMandatoryActivityId: null,
      labActivityStatus: "not-started",
      knowledge: DEFAULT_PLAYER_KNOWLEDGE,
      stats: DEFAULT_PLAYER_STATS,
      projectProgress: 0,
      wallet: STARTING_WALLET,
      inventory: [],
      storeBasket: [],
      lastWeeklyPayWeek: null,
      selectedProjectId: null,
      projectStatesById,
      projectState:
        fallbackProject ??
        createProjectStateFromDefinition(getFirstAssistantProjectDefinition(), semester),
      projectPanelMode: "status",
      lessonSession: null,
      gradebookByCourse: {},
      practiceHistory: {
        practiceAttempts: {},
      },
      workbenchSubmission: {
        message: null,
        responseText: null,
        category: null,
        progressGain: 0,
      },
      lessonWorkbenchBoostMultiplier: 1,
      lessonWorkbenchBoostUsesRemaining: 0,
    });
  },
}));