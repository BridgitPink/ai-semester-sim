import { create } from "zustand";
import type { PlayerStats } from "../game/types/player";
import type { Semester } from "../game/types/semester";
import type { CourseCompletion, Lesson } from "../game/types/course";
import type { ProjectState } from "../game/types/player";

type LocationId = "dorm" | "classroom" | "library" | "cafe" | "lab" | "advisor-office" | null;
type PanelType = "none" | "location" | "npc" | "course" | "project" | "object";
type SceneKey = "GameScene" | "ClassroomScene";
type DayType = "class" | "lab" | "off";
type FreeActionType = "rest" | "social" | "project" | "study" | "skip";

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
  
  // Location & UI
  currentLocation: LocationId;
  activePanel: PanelType;
  selectedNpcName: string | null;
  menuOpen: boolean;
  
  // Lesson modal
  currentLesson: Lesson | null;
  lessonModalOpen: boolean;
  
  // Scene & world state
  currentScene: SceneKey;
  currentBuilding: LocationId; // which building is the player in (for ClassroomScene context)
  playerPosition: PlayerPosition | null; // saved position for returning to GameScene
  
  // Player state
  stats: PlayerStats;
  
  // Course & learning progress
  courseCompletions: CourseCompletion[];
  completedLessons: string[];
  
  // Relationships & projects
  npcRelationships: Record<string, number>; // npcId -> relationship points
  projectState: ProjectState;
  
  // Actions
  setLocation: (location: LocationId) => void;
  openLocationPanel: (location: LocationId) => void;
  openNpcPanel: (npcName: string) => void;
  openCoursePanel: () => void;
  openProjectPanel: () => void;
  closePanel: () => void;
  toggleMenu: () => void;
  
  // Lesson modal actions
  openLessonModal: (lesson: Lesson) => void;
  closeLessonModal: () => void;
  
  // Scene & building actions
  enterBuilding: (buildingId: LocationId, playerPos: PlayerPosition) => void;
  exitBuilding: () => void;
  
  advanceWeek: () => void;
  completeMandatoryActivity: (activityId: string) => void;
  openSleepConfirmation: () => void;
  confirmSleep: (energyRecovery: number) => void;
  cancelSleepConfirmation: () => void;
  advanceToNextDay: () => void;
  useFreeAction: (actionType: FreeActionType, effects: Partial<PlayerStats>) => void;
  
  addCompletedLesson: (lessonId: string, courseId: string) => void;
  updateStats: (updates: Partial<PlayerStats>) => void;
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
  
  // Location & UI state
  currentLocation: null,
  activePanel: "none",
  selectedNpcName: null,
  menuOpen: false,
  
  // Lesson modal state
  currentLesson: null,
  lessonModalOpen: false,
  
  // Scene & world state
  currentScene: "GameScene",
  currentBuilding: null,
  playerPosition: null,
  
  // Player stats
  stats: {
    energy: 100,
    focus: 80,
    stress: 15,
    confidence: 50,
    knowledge: 0,
    projectProgress: 0,
  },
  
  // Course & learning state
  courseCompletions: [],
  completedLessons: [],
  
  // Relationship & project state
  npcRelationships: {},
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
      selectedNpcName: null,
    }),
  openNpcPanel: (npcName) =>
    set({
      activePanel: "npc",
      selectedNpcName: npcName,
    }),
  openCoursePanel: () =>
    set({
      activePanel: "course",
      selectedNpcName: null,
    }),
  openProjectPanel: () =>
    set({
      activePanel: "project",
      selectedNpcName: null,
    }),
  closePanel: () =>
    set({
      activePanel: "none",
      selectedNpcName: null,
    }),
  
  // Action: menu
  toggleMenu: () => {
    const state = get();
    set({ menuOpen: !state.menuOpen });
  },
  
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
  
  // Open sleep confirmation modal
  openSleepConfirmation: () => {
    set({ sleepConfirmationOpen: true, activePanel: "object" });
  },
  
  // Close sleep confirmation modal without advancing
  cancelSleepConfirmation: () => {
    set({ sleepConfirmationOpen: false });
  },
  
  // Confirm sleep: apply energy recovery, advance day, reset daily state
  confirmSleep: (energyRecovery) => {
    const state = get();
    
    // Apply energy recovery
    const newEnergy = Math.min(100, state.stats.energy + energyRecovery);
    
    // Advance to next day
    state.advanceToNextDay();
    
    // Update energy and close modal
    set({ sleepConfirmationOpen: false });
    state.updateStats({ energy: newEnergy });
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
    
    // Apply effects to stats
    state.updateStats(effects);
    
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
  
  // Action: stats
  updateStats: (updates) => {
    const state = get();
    set({
      stats: {
        ...state.stats,
        ...updates,
      },
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
    const current = state.npcRelationships[npcId] || 0;
    set({
      npcRelationships: {
        ...state.npcRelationships,
        [npcId]: Math.max(0, Math.min(100, current + delta)),
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
    
    const npcRelationships: Record<string, number> = {};
    // Initialize all NPCs to 50 (neutral) if needed
    
    set({
      currentSemester: semester,
      courseCompletions,
      npcRelationships,
      day: 1,
      week: 1,
      dayType: "class", // Day 1 is Monday = class day
      mandatoryActivityComplete: false,
      freeActionsRemaining: 3,
      completedMandatoryActivityId: null,
    });
  },
}));