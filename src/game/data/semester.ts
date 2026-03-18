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
  name: "AI Study Helper",
  description:
    "Build a practical AI study assistant with strong prompting foundations and a clear growth path toward retrieval and evaluation capabilities.",
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
  progressCategories: [
    {
      id: "prompting",
      label: "Prompting",
      description: "Prompt templates, instruction quality, and prompt workflow reliability.",
      weight: 1,
    },
    {
      id: "retrieval",
      label: "Retrieval",
      description: "Ability to fetch grounded context for responses.",
      weight: 1,
    },
    {
      id: "knowledgeBase",
      label: "Knowledge Base",
      description: "Curation and structuring of trusted learning sources.",
      weight: 1,
    },
    {
      id: "evaluation",
      label: "Evaluation",
      description: "Quality checks, testing loops, and response assessment.",
      weight: 1,
    },
    {
      id: "interface",
      label: "Interface",
      description: "Usable learner experience and interaction flow.",
      weight: 1,
    },
  ],
  capabilities: [
    "hasPromptTemplates",
    "hasKnowledgeSource",
    "hasRetrievalLayer",
    "hasEmbeddings",
    "hasVectorDb",
    "hasDocumentUpload",
    "hasDashboard",
    "hasEvaluationMetrics",
  ],
  milestones: [
    {
      id: "scope-defined",
      name: "Project Scope Defined",
      description: "Core problem and AI Study Helper project direction are defined.",
      requiredOverallProgress: 10,
    },
    {
      id: "prompt-workflow-built",
      name: "Prompt Workflow Built",
      description: "Prompt templates and repeatable prompting workflow are in place.",
      requiredCapabilities: ["hasPromptTemplates"],
      requiredOverallProgress: 25,
    },
    {
      id: "knowledge-source-added",
      name: "Knowledge Source Added",
      description: "A trusted source of study content is represented in the project.",
      requiredCapabilities: ["hasKnowledgeSource"],
      requiredOverallProgress: 40,
    },
    {
      id: "retrieval-layer-ready",
      name: "Retrieval Layer Ready",
      description: "Retrieval-oriented architecture is ready for later vector workflows.",
      requiredCapabilities: ["hasRetrievalLayer"],
      requiredOverallProgress: 55,
    },
    {
      id: "response-quality-tested",
      name: "Response Quality Tested",
      description: "Evaluation-oriented checks are running for response quality.",
      requiredCapabilities: ["hasEvaluationMetrics"],
      requiredOverallProgress: 70,
    },
    {
      id: "prototype-interface-working",
      name: "Prototype Interface Working",
      description: "A prototype interface is usable with core study-helper workflow.",
      requiredCapabilities: ["hasDashboard"],
      requiredOverallProgress: 85,
    },
  ],
  capabilityRules: [
    {
      capability: "hasPromptTemplates",
      requiredCategoryMinimums: {
        prompting: 25,
      },
    },
    {
      capability: "hasKnowledgeSource",
      requiredCategoryMinimums: {
        knowledgeBase: 20,
      },
    },
    {
      capability: "hasRetrievalLayer",
      requiredCategoryMinimums: {
        retrieval: 25,
        knowledgeBase: 20,
      },
    },
    {
      capability: "hasEmbeddings",
      requiredCategoryMinimums: {
        retrieval: 45,
      },
      requiredOverallProgress: 75,
      requiredMilestoneIds: ["retrieval-layer-ready"],
    },
    {
      capability: "hasVectorDb",
      requiredCategoryMinimums: {
        retrieval: 60,
      },
      requiredOverallProgress: 82,
      requiredMilestoneIds: ["retrieval-layer-ready"],
    },
    {
      capability: "hasDocumentUpload",
      requiredCategoryMinimums: {
        knowledgeBase: 55,
      },
      requiredOverallProgress: 80,
    },
    {
      capability: "hasDashboard",
      requiredCategoryMinimums: {
        interface: 35,
      },
      requiredOverallProgress: 65,
    },
    {
      capability: "hasEvaluationMetrics",
      requiredCategoryMinimums: {
        evaluation: 30,
      },
      requiredOverallProgress: 60,
    },
  ],
  courseProgressRules: [
    {
      courseId: "ai-foundations",
      progressDelta: {
        prompting: 8,
        evaluation: 12,
      },
    },
    {
      courseId: "data-prompting-basics",
      progressDelta: {
        prompting: 12,
        knowledgeBase: 10,
        retrieval: 8,
      },
    },
    {
      courseId: "systems-thinking-ai",
      progressDelta: {
        retrieval: 8,
        evaluation: 10,
        interface: 12,
      },
    },
  ],
  lessonProgressRules: [
    {
      lessonId: "lesson-dpb-02",
      progressDelta: {
        prompting: 4,
      },
    },
    {
      lessonId: "lesson-dpb-05",
      progressDelta: {
        knowledgeBase: 3,
        retrieval: 4,
      },
    },
    {
      lessonId: "lesson-dpb-06",
      progressDelta: {
        evaluation: 4,
      },
    },
    {
      lessonId: "lesson-stai-03",
      progressDelta: {
        interface: 3,
      },
    },
    {
      lessonId: "lesson-stai-05",
      progressDelta: {
        evaluation: 4,
      },
    },
  ],
  freeActionProgressRules: [
    {
      actionType: "project",
      progressDelta: {
        prompting: 3,
        interface: 2,
      },
    },
    {
      actionType: "study",
      progressDelta: {
        knowledgeBase: 2,
        evaluation: 1,
      },
    },
  ],
  labStageCategoryRules: [
    { stageId: "lab-stage-01", category: "prompting" },
    { stageId: "lab-stage-02", category: "knowledgeBase" },
    { stageId: "lab-stage-03", category: "prompting" },
    { stageId: "lab-stage-04", category: "interface" },
    { stageId: "lab-stage-05", category: "retrieval" },
    { stageId: "lab-stage-06", category: "evaluation" },
    { stageId: "lab-stage-07", category: "evaluation" },
    { stageId: "lab-stage-08", category: "interface" },
  ],
  workbenchConfig: {
    baseProgressGain: 6,
    minProgressGain: 2,
    maxProgressGain: 14,
    lessonBoostUses: 2,
    placeholderResponse: "ok..",
    requireLabBuilding: true,
  },
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
 * The MVP Semester - one semester, 3 courses, 6 locations, 8 weeks to complete
 */
export const mvpSemester: Semester = {
  id: "spring-2026",
  title: "Spring 2026 - AI Basics Bootcamp",
  totalWeeks: 8,
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
