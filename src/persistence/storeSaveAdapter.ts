import { mvpProgram } from "../game/data/semester";
import { npcProfiles } from "../game/data/npcs";
import { useGameStore } from "../store/useGameStore";
import { GAME_SAVE_VERSION, type GameSavePayload } from "./saveSchema";

export function createGameSavePayload(): GameSavePayload | null {
  const state = useGameStore.getState();
  if (!state.currentSemester) {
    return null;
  }

  return {
    version: GAME_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    semesterId: state.currentSemester.id,
    day: state.day,
    week: state.week,
    dayType: state.dayType,
    mandatoryActivityComplete: state.mandatoryActivityComplete,
    freeActionsRemaining: state.freeActionsRemaining,
    completedMandatoryActivityId: state.completedMandatoryActivityId,
    labActivityStatus: state.labActivityStatus,
    currentLocation: state.currentLocation,
    currentScene: state.currentScene,
    currentBuilding: state.currentBuilding,
    playerPosition: state.playerPosition,
    knowledge: state.knowledge,
    stats: state.stats,
    projectProgress: state.projectProgress,
    wallet: state.wallet,
    inventory: state.inventory,
    lastWeeklyPayWeek: state.lastWeeklyPayWeek,
    courseCompletions: state.courseCompletions,
    completedLessons: state.completedLessons,
    npcRelationshipState: state.npcRelationshipState,
    projectState: state.projectState,
    selectedProjectId: state.selectedProjectId,
    projectStatesById: state.projectStatesById,
    gradebookByCourse: state.gradebookByCourse,
    practiceHistory: state.practiceHistory,
    lessonWorkbenchBoostMultiplier: state.lessonWorkbenchBoostMultiplier,
    lessonWorkbenchBoostUsesRemaining: state.lessonWorkbenchBoostUsesRemaining,
  };
}

function getSemesterById(semesterId: string) {
  return mvpProgram.semesters.find((semester) => semester.id === semesterId) ?? mvpProgram.semesters[0] ?? null;
}

export function applyGameSavePayload(payload: GameSavePayload): boolean {
  const semester = getSemesterById(payload.semesterId);
  if (!semester) {
    if (import.meta.env.DEV) {
      console.warn("[persistence] Could not find semester for payload.", payload.semesterId);
    }
    return false;
  }

  const store = useGameStore.getState();
  store.initializeSemester(semester);

  const mergedRelationshipState = { ...store.npcRelationshipState, ...payload.npcRelationshipState };
  const hydratedProjectStates = payload.projectStatesById ?? store.projectStatesById;
  const hydratedSelectedProjectId =
    payload.selectedProjectId !== undefined ? payload.selectedProjectId : store.selectedProjectId;
  const hydratedActiveProject =
    (hydratedSelectedProjectId ? hydratedProjectStates[hydratedSelectedProjectId] : null) ??
    payload.projectState;

  // Ensure relationship records exist for all known NPCs.
  npcProfiles.forEach((npc) => {
    if (!mergedRelationshipState[npc.id]) {
      mergedRelationshipState[npc.id] = { affinity: 50, familiarity: 0 };
    }
  });

  useGameStore.setState({
    day: payload.day,
    week: payload.week,
    dayType: payload.dayType,
    mandatoryActivityComplete: payload.mandatoryActivityComplete,
    freeActionsRemaining: payload.freeActionsRemaining,
    completedMandatoryActivityId: payload.completedMandatoryActivityId,
    labActivityStatus: payload.labActivityStatus,
    currentLocation: payload.currentLocation,
    currentScene: payload.currentScene,
    currentBuilding: payload.currentBuilding,
    playerPosition: payload.playerPosition,
    knowledge: payload.knowledge,
    stats: payload.stats,
    projectProgress: payload.projectProgress,
    wallet: payload.wallet,
    inventory: payload.inventory,
    lastWeeklyPayWeek: payload.lastWeeklyPayWeek,
    courseCompletions: payload.courseCompletions,
    completedLessons: payload.completedLessons,
    npcRelationshipState: mergedRelationshipState,
    selectedProjectId: hydratedSelectedProjectId,
    projectStatesById: hydratedProjectStates,
    projectState: hydratedActiveProject,
    gradebookByCourse: payload.gradebookByCourse,
    practiceHistory: payload.practiceHistory,
    lessonWorkbenchBoostMultiplier: payload.lessonWorkbenchBoostMultiplier,
    lessonWorkbenchBoostUsesRemaining: payload.lessonWorkbenchBoostUsesRemaining,
    activePanel: "none",
    selectedNpcId: null,
    lessonSession: null,
    menuOpen: false,
    objectModal: null,
    lessonModalOpen: false,
    currentLesson: null,
  });

  useGameStore.getState().recomputeProjectState();
  return true;
}

export function createAutosaveSignature() {
  const state = useGameStore.getState();

  const signature = {
    day: state.day,
    week: state.week,
    dayType: state.dayType,
    mandatoryActivityComplete: state.mandatoryActivityComplete,
    freeActionsRemaining: state.freeActionsRemaining,
    completedMandatoryActivityId: state.completedMandatoryActivityId,
    labActivityStatus: state.labActivityStatus,
    completedLessons: state.completedLessons,
    courseCompletions: state.courseCompletions,
    projectProgress: state.projectProgress,
    projectState: state.projectState,
    selectedProjectId: state.selectedProjectId,
    projectStatesById: state.projectStatesById,
    gradebookByCourse: state.gradebookByCourse,
    practiceHistory: state.practiceHistory,
    wallet: state.wallet,
    inventory: state.inventory,
    knowledge: state.knowledge,
    stats: state.stats,
    npcRelationshipState: state.npcRelationshipState,
    currentLocation: state.currentLocation,
    currentScene: state.currentScene,
    currentBuilding: state.currentBuilding,
    playerPosition: state.playerPosition,
    lastWeeklyPayWeek: state.lastWeeklyPayWeek,
    lessonWorkbenchBoostMultiplier: state.lessonWorkbenchBoostMultiplier,
    lessonWorkbenchBoostUsesRemaining: state.lessonWorkbenchBoostUsesRemaining,
  };

  return JSON.stringify(signature);
}
