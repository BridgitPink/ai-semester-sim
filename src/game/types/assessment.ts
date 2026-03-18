/**
 * Shared assessment model used for:
 * - graded lesson quizzes
 * - graded checkpoint tests
 * - practice quizzes in study mode
 *
 * Data-driven by design; UI should render from this structure.
 */

import type { CourseId } from "./course";

export type AssessmentType = "quiz" | "checkpoint";
export type AssessmentMode = "graded" | "practice";

export type QuestionType = "mcq" | "truefalse";

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: "mcq";
  prompt: string;
  options: MultipleChoiceOption[];
  /**
   * Index into `options` for the correct answer (0-based).
   * Required for authored content to keep assessments easy to write.
   */
  correctIndex: number;
  /**
   * Stable option id for the correct answer.
   * Optional: derived from `correctIndex` during validation/scoring.
   */
  correctOptionId?: string;
  explanation?: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: "truefalse";
  prompt: string;
  correctAnswer: boolean;
  explanation?: string;
}

export type AssessmentQuestion = MultipleChoiceQuestion | TrueFalseQuestion;

export interface Assessment {
  id: string;
  courseId: CourseId;
  lessonId?: string;
  week: number; // 1..8
  type: AssessmentType;
  mode: AssessmentMode;
  title: string;
  description?: string;
  /**
   * Weight used for course grade aggregation. For MVP, prefer 1 for quizzes
   * and 2 for checkpoints unless explicitly authored.
   */
  weight?: number;
  /**
   * Passing score percentage (0..100). Optional.
   * If omitted, results screen shows score only (no pass/fail gate).
   */
  passingScore?: number;
  questions: AssessmentQuestion[];
}

export type AssessmentAnswerValue = string | boolean;

export type AssessmentAnswers = Record<string, AssessmentAnswerValue | undefined>;

export interface AssessmentScoringBreakdown {
  correctCount: number;
  totalCount: number;
  scorePercent: number; // 0..100
}

export interface AssessmentResult {
  assessmentId: string;
  mode: AssessmentMode;
  breakdown: AssessmentScoringBreakdown;
  passed?: boolean;
  /**
   * For UI review / reveal.
   * If false, UI should avoid revealing solutions (e.g., graded pre-submit).
   */
  revealSolutions: boolean;
  submittedAt: number; // epoch ms
}

export interface GradedAttemptRecord {
  assessmentId: string;
  courseId: CourseId;
  lessonId?: string;
  week: number;
  type: AssessmentType;
  weight: number;
  result: AssessmentResult;
}

export interface PracticeAttemptRecord {
  assessmentId: string;
  courseId: CourseId;
  lessonId?: string;
  week: number;
  type: AssessmentType;
  result: AssessmentResult;
}
