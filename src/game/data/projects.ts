import type { AssistantProjectDefinition, AssistantProjectPhaseDefinition } from "../types/project";

const SHARED_ASSISTANT_PHASE_FLOW: AssistantProjectPhaseDefinition[] = [
  {
    id: "selected",
    label: "Selected",
    helperLabel: "Choose your product direction and define who this assistant helps.",
    milestoneDescription: "Project direction is selected and scoped.",
    recommendedNextStep: "Draft your first problem statement and user interaction goal.",
    completionOverallProgress: 2,
  },
  {
    id: "planning",
    label: "Planning",
    helperLabel: "Plan your assistant workflow from input to structured output.",
    milestoneDescription: "Core assistant workflow is planned.",
    recommendedNextStep: "Design prompt templates and output format fields.",
    completionOverallProgress: 25,
  },
  {
    id: "prototyping",
    label: "Prototyping",
    helperLabel: "Build the first working assistant loop with real prompts.",
    milestoneDescription: "Assistant prototype can accept input and return structured output.",
    recommendedNextStep: "Test two realistic user scenarios and improve response quality.",
    completionOverallProgress: 55,
  },
  {
    id: "refining",
    label: "Refining",
    helperLabel: "Improve reliability, clarity, and usability of assistant responses.",
    milestoneDescription: "Assistant experience is refined and quality-checked.",
    recommendedNextStep: "Polish edge cases and finalize your presentation artifacts.",
    completionOverallProgress: 85,
  },
  {
    id: "submitted",
    label: "Submitted",
    helperLabel: "Final assistant package is complete and submitted.",
    milestoneDescription: "Final deliverable is submitted.",
    recommendedNextStep: "Review lessons learned and prepare for retrospective feedback.",
  },
];

const SHARED_LESSON_PHASE_GUIDANCE = {
  selected: "Use early lessons to clarify the user problem and assistant scope.",
  planning: "Map lesson concepts to prompts, inputs, and expected output schema.",
  prototyping: "Apply lab concepts to build and test your assistant interaction loop.",
  refining: "Use evaluation lessons to tighten quality, consistency, and UX.",
  submitted: "Summarize your build decisions and final delivery readiness.",
} as const;

export const ASSISTANT_PROJECT_DEFINITIONS: AssistantProjectDefinition[] = [
  {
    id: "ai-study-helper",
    title: "AI Study Helper",
    shortDescription:
      "An assistant focused on studying, concept explanation, lesson review, and academic support.",
    domainFocus: "Academic support and study workflows",
    outputType: "Structured study guidance, concept breakdowns, and review checklists",
    learningGoals: [
      "Design clear prompt-driven study interactions.",
      "Generate structured explanations with actionable review steps.",
      "Iterate on assistant quality for classroom-aligned use cases.",
    ],
    phases: SHARED_ASSISTANT_PHASE_FLOW,
    finalDeliverableDescription:
      "A working assistant-style product package for academic support with prompt flow, output structure, and documented milestones.",
    lessonPhaseGuidance: SHARED_LESSON_PHASE_GUIDANCE,
  },
  {
    id: "ai-career-helper",
    title: "AI Career Helper",
    shortDescription:
      "An assistant focused on resume help, interview prep, skill planning, and career support.",
    domainFocus: "Career readiness and professional growth workflows",
    outputType: "Structured career recommendations, interview prep plans, and skill roadmaps",
    learningGoals: [
      "Design clear prompt-driven career support interactions.",
      "Generate structured outputs for resume and interview preparation.",
      "Iterate on assistant quality for practical job-readiness scenarios.",
    ],
    phases: SHARED_ASSISTANT_PHASE_FLOW,
    finalDeliverableDescription:
      "A working assistant-style product package for career support with prompt flow, output structure, and documented milestones.",
    lessonPhaseGuidance: SHARED_LESSON_PHASE_GUIDANCE,
  },
];

export function getAssistantProjectDefinition(projectId: string) {
  return ASSISTANT_PROJECT_DEFINITIONS.find((project) => project.id === projectId) ?? null;
}
