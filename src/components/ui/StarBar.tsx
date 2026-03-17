interface StatBarProps {
  label: string;
  value: number;
}

export function StatBar({ label, value }: StatBarProps) {
  return (
    <div className="stat-row">
      <div className="stat-label">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}