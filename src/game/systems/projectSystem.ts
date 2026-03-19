/**
 * Project system
 * Manages final project state, feature unlocking, export generation
 */

import { useGameStore } from "../../store/useGameStore";
import type { Course } from "../types/course";
import type { ProjectCapabilityKey, ProjectProgressCategoryKey } from "../types/player";
import type { ProjectState } from "../types/player";
import { getDefaultProjectCategoryForLabStage } from "../data/labStages";
import { getEnergyModifier, getStressPenalty } from "./playerSelectors";
import type { FreeActionType } from "./freeActionSystem";

function getActiveProjectStateSnapshot(): ProjectState | null {
  const state = useGameStore.getState();
  if (!state.selectedProjectId) {
    return null;
  }
  return state.projectStatesById[state.selectedProjectId] ?? null;
}

function getLessonProgressFallback(courseId: string): Partial<Record<ProjectProgressCategoryKey, number>> {
  switch (courseId) {
    case "ai-foundations":
      return {
        prompting: 1,
        evaluation: 1,
      };
    case "data-prompting-basics":
      return {
        prompting: 1,
        knowledgeBase: 1,
        retrieval: 1,
      };
    case "systems-thinking-ai":
      return {
        retrieval: 1,
        evaluation: 1,
        interface: 1,
      };
    default:
      return {
        prompting: 1,
      };
  }
}

/**
 * Unlock a project feature based on course completion milestone
 * Called when a course is completed
 */
export function unlockProjectFeatureForCourse(courseId: string) {
  const { currentSemester } = useGameStore.getState();
  
  if (!currentSemester) return;
  
  const course = currentSemester.courses.find((c: Course) => c.id === courseId);
  if (!course) return;

  // Unlock features tied to this course's milestone
  course.milestoneReward.projectFeatures.forEach((featureId: string) => {
    useGameStore.getState().unlockProjectFeature(featureId);
  });
}

export function applyLessonProjectProgress(lessonId: string, courseId: string) {
  const state = useGameStore.getState();
  const template = state.currentSemester?.finalProjectTemplate;
  if (!template) return;

  const lessonRule = template.lessonProgressRules.find((rule) => rule.lessonId === lessonId);
  const course = state.currentSemester?.courses.find((item: Course) => item.id === courseId);

  if (lessonRule) {
    state.applyProjectProgressDelta(lessonRule.progressDelta, lessonRule.capabilityUnlocks);
    return;
  }

  const lesson = course?.lessons.find((item) => item.id === lessonId);
  if (lesson?.projectImpact?.progressDelta || lesson?.projectImpact?.capabilityUnlocks) {
    state.applyProjectProgressDelta(
      lesson.projectImpact?.progressDelta ?? {},
      lesson.projectImpact?.capabilityUnlocks
    );
    return;
  }

  state.applyProjectProgressDelta(getLessonProgressFallback(courseId));
}

export function applyCourseProjectProgress(courseId: string) {
  const state = useGameStore.getState();
  const { currentSemester } = state;
  if (!currentSemester) return;

  const courseRule = currentSemester.finalProjectTemplate.courseProgressRules.find(
    (rule) => rule.courseId === courseId
  );
  const course = currentSemester.courses.find((item: Course) => item.id === courseId);

  if (courseRule) {
    state.applyProjectProgressDelta(courseRule.progressDelta, courseRule.capabilityUnlocks);
  }

  if (course?.milestoneReward.progressDelta || course?.milestoneReward.capabilityUnlocks) {
    state.applyProjectProgressDelta(
      course.milestoneReward.progressDelta ?? {},
      course.milestoneReward.capabilityUnlocks
    );
  }
}

export function applyFreeActionProjectProgress(actionType: FreeActionType) {
  const state = useGameStore.getState();
  const template = state.currentSemester?.finalProjectTemplate;
  if (!template) return;

  const actionRule = template.freeActionProgressRules.find((rule) => rule.actionType === actionType);
  if (!actionRule) return;

  state.applyProjectProgressDelta(actionRule.progressDelta);
}

export function getProjectCategoryProgress(): Record<ProjectProgressCategoryKey, number> {
  const projectState = getActiveProjectStateSnapshot();
  if (!projectState) {
    return {
      prompting: 0,
      retrieval: 0,
      knowledgeBase: 0,
      evaluation: 0,
      interface: 0,
    };
  }

  return {
    prompting: projectState.progress.prompting,
    retrieval: projectState.progress.retrieval,
    knowledgeBase: projectState.progress.knowledgeBase,
    evaluation: projectState.progress.evaluation,
    interface: projectState.progress.interface,
  };
}

