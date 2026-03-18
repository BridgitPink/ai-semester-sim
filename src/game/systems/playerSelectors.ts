import { useGameStore } from "../../store/useGameStore";
import type { PlayerKnowledge, PlayerStats } from "../types/player";

export function getPlayerKnowledge(): PlayerKnowledge {
  return useGameStore.getState().knowledge;
}

export function getPlayerStats(): PlayerStats {
  return useGameStore.getState().stats;
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
