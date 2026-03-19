import { useGameStore } from "../../store/useGameStore";
import { ASSISTANT_PROJECT_DEFINITIONS, getAssistantProjectDefinition } from "../../game/data/projects";
import type { AssistantProjectPhase } from "../../game/types/player";
import { StatBar } from "../ui/StarBar";

type PhaseStatus = "complete" | "active" | "upcoming";

function getPhaseStatus(
  activePhase: AssistantProjectPhase,
  phaseId: AssistantProjectPhase,
  orderedPhases: AssistantProjectPhase[]
): PhaseStatus {
  const activeIndex = orderedPhases.indexOf(activePhase);
  const phaseIndex = orderedPhases.indexOf(phaseId);
  if (phaseIndex < activeIndex) {
    return "complete";
  }
  if (phaseIndex === activeIndex) {
    return "active";
  }
  return "upcoming";
}

export function ProjectPanel() {
  const {
    closePanel,
    projectPanelMode,
    selectedProjectId,
    projectStatesById,
    setActiveProject,
  } = useGameStore();

  const activeProject = selectedProjectId ? projectStatesById[selectedProjectId] ?? null : null;
  const activeDefinition = activeProject ? getAssistantProjectDefinition(activeProject.id) : null;

  const showSwitchControls = projectPanelMode === "board";
  const orderedPhases =
    activeDefinition?.phases.map((phase) => phase.id) ??
    (["selected", "planning", "prototyping", "refining", "submitted"] as AssistantProjectPhase[]);
  const nextPhaseInfo = activeDefinition?.phases.find((phase) => phase.id === activeProject?.phase) ?? null;

  const handleSelectProject = (projectId: string) => {
    setActiveProject(projectId);
  };

  return (
    <>
      <div className="modal-header">
        <h1>Project Board</h1>
        <p>Choose your active assistant project and review status</p>
      </div>

      <div className="modal-body modal-body--scrollable">
        <div className="project-section">
          <h3>Project Selection</h3>
          {!showSwitchControls && (
            <p className="section-subtitle">
              Selection and switching are available at the lab Project Board only.
            </p>
          )}
          <div className="features-list">
            {ASSISTANT_PROJECT_DEFINITIONS.map((definition) => {
              const isActive = selectedProjectId === definition.id;
              return (
                <div
                  key={definition.id}
                  className={`feature-item ${isActive ? "" : "feature-item--locked"}`}
                >
                  <div className="feature-checkbox-label" style={{ justifyContent: "space-between" }}>
                    <div>
                      <span className="feature-name">{definition.title}</span>
                      <p className="feature-description" style={{ marginTop: 6 }}>
                        {definition.shortDescription}
                      </p>
                    </div>
                    <button
                      className="btn"
                      onClick={() => handleSelectProject(definition.id)}
                      disabled={!showSwitchControls || isActive}
                    >
                      {isActive ? "Active" : "Set Active"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!activeProject && (
          <div className="project-section">
            <h3>Status</h3>
            <p className="section-subtitle">
              No project selected yet. Go to the lab Project Board and choose either AI Study Helper or AI Career Helper.
            </p>
          </div>
        )}

        {activeProject && activeDefinition && (
          <>
            <div className="project-section">
              <h3>Active Project</h3>
              <p className="selection-display" style={{ marginBottom: 8 }}>{activeDefinition.title}</p>
              <p className="section-subtitle" style={{ marginBottom: 8 }}>{activeDefinition.shortDescription}</p>
              <p className="section-subtitle" style={{ marginBottom: 4 }}>
                Domain Focus: {activeDefinition.domainFocus}
              </p>
              <p className="section-subtitle">
                Output Type: {activeDefinition.outputType}
              </p>
            </div>

            <div className="project-panel-progress">
              <StatBar
                label="Overall Progress"
                value={activeProject.progress.overall}
                showValue={true}
              />
            </div>

            <div className="project-section" style={{ marginTop: 12 }}>
              <h3>Current Phase</h3>
              <p className="selection-display" style={{ marginBottom: 8 }}>
                {nextPhaseInfo?.label ?? activeProject.phase}
              </p>
              <StatBar label="Phase Progress" value={activeProject.phaseProgress} showValue={true} />
              <p className="section-subtitle" style={{ marginTop: 8 }}>
                {nextPhaseInfo?.helperLabel ?? "Keep building your assistant pipeline at the workbench."}
              </p>
            </div>

            <div className="project-section">
              <h3>Phase Status</h3>
              <div className="features-list">
                {activeDefinition.phases.map((phase) => {
                  const status = getPhaseStatus(activeProject.phase, phase.id, orderedPhases);
                  const icon = status === "complete" ? "✓" : status === "active" ? "●" : "○";
                  const statusLabel =
                    status === "complete" ? "Complete" : status === "active" ? "In Progress" : "Pending";
                  return (
                    <div key={phase.id} className="feature-item">
                      <div className="feature-checkbox-label">
                        <span className="feature-icon">{icon}</span>
                        <span className="feature-name">{phase.label}</span>
                      </div>
                      <p className="feature-description" style={{ marginTop: 4 }}>
                        {phase.milestoneDescription}
                      </p>
                      <p className="feature-description" style={{ marginTop: 4 }}>
                        Status: {statusLabel}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="project-section">
              <h3>Next Recommended Step</h3>
              <p className="section-subtitle">
                {nextPhaseInfo?.recommendedNextStep ?? "Use the workbench to continue project progression."}
              </p>
            </div>

            <div className="project-section">
              <h3>Final Deliverable</h3>
              <p className="section-subtitle">{activeDefinition.finalDeliverableDescription}</p>
            </div>

            <div className="project-panel-progress" style={{ marginTop: 10 }}>
              <div className="stats-grid">
                <StatBar label="Prompting" value={activeProject.progress.prompting} />
                <StatBar label="Retrieval" value={activeProject.progress.retrieval} />
                <StatBar label="Knowledge Base" value={activeProject.progress.knowledgeBase} />
                <StatBar label="Evaluation" value={activeProject.progress.evaluation} />
                <StatBar label="Interface" value={activeProject.progress.interface} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={closePanel}>
          Close
        </button>
      </div>
    </>
  );
}
