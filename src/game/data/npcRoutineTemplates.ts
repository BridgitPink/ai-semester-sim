import type {
  CampusLocationId,
  DayPhase,
  DayType,
  NpcRoutineTemplateId,
} from "../types/npc";

export interface NpcRoutineCandidate {
  locationId: CampusLocationId;
  activity: string;
  base: number; // base utility, used before modifiers
}

export interface NpcRoutineTemplate {
  id: NpcRoutineTemplateId;
  dayTypeToPhaseCandidates: Record<DayType, Record<DayPhase, NpcRoutineCandidate[]>>;
}

const ACADEMIC_COMMON: Record<DayPhase, NpcRoutineCandidate[]> = {
  academic: [
    { locationId: "classroom", activity: "getting ready for class", base: 85 },
    { locationId: "library", activity: "reviewing notes", base: 65 },
    { locationId: "dorm", activity: "packing up", base: 55 },
  ],
  free: [
    { locationId: "library", activity: "studying", base: 75 },
    { locationId: "cafe", activity: "decompressing", base: 65 },
    { locationId: "dorm", activity: "resetting", base: 55 },
  ],
};

export const npcRoutineTemplates: Record<NpcRoutineTemplateId, NpcRoutineTemplate> = {
  "routine-roommate": {
    id: "routine-roommate",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "dorm", activity: "getting ready", base: 80 },
          { locationId: "classroom", activity: "heading to class", base: 70 },
          { locationId: "library", activity: "skimming readings", base: 60 },
        ],
        free: [
          { locationId: "dorm", activity: "recharging", base: 80 },
          { locationId: "cafe", activity: "meeting friends", base: 65 },
          { locationId: "library", activity: "quiet study", base: 60 },
        ],
      },
      lab: {
        academic: [
          { locationId: "dorm", activity: "getting ready", base: 75 },
          { locationId: "lab", activity: "checking out lab demos", base: 70 },
          { locationId: "library", activity: "reading docs", base: 60 },
        ],
        free: [
          { locationId: "dorm", activity: "recharging", base: 80 },
          { locationId: "cafe", activity: "hanging out", base: 65 },
          { locationId: "library", activity: "quiet study", base: 60 },
        ],
      },
      off: {
        academic: [
          { locationId: "dorm", activity: "sleeping in", base: 85 },
          { locationId: "cafe", activity: "lazy brunch", base: 70 },
          { locationId: "library", activity: "catch-up reading", base: 55 },
        ],
        free: [
          { locationId: "dorm", activity: "recharging", base: 85 },
          { locationId: "cafe", activity: "hanging out", base: 75 },
          { locationId: "library", activity: "studying a bit", base: 55 },
        ],
      },
    },
  },

  "routine-classmate": {
    id: "routine-classmate",
    dayTypeToPhaseCandidates: {
      class: ACADEMIC_COMMON,
      lab: {
        academic: [
          { locationId: "library", activity: "working on assignments", base: 75 },
          { locationId: "cafe", activity: "group chat", base: 60 },
          { locationId: "dorm", activity: "taking it easy", base: 55 },
        ],
        free: ACADEMIC_COMMON.free,
      },
      off: {
        academic: [
          { locationId: "cafe", activity: "catching up with people", base: 75 },
          { locationId: "library", activity: "light studying", base: 60 },
          { locationId: "dorm", activity: "resting", base: 55 },
        ],
        free: [
          { locationId: "cafe", activity: "hanging out", base: 80 },
          { locationId: "library", activity: "studying", base: 55 },
          { locationId: "dorm", activity: "resting", base: 60 },
        ],
      },
    },
  },

  "routine-lab-student": {
    id: "routine-lab-student",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "classroom", activity: "taking notes", base: 80 },
          { locationId: "library", activity: "reading papers", base: 70 },
          { locationId: "lab", activity: "testing ideas", base: 65 },
        ],
        free: [
          { locationId: "lab", activity: "prototyping", base: 80 },
          { locationId: "library", activity: "debugging concepts", base: 70 },
          { locationId: "cafe", activity: "brainstorming", base: 55 },
        ],
      },
      lab: {
        academic: [
          { locationId: "lab", activity: "setting up experiments", base: 90 },
          { locationId: "library", activity: "reading docs", base: 65 },
        ],
        free: [
          { locationId: "lab", activity: "iterating on prototypes", base: 80 },
          { locationId: "cafe", activity: "taking a break", base: 55 },
          { locationId: "dorm", activity: "resting", base: 50 },
        ],
      },
      off: {
        academic: [
          { locationId: "lab", activity: "side project tinkering", base: 70 },
          { locationId: "library", activity: "deep reading", base: 65 },
          { locationId: "cafe", activity: "casual chat", base: 55 },
        ],
        free: [
          { locationId: "cafe", activity: "hanging out", base: 65 },
          { locationId: "library", activity: "studying", base: 60 },
          { locationId: "dorm", activity: "resting", base: 55 },
        ],
      },
    },
  },

  "routine-cafe-student": {
    id: "routine-cafe-student",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "classroom", activity: "showing up last minute", base: 75 },
          { locationId: "cafe", activity: "grabbing coffee", base: 65 },
          { locationId: "library", activity: "quick review", base: 55 },
        ],
        free: [
          { locationId: "cafe", activity: "socializing", base: 85 },
          { locationId: "dorm", activity: "chilling", base: 60 },
          { locationId: "library", activity: "studying a bit", base: 50 },
        ],
      },
      lab: {
        academic: [
          { locationId: "cafe", activity: "coffee run", base: 75 },
          { locationId: "library", activity: "helping friends", base: 60 },
          { locationId: "lab", activity: "dropping by", base: 55 },
        ],
        free: [
          { locationId: "cafe", activity: "hanging out", base: 85 },
          { locationId: "dorm", activity: "chilling", base: 60 },
          { locationId: "library", activity: "studying a bit", base: 50 },
        ],
      },
      off: {
        academic: [
          { locationId: "cafe", activity: "camping out", base: 90 },
          { locationId: "dorm", activity: "sleeping in", base: 65 },
          { locationId: "library", activity: "light reading", base: 50 },
        ],
        free: [
          { locationId: "cafe", activity: "hanging out", base: 90 },
          { locationId: "dorm", activity: "chilling", base: 65 },
          { locationId: "library", activity: "studying a bit", base: 50 },
        ],
      },
    },
  },

  "routine-library-student": {
    id: "routine-library-student",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "classroom", activity: "taking notes", base: 80 },
          { locationId: "library", activity: "reading ahead", base: 70 },
        ],
        free: [
          { locationId: "library", activity: "deep studying", base: 90 },
          { locationId: "dorm", activity: "quiet rest", base: 55 },
          { locationId: "cafe", activity: "brief break", base: 50 },
        ],
      },
      lab: {
        academic: [
          { locationId: "library", activity: "reading docs", base: 85 },
          { locationId: "lab", activity: "observing demos", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "deep studying", base: 90 },
          { locationId: "dorm", activity: "quiet rest", base: 55 },
          { locationId: "cafe", activity: "brief break", base: 50 },
        ],
      },
      off: {
        academic: [
          { locationId: "library", activity: "catching up", base: 90 },
          { locationId: "cafe", activity: "quiet corner", base: 55 },
          { locationId: "dorm", activity: "resting", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "deep studying", base: 90 },
          { locationId: "dorm", activity: "quiet rest", base: 60 },
          { locationId: "cafe", activity: "brief break", base: 55 },
        ],
      },
    },
  },

  "routine-advisor": {
    id: "routine-advisor",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "advisor-office", activity: "meeting students", base: 90 },
          { locationId: "library", activity: "reviewing plans", base: 60 },
        ],
        free: [
          { locationId: "advisor-office", activity: "office hours", base: 85 },
          { locationId: "library", activity: "writing notes", base: 60 },
        ],
      },
      lab: {
        academic: [
          { locationId: "advisor-office", activity: "checking in", base: 80 },
          { locationId: "library", activity: "emailing", base: 60 },
        ],
        free: [
          { locationId: "advisor-office", activity: "office hours", base: 75 },
          { locationId: "library", activity: "writing notes", base: 60 },
        ],
      },
      off: {
        academic: [
          { locationId: "advisor-office", activity: "catching up on paperwork", base: 70 },
          { locationId: "library", activity: "quiet work", base: 65 },
        ],
        free: [
          { locationId: "advisor-office", activity: "wrapping up", base: 70 },
          { locationId: "library", activity: "quiet work", base: 65 },
        ],
      },
    },
  },

  "routine-teacher-classroom": {
    id: "routine-teacher-classroom",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "classroom", activity: "prepping lecture", base: 95 },
          { locationId: "library", activity: "grading", base: 60 },
        ],
        free: [
          { locationId: "classroom", activity: "wrapping up", base: 85 },
          { locationId: "library", activity: "grading", base: 65 },
        ],
      },
      lab: {
        academic: [
          { locationId: "library", activity: "planning curriculum", base: 70 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "planning curriculum", base: 70 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
      },
      off: {
        academic: [
          { locationId: "library", activity: "planning curriculum", base: 70 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "planning curriculum", base: 70 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
      },
    },
  },

  "routine-teacher-library": {
    id: "routine-teacher-library",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "library", activity: "hosting study hour", base: 90 },
          { locationId: "classroom", activity: "guest visit", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "office hour", base: 85 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
      },
      lab: {
        academic: [
          { locationId: "library", activity: "helping with research", base: 90 },
          { locationId: "lab", activity: "checking demos", base: 55 },
        ],
        free: [
          { locationId: "library", activity: "office hour", base: 85 },
          { locationId: "advisor-office", activity: "meetings", base: 60 },
        ],
      },
      off: {
        academic: [
          { locationId: "library", activity: "archiving materials", base: 80 },
          { locationId: "advisor-office", activity: "paperwork", base: 60 },
        ],
        free: [
          { locationId: "library", activity: "archiving materials", base: 80 },
          { locationId: "advisor-office", activity: "paperwork", base: 60 },
        ],
      },
    },
  },

  "routine-worker-cafe": {
    id: "routine-worker-cafe",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "cafe", activity: "working the counter", base: 95 },
          { locationId: "cafe", activity: "restocking", base: 80 },
        ],
        free: [
          { locationId: "cafe", activity: "closing tasks", base: 85 },
          { locationId: "cafe", activity: "restocking", base: 75 },
        ],
      },
      lab: {
        academic: [
          { locationId: "cafe", activity: "working the counter", base: 95 },
          { locationId: "cafe", activity: "restocking", base: 80 },
        ],
        free: [
          { locationId: "cafe", activity: "closing tasks", base: 85 },
          { locationId: "cafe", activity: "restocking", base: 75 },
        ],
      },
      off: {
        academic: [
          { locationId: "cafe", activity: "working the counter", base: 95 },
          { locationId: "cafe", activity: "restocking", base: 80 },
        ],
        free: [
          { locationId: "cafe", activity: "closing tasks", base: 85 },
          { locationId: "cafe", activity: "restocking", base: 75 },
        ],
      },
    },
  },

  "routine-tech-lab": {
    id: "routine-tech-lab",
    dayTypeToPhaseCandidates: {
      class: {
        academic: [
          { locationId: "lab", activity: "maintaining equipment", base: 75 },
          { locationId: "library", activity: "ordering parts", base: 60 },
        ],
        free: [
          { locationId: "lab", activity: "calibrating setups", base: 75 },
          { locationId: "library", activity: "writing notes", base: 60 },
        ],
      },
      lab: {
        academic: [
          { locationId: "lab", activity: "supporting lab day", base: 95 },
          { locationId: "lab", activity: "demo support", base: 85 },
        ],
        free: [
          { locationId: "lab", activity: "wrapping up", base: 80 },
          { locationId: "library", activity: "logging issues", base: 60 },
        ],
      },
      off: {
        academic: [
          { locationId: "lab", activity: "maintenance", base: 70 },
          { locationId: "library", activity: "paperwork", base: 60 },
        ],
        free: [
          { locationId: "lab", activity: "maintenance", base: 70 },
          { locationId: "library", activity: "paperwork", base: 60 },
        ],
      },
    },
  },
};
