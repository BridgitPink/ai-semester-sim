import type { MultipleChoiceQuestion } from "../../game/types/assessment";

export function MultipleChoiceQuestionRenderer(props: {
  question: MultipleChoiceQuestion;
  value?: string;
  locked?: boolean;
  onChange: (value: string) => void;
}) {
  const locked = props.locked ?? false;

  return (
    <div className="lesson-block" style={{ marginBottom: "14px" }}>
      <div style={{ fontWeight: 600, marginBottom: "8px" }}>{props.question.prompt}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {props.question.options.map((opt) => {
          const checked = props.value === opt.id;
          return (
            <label key={opt.id} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="radio"
                name={props.question.id}
                disabled={locked}
                checked={checked}
                onChange={() => props.onChange(opt.id)}
              />
              <span>{opt.text}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
