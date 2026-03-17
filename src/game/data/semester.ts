/**
 * Main program and semester definition - the source of truth for MVP content.
 * One program, one semester, 3 courses, 6 locations, final project template.
 */

import type { Program, Semester, FinalProjectTemplate } from "../types/semester";
import { courses } from "./courses";

/**
 * Final project template - player builds their GitHub-ready project package.
 * Features unlock as courses are completed.
 */
const mvpProjectTemplate: FinalProjectTemplate = {
  id: "ai-study-helper",
  titleOptions: [
    "AI Study Helper",
    "Smart Study Buddy",
    "AI-Powered Learning Assistant",
    "QuickQuiz AI",
  ],
  problemStatementOptions: [
    "Students struggle to create effective study materials and need an AI tool to generate flashcards and quizzes from their notes.",
    "Exam prep is time-consuming; an AI system that transforms textbooks into practice questions would accelerate learning.",
    "Learners need personalized study aids; an AI tool customized to their subject matter could improve retention.",
  ],
  featurePool: [
    {
      id: "feature-readme",
      name: "Project README",
      description:
        "Clear documentation explaining what your project does, how to use it, and what you learned.",
    },
    {
      id: "feature-problem-statement",
      name: "Problem Statement",
      description:
        "A one-paragraph summary of the user problem your AI tool solves.",
    },
    {
      id: "feature-techstack",
      name: "Tech Stack",
      description:
        "List of technologies: programming language, AI APIs, hosting platform, and frameworks.",
    },
    {
      id: "feature-features",
      name: "Feature List",
      description:
        "Bullet-point list of what your AI Study Helper can do (e.g., 'generate flashcards', 'auto-quiz').",
    },
    {
      id: "feature-deployment",
      name: "Deployment Guide",
      description:
        "Step-by-step instructions for running your project locally or deploying it live.",
    },
    {
      id: "feature-summary",
      name: "What I Learned",
      description:
        "Reflection on AI concepts you practiced, challenges you overcame, and next steps.",
    },
    {
      id: "feature-bonus-architecture",
      name: "System Architecture Diagram",
      description:
        "Visual overview of how your app flows: input → AI API → output (bonus feature).",
    },
  ],
  techStack: [
    "Python",
    "JavaScript/TypeScript",
    "OpenAI API / Anthropic API",
    "HTML/CSS/React",
    "GitHub",
  ],
  readmeSections: [
    "Project Title",
    "Problem Statement",
    "Features",
    "Tech Stack",
    "Getting Started",
    "Usage Example",
    "What I Learned",
  ],
};

/**
 * The MVP Semester - one semester, 3 courses, 6 locations
 */
export const mvpSemester: Semester = {
  id: "spring-2026",
  title: "Spring 2026 - AI Basics Bootcamp",
  totalWeeks: 6,
  courses,
  finalProjectTemplate: mvpProjectTemplate,
};

/**
 * The MVP Program - currently just one semester, but structure supports future expansion
 */
export const mvpProgram: Program = {
  id: "ai-semester-sim",
  semesters: [mvpSemester],
};

/**
 * Helper function to get the current active semester (MVP always returns first)
 */
export function getCurrentSemester(): Semester {
  return mvpProgram.semesters[0];
}

/**
 * Helper function to get all courses in current semester
 */
export function getSemesterCourses(): typeof courses {
  return getCurrentSemester().courses;
}

/**
 * Helper function to get final project template
 */
export function getProjectTemplate(): FinalProjectTemplate {
  return getCurrentSemester().finalProjectTemplate;
}
