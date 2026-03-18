import { useGameStore } from "../../store/useGameStore";
import { validateAssessment } from "../../game/systems/assessmentSystem";
import { finalizeOfficialLessonCompletion, applyStudySessionBonuses } from "../../game/systems/lessonSessionSystem";
import { LessonContentRenderer } from "../lessons/LessonContentRenderer";
import { AssessmentRenderer } from "../assessments/AssessmentRenderer";
import { AssessmentResults } from "../assessments/AssessmentResults";

/**
 * LessonModal Component - Displays full lesson content and completion interface
 * Rendered inside Hud component alongside other modals
 * Handles lesson completion, stat rewards, and course milestone detection
 */
export function LessonModal() {
  const {
    currentLesson,
    lessonModalOpen,
    closeLessonModal,
    completedLessons,
    lessonSession,
    setLessonSessionPhase,
    setAssessmentAnswer,
    submitLessonSessionAssessment,
  } = useGameStore();

  if (!lessonModalOpen || !currentLesson) return null;

  const isCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

  const sessionKind = lessonSession?.kind ?? "official";
  const phase = lessonSession?.phase ?? "content";
  const answers = lessonSession?.answers ?? {};
  const result = lessonSession?.result;

  const assessment = sessionKind === "official" ? currentLesson.gradedAssessment : currentLesson.studyExtension?.practiceAssessment;
  const validation = validateAssessment(assessment);
  const safeQuestions = validation.safeQuestions;

  const isCheckpoint = sessionKind === "official" && assessment?.type === "checkpoint";

  const studyBlocks = [
    ...(currentLesson.studyExtension?.recapBlocks ?? []),
    ...(currentLesson.studyExtension?.extraBlocks ?? []),
  ];
  const contentBlocksToRender = sessionKind === "study" && studyBlocks.length > 0 ? studyBlocks : currentLesson.contentBlocks;

  const handleClose = () => {
    closeLessonModal();
  };

  const handleFinalizeOfficialCompletion = () => {
    if (isCompleted) return;
    const outcome = finalizeOfficialLessonCompletion(currentLesson.id);
    if (!outcome.success) {
      console.warn(outcome.message);
    }
    handleClose();
  };

  const handleFinishStudy = () => {
    const outcome = applyStudySessionBonuses(currentLesson.id);
    if (!outcome.success) {
      console.warn(outcome.message);
    }
    handleClose();
  };

  return (
    <>
      <div className="overlay-backdrop" onClick={closeLessonModal} />
      <div className="modal modal--lesson">
        <div className="modal-content">
          <div className="modal-header">
            <h1>{currentLesson.title}</h1>
            <p className="lesson-concept">{currentLesson.concept}</p>
          </div>

          <div className="modal-body modal-body--lesson">
            {phase !== "assessment" && phase !== "results" && (
              <>
                {typeof currentLesson.summary === "string" && currentLesson.summary.trim().length > 0 && (
                  <div className="lesson-summary">
                    <p>{currentLesson.summary}</p>
                  </div>
                )}

                {phase === "intro" && (
                  <p style={{ marginTop: 0, color: "var(--color-text-secondary)" }}>
                    {sessionKind === "official"
                      ? isCheckpoint
                        ? "Read the lesson to complete the lecture. The checkpoint is taken separately."
                        : "Read the lesson, then submit the quiz to complete."
                      : "Study mode: review content and optional practice quiz."}
                  </p>
                )}

                <LessonContentRenderer contentBlocks={contentBlocksToRender} />

                {/* Rewards Preview (official only) */}
                {sessionKind === "official" && (
                  <div className="lesson-rewards">
                    <h4>Completion Rewards</h4>
                    <div className="rewards-list">
                      <div className="reward-item">
                        <span className="reward-icon">📚</span>
                        <span>+{currentLesson.completionReward.knowledge} Knowledge</span>
                      </div>
                      <div className="reward-item">
                        <span className="reward-icon">💪</span>
                        <span>+{currentLesson.completionReward.confidence} Confidence</span>
                      </div>
                      {currentLesson.completionReward.focus && (
                        <div className="reward-item">
                          <span className="reward-icon">🎯</span>
                          <span>+{currentLesson.completionReward.focus} Focus</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {phase === "assessment" && assessment && validation.isValid && (
              <AssessmentRenderer
                assessment={assessment}
                answers={answers}
                onAnswer={(questionId, value) => setAssessmentAnswer(questionId, value)}
                validationQuestions={safeQuestions}
              />
            )}

            {phase === "assessment" && (!assessment || !validation.isValid) && (
              <div className="lesson-block">
                <h4 style={{ marginTop: 0 }}>Assessment unavailable</h4>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  This lesson does not have a valid assessment authored yet.
                </p>
              </div>
            )}

            {phase === "results" && assessment && result && (
              <AssessmentResults assessment={assessment} result={result} answers={answers} questions={safeQuestions} />
            )}
          </div>

          <div className="modal-footer">
            {phase === "intro" && (
              <>
                <button className="btn btn-primary" onClick={() => setLessonSessionPhase("content")}>
                  Start
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </>
            )}

            {phase === "content" && sessionKind === "official" && (
              <>
                {assessment ? (
                  isCheckpoint ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleFinalizeOfficialCompletion}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "✓ Lecture Completed" : "Finish Lecture"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => setLessonSessionPhase("assessment")}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "✓ Completed" : "Take Quiz"}
                    </button>
                  )
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleFinalizeOfficialCompletion}
                    disabled={isCompleted}
                  >
                    {isCompleted ? "✓ Completed" : "Complete Lesson"}
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </>
            )}

            {phase === "content" && sessionKind === "study" && (
              <>
                {assessment ? (
                  <button className="btn btn-primary" onClick={() => setLessonSessionPhase("assessment")}>
                    Practice Quiz
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleFinishStudy}>
                    Finish Study
                  </button>
                )}
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </>
            )}

            {phase === "assessment" && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    submitLessonSessionAssessment();
                  }}
                >
                  Submit
                </button>
                <button className="btn btn-secondary" onClick={() => setLessonSessionPhase("content")}>
                  Back
                </button>
              </>
            )}

            {phase === "results" && sessionKind === "official" && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={handleFinalizeOfficialCompletion}
                  disabled={isCompleted}
                >
                  {isCompleted ? "✓ Completed" : "Complete Lesson"}
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </>
            )}

            {phase === "results" && sessionKind === "study" && (
              <>
                <button className="btn btn-primary" onClick={handleFinishStudy}>
                  Finish Study
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
