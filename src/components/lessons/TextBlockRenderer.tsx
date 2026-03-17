import type { TextBlock } from "../../game/types/course";

export function TextBlockRenderer(props: { block: TextBlock }) {
  const text = typeof props.block.text === "string" ? props.block.text.trim() : "";
  if (!text) return null;

  return (
    <div className="lesson-block lesson-block--text">
      <p>{text}</p>
    </div>
  );
}
