import { Easing } from 'remotion';

export const FONT_HEAD = "'Space Grotesk', 'Inter', sans-serif";
export const FONT_BODY = "'Inter', 'Space Grotesk', sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'SFMono-Regular', monospace";

export const C = {
	bg: '#0B132B',
	bgDeep: '#050A18',
	panel: 'rgba(8, 18, 38, 0.82)',
	cyan: '#00F5D4',
	cyanSoft: 'rgba(0, 245, 212, 0.55)',
	orange: '#FF9F1C',
	red: '#FF3B30',
	white: '#FFFFFF',
	muted: '#9FB3C8',
	dim: 'rgba(159, 179, 200, 0.45)',
	grid: 'rgba(0, 245, 212, 0.075)',
	gridStrong: 'rgba(0, 245, 212, 0.16)',
} as const;

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.ease);

export const reveal = (
	frame: number,
	start: number,
	duration = 14,
): number => {
	const value = (frame - start) / duration;
	return value < 0 ? 0 : value > 1 ? 1 : value;
};

export const rise = (progress: number, distance = 26): string =>
	`translateY(${(1 - progress) * distance}px)`;

export const seeded = (n: number): number => {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
