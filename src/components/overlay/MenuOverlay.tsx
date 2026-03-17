import { useGameStore } from "../../store/useGameStore";
import { StatBar } from "../ui/StarBar";

export function MenuOverlay() {
  const {
    menuOpen,
    toggleMenu,
    week,
    day,
    stats,
    courseCompletions,
    projectState,
  } = useGameStore();

  if (!menuOpen) return null;

  return (
    <>
      <div className="overlay-backdrop" onClick={toggleMenu} />
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h1>Menu</h1>
            <p>Press M or Tab to close</p>
          </div>

          <div className="modal-body">
            {/* Progression Section */}
            <div className="modal-section">
              <h2>Progression</h2>
              <p style={{ marginBottom: "16px", color: "var(--color-text-secondary)" }}>
                Week {week}, Day {day}
              </p>
            </div>

            {/* Stats Section */}
            <div className="modal-section">
              <h2>Stats</h2>
              <StatBar label="Energy" value={stats.energy} />
              <StatBar label="Focus" value={stats.focus} />
              <StatBar label="Stress" value={stats.stress} />
              <StatBar label="Confidence" value={stats.confidence} />
              <StatBar label="Knowledge" value={stats.knowledge} />
              <StatBar label="Project" value={stats.projectProgress} />
            </div>

            {/* Courses Section */}
            {courseCompletions.length > 0 && (
              <div className="modal-section">
                <h2>Courses</h2>
                {courseCompletions.map((course) => (
                  <div key={course.courseId} style={{ marginBottom: "12px" }}>
                    <div style={{ marginBottom: "6px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>
                        {course.courseId}
                      </span>
                      {" "}
                      <span style={{ color: "var(--color-text-secondary)" }}>
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        background: "var(--color-bg-tertiary)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${course.progressPercent}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, var(--color-accent), var(--color-accent-light))",
                          borderRadius: "4px",
                          transition: "width var(--transition-standard)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Project Section */}
            <div className="modal-section">
              <h2>Project</h2>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "8px" }}>
                Progress: {stats.projectProgress}%
              </p>
              {projectState.unlockedFeatures.length > 0 && (
                <details style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  <summary style={{ cursor: "pointer", marginBottom: "8px" }}>
                    Unlocked Features ({projectState.unlockedFeatures.length})
                  </summary>
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px" }}>
                    {projectState.unlockedFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>

            {/* Controls Section */}
            <div className="modal-section">
              <h2>Controls</h2>
              <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Arrow Keys</strong> - Move
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <strong>E</strong> - Interact
                </div>
                <div>
                  <strong>M / Tab</strong> - Toggle Menu
                </div>
              </div>
            </div>
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
