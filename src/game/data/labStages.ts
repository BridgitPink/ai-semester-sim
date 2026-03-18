export interface LabStage {
  week: number; // 1..8
  id: string;
  title: string;
  summary: string;
}

export const LAB_STAGE_PROJECT_CATEGORY_DEFAULTS: Record<string, "prompting" | "retrieval" | "knowledgeBase" | "evaluation" | "interface"> = {
  "lab-stage-01": "prompting",
  "lab-stage-02": "knowledgeBase",
  "lab-stage-03": "prompting",
  "lab-stage-04": "interface",
  "lab-stage-05": "retrieval",
  "lab-stage-06": "evaluation",
  "lab-stage-07": "evaluation",
  "lab-stage-08": "interface",
};

export interface LabProject {
  id: string;
  title: string;
  summary: string;
  stages: LabStage[];
}

export const buildStudyHelperLabProject: LabProject = {
  id: "lab-build-study-helper",
  title: "Build Your AI Study Helper",
  summary:
    "A semester-long lab project focused on defining, building, and packaging an AI-powered study helper.",
  stages: [
    {
      week: 1,
      id: "lab-stage-01",
      title: "Define the User and the One Job",
      summary:
        "Pick a specific user and a single job your study helper will do (like generating flashcards from notes). Write a crisp problem statement, decide what inputs you’ll accept, and define what a ‘good output’ looks like so you can build an MVP that’s focused and finishable.",
    },
    {
      week: 2,
      id: "lab-stage-02",
      title: "Design the Input: Notes Format and Constraints",
      summary:
        "Decide how study material will be provided (pasted text, bullet notes, or short excerpts) and add simple constraints like length limits and recommended headings. Input structure is the fastest way to improve AI output quality, so this week is about shaping inputs for reliability.",
    },
    {
      week: 3,
      id: "lab-stage-03",
      title: "First Prompt Template: Flashcards from Notes",
      summary:
        "Create a prompt template that turns notes into clear flashcards with consistent formatting. Include a small example and rules for count, difficulty, and tone. The goal is repeatable results you can test and iterate on—not one perfect output.",
    },
    {
      week: 4,
      id: "lab-stage-04",
      title: "Structured Output + Parsing Plan",
      summary:
        "Move from free-form text to a structured format (like JSON) so your UI can render outputs reliably. Define a simple schema, plan validation checks, and decide how you’ll recover when the model returns partial or malformed results.",
    },
    {
      week: 5,
      id: "lab-stage-05",
      title: "Grounding and Chunking: Handling Longer Notes",
      summary:
        "Handle longer inputs by chunking notes and generating flashcards per chunk, then merging. Discuss tradeoffs like speed vs. coverage and how grounding on provided notes reduces confident mistakes. The focus is a workflow that remains usable as inputs grow.",
    },
    {
      week: 6,
      id: "lab-stage-06",
      title: "Add Quizzes: From Flashcards to Practice Tests",
      summary:
        "Extend the helper to generate a short quiz based on the same notes, including an answer key and brief explanations. Define difficulty targets and constraints to avoid trivia. This week is about building a second output mode using the same input pipeline.",
    },
    {
      week: 7,
      id: "lab-stage-07",
      title: "Evaluate and Iterate: A Tiny Test Set",
      summary:
        "Create a small set of representative ‘test notes’ and evaluate outputs across prompt versions. Track common failure modes and fix them deliberately. Treat prompt iteration like debugging code: changes should be tested, compared, and kept only if they improve outcomes.",
    },
    {
      week: 8,
      id: "lab-stage-08",
      title: "Package for GitHub: README, Examples, and Reflection",
      summary:
        "Turn your work into a portfolio-ready package: write a README, include example inputs/outputs, document limitations, and add a short ‘what I learned’ reflection. The goal is clarity and credibility—something a reviewer can understand in minutes.",
    },
  ],
};

export const labProjects: LabProject[] = [buildStudyHelperLabProject];

export const labStages: LabStage[] = buildStudyHelperLabProject.stages;

export function getActiveLabProject(): LabProject {
  return buildStudyHelperLabProject;
}

export function getLabProjectById(projectId: string): LabProject | undefined {
  return labProjects.find((project) => project.id === projectId);
}

export function getLabStageForWeek(week: number): LabStage {
  const clampedWeek = Math.max(1, Math.min(8, Math.floor(week)));
  return (
    getActiveLabProject().stages.find((stage) => stage.week === clampedWeek) ??
    getActiveLabProject().stages[0]
  );
}

export function getDefaultProjectCategoryForLabStage(stageId: string) {
  return LAB_STAGE_PROJECT_CATEGORY_DEFAULTS[stageId] ?? "prompting";
}
