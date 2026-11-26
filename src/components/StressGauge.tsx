import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAB } from './labTheme';
import { clamp, FONT_HEAD, FONT_MONO } from './theme';

type Props = {
	value?: number;
	label?: string;
	unit?: string;
	dangerAt?: number;
	beat?: number;
};

const CX = 260;
const CY = 262;
const RADIUS = 198;
const ARC_LENGTH = Math.PI * RADIUS;
const TICKS = Array.from({ length: 21 }, (_, index) => index);

export const StressGauge: React.FC<Props> = ({
	value = 72,
	label = 'STRESS',
	unit = '%',
	dangerAt = 80,
	beat = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const local = Math.max(0, frame - beat * 8);
	const springValue = spring({ frame: local, fps, config: { damping: 16, mass: 0.9, stiffness: 80 } });
	const target = Math.min(100, Math.max(0, value));
	const current = interpolate(springValue, [0, 1], [0, target], clamp);
	const ratio = current / 100;
	const color = target >= dangerAt ? LAB.rose : target >= dangerAt * 0.7 ? LAB.lime : LAB.blue;
	const needleAngle = Math.PI + ratio * Math.PI;
	const needleX = CX + 150 * Math.cos(needleAngle);
	const needleY = CY + 150 * Math.sin(needleAngle);
	const pulse = 0.45 + 0.55 * Math.sin(frame / 6);

	return (
		<AbsoluteFill style={{ backgroundColor: LAB.bg, color: LAB.white, fontFamily: FONT_HEAD, justifyContent: 'center', alignItems: 'center' }}>
			<AbsoluteFill
				style={{
					backgroundImage: `radial-gradient(circle at 50% 60%, ${color}18 0%, transparent 55%)`,
				}}
			/>
			<div style={{ position: 'relative', width: 640, maxWidth: '86%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 4, color }}>{label.toUpperCase()}</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: LAB.dim }}>DANGER AT {dangerAt}{unit}</div>
				</div>

				<svg viewBox="0 0 520 320" style={{ width: '100%', display: 'block' }}>
					<path d={`M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`} fill="none" stroke={LAB.panelSolid} strokeWidth={26} strokeLinecap="round" />
					<path
						d={`M ${CX - RADIUS} ${CY} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${CY}`}
						fill="none"
						stroke={color}
						strokeWidth={26}
						strokeLinecap="round"
						strokeDasharray={`${ARC_LENGTH * ratio} ${ARC_LENGTH}`}
						style={{ filter: `drop-shadow(0 0 12px ${color}88)` }}
					/>
					{TICKS.map((tick) => {
						const angle = Math.PI + (tick / (TICKS.length - 1)) * Math.PI;
						const inner = 168;
						const outer = tick % 5 === 0 ? 142 : 154;
						const x1 = CX + inner * Math.cos(angle);
						const y1 = CY + inner * Math.sin(angle);
						const x2 = CX + outer * Math.cos(angle);
						const y2 = CY + outer * Math.sin(angle);
						return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tick % 5 === 0 ? LAB.muted : LAB.dim} strokeWidth={tick % 5 === 0 ? 3 : 1.5} />;
					})}
					<line x1={CX} y1={CY} x2={needleX} y2={needleY} stroke={LAB.white} strokeWidth={5} strokeLinecap="round" />
					<circle cx={CX} cy={CY} r={14} fill={LAB.bgDeep} stroke={color} strokeWidth={4} />
					<circle cx={CX} cy={CY} r={5} fill={color} />
				</svg>

				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -28 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: LAB.dim }}>0{unit}</div>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: 86, lineHeight: 0.92, fontWeight: 700, color, textShadow: `0 0 30px ${color}66` }}>
							{current.toFixed(0)}
							<span style={{ fontSize: 32, color: LAB.muted, marginLeft: 4 }}>{unit}</span>
						</div>
						<div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 3, color: LAB.muted }}>
							{target >= dangerAt ? 'CRITICAL BAND' : 'OPERATING RANGE'}
						</div>
					</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: LAB.dim }}>100{unit}</div>
				</div>

				<div style={{ position: 'absolute', top: 10, right: 0, width: 12, height: 12, borderRadius: 999, background: color, opacity: pulse, boxShadow: `0 0 18px ${color}` }} />
			</div>
		</AbsoluteFill>
	);
};
