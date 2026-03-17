import type {
  LessonContentBlock,
  LessonContentBlockType,
  VideoBlock,
} from "../types/course";

export function isKnownBlockType(value: unknown): value is LessonContentBlockType {
  return value === "text" || value === "video" || value === "example" || value === "tip";
}

export function isVideoBlock(block: LessonContentBlock): block is VideoBlock {
  return block.type === "video";
}
