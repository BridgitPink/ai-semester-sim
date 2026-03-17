import type { LessonContentBlock } from "../../game/types/course";
import { isKnownBlockType } from "../../game/systems/lessonContentUtils";
import { TextBlockRenderer } from "./TextBlockRenderer";
import { VideoBlockRenderer } from "./VideoBlockRenderer";
import { ExampleBlockRenderer } from "./ExampleBlockRenderer";
import { TipBlockRenderer } from "./TipBlockRenderer";

export function LessonContentRenderer(props: { contentBlocks?: LessonContentBlock[] }) {
  const blocks = Array.isArray(props.contentBlocks) ? props.contentBlocks : [];

  if (blocks.length === 0) {
    return (
      <div className="lesson-content">
        <p style={{ color: "var(--color-text-secondary)" }}>
          Lesson content not available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="lesson-content">
      {blocks.map((block, index) => {
        try {
          if (!block || typeof block !== "object") return null;
          if (!isKnownBlockType((block as { type?: unknown }).type)) return null;

          switch (block.type) {
            case "text":
              return <TextBlockRenderer key={index} block={block} />;
            case "video":
              return <VideoBlockRenderer key={index} block={block} />;
            case "example":
              return <ExampleBlockRenderer key={index} block={block} />;
            case "tip":
              return <TipBlockRenderer key={index} block={block} />;
            default:
              return null;
          }
        } catch {
          return (
            <div key={index} className="lesson-block">
              <p style={{ color: "var(--color-text-secondary)" }}>
                Content block failed to render. Continue with lesson.
              </p>
            </div>
          );
        }
      })}
    </div>
  );
}
