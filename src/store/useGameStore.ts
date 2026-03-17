import { create } from "zustand";
import type { PlayerStats } from "../game/types/player";
import type { Semester } from "../game/types/semester";
import type { CourseCompletion, Lesson } from "../game/types/course";
import type { ProjectState } from "../game/types/player";

type LocationId = "dorm" | "classroom" | "library" | "cafe" | "lab" | "advisor-office" | null;
type PanelType = "none" | "location" | "npc" | "course" | "project";
type SceneKey = "GameScene" | "ClassroomScene";

interface PlayerPosition {
  x: number;
  y: number;
}

interface GameStore {
  // Progression
  day: number;
  week: number;
  currentSemester: Semester | null;
  
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
    });
  },
}));