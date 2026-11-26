import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAB, LabAccent, labAccent } from './labTheme';
import { clamp, FONT_HEAD, FONT_MONO } from './theme';

type Metric = {
	label: string;
	value: string;
};

type Props = {
	title?: string;
	subtitle?: string;
	metrics?: Metric[];
	accent?: LabAccent;
	beat?: number;
};

const FALLBACK_METRICS: Metric[] = [
	{ label: 'VOLTAGE', value: '4.20 kV' },
	{ label: 'CURRENT', value: '18.4 A' },
	{ label: 'TEMP', value: '312 C' },
];

const Corner: React.FC<{ top?: number; bottom?: number; left?: number; right?: number; rotate: number; color: string }> = ({
	top,
	bottom,
	left,
	right,
	rotate,
	color,
}) => (
	<div
		style={{
			position: 'absolute',
			top,
			bottom,
			left,
			right,
			width: 46,
			height: 46,
			borderTop: `2px solid ${color}`,
			borderLeft: `2px solid ${color}`,
			transform: `rotate(${rotate}deg)`,
		}}
	/>
);

export const HudOverlay: React.FC<Props> = ({
	title = 'KINETIC LAB',
	subtitle = 'HIGH-VOLTAGE TEST BAY',
	metrics = FALLBACK_METRICS,
	accent = 'blue',
	beat = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames } = useVideoConfig();
	const color = labAccent(accent);
	const local = Math.max(0, frame - beat * 8);
	const reveal = interpolate(local, [0, 16], [0, 1], clamp);
	const blink = Math.sin(frame / 5) > 0 ? 1 : 0.25;
	const scan = interpolate(frame % 200, [0, 200], [0, 100], clamp);
	const time = frame / fps;
	const total = durationInFrames / fps;

	return (
		<AbsoluteFill style={{ color: LAB.white, fontFamily: FONT_HEAD, pointerEvents: 'none', opacity: reveal }}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${LAB.grid} 1px, transparent 1px), linear-gradient(90deg, ${LAB.grid} 1px, transparent 1px)`,
					backgroundSize: '52px 52px',
					maskImage: 'radial-gradient(ellipse at 50% 50%, black 22%, transparent 88%)',
					WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 22%, transparent 88%)',
					opacity: 0.7,
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 50% 110%, ${color}1F 0%, transparent 48%)`,
				}}
			/>
			<div style={{ position: 'absolute', inset: 34, border: `1px solid ${color}33` }} />
			<Corner top={26} left={26} rotate={0} color={color} />
			<Corner top={26} right={26} rotate={90} color={color} />
			<Corner bottom={26} right={26} rotate={180} color={color} />
			<Corner bottom={26} left={26} rotate={270} color={color} />

			<div style={{ position: 'absolute', top: 58, left: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
				<div style={{ width: 10, height: 10, borderRadius: 999, background: color, opacity: blink, boxShadow: `0 0 16px ${color}` }} />
				<div>
					<div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 5 }}>{title}</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 3, color: LAB.muted }}>{subtitle}</div>
				</div>
			</div>
			<div style={{ position: 'absolute', top: 62, right: 64, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: LAB.muted }}>
				<div style={{ color }}>{'REC // ARM'}</div>
				<div>{`T+${time.toFixed(2)}s / ${total.toFixed(1)}s`}</div>
			</div>

			<div style={{ position: 'absolute', left: 64, bottom: 64, display: 'flex', gap: 14 }}>
				{metrics.map((metric) => (
					<div
						key={metric.label}
						style={{
							minWidth: 210,
							background: LAB.panel,
							border: `1px solid ${color}44`,
							borderTop: `3px solid ${color}`,
							padding: '16px 20px',
						}}
					>
						<div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2.4, color: LAB.muted }}>{metric.label}</div>
						<div style={{ fontFamily: FONT_MONO, fontSize: 32, fontWeight: 600, letterSpacing: 1, color: LAB.white, marginTop: 4 }}>{metric.value}</div>
					</div>
				))}
			</div>

			<div style={{ position: 'absolute', right: 64, bottom: 70, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: LAB.dim, textAlign: 'right' }}>
				<div>SAFE ZONE // HUD ACTIVE</div>
				<div>{`GRID 52PX // ${accent.toUpperCase()} CHANNEL`}</div>
			</div>

			<div style={{ position: 'absolute', top: 0, bottom: 0, left: `${scan}%`, width: 2, background: color, opacity: 0.16 }} />
			<div style={{ position: 'absolute', top: '50%', left: '50%', width: 34, height: 34, border: `1px solid ${color}55`, transform: 'translate(-50%, -50%)' }} />
			<div style={{ position: 'absolute', top: '50%', left: '50%', width: 6, height: 6, background: color, transform: 'translate(-50%, -50%)' }} />
		</AbsoluteFill>
	);
};
