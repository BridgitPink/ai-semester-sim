/**
 * Assessment System
 *
 * Pure helpers for validating and scoring assessments.
 * Must never throw from malformed content; UI should degrade gracefully.
 */

import type {
  Assessment,
  AssessmentAnswers,
  AssessmentQuestion,
  AssessmentResult,
  AssessmentScoringBreakdown,
} from "../types/assessment";

export type AssessmentValidationIssue = {
  level: "warning" | "error";
  message: string;
  questionId?: string;
};

export type AssessmentValidationResult = {
  isValid: boolean;
  issues: AssessmentValidationIssue[];
  /** subset of questions that are safe to render/score */
  safeQuestions: AssessmentQuestion[];
};

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function validateAssessment(assessment: Assessment | null | undefined): AssessmentValidationResult {
  if (!assessment) {
    return {
      isValid: false,
      issues: [{ level: "error", message: "Assessment data is missing." }],
      safeQuestions: [],
    };
  }

  const issues: AssessmentValidationIssue[] = [];
  const questions = Array.isArray(assessment.questions) ? assessment.questions : [];
  if (questions.length === 0) {
    issues.push({ level: "error", message: "Assessment has no questions." });
  }

  const safeQuestions: AssessmentQuestion[] = [];

  for (const question of questions) {
    if (!question || typeof question !== "object") {
      issues.push({ level: "warning", message: "Invalid question entry skipped." });
      continue;
    }

    if (typeof (question as { id?: unknown }).id !== "string" || (question as { id: string }).id.trim().length === 0) {
      issues.push({ level: "warning", message: "Question is missing an id and was skipped." });
      continue;
    }

    if (question.type === "mcq") {
      const q = question;
      const optionList = Array.isArray(q.options) ? q.options : [];
      if (typeof q.prompt !== "string" || q.prompt.trim().length === 0) {
        issues.push({ level: "warning", message: "MCQ prompt is missing.", questionId: q.id });
      }
      if (optionList.length < 2) {
        issues.push({ level: "warning", message: "MCQ must have at least 2 options.", questionId: q.id });
        continue;
      }
      const index = (q as { correctIndex?: unknown }).correctIndex;
      if (typeof index !== "number" || !Number.isFinite(index) || Math.floor(index) !== index) {
        issues.push({ level: "warning", message: "MCQ is missing a valid correctIndex.", questionId: q.id });
        continue;
      }
      if (index < 0 || index >= optionList.length) {
        issues.push({ level: "warning", message: "MCQ correctIndex is out of bounds.", questionId: q.id });
        continue;
      }

      const derivedCorrectId = optionList[index]?.id;
      if (typeof derivedCorrectId !== "string" || derivedCorrectId.trim().length === 0) {
        issues.push({ level: "warning", message: "MCQ correct option id is invalid.", questionId: q.id });
        continue;
      }

      const authoredCorrectId = (q as { correctOptionId?: unknown }).correctOptionId;
      if (typeof authoredCorrectId === "string" && authoredCorrectId.trim().length > 0 && authoredCorrectId !== derivedCorrectId) {
        issues.push({
          level: "warning",
          message: "MCQ correctOptionId did not match correctIndex; using correctIndex.",
          questionId: q.id,
        });
      }

      // Normalize: ensure safe questions always have a correctOptionId.
      safeQuestions.push({
        ...q,
        correctOptionId: derivedCorrectId,
      });
      continue;
    }

    if (question.type === "truefalse") {
      const q = question;
      if (typeof q.prompt !== "string" || q.prompt.trim().length === 0) {
        issues.push({ level: "warning", message: "True/False prompt is missing.", questionId: q.id });
      }
      if (typeof q.correctAnswer !== "boolean") {
        issues.push({ level: "warning", message: "True/False correct answer missing.", questionId: q.id });
        continue;
      }
      safeQuestions.push(question);
      continue;
    }

    issues.push({ level: "warning", message: "Unknown question type skipped.", questionId: (question as { id: string }).id });
  }

  const isValid = issues.every((i) => i.level !== "error") && safeQuestions.length > 0;
  return { isValid, issues, safeQuestions };
}

export function scoreAssessment(
  assessment: Assessment,
  answers: AssessmentAnswers,
  options?: { revealSolutions?: boolean; submittedAt?: number }
): AssessmentResult {
  const validation = validateAssessment(assessment);
  const safeQuestions = validation.safeQuestions;

  const totalCount = safeQuestions.length;
  let correctCount = 0;

  for (const q of safeQuestions) {
    const answer = answers[q.id];

    if (q.type === "mcq") {
      if (typeof answer === "string" && typeof q.correctOptionId === "string" && answer === q.correctOptionId) {
        correctCount += 1;
      }
      continue;
    }

    if (q.type === "truefalse") {
      if (typeof answer === "boolean" && answer === q.correctAnswer) {
        correctCount += 1;
      }
      continue;
    }
  }

  const rawPercent = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  const breakdown: AssessmentScoringBreakdown = {
    correctCount,
    totalCount,
    scorePercent: clampPercent(rawPercent),
  };

  const passingScore = assessment.passingScore;
  const passed = typeof passingScore === "number" ? breakdown.scorePercent >= clampPercent(passingScore) : undefined;

  return {
    assessmentId: assessment.id,
    mode: assessment.mode,
    breakdown,
    passed,
    revealSolutions: options?.revealSolutions ?? true,
    submittedAt: options?.submittedAt ?? Date.now(),
  };
}

export function getDefaultAssessmentWeight(assessment: Assessment): number {
  if (typeof assessment.weight === "number" && Number.isFinite(assessment.weight) && assessment.weight > 0) {
    return assessment.weight;
  }
  return assessment.type === "checkpoint" ? 2 : 1;
}
