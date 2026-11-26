import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, clamp, easeOut, FONT_MONO } from './theme';

type Props = {
	text: string;
	accent?: 'cyan' | 'orange' | string;
	durationInFrames?: number;
};

export const Badge: React.FC<Props> = ({ text, accent = 'cyan', durationInFrames = 90 }) => {
	const frame = useCurrentFrame();
	const enter = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: easeOut });
	const exit = interpolate(frame, [Math.max(1, durationInFrames - 12), durationInFrames], [1, 0], clamp);
	const opacity = Math.min(enter, exit);
	const y = interpolate(enter, [0, 1], [22, 0], { ...clamp, easing: easeOut });
	const color = accent === 'orange' ? C.orange : C.cyan;

	return (
		<div
			style={{
				position: 'absolute',
				top: 128,
				right: 88,
				opacity,
				transform: `translateY(${y}px)`,
				display: 'flex',
				alignItems: 'stretch',
				gap: 12,
				background: C.bg,
				border: `2px solid ${color}`,
				boxShadow: `0 0 24px ${color}55, inset 0 0 24px ${color}12`,
				padding: '12px 20px 14px 14px',
				pointerEvents: 'none',
			}}
		>
			<div style={{ width: 4, background: color, boxShadow: `0 0 10px ${color}` }} />
			<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.6, color: 'rgba(159,179,200,0.62)' }}>DATA //</span>
				<span style={{ fontFamily: FONT_MONO, fontSize: 40, lineHeight: 1, fontWeight: 700, letterSpacing: 1, color }}>{text}</span>
			</div>
		</div>
	);
};
