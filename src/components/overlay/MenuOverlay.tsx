import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { StatBar } from "../ui/StarBar";
import { PanelSection } from "../ui/PanelSection";
import { resetGame } from "../../game/bootstrap";
import {
  getAcademicReadiness,
  getKnowledgeStats,
  getPrimaryGameplayStats,
  getSecondaryPlayerStats,
  getSocialReadiness,
} from "../../game/systems/playerSelectors";

export function MenuOverlay() {
  const [isResetting, setIsResetting] = useState(false);
  const {
    menuOpen,
    toggleMenu,
    week,
    day,
    currentSemester,
    courseCompletions,
    projectState,
  } = useGameStore();

  const primaryGameplayStats = getPrimaryGameplayStats();
  const secondaryPlayerStats = getSecondaryPlayerStats();
  const knowledgeStats = getKnowledgeStats();
  const academicReadiness = getAcademicReadiness();
  const socialReadiness = getSocialReadiness();

  const handleResetGame = async () => {
    if (isResetting) {
      return;
    }

    const confirmed = window.confirm(
      "Restart semester? This will clear your cloud save and reset progress for this account."
    );
    if (!confirmed) {
      return;
    }

    setIsResetting(true);
    try {
      await resetGame();
    } finally {
      setIsResetting(false);
    }
  };

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

            <PanelSection title="Core Stats">
              <div className="stats-grid">
                {primaryGameplayStats.map((stat) => (
                  <StatBar key={stat.key} label={stat.label} value={stat.value} />
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Player Profile">
              <div className="stats-grid">
                {secondaryPlayerStats.map((stat) => (
                  <StatBar key={stat.key} label={stat.label} value={stat.value} />
                ))}
              </div>
            </PanelSection>

            <PanelSection title="Academic Progress">
              <div className="stats-grid">
                {knowledgeStats.map((stat) => (
                  <StatBar key={stat.key} label={stat.label} value={stat.value} />
                ))}
                <StatBar label="Academic Readiness" value={academicReadiness} />
                <StatBar label="Social Readiness" value={socialReadiness} />
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
                    {projectState.progress.overall}%
                  </span>
                </div>
                <div className="project-progress-bar">
                  <div
                    className="project-progress-fill"
                    style={{ width: `${projectState.progress.overall}%` }}
                  />
                </div>
              </div>

              <div className="stats-grid" style={{ marginTop: 12 }}>
                <StatBar label="Prompting" value={projectState.progress.prompting} />
                <StatBar label="Retrieval" value={projectState.progress.retrieval} />
                <StatBar label="Knowledge Base" value={projectState.progress.knowledgeBase} />
                <StatBar label="Evaluation" value={projectState.progress.evaluation} />
                <StatBar label="Interface" value={projectState.progress.interface} />
              </div>

              {projectState.milestones.length > 0 && (
                <div className="project-features" style={{ marginTop: 12 }}>
                  <h4>Milestones</h4>
                  <ul className="feature-list">
                    {projectState.milestones.map((milestone) => (
                      <li key={milestone.id}>
                        <span className="feature-icon">{milestone.isCompleted ? "✓" : "•"}</span>
                        {milestone.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
            <button className="btn btn-secondary" onClick={handleResetGame} disabled={isResetting}>
              {isResetting ? "Resetting..." : "Restart Semester"}
            </button>
            <button className="btn btn-secondary" onClick={toggleMenu}>
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
