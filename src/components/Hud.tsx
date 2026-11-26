import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT_MONO } from './theme';

const format = (seconds: number) => {
	const total = Math.max(0, Math.floor(seconds));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const Hud: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames - 1)));
	const time = frame / fps;

	return (
		<>
			<div style={{ position: 'absolute', left: 24, right: 24, bottom: 10, height: 2, background: 'rgba(255,255,255,0.08)' }}>
				<div style={{ height: '100%', width: `${progress * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.orange})`, boxShadow: `0 0 10px ${C.cyan}` }} />
			</div>
			<div style={{ position: 'absolute', left: 24, bottom: 20, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.4, color: 'rgba(159,179,200,0.45)' }}>
				{`TC ${format(time)} / ${format(durationInFrames / fps)}`}
			</div>
			<div style={{ position: 'absolute', right: 24, bottom: 20, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.4, color: 'rgba(159,179,200,0.45)' }}>
				KINETIC LAB // EP.01 // TUNNEL BOOM
			</div>
		</>
	);
};
