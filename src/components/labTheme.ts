export const LAB = {
	bg: '#090A1A',
	bgDeep: '#05060F',
	panel: 'rgba(9, 10, 26, 0.86)',
	panelSolid: '#0F1226',
	blue: '#3B82F6',
	blueSoft: 'rgba(59, 130, 246, 0.18)',
	lime: '#A3E635',
	limeSoft: 'rgba(163, 230, 53, 0.16)',
	rose: '#F43F5E',
	roseSoft: 'rgba(244, 63, 94, 0.16)',
	white: '#F8FAFC',
	muted: '#94A3B8',
	dim: 'rgba(148, 163, 184, 0.42)',
	grid: 'rgba(59, 130, 246, 0.10)',
	gridStrong: 'rgba(59, 130, 246, 0.24)',
} as const;

export type LabAccent = 'blue' | 'lime' | 'rose';

export const labAccent = (accent: LabAccent): string => {
	if (accent === 'lime') return LAB.lime;
	if (accent === 'rose') return LAB.rose;
	return LAB.blue;
};
