/**
 * StatBar Component - Displays a labeled horizontal stat bar
 * Flexible for use in HUD, menus, modals, and panels
 */

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number; // defaults to 100
  showValue?: boolean; // defaults to true
  compact?: boolean; // smaller height/font for dense layouts
}

export function StatBar({
  label,
  value,
  maxValue = 100,
  showValue = true,
  compact = false,
}: StatBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div className={`stat-row ${compact ? "stat-row--compact" : ""}`}>
      <div className="stat-label">
        <span>{label}</span>
        {showValue && <span>{Math.round(value)}</span>}
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}