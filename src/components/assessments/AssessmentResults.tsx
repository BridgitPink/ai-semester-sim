import type { Assessment, AssessmentAnswers, AssessmentQuestion, AssessmentResult } from "../../game/types/assessment";

function renderQuestionReview(q: AssessmentQuestion, answers: AssessmentAnswers) {
  const userAnswer = answers[q.id];

  if (q.type === "mcq") {
    const correct = q.correctOptionId;
    const selected = typeof userAnswer === "string" ? userAnswer : undefined;
    const selectedLabel = q.options.find((o) => o.id === selected)?.text;
    const correctLabel = q.options.find((o) => o.id === correct)?.text;
    const isCorrect = selected !== undefined && selected === correct;

    return {
      prompt: q.prompt,
      isCorrect,
      selectedText: selectedLabel ?? (selected ? selected : "No answer"),
      correctText: correctLabel ?? correct,
      explanation: q.explanation,
    };
  }

  const correct = q.correctAnswer;
  const selected = typeof userAnswer === "boolean" ? userAnswer : undefined;
  const isCorrect = selected !== undefined && selected === correct;

  return {
    prompt: q.prompt,
    isCorrect,
    selectedText: selected === undefined ? "No answer" : selected ? "True" : "False",
    correctText: correct ? "True" : "False",
    explanation: q.explanation,
  };
}

export function AssessmentResults(props: {
  assessment: Assessment;
  result: AssessmentResult;
  answers: AssessmentAnswers;
  questions: AssessmentQuestion[];
}) {
  const score = props.result.breakdown.scorePercent;
  const passed = props.result.passed;

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <h3 style={{ margin: 0 }}>Results</h3>
        <p style={{ marginTop: "6px", color: "var(--color-text-secondary)" }}>
          Score: <strong>{score}%</strong> ({props.result.breakdown.correctCount}/
          {props.result.breakdown.totalCount})
          {typeof passed === "boolean" && (
            <>
              {" "}— {passed ? "Passed" : "Not passed"}
            </>
          )}
        </p>
        {props.assessment.mode === "graded" ? (
          <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Recorded to your course gradebook. (One attempt)
          </p>
        ) : (
          <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            Practice only — does not affect your grade.
          </p>
        )}
      </div>

      {props.result.revealSolutions && (
        <div>
          <h4 style={{ marginTop: 0 }}>Review</h4>
          {props.questions.map((q) => {
            const review = renderQuestionReview(q, props.answers);
            return (
              <div key={q.id} className="lesson-block" style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: 600, marginBottom: "6px" }}>{review.prompt}</div>
                <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  Your answer: {review.selectedText}
                  <br />
                  Correct: {review.correctText}
                  <br />
                  {review.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </div>
                {review.explanation && (
                  <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                    {review.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
