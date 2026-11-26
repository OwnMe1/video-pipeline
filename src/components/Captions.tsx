import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import captionsData from '../../public/subs/captions.json';
import wordsData from '../../public/subs/words.json';
import { C, clamp, FONT_BODY, FONT_HEAD, FONT_MONO } from './theme';

type Word = { word: string; start: number; end: number; scene: string };
type Caption = { text: string; start: number; end: number; words: Word[] };

const CAPTIONS = captionsData as Caption[];
const WORDS = wordsData as Word[];
const HOOK_END = 8.0;

const hookGroups: { start: number; end: number; words: Word[] }[] = [];
let hookCur: Word[] = [];
const flushHook = () => {
	if (hookCur.length === 0) return;
	hookGroups.push({ start: hookCur[0].start, end: Math.max(...hookCur.map((w) => w.end)), words: hookCur });
	hookCur = [];
};
for (const word of WORDS) {
	if (word.start > HOOK_END + 0.35) break;
	if (hookCur.length > 0) {
		const prev = hookCur[hookCur.length - 1];
		if (word.start - prev.end > 0.45 || hookCur.length >= 3) flushHook();
	}
	hookCur.push(word);
}
flushHook();

const HookCaptions: React.FC<{ time: number }> = ({ time }) => {
	const group = hookGroups.find((g) => time >= g.start - 0.1 && time < g.end + 0.12) ?? hookGroups[0];
	if (!group) return null;
	let active = -1;
	for (let i = 0; i < group.words.length; i++) {
		if (time >= group.words[i].start - 0.03) active = i;
	}
	const opacity = interpolate(time, [group.start - 0.08, group.start + 0.06, group.end - 0.06, group.end + 0.1], [0, 1, 1, 0], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 120,
				display: 'flex',
				justifyContent: 'center',
				opacity,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
					padding: '18px 30px 22px',
					background: 'linear-gradient(180deg, rgba(5,10,24,0.86), rgba(5,10,24,0.95))',
					border: `1px solid ${C.cyan}66`,
					boxShadow: `0 30px 80px rgba(0,0,0,0.55), inset 0 0 40px ${C.cyan}0d`,
				}}
			>
				<div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: C.orange }}>
					HOOK // {time.toFixed(1)}s
				</div>
				<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', gap: '8px 18px', maxWidth: 1520 }}>
					{group.words.map((word, index) => (
						<span
							key={`${word.word}-${word.start}`}
							style={{
								fontFamily: FONT_HEAD,
								fontSize: 64,
								lineHeight: 1.02,
								fontWeight: 700,
								letterSpacing: -1.6,
								color: index === active ? C.cyan : 'rgba(255,255,255,0.88)',
								textShadow: index === active ? `0 0 26px ${C.cyan}88, 0 2px 18px rgba(0,0,0,0.9)` : '0 2px 18px rgba(0,0,0,0.9)',
								WebkitTextStroke: '0.6px rgba(5,10,24,0.85)',
								transform: index === active ? 'scale(1.05)' : 'none',
								transformOrigin: 'center bottom',
							}}
						>
							{word.word}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export const Captions: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const time = frame / fps;

	if (time < HOOK_END) {
		return <HookCaptions time={time} />;
	}

	const index = CAPTIONS.findIndex((item) => time >= item.start && time < item.end);
	if (index === -1) {
		return null;
	}
	const caption = CAPTIONS[index];
	const fadeIn = interpolate(time, [caption.start, caption.start + 0.12], [0, 1], clamp);
	const fadeOut = interpolate(time, [caption.end - 0.12, caption.end], [1, 0], clamp);
	const opacity = Math.min(fadeIn, fadeOut);
	const sceneLabel = caption.words[0]?.scene?.toUpperCase() ?? 'CAP';

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
						{`CAP // ${String(index + 1).padStart(3, '0')} // ${sceneLabel}`}
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
