import { create } from "zustand";
import type {
  PlayerKnowledge,
  PlayerKnowledgeDelta,
  PlayerStatDelta,
  PlayerStats,
  ProjectState,
} from "../game/types/player";
import type { Semester } from "../game/types/semester";
import type { CourseCompletion, Lesson } from "../game/types/course";
import type { InteriorObject, ObjectInteractionType } from "../game/types/interiorObject";
import {
  applyPlayerKnowledgeDelta,
  applyPlayerStatDelta,
  clampPlayerValue,
  DEFAULT_PLAYER_KNOWLEDGE,
  DEFAULT_PLAYER_STATS,
  type PlayerDeltaPayload,
} from "../game/systems/playerStatSystem";

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
type PanelType = "none" | "location" | "npc" | "course" | "project" | "object";
type SceneKey = "GameScene" | "ClassroomScene";
type DayType = "class" | "lab" | "off";
type FreeActionType = "rest" | "social" | "project" | "study" | "skip";

export interface RelationshipState {
  affinity: number; // 0-100
  familiarity: number; // 0-100
}

type ObjectModalVariant = "placeholder" | "info" | "extra-credit" | "lab";

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
  
  // Scene & world state
  currentScene: SceneKey;
  currentBuilding: LocationId; // which building is the player in (for ClassroomScene context)
  playerPosition: PlayerPosition | null; // saved position for returning to GameScene
  
  // Player state
  knowledge: PlayerKnowledge;
  stats: PlayerStats;
  projectProgress: number;
  
  // Course & learning progress
  courseCompletions: CourseCompletion[];
  completedLessons: string[];
  
  // Relationships & projects
  npcRelationshipState: Record<string, RelationshipState>; // npcId -> relationship state
  projectState: ProjectState;
  
  // Actions
  setLocation: (location: LocationId) => void;
  openLocationPanel: (location: LocationId) => void;
  openNpcPanel: (npcId: string) => void;
  openCoursePanel: () => void;
  openProjectPanel: () => void;
  closePanel: () => void;
  toggleMenu: () => void;

  // Object modal actions
  openObjectModal: (ctx: ObjectModalContext) => void;
  clearObjectModal: () => void;
  
  // Lesson modal actions
  openLessonModal: (lesson: Lesson) => void;
  closeLessonModal: () => void;
  
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
  applyPlayerStatDelta: (delta: PlayerStatDelta) => void;
  applyPlayerKnowledgeDelta: (delta: PlayerKnowledgeDelta) => void;
  applyPlayerDeltas: (payload: PlayerDeltaPayload) => void;
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
  
  // Scene & world state
  currentScene: "GameScene",
  currentBuilding: null,
  playerPosition: null,
  
  // Player stats
  knowledge: DEFAULT_PLAYER_KNOWLEDGE,
  stats: DEFAULT_PLAYER_STATS,
  projectProgress: 0,
  
  // Course & learning state
  courseCompletions: [],
  completedLessons: [],
  
  // Relationship & project state
  npcRelationshipState: {},
  projectState: {
    unlockedFeatures: [],
    selectedFeatures: [],
  },
  
  // Action: movement & location
  setLocation: (location) => set({ currentLocation: location }),
  
  // Action: panels
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
  openProjectPanel: () =>
    set({
      activePanel: "project",
      selectedNpcId: null,
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
    }),

  clearObjectModal: () =>
    set({
      objectModal: null,
      activePanel: "none",
    }),
  
  // Action: lesson modal
  openLessonModal: (lesson) =>
    set({
      currentLesson: lesson,
      lessonModalOpen: true,
    }),
  closeLessonModal: () =>
    set({
      currentLesson: null,
      lessonModalOpen: false,
    }),
  
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
    set({
      labActivityStatus: "complete",
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

  setProjectProgress: (value) => {
    set({
      projectProgress: clampPlayerValue(value),
    });
  },
  
  // Action: project
  unlockProjectFeature: (featureId) => {
    const state = get();
    if (!state.projectState.unlockedFeatures.includes(featureId)) {
      set({
        projectState: {
          ...state.projectState,
          unlockedFeatures: [...state.projectState.unlockedFeatures, featureId],
        },
      });
    }
  },
  
  setProjectState: (updates) => {
    const state = get();
    set({
      projectState: {
        ...state.projectState,
        ...updates,
      },
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
    });
  },
}));