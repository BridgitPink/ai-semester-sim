import { useGameStore } from "../../store/useGameStore";
import { courses } from "../../game/data/courses";
import { StatBar } from "../ui/StarBar";

export function CoursePanel() {
  const {
    closePanel,
    courseCompletions,
    completedLessons,
    openLessonModal,
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
  const courseData = courses.find((c) => c.id === activeCourse.courseId);

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

        {/* Lessons */}
        <div className="lessons-grid">
          {courseData.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);

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