export function getProjectCapabilities(): Record<ProjectCapabilityKey, boolean> {
  const projectState = getActiveProjectStateSnapshot();
  if (!projectState) {
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

  return {
    ...projectState.capabilities,
  };
}

export function getProjectMilestones() {
  return getActiveProjectStateSnapshot()?.milestones ?? [];
}

export function getProjectOverallProgress(): number {
  return getActiveProjectStateSnapshot()?.progress.overall ?? 0;
}

/**
 * Get the current project state
 */
export function getProjectState(): ProjectState {
  const state = useGameStore.getState();
  const active = getActiveProjectStateSnapshot();
  return active ?? state.projectState;
}

/**
 * Get percentage of project features unlocked (0-100)
 */
export function getProjectUnlockPercent(): number {
  const { currentSemester } = useGameStore.getState();
  const projectState = getActiveProjectStateSnapshot();
  
  if (!currentSemester || !projectState) return 0;
  
  const totalFeatures = currentSemester.finalProjectTemplate.featurePool.length;
  const unlockedCount = projectState.unlockedFeatures.length;
  
  return Math.round((unlockedCount / totalFeatures) * 100);
}

/**
 * Export the final project as JSON/text suitable for GitHub README
 * TODO: Format project title, problem statement, features into structured output
 * TODO: Include tech stack, deployment guide stub, learning summary template
 * Returns formatted project export ready for copy-paste to GitHub
 */
export function exportProject(): string {
  const { currentSemester } = useGameStore.getState();
  const projectState = getActiveProjectStateSnapshot();
  
  if (!currentSemester || !projectState) return "";
  
  const template = currentSemester.finalProjectTemplate;
  
  // TODO: Build markdown/JSON with selected options
  // For now, return a stub
  return `
# ${projectState.selectedTitle || "AI Study Helper"}

## Problem Statement
${projectState.selectedProblemStatement || "..."}

## Features
${projectState.selectedFeatures.map((f: string) => `- ${f}`).join("\n")}

## Tech Stack
${template.techStack.join(", ")}

## What I Learned
[Your reflection here]
`.trim();
}

/**
 * Validate project is ready for export (minimum required sections filled)
 */
export function canExportProject(): boolean {
  const projectState = getActiveProjectStateSnapshot();
  if (!projectState) {
    return false;
  }
  
  // MVP: requires at least title and problem statement
  return !!(projectState.selectedTitle && projectState.selectedProblemStatement);
}

function getLowestProgressCategory(): ProjectProgressCategoryKey {
  const progress = getProjectCategoryProgress();
  return (Object.entries(progress) as Array<[ProjectProgressCategoryKey, number]>).reduce(
    (lowest, current) => (current[1] < lowest[1] ? current : lowest),
    ["prompting", progress.prompting]
  )[0];
}

function getLessonCategoryFromHooks(): ProjectProgressCategoryKey | null {
  const state = useGameStore.getState();
  const template = state.currentSemester?.finalProjectTemplate;
  if (!template) return null;

  const lessonContextId = state.completedMandatoryActivityId;
  if (!lessonContextId || lessonContextId.startsWith("lab-")) return null;

  const lesson = state.currentSemester?.courses
    .flatMap((course) => course.lessons)
    .find((item) => item.id === lessonContextId);

  return lesson?.workbenchHooks?.projectCategory ?? null;
}

export function getActiveLabProjectCategory(): ProjectProgressCategoryKey {
  const state = useGameStore.getState();
  const template = state.currentSemester?.finalProjectTemplate;
  if (!template) return getLowestProgressCategory();

  const lessonCategory = getLessonCategoryFromHooks();
  if (lessonCategory) return lessonCategory;

  const activeStageId = `lab-stage-${String(Math.max(1, Math.min(8, state.week))).padStart(2, "0")}`;
  const stageRule = template.labStageCategoryRules.find((rule) => rule.stageId === activeStageId);
  if (stageRule) return stageRule.category;

  return getDefaultProjectCategoryForLabStage(activeStageId);
}

export function getWorkbenchProgressGain(baseValue?: number, lessonBoostMultiplier?: number): number {
  const state = useGameStore.getState();
  const config = state.currentSemester?.finalProjectTemplate.workbenchConfig;

  const baseGain = baseValue ?? config?.baseProgressGain ?? 6;
  const minGain = config?.minProgressGain ?? 2;
  const maxGain = config?.maxProgressGain ?? 14;

  const focusModifier = 0.85 + state.stats.focus / 1000;
  const energyModifier = getEnergyModifier(state.stats.energy);
  const stressModifier = 1 - getStressPenalty(state.stats.stress);
  const boostMultiplier = lessonBoostMultiplier ?? 1;

  const raw = baseGain * focusModifier * energyModifier * stressModifier * boostMultiplier;
  return Math.max(minGain, Math.min(maxGain, Math.round(raw)));
}
