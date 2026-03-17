import { useGameStore } from "../../store/useGameStore";
import { findCourseForLesson, onCourseCompleted } from "../../game/systems/semesterSystem";
import { getRequiredLessonForToday } from "../../game/systems/academicScheduleSystem";
import { LessonContentRenderer } from "../lessons/LessonContentRenderer";

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
    courseCompletions,
    addCompletedLesson,
    updateStats,
    completeMandatoryActivity,
  } = useGameStore();

  if (!lessonModalOpen || !currentLesson) return null;

  const handleCompleteLesson = () => {
    const lesson = currentLesson;

    // Capture today's required lesson BEFORE we mutate completion state.
    const requiredLesson = getRequiredLessonForToday();
    const satisfiesTodaysRequirement = requiredLesson?.id === lesson.id;
    
    // Find which course this lesson belongs to using safe traversal
    const course = findCourseForLesson(lesson.id);
    if (!course) {
      console.error(`Course not found for lesson ${lesson.id}`);
      closeLessonModal();
      return;
    }

    // Find course completion tracking
    const courseCompletion = courseCompletions.find((c) => c.courseId === course.id);
    if (!courseCompletion) {
      console.error(`Course completion not found for ${course.id}`);
      closeLessonModal();
      return;
    }

    // Add lesson to completed
    addCompletedLesson(lesson.id, course.id);

    // Consume today's academic block if this is the scheduled required lesson.
    if (satisfiesTodaysRequirement) {
      completeMandatoryActivity(lesson.id);
    }
    
    // Apply rewards
    updateStats({
      knowledge: Math.min(100, completedLessons.length * 15 + lesson.completionReward.knowledge),
      confidence: Math.min(100, completedLessons.length * 10 + lesson.completionReward.confidence),
      focus: lesson.completionReward.focus
        ? Math.min(100, Math.max(0, 80 - completedLessons.length * 5 + lesson.completionReward.focus))
        : Math.max(0, 80 - completedLessons.length * 5),
    });

    // Check if course is now complete after this lesson
    // The store will have updated courseCompletion.isCompleted in addCompletedLesson
    // We need to check the updated state
    const updatedCompletion = useGameStore.getState().courseCompletions.find((c) => c.courseId === course.id);
    if (updatedCompletion && updatedCompletion.isCompleted && !updatedCompletion.milestoneUnlocked) {
      // Course just completed - trigger feature unlock
      onCourseCompleted(course.id);
    }

    closeLessonModal();
  };

  const isCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;

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
            {typeof currentLesson.summary === "string" && currentLesson.summary.trim().length > 0 && (
              <div className="lesson-summary">
                <p>{currentLesson.summary}</p>
              </div>
            )}

            <LessonContentRenderer contentBlocks={currentLesson.contentBlocks} />

            {/* Rewards Preview */}
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
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleCompleteLesson}
              disabled={isCompleted}
            >
              {isCompleted ? "✓ Completed" : "Complete Lesson"}
            </button>
            <button className="btn btn-secondary" onClick={closeLessonModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
