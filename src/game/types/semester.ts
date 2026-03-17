/**
 * Semester and program types aligned to CONTENT_MODEL
 */

import type { Course } from "./course";

/**
 * Template for the final project deliverable.
 * Player selects from curated options to build their portfolio piece.
 */
export interface FinalProjectTemplate {
  id: string;
  titleOptions: string[]; // e.g., ["AI Study Helper", "Learning Assistant Bot"]
  problemStatementOptions: string[];
  featurePool: {
    id: string;
    name: string;
    description: string;
  }[];
  techStack: string[];
  readmeSections: string[];
}

/**
 * A semester is the main progression unit in AI Semester Sim.
 * MVP has one semester with 3 courses and 6 locations.
 */
export interface Semester {
  id: string;
  title: string;
  totalWeeks: number;
  courses: Course[];
  finalProjectTemplate: FinalProjectTemplate;
}

/**
 * A program can contain multiple semesters.
 * MVP has one semester; future versions can expand.
 */
export interface Program {
  id: string;
  semesters: Semester[];
}
