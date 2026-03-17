import type { PropsWithChildren } from "react";

interface PanelSectionProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

/**
 * PanelSection Component - Standardized section wrapper for modals and panels
 * Provides consistent header, body, and visual hierarchy
 */
export function PanelSection({
  title,
  subtitle,
  children,
}: PanelSectionProps) {
  return (
    <div className="panel-section">
      <div className="panel-section-header">
        <h2>{title}</h2>
        {subtitle && <p className="panel-section-subtitle">{subtitle}</p>}
      </div>
      <div className="panel-section-body">{children}</div>
    </div>
  );
}
