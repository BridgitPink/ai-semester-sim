import { useGameStore } from "../../store/useGameStore";
import { StatBar } from "../ui/StarBar";
import type { CourseId } from "../../game/types/course";

export function CoursePanel() {
  const {
    closePanel,
    currentSemester,
    courseCompletions,
    completedLessons,
    openLessonModal,
    openOfficialLessonSession,
    gradebookByCourse,
    getCourseGradePercent,
  } = useGameStore();

  // Get first incomplete course or the first course
  const activeCourse =
    courseCompletions.length > 0
      ? courseCompletions.find((c) => !c.isCompleted)
      : null;

  if (!activeCourse) {
    return (
      <>
        <div className="modal-header">
          <h1>Courses</h1>
          <p>All courses completed!</p>
        </div>
        <div className="modal-body">
          <p>Congratulations! You have completed all three AI courses.</p>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Now focus on finishing your final project.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={closePanel}>
            Close
          </button>
        </div>
      </>
    );
  }

  // Find the course definition
  const courseData = currentSemester?.courses.find((course) => course.id === activeCourse.courseId);

  if (!courseData) {
    return (
      <>
        <div className="modal-header">
          <h1>Error</h1>
        </div>
        <div className="modal-body">
          <p>Course not found.</p>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={closePanel}>
            Close
          </button>
        </div>
      </>
    );
  }

  const courseId = activeCourse.courseId as CourseId;
  const gradePercent = getCourseGradePercent(courseId);
  const passingScore = 70;

  const attemptRows = Object.values(gradebookByCourse[courseId]?.gradedAttempts ?? {}).sort(
    (a, b) => (a.week ?? 0) - (b.week ?? 0)
  );

  return (
    <>
      <div className="modal-header">
        <h1>{courseData.title}</h1>
        <p>{courseData.description}</p>
      </div>

      <div className="modal-body modal-body--scrollable">
        {/* Progress */}
        <div className="course-panel-progress">
          <StatBar
            label="Course Progress"
            value={activeCourse.progressPercent}
            showValue={true}
          />
        </div>

        {/* Gradebook (minimal) */}
        <div className="lesson-block" style={{ marginTop: "12px" }}>
          <h4 style={{ marginTop: 0 }}>Gradebook</h4>
          <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
            Grade-to-date: {gradePercent === null ? "—" : `${gradePercent}%`} (passing: {passingScore}%)
          </p>
          {attemptRows.length > 0 && (
            <div style={{ marginTop: "8px" }}>
              {attemptRows.map((row) => (
                <div key={row.assessmentId} style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  Week {row.week} {row.type}: {row.result.breakdown.scorePercent}%
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lessons */}
        <div className="lessons-grid">
          {courseData.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);

            const isCheckpoint = lesson.gradedAssessment?.type === "checkpoint";
            const checkpointAssessmentId = lesson.gradedAssessment?.id;
            const checkpointSubmitted =
              isCheckpoint &&
              typeof checkpointAssessmentId === "string" &&
              Boolean(gradebookByCourse[courseId]?.gradedAttempts?.[checkpointAssessmentId]);

            return (
              <div
                key={lesson.id}
                className={`lesson-card ${isCompleted ? "lesson-card--completed" : ""}`}
              >
                <div className="lesson-card-header">
                  {isCompleted && <span className="lesson-badge">✓</span>}
                  <h3>{lesson.title}</h3>
                </div>
                <p className="lesson-concept">{lesson.concept}</p>
                <button
                  className="btn btn-small"
                  onClick={() => openLessonModal(lesson)}
                  disabled={isCompleted}
                >
                  {isCompleted ? "Completed" : "Start Lesson"}
                </button>

                {isCheckpoint && (
                  <button
                    className="btn btn-small"
                    style={{ marginTop: "6px" }}
                    onClick={() =>
                      openOfficialLessonSession(lesson.id, "course-panel", { startPhase: "assessment" })
                    }
                    disabled={!isCompleted || checkpointSubmitted}
                  >
                    {checkpointSubmitted ? "Checkpoint Submitted" : "Take Checkpoint"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={closePanel}>
          Close
        </button>
      </div>
    </>
  );
}
