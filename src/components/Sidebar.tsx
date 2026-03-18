import { useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { StatBar } from "./ui/StarBar";
import {
  getAcademicReadiness,
  getPrimaryGameplayStats,
  getSidebarStatusSummary,
  getSocialReadiness,
} from "../game/systems/playerSelectors";

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
    courseCompletions,
    projectState,
  } = useGameStore();

  const sidebarStatus = getSidebarStatusSummary();
  const primaryGameplayStats = getPrimaryGameplayStats();
  const academicReadiness = getAcademicReadiness();
  const socialReadiness = getSocialReadiness();

  return (
    <div className="sidebar">
      {/* Header with progression */}
      <div className="sidebar-header">
        <div className="sidebar-title">AI Semester Sim</div>
        <div className="sidebar-progress">
          Week {sidebarStatus.week} • {sidebarStatus.dayName}
        </div>
        <div className="sidebar-day-type">
          {sidebarStatus.dayTypeLabel}
        </div>
      </div>

      <div className="sidebar-persistent-group">
        <div className="sidebar-day-info sidebar-day-info--persistent">
          <div className="day-info-row">
            <span className="label">Mandatory Activity:</span>
            <span className="value">{sidebarStatus.mandatoryActivityLabel}</span>
          </div>
          <div className="day-info-row">
            <span className="label">Free Actions:</span>
            <span className="value">{sidebarStatus.freeActionsRemaining}/3</span>
          </div>
          {sidebarStatus.hintMessage && (
            <div className="day-info-hint">{sidebarStatus.hintMessage}</div>
          )}
        </div>

        <div className="sidebar-stats sidebar-stats--compact">
          {primaryGameplayStats.map((stat) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              value={stat.value}
              compact
            />
          ))}
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
            <h2>Readiness</h2>
            <div className="sidebar-stats">
              <StatBar label="Academic" value={academicReadiness} />
              <StatBar label="Social" value={socialReadiness} />
            </div>

            <p className="sidebar-note">
              Open Menu for full profile details and academic branch progress.
            </p>
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
