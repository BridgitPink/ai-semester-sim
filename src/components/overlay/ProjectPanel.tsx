import { useGameStore } from "../../store/useGameStore";
import { mvpSemester } from "../../game/data/semester";
import { StatBar } from "../ui/StarBar";

export function ProjectPanel() {
  const {
    closePanel,
    stats,
    projectState,
    setProjectState,
  } = useGameStore();

  const template = mvpSemester.finalProjectTemplate;

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectState({ selectedTitle: e.target.value });
  };

  const handleProblemStatementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectState({ selectedProblemStatement: e.target.value });
  };

  const toggleFeature = (featureId: string) => {
    const isSelected = projectState.selectedFeatures.includes(featureId);
    const newFeatures = isSelected
      ? projectState.selectedFeatures.filter((f) => f !== featureId)
      : [...projectState.selectedFeatures, featureId];
    setProjectState({ selectedFeatures: newFeatures });
  };

  const handleExport = () => {
    // Create export object
    const exportData = {
      title: projectState.selectedTitle || template.titleOptions[0],
      problemStatement: projectState.selectedProblemStatement || template.problemStatementOptions[0],
      features: projectState.selectedFeatures,
      unlockedFeatures: projectState.unlockedFeatures,
      techStack: template.techStack,
      readmeSections: template.readmeSections,
      generatedAt: new Date().toISOString(),
    };

    // For now, just log it (future: download as JSON or GitHub package)
    console.log("Project Export:", exportData);
    alert("Project exported! Check console for JSON structure.");
  };

  return (
    <>
      <div className="modal-header">
        <h1>AI Study Helper Project</h1>
        <p>Your semester capstone</p>
      </div>

      <div className="modal-body modal-body--scrollable">
        {/* Progress */}
        <div className="project-panel-progress">
          <StatBar
            label="Project Progress"
            value={stats.projectProgress}
            showValue={true}
          />
        </div>

        {/* Title Selection */}
        <div className="project-section">
          <h3>Project Title</h3>
          <select
            className="project-select"
            value={projectState.selectedTitle || ""}
            onChange={handleTitleChange}
          >
            <option value="">-- Choose a title --</option>
            {template.titleOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
          {projectState.selectedTitle && (
            <p className="selection-display">{projectState.selectedTitle}</p>
          )}
        </div>

        {/* Problem Statement Selection */}
        <div className="project-section">
          <h3>Problem Statement</h3>
          <select
            className="project-select"
            value={projectState.selectedProblemStatement || ""}
            onChange={handleProblemStatementChange}
          >
            <option value="">-- Choose a problem statement --</option>
            {template.problemStatementOptions.map((statement, idx) => (
              <option key={idx} value={statement}>
                {statement.substring(0, 50)}...
              </option>
            ))}
          </select>
          {projectState.selectedProblemStatement && (
            <p className="selection-display">{projectState.selectedProblemStatement}</p>
          )}
        </div>

        {/* Feature Selection */}
        <div className="project-section">
          <h3>Project Features</h3>
          <p className="section-subtitle">
            Select which components to include in your final package.
          </p>
          <div className="features-list">
            {template.featurePool.map((feature) => {
              const isUnlocked = projectState.unlockedFeatures.includes(feature.id);
              const isSelected = projectState.selectedFeatures.includes(feature.id);

              return (
                <div
                  key={feature.id}
                  className={`feature-item ${isUnlocked ? "" : "feature-item--locked"}`}
                >
                  <label className="feature-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFeature(feature.id)}
                      disabled={!isUnlocked}
                      className="feature-checkbox"
                    />
                    <span className="feature-icon">
                      {isUnlocked ? "🔓" : "🔒"}
                    </span>
                    <span className="feature-name">{feature.name}</span>
                  </label>
                  <p className="feature-description">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="project-section">
          <h3>Tech Stack</h3>
          <ul className="tech-stack-list">
            {template.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn" onClick={handleExport}>
          Export Project
        </button>
        <button className="btn btn-secondary" onClick={closePanel}>
          Close
        </button>
      </div>
    </>
  );
}
