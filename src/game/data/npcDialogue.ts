import type {
  CampusLocationId,
  DayPhase,
  DayType,
  NpcDialogueSetId,
  NpcMood,
} from "../types/npc";

export type RelationshipBand = "low" | "mid" | "high";

export interface NpcDialogueContext {
  dayType: DayType;
  phase: DayPhase;
  locationId: CampusLocationId;
  mood: NpcMood;
  relationshipBand: RelationshipBand;
  beforeAcademic: boolean;
}

export interface NpcDialogueSet {
  id: NpcDialogueSetId;
  linesByKey: Record<string, string[]>;
}

function key(ctx: Partial<NpcDialogueContext>): string {
  // Stable key order; omit undefined parts.
  const parts: string[] = [];
  if (ctx.dayType) parts.push(`day:${ctx.dayType}`);
  if (ctx.phase) parts.push(`phase:${ctx.phase}`);
  if (ctx.locationId) parts.push(`loc:${ctx.locationId}`);
  if (ctx.mood) parts.push(`mood:${ctx.mood}`);
  if (ctx.relationshipBand) parts.push(`rel:${ctx.relationshipBand}`);
  return parts.join("|");
}

export function pickDialogueLines(
  set: NpcDialogueSet,
  ctx: NpcDialogueContext,
  stableIndex: number,
  count: number = 2
): string[] {
  const candidates: string[][] = [];

  // Most-specific → least-specific fallbacks.
  const keysToTry = [
    key(ctx),
    // Keep location but drop the most volatile dimensions.
    key({ dayType: ctx.dayType, phase: ctx.phase, locationId: ctx.locationId }),
    key({ ...ctx, locationId: undefined }),
    key({ ...ctx, mood: undefined }),
    key({ ...ctx, relationshipBand: undefined }),
    key({ dayType: ctx.dayType, phase: ctx.phase }),
    key({ locationId: ctx.locationId }),
    key({ phase: ctx.phase }),
    "default",
  ];

  for (const k of keysToTry) {
    const lines = set.linesByKey[k];
    if (lines && lines.length > 0) {
      candidates.push(lines);
      break;
    }
  }

  const pool = candidates[0] ?? ["…"];
  const start = Math.abs(stableIndex) % pool.length;

  const result: string[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    result.push(pool[(start + i) % pool.length]);
  }

  return result;
}

export const npcDialogueSets: Record<NpcDialogueSetId, NpcDialogueSet> = {
  "dialogue-roommate": {
    id: "dialogue-roommate",
    linesByKey: {
      "day:class|phase:academic|loc:dorm": [
        "Morning. You heading out soon?",
        "If you’re doing class, grab your notes before you go.",
      ],
      "day:class|phase:free|loc:dorm": [
        "How’d class go?",
        "Want to decompress for a minute?",
      ],
      "phase:free": [
        "I’m around if you need a second opinion.",
        "You’ve got this. Small steps.",
      ],
      default: [
        "Hey. Everything okay?",
        "Try not to run yourself into the ground.",
      ],
    },
  },

  "dialogue-classmate": {
    id: "dialogue-classmate",
    linesByKey: {
      "day:class|phase:academic": [
        "I’m trying to lock in before class.",
        "If you finish the lesson early, tell me what clicked for you.",
      ],
      "day:lab|phase:academic": [
        "No lecture today—kind of nice.",
        "I’m going to review and then take a break.",
      ],
      "day:off|phase:free": [
        "Off day energy.",
        "You doing something fun, or catching up on studying?",
      ],
      default: [
        "Hey.",
        "How’s the semester treating you?",
      ],
    },
  },

  "dialogue-lab-student": {
    id: "dialogue-lab-student",
    linesByKey: {
      "day:lab|phase:academic": [
        "Lab day. Best day.",
        "If your build feels messy, tighten the loop: input → output → test.",
      ],
      "phase:free": [
        "I’m iterating on something small.",
        "Want the quick version or the deep dive?",
      ],
      default: [
        "I’m thinking about experiments.",
        "Sometimes the simplest baseline wins.",
      ],
    },
  },

  "dialogue-cafe-student": {
    id: "dialogue-cafe-student",
    linesByKey: {
      "loc:cafe": [
        "You look like you could use a coffee break.",
        "If you’re stuck, talk it out—half the time the answer shows up.",
      ],
      default: [
        "Hey!",
        "What’s the vibe today?",
      ],
    },
  },

  "dialogue-library-student": {
    id: "dialogue-library-student",
    linesByKey: {
      "loc:library": [
        "Quiet time helps me think.",
        "If you’re overwhelmed, pick one concept and drill it.",
      ],
      default: [
        "I’m trying to stay focused.",
        "One page at a time.",
      ],
    },
  },

  "dialogue-advisor": {
    id: "dialogue-advisor",
    linesByKey: {
      "loc:advisor-office": [
        "Quick check-in?",
        "Consistency beats intensity—aim for steady progress this week.",
      ],
      default: [
        "Keep an eye on your stress.",
        "If you fall behind, we can adjust your plan.",
      ],
    },
  },

  "dialogue-teacher": {
    id: "dialogue-teacher",
    linesByKey: {
      "day:class|phase:academic": [
        "Focus on the core idea, not the buzzwords.",
        "If you can explain it simply, you understand it.",
      ],
      default: [
        "Stay curious.",
        "Ask good questions—then test your assumptions.",
      ],
    },
  },

  "dialogue-worker": {
    id: "dialogue-worker",
    linesByKey: {
      "loc:cafe": [
        "Welcome in.",
        "Take a breath—you’re doing fine.",
      ],
      "loc:campus-store": [
        "Welcome to the campus store.",
        "If you need supplies, I can point you to the right shelf.",
      ],
      "loc:campus-food": [
        "You can order right here.",
        "Grab a table when you are ready.",
      ],
      default: [
        "Hey there.",
        "Need anything?",
      ],
    },
  },

  "dialogue-lab-tech": {
    id: "dialogue-lab-tech",
    linesByKey: {
      "loc:lab": [
        "Careful with the setups.",
        "If something breaks, write down what you changed—future you will thank you.",
      ],
      default: [
        "Keep your workspace tidy.",
        "It saves time later.",
      ],
    },
  },
};
