/**
 * Project system
 * Manages final project state, feature unlocking, export generation
 */

import { useGameStore } from "../../store/useGameStore";
import type { ProjectState } from "../types/player";

/**
 * Unlock a project feature based on course completion milestone
 * Called when a course is completed
 */
export function unlockProjectFeatureForCourse(courseId: string) {
  const { currentSemester } = useGameStore.getState();
  
  if (!currentSemester) return;
  
  const course = currentSemester.courses.find((c: any) => c.id === courseId);
  if (!course) return;

  // Unlock features tied to this course's milestone
  course.milestoneReward.projectFeatures.forEach((featureId: string) => {
    useGameStore.getState().unlockProjectFeature(featureId);
  });
}

/**
 * Get the current project state
 */
export function getProjectState(): ProjectState {
  return useGameStore.getState().projectState;
}

/**
 * Get percentage of project features unlocked (0-100)
 */
export function getProjectUnlockPercent(): number {
  const { projectState, currentSemester } = useGameStore.getState();
  
  if (!currentSemester) return 0;
  
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
  const { projectState, currentSemester } = useGameStore.getState();
  
  if (!currentSemester) return "";
  
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
  const { projectState } = useGameStore.getState();
  
  // MVP: requires at least title and problem statement
  return !!(projectState.selectedTitle && projectState.selectedProblemStatement);
}
