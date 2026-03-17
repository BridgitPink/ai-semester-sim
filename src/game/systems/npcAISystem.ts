import type { NpcProfile } from "../types/npc";

export function getNpcLine(npc: NpcProfile): string {
  switch (npc.mood) {
    case "focused":
      return `${npc.name} is locked in and thinking about project work.`;
    case "tired":
      return `${npc.name} looks exhausted and needs a break.`;
    case "social":
      return `${npc.name} seems ready to talk and share ideas.`;
    case "stressed":
      return `${npc.name} looks overwhelmed by deadlines.`;
    default:
      return `${npc.name} is hanging around campus.`;
  }
}