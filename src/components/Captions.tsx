import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import captionsData from '../../public/subs_captions.json';
import { C, clamp, FONT_BODY, FONT_MONO } from './theme';

type Caption = { text: string; start: number; end: number; scene: string };
const CAPTIONS = captionsData as Caption[];

export const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const time = frame / fps;

	const index = CAPTIONS.findIndex((item) => time >= item.start && time < item.end);
	if (index === -1) {
		return null;
	}
	const caption = CAPTIONS[index];
	const fadeIn = interpolate(time, [caption.start, caption.start + 0.12], [0, 1], clamp);
	const fadeOut = interpolate(time, [caption.end - 0.12, caption.end], [1, 0], clamp);
	const opacity = Math.min(fadeIn, fadeOut);

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 96,
				display: 'flex',
				justifyContent: 'center',
				opacity,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'stretch',
					gap: 18,
					maxWidth: 1560,
					background: 'linear-gradient(180deg, rgba(5,10,24,0.82), rgba(5,10,24,0.92))',
					border: '1px solid rgba(0,245,212,0.25)',
					boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
					padding: '12px 26px 14px 18px',
				}}
			>
				<div style={{ width: 4, background: C.cyan, boxShadow: `0 0 12px ${C.cyan}` }} />
				<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.4, color: C.orange }}>
						{`CAP // ${String(index + 1).padStart(3, '0')} // ${caption.scene.toUpperCase()}`}
					</div>
					<div
						style={{
							fontFamily: FONT_BODY,
							fontSize: 38,
							lineHeight: 1.12,
							fontWeight: 600,
							letterSpacing: -0.2,
							color: C.white,
							textShadow: '0 2px 20px rgba(0,0,0,0.65)',
						}}
					>
						{caption.text}
					</div>
				</div>
			</div>
		</div>
	);
};
