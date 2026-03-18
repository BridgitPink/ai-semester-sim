import type { TrueFalseQuestion } from "../../game/types/assessment";

export function TrueFalseQuestionRenderer(props: {
  question: TrueFalseQuestion;
  value?: boolean;
  locked?: boolean;
  onChange: (value: boolean) => void;
}) {
  const locked = props.locked ?? false;

  return (
    <div className="lesson-block" style={{ marginBottom: "14px" }}>
      <div style={{ fontWeight: 600, marginBottom: "8px" }}>{props.question.prompt}</div>
      <div style={{ display: "flex", gap: "12px" }}>
        <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="radio"
            name={props.question.id}
            disabled={locked}
            checked={props.value === true}
            onChange={() => props.onChange(true)}
          />
          <span>True</span>
        </label>
        <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="radio"
            name={props.question.id}
            disabled={locked}
            checked={props.value === false}
            onChange={() => props.onChange(false)}
          />
          <span>False</span>
        </label>
      </div>
    </div>
  );
}
