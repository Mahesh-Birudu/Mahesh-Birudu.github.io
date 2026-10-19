import * as React from 'react';
export interface PresenceBadgeProps { state: string; label: string; }
export const PresenceBadge: React.FC<PresenceBadgeProps> = ({ state, label }) => (
  <span className="m365-presence" data-presence={state} role="status" aria-label={'Teams status: ' + label}>{label}</span>
);
