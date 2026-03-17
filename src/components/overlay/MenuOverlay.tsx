import { useGameStore } from "../../store/useGameStore";
import { StatBar } from "../ui/StarBar";
import { PanelSection } from "../ui/PanelSection";

export function MenuOverlay() {
  const {
    menuOpen,
    toggleMenu,
    week,
    day,
    currentSemester,
    stats,
    courseCompletions,
    projectState,
  } = useGameStore();

  if (!menuOpen) return null;

  return (
    <>
      <div className="overlay-backdrop" onClick={toggleMenu} />
      <div className="modal modal--large">
        <div className="modal-content">
          <div className="modal-header">
            <h1>Menu</h1>
            <p>Press M or Tab to close</p>
          </div>

          <div className="modal-body modal-body--scrollable">
            {/* Progression Section */}
            <PanelSection title="Progression">
              <div className="progression-info">
                <p>
                  <strong>Week {week}</strong>, Day {day}
                </p>
                {currentSemester && (
                  <p style={{ color: "var(--color-text-secondary)" }}>
                    {currentSemester.title}
                  </p>
                )}
              </div>
            </PanelSection>

            {/* Stats Section */}
            <PanelSection title="Player Stats">
              <div className="stats-grid">
                <StatBar label="Energy" value={stats.energy} />
                <StatBar label="Focus" value={stats.focus} />
                <StatBar label="Stress" value={stats.stress} />
                <StatBar label="Confidence" value={stats.confidence} />
                <StatBar label="Knowledge" value={stats.knowledge} />
                <StatBar label="Project Progress" value={stats.projectProgress} />
              </div>
            </PanelSection>

            {/* Courses Section */}
            {courseCompletions.length > 0 && (
              <PanelSection title="Courses">
                <div className="courses-list">
                  {courseCompletions.map((completion) => (
                    <div key={completion.courseId} className="course-card">
                      <div className="course-card-header">
                        <h3>{completion.courseId}</h3>
                        <span className="course-progress">
                          {completion.progressPercent}%
                        </span>
                      </div>
                      <div className="course-progress-bar">
                        <div
                          className="course-progress-fill"
                          style={{ width: `${completion.progressPercent}%` }}
                        />
                      </div>
                      <p className="course-status">
                        {completion.lessonsCompleted.length} lessons completed
                      </p>
                      {completion.isCompleted && (
                        <p className="course-completed">✓ Course Complete</p>
                      )}
                    </div>
                  ))}
                </div>
              </PanelSection>
            )}

            {/* Project Section */}
            <PanelSection title="Final Project">
              <div className="project-progress">
                <div className="project-progress-header">
                  <span>Overall Progress</span>
                  <span className="project-progress-value">
                    {stats.projectProgress}%
                  </span>
                </div>
                <div className="project-progress-bar">
                  <div
                    className="project-progress-fill"
                    style={{ width: `${stats.projectProgress}%` }}
                  />
                </div>
              </div>

              {projectState.unlockedFeatures.length > 0 && (
                <div className="project-features">
                  <h4>Unlocked Features ({projectState.unlockedFeatures.length})</h4>
                  <ul className="feature-list">
                    {projectState.unlockedFeatures.map((feature) => (
                      <li key={feature}>
                        <span className="feature-icon">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </PanelSection>

            {/* Controls Section */}
            <PanelSection title="Controls">
              <div className="controls-list">
                <div className="control-item">
                  <strong>Arrow Keys</strong> - Move
                </div>
                <div className="control-item">
                  <strong>E</strong> - Interact
                </div>
                <div className="control-item">
                  <strong>M / Tab</strong> - Toggle Menu
                </div>
              </div>
            </PanelSection>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={toggleMenu}>
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
