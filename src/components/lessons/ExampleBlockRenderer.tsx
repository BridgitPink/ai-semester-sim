import type { ExampleBlock } from "../../game/types/course";

export function ExampleBlockRenderer(props: { block: ExampleBlock }) {
  const title = typeof props.block.title === "string" ? props.block.title.trim() : "Example";
  const text = typeof props.block.text === "string" ? props.block.text.trim() : "";
  if (!text) return null;

  return (
    <div className="lesson-block lesson-block--example">
      <p>
        <strong>{title}:</strong> {text}
      </p>
    </div>
  );
}
