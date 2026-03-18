import { useGameStore } from "../../store/useGameStore";
import type { PlayerKnowledge, PlayerStats } from "../types/player";
import { getCurrentDaySummary, shouldPromptReturnToDorm } from "./timeSystem";

export interface PlayerStatDisplayItem {
  key: string;
  label: string;
  value: number;
}

export interface SidebarStatusSummary {
  week: number;
  dayName: string;
  dayTypeLabel: string;
  mandatoryActivityLabel: string;
  freeActionsRemaining: number;
  canSleep: boolean;
  hintMessage: string | null;
}

export function getPlayerKnowledge(): PlayerKnowledge {
  return useGameStore.getState().knowledge;
}

export function getPlayerStats(): PlayerStats {
  return useGameStore.getState().stats;
}

export function getPrimaryGameplayStats(): PlayerStatDisplayItem[] {
  const stats = getPlayerStats();
  return [
    { key: "energy", label: "Energy", value: stats.energy },
    { key: "stress", label: "Stress", value: stats.stress },
    { key: "focus", label: "Focus", value: stats.focus },
    { key: "confidence", label: "Confidence", value: stats.confidence },
  ];
}

export function getSecondaryPlayerStats(): PlayerStatDisplayItem[] {
  const stats = getPlayerStats();
  return [
    { key: "charisma", label: "Charisma", value: stats.charisma },
    { key: "curiosity", label: "Curiosity", value: stats.curiosity },
    { key: "discipline", label: "Discipline", value: stats.discipline },
  ];
}

export function getKnowledgeStats(): PlayerStatDisplayItem[] {
  const knowledge = getPlayerKnowledge();
  return [
    { key: "aiFoundations", label: "AI Foundations", value: knowledge.aiFoundations },
    { key: "dataPrompting", label: "Data & Prompting", value: knowledge.dataPrompting },
    {
      key: "appliedAIBuilding",
      label: "Applied AI Building",
      value: knowledge.appliedAIBuilding,
    },
  ];
}

export function getSidebarStatusSummary(): SidebarStatusSummary {
  const daySummary = getCurrentDaySummary();
  const shouldReturnToDorm = shouldPromptReturnToDorm();
  let hintMessage: string | null = null;

  if (shouldReturnToDorm) {
    hintMessage = "Day complete. Return to dorm when ready.";
  } else if (daySummary.canSleep) {
    hintMessage = "Ready to sleep.";
  }

  return {
    week: daySummary.week,
    dayName: daySummary.dayName,
    dayTypeLabel: daySummary.dayTypeLabel,
    mandatoryActivityLabel: daySummary.mandatoryActivityLabel,
    freeActionsRemaining: daySummary.freeActionsRemaining,
    canSleep: daySummary.canSleep,
    hintMessage,
  };
}

export function getStressPenalty(stress: number = getPlayerStats().stress): number {
  if (stress <= 40) return 0;
  return Math.min(0.35, (stress - 40) / 200);
}

export function getEnergyModifier(energy: number = getPlayerStats().energy): number {
  if (energy >= 80) return 1.1;
  if (energy <= 25) return 0.8;
  if (energy <= 45) return 0.9;
  return 1;
}

export function getLearningMultiplier(): number {
  const stats = getPlayerStats();
  const penalty = getStressPenalty(stats.stress);
  const energyModifier = getEnergyModifier(stats.energy);
  const focusFactor = 0.85 + stats.focus / 1000;
  return Math.max(0.6, (1 - penalty) * energyModifier * focusFactor);
}

export function getAcademicReadiness(): number {
  const stats = getPlayerStats();
  const knowledge = getPlayerKnowledge();
  const knowledgeAverage =
    (knowledge.aiFoundations + knowledge.dataPrompting + knowledge.appliedAIBuilding) / 3;
  const base =
    stats.focus * 0.35 +
    stats.confidence * 0.2 +
    stats.discipline * 0.2 +
    knowledgeAverage * 0.25;

  return Math.max(0, Math.min(100, Math.round(base * (1 - getStressPenalty(stats.stress)))));
}

export function getSocialReadiness(): number {
  const stats = getPlayerStats();
  const base = stats.charisma * 0.5 + stats.confidence * 0.25 + stats.energy * 0.15 + stats.curiosity * 0.1;
  return Math.max(0, Math.min(100, Math.round(base * (1 - getStressPenalty(stats.stress)))));
}
