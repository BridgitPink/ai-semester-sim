import { Panel } from "../ui/Panel";
import { StatBar } from "../ui/StatBar";
import { useGameStore } from "../../store/useGameStore";

export function Hud() {
  const { day, week, activePanel, currentLocation, selectedNpcName, stats, closePanel } =
    useGameStore();

  return (
    <div className="hud">
      <Panel>
        <h2>Semester</h2>
        <p>Week {week}, Day {day}</p>
      </Panel>

      <Panel>
        <h2>Stats</h2>
        <StatBar label="Energy" value={stats.energy} />
        <StatBar label="Focus" value={stats.focus} />
        <StatBar label="Stress" value={stats.stress} />
        <StatBar label="Confidence" value={stats.confidence} />
        <StatBar label="Knowledge" value={stats.knowledge} />
        <StatBar label="Project" value={stats.projectProgress} />
      </Panel>

      {activePanel !== "none" && (
        <Panel>
          <h2>Interaction</h2>
          {activePanel === "location" && <p>You entered: {currentLocation}</p>}
          {activePanel === "npc" && <p>You are talking to: {selectedNpcName}</p>}
          <button onClick={closePanel}>Close</button>
        </Panel>
      )}

      <Panel>
        <p>Move: Arrow keys</p>
        <p>Interact: E</p>
      </Panel>
    </div>
  );
}