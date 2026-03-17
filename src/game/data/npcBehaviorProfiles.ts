import type { NpcBehaviorProfileId, NpcMood } from "../types/npc";

export interface NpcBehaviorProfile {
  id: NpcBehaviorProfileId;

  routineWeight: number; // how strongly the NPC sticks to preferred routine
  socialWeight: number; // preference for cafe/social hubs
  studyWeight: number; // preference for library/classroom
  labWeight: number; // preference for lab
  restWeight: number; // preference for dorm/rest

  moodToWeightDelta?: Partial<Record<NpcMood, Partial<Pick<NpcBehaviorProfile,
    "routineWeight" | "socialWeight" | "studyWeight" | "labWeight" | "restWeight"
  >>>>;
}

export const npcBehaviorProfiles: Record<NpcBehaviorProfileId, NpcBehaviorProfile> = {
  "behavior-roommate": {
    id: "behavior-roommate",
    routineWeight: 1.1,
    socialWeight: 0.8,
    studyWeight: 0.9,
    labWeight: 0.6,
    restWeight: 1.2,
    moodToWeightDelta: {
      tired: { restWeight: 0.4 },
      relaxed: { restWeight: 0.2 },
      stressed: { restWeight: 0.2, socialWeight: -0.1 },
    },
  },
  "behavior-studious": {
    id: "behavior-studious",
    routineWeight: 1.2,
    socialWeight: 0.6,
    studyWeight: 1.3,
    labWeight: 0.9,
    restWeight: 0.8,
    moodToWeightDelta: {
      focused: { studyWeight: 0.3 },
      tired: { restWeight: 0.2, studyWeight: -0.1 },
      stressed: { studyWeight: -0.2, restWeight: 0.2 },
    },
  },
  "behavior-social": {
    id: "behavior-social",
    routineWeight: 0.9,
    socialWeight: 1.4,
    studyWeight: 0.7,
    labWeight: 0.7,
    restWeight: 0.8,
    moodToWeightDelta: {
      social: { socialWeight: 0.3 },
      stressed: { socialWeight: -0.2, restWeight: 0.2 },
      tired: { restWeight: 0.2, socialWeight: -0.1 },
    },
  },
  "behavior-lab": {
    id: "behavior-lab",
    routineWeight: 1.1,
    socialWeight: 0.6,
    studyWeight: 0.9,
    labWeight: 1.4,
    restWeight: 0.8,
    moodToWeightDelta: {
      focused: { labWeight: 0.3 },
      tired: { restWeight: 0.2, labWeight: -0.1 },
      stressed: { labWeight: -0.1, restWeight: 0.2 },
    },
  },
  "behavior-library": {
    id: "behavior-library",
    routineWeight: 1.2,
    socialWeight: 0.5,
    studyWeight: 1.5,
    labWeight: 0.6,
    restWeight: 0.8,
    moodToWeightDelta: {
      focused: { studyWeight: 0.3 },
      relaxed: { studyWeight: 0.1 },
      tired: { restWeight: 0.2, studyWeight: -0.2 },
    },
  },
  "behavior-staff": {
    id: "behavior-staff",
    routineWeight: 1.5,
    socialWeight: 0.7,
    studyWeight: 0.7,
    labWeight: 0.7,
    restWeight: 0.7,
  },
};
