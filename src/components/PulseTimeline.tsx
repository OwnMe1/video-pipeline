import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAB } from './labTheme';
import { clamp, FONT_HEAD, FONT_MONO } from './theme';

type Event = {
	label: string;
	position: number;
	intensity?: number;
};

type Props = {
	events?: Event[];
	title?: string;
	beat?: number;
};

const W = 1160;
const H = 300;
const BASE = 158;

const FALLBACK_EVENTS: Event[] = [
	{ label: 'VOLTAGE RAMP', position: 0.18, intensity: 0.7 },
	{ label: 'THERMAL SPIKE', position: 0.46, intensity: 1.1 },
	{ label: 'PACKAGE FAIL', position: 0.74, intensity: 1.6 },
];

export const PulseTimeline: React.FC<Props> = ({
	events = FALLBACK_EVENTS,
	title = 'PULSE TIMELINE',
	beat = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const reveal = interpolate(frame - beat * 8, [0, 18], [0, 1], clamp);
	const scanX = ((frame * 7) % W) / 1;
	const scanY = BASE + Math.sin(scanX * 0.045) * 10;
	const samples = Array.from({ length: 241 }, (_, index) => {
		const x = (index / 240) * W;
		let y = BASE + Math.sin(x * 0.045) * 9;
		for (const event of events) {
			const center = event.position * W;
			const width = 26 + (event.intensity ?? 1) * 10;
			const distance = Math.abs(x - center);
			if (distance < width) {
				const bump = Math.cos((distance / width) * Math.PI * 0.5);
				y -= bump * (46 + (event.intensity ?? 1) * 42);
			}
			if (distance < 3) {
				y += 24;
			}
		}
		return { x, y };
	});
	const path = samples.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
	const time = (frame / fps).toFixed(2);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: LAB.bg,
				color: LAB.white,
				fontFamily: FONT_HEAD,
				padding: '48px 64px',
				justifyContent: 'center',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${LAB.grid} 1px, transparent 1px), linear-gradient(90deg, ${LAB.grid} 1px, transparent 1px)`,
					backgroundSize: '58px 58px',
					opacity: 0.65,
				}}
			/>
			<div style={{ position: 'relative', width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 4, color: LAB.lime }}>{title}</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: LAB.dim }}>T+{time}s // TELEMETRY</div>
				</div>

				<div style={{ position: 'relative', border: `1px solid ${LAB.gridStrong}`, background: LAB.bgDeep, overflow: 'hidden' }}>
					<svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
						<line x1={0} y1={BASE} x2={W} y2={BASE} stroke={LAB.dim} strokeWidth={1} strokeDasharray="6 10" opacity={0.35} />
						{events.map((event, index) => {
							const x = event.position * W;
							const accent = index === events.length - 1 ? LAB.rose : index === 1 ? LAB.lime : LAB.blue;
							return (
								<g key={`${event.label}-${index}`} opacity={reveal}>
									<line x1={x} y1={28} x2={x} y2={H - 28} stroke={accent} strokeWidth={1.5} strokeDasharray="5 8" opacity={0.6} />
									<circle cx={x} cy={BASE - 4} r={5} fill={accent} />
									<text x={x + 8} y={36} fill={accent} fontFamily={FONT_MONO} fontSize={12} letterSpacing={1.5}>
										{event.label}
									</text>
								</g>
							);
						})}
						<path d={path} fill="none" stroke={LAB.blue} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
						<path d={path} fill="none" stroke={LAB.white} strokeWidth={1} strokeDasharray="3 7" opacity={0.35} />
						<line x1={scanX} y1={0} x2={scanX} y2={H} stroke={LAB.lime} strokeWidth={2} opacity={0.7} />
						<circle cx={scanX} cy={scanY} r={7} fill={LAB.lime} style={{ filter: `drop-shadow(0 0 10px ${LAB.lime})` }} />
					</svg>
				</div>

				<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: LAB.dim }}>
					<span>00.0s</span>
					<span>VOLTAGE / THERMAL / MECHANICAL</span>
					<span>{(H / 100).toFixed(0)}.0s</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
