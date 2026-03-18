import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { StatBar } from "./ui/StarBar";
import { getCurrentDaySummary, canSleepNow } from "../game/systems/timeSystem";
import { getAcademicReadiness, getSocialReadiness } from "../game/systems/playerSelectors";

type TabType = "stats" | "course" | "project";

/**
 * Sidebar Component - Persistent left panel with tabbed interface
 * 
 * Features:
 * - Week/Day progress at top
 * - 3 tabs: Stats, Courses, Project
 * - Displays player progression and state
 * - Integrated dark theme styling
 */
export function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const {
    knowledge,
    stats,
    projectProgress,
    courseCompletions,
    projectState,
  } = useGameStore();

  const daySummary = getCurrentDaySummary();
  const canSleep = canSleepNow();
  const academicReadiness = getAcademicReadiness();
  const socialReadiness = getSocialReadiness();

  return (
    <div className="sidebar">
      {/* Header with progression */}
      <div className="sidebar-header">
        <div className="sidebar-title">AI Semester Sim</div>
        <div className="sidebar-progress">
          Week {daySummary.week} • {daySummary.dayName}
        </div>
        <div className="sidebar-day-type">
          {daySummary.dayTypeLabel}
        </div>
      </div>

      {/* Tab buttons */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveTab("stats")}
        >
          Stats
        </button>
        <button
          className={`sidebar-tab ${activeTab === "course" ? "active" : ""}`}
          onClick={() => setActiveTab("course")}
        >
          Courses
        </button>
        <button
          className={`sidebar-tab ${activeTab === "project" ? "active" : ""}`}
          onClick={() => setActiveTab("project")}
        >
          Project
        </button>
      </div>

      {/* Tab content */}
      <div className="sidebar-content">
        {/* Stats Tab */}
        {activeTab === "stats" && (
          <div className="sidebar-section">
            <h2>Day Progress</h2>
            <div className="sidebar-day-info">
              <div className="day-info-row">
                <span className="label">Mandatory Activity:</span>
                <span className="value">{daySummary.mandatoryActivityLabel}</span>
              </div>
              <div className="day-info-row">
                <span className="label">Free Actions:</span>
                <span className="value">{daySummary.freeActionsRemaining}/3</span>
              </div>
              {canSleep && (
                <div className="day-info-hint">
                  💤 Ready to sleep
                </div>
              )}
            </div>

            <h2>Player Stats</h2>
            <div className="sidebar-stats">
              <StatBar label="Energy" value={stats.energy} />
              <StatBar label="Stress" value={stats.stress} />
              <StatBar label="Focus" value={stats.focus} />
              <StatBar label="Confidence" value={stats.confidence} />
              <StatBar label="Charisma" value={stats.charisma} />
              <StatBar label="Curiosity" value={stats.curiosity} />
              <StatBar label="Discipline" value={stats.discipline} />
            </div>

            <h2>Academic Progress</h2>
            <div className="sidebar-stats">
              <StatBar label="AI Foundations" value={knowledge.aiFoundations} />
              <StatBar label="Data & Prompting" value={knowledge.dataPrompting} />
              <StatBar label="Applied AI Building" value={knowledge.appliedAIBuilding} />
              <StatBar label="Project" value={projectProgress} />
            </div>

            <h2>Readiness</h2>
            <div className="sidebar-stats">
              <StatBar label="Academic" value={academicReadiness} />
              <StatBar label="Social" value={socialReadiness} />
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "course" && (
          <div className="sidebar-section">
            <h2>Courses</h2>
            {courseCompletions.length > 0 ? (
              <div className="sidebar-course-list">
                {courseCompletions.map((course) => (
                  <div key={course.courseId} className="sidebar-course-item">
                    <div className="course-name">{course.courseId}</div>
                    <div className="course-status">
                      {course.isCompleted
                        ? "✓ Completed"
                        : course.progressPercent > 0
                          ? `${course.progressPercent}% progress`
                          : "Not started"}
                    </div>
                    {course.progressPercent > 0 && !course.isCompleted && (
                      <div className="course-progress-bar">
                        <div
                          className="course-progress-fill"
                          style={{ width: `${course.progressPercent}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="sidebar-empty">
                <p>No courses available yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Project Tab */}
        {activeTab === "project" && (
          <div className="sidebar-section">
            <h2>Final Project</h2>
            {projectState ? (
              <div className="sidebar-project">
                <div className="project-item">
                  <div className="project-label">Progress</div>
                  <div className="project-value">
                    {Object.keys(projectState.unlockedFeatures || {}).length} 
                    {" "}features unlocked
                  </div>
                </div>
                {projectState.unlockedFeatures && (
                  <div className="project-features">
                    {Object.entries(projectState.unlockedFeatures).map(
                      ([featureId, unlocked]) => (
                        <div
                          key={featureId}
                          className={`feature-item ${
                            unlocked ? "unlocked" : "locked"
                          }`}
                        >
                          <span className="feature-icon">
                            {unlocked ? "✓" : "○"}
                          </span>
                          <span className="feature-name">{featureId}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="sidebar-empty">
                <p>No project data available.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="sidebar-footer">
        <p>Press M or Tab for Menu</p>
      </div>
    </div>
  );
}
