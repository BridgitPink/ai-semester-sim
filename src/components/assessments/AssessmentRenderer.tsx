import type { Assessment, AssessmentAnswers, AssessmentQuestion } from "../../game/types/assessment";
import { MultipleChoiceQuestionRenderer } from "./MultipleChoiceQuestionRenderer.tsx";
import { TrueFalseQuestionRenderer } from "./TrueFalseQuestionRenderer.tsx";

export function AssessmentRenderer(props: {
  assessment: Assessment;
  answers: AssessmentAnswers;
  locked?: boolean;
  onAnswer: (questionId: string, value: string | boolean) => void;
  validationQuestions?: AssessmentQuestion[];
}) {
  const questions = props.validationQuestions ?? props.assessment.questions;
  const locked = props.locked ?? false;

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0 }}>{props.assessment.title}</h3>
        {props.assessment.description && (
          <p style={{ marginTop: "6px", color: "var(--color-text-secondary)" }}>
            {props.assessment.description}
          </p>
        )}
        {props.assessment.mode === "practice" && (
          <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            This practice quiz does not affect your grade.
          </p>
        )}
      </div>

      {questions.map((q) => {
        if (q.type === "mcq") {
          return (
            <MultipleChoiceQuestionRenderer
              key={q.id}
              question={q}
              value={typeof props.answers[q.id] === "string" ? (props.answers[q.id] as string) : undefined}
              locked={locked}
              onChange={(value: string) => props.onAnswer(q.id, value)}
            />
          );
        }

        if (q.type === "truefalse") {
          return (
            <TrueFalseQuestionRenderer
              key={q.id}
              question={q}
              value={typeof props.answers[q.id] === "boolean" ? (props.answers[q.id] as boolean) : undefined}
              locked={locked}
              onChange={(value: boolean) => props.onAnswer(q.id, value)}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
