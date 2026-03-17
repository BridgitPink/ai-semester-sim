import type { TipBlock } from "../../game/types/course";

export function TipBlockRenderer(props: { block: TipBlock }) {
  const text = typeof props.block.text === "string" ? props.block.text.trim() : "";
  if (!text) return null;

  return (
    <div className="lesson-block lesson-block--tip">
      <p>
        <strong>Tip:</strong> {text}
      </p>
    </div>
  );
}
