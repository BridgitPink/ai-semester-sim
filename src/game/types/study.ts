/**
 * Study extensions attach to completed lessons.
 * They reuse the lesson-style window and content block renderers.
 */

import type { LessonContentBlock } from "./course";
import type { Assessment } from "./assessment";

export interface StudyExtension {
  recapBlocks?: LessonContentBlock[];
  extraBlocks?: LessonContentBlock[];
  /** Optional practice-only assessment; must have mode === "practice". */
  practiceAssessment?: Assessment;
  /** Optional small bonuses granted after completing study session. */
  bonuses?: {
    knowledge?: number;
    confidence?: number;
    focus?: number;
  };
}
