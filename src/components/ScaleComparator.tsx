import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAB } from './labTheme';
import { clamp, FONT_HEAD, FONT_MONO } from './theme';

type Side = {
	label: string;
	value: string;
	ratio: number;
	color?: string;
};

type Props = {
	left?: Side;
	right?: Side;
	title?: string;
	beat?: number;
};

const FALLBACK_LEFT: Side = { label: 'BASELINE', value: '1x', ratio: 1, color: LAB.blue };
const FALLBACK_RIGHT: Side = { label: 'TARGET', value: '3.6x', ratio: 3.6, color: LAB.lime };

export const ScaleComparator: React.FC<Props> = ({
	left = FALLBACK_LEFT,
	right = FALLBACK_RIGHT,
	title = 'SCALE COMPARATOR',
	beat = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const start = beat * 8;
	const local = Math.max(0, frame - start);
	const progress = spring({ frame: local, fps, config: { damping: 18, mass: 0.9, stiffness: 90 } });
	const total = Math.max(0.001, Math.abs(left.ratio) + Math.abs(right.ratio));
	const leftShare = (Math.abs(left.ratio) / total) * 100;
	const rightShare = (Math.abs(right.ratio) / total) * 100;
	const scan = interpolate(frame % 180, [0, 180], [0, 100], clamp);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: LAB.bg,
				color: LAB.white,
				fontFamily: FONT_HEAD,
				padding: 64,
				justifyContent: 'center',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${LAB.grid} 1px, transparent 1px), linear-gradient(90deg, ${LAB.grid} 1px, transparent 1px)`,
					backgroundSize: '64px 64px',
					opacity: 0.8,
				}}
			/>
			<div style={{ position: 'relative', width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 4, color: LAB.blue }}>{title}</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: LAB.dim }}>RELATIVE MAGNITUDE</div>
				</div>

				<div style={{ position: 'relative', height: 22, background: LAB.panelSolid, border: `1px solid ${LAB.gridStrong}`, overflow: 'hidden' }}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							width: `${leftShare * progress}%`,
							background: `linear-gradient(90deg, ${left.color ?? LAB.blue}, ${left.color ?? LAB.blue}55)`,
							boxShadow: `0 0 24px ${left.color ?? LAB.blue}66`,
						}}
					/>
					<div style={{ position: 'absolute', top: 0, bottom: 0, left: `${scan}%`, width: 2, background: LAB.white, opacity: 0.18 }} />
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: LAB.dim }}>
					<span>{left.label}</span>
					<span>{right.label}</span>
				</div>

				<div style={{ display: 'flex', gap: 28, marginTop: 38 }}>
					{[left, right].map((side, index) => {
						const sideProgress = spring({ frame: Math.max(0, local - index * 7), fps, config: { damping: 20, mass: 0.8 } });
						return (
							<div
								key={side.label}
								style={{
									flex: 1,
									background: LAB.panel,
									border: `1px solid ${side.color ?? LAB.blue}55`,
									borderTop: `3px solid ${side.color ?? LAB.blue}`,
									padding: '24px 26px',
									opacity: sideProgress,
									transform: `translateY(${(1 - sideProgress) * 22}px)`,
								}}
							>
								<div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: LAB.muted }}>{side.label}</div>
								<div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700, color: side.color ?? LAB.white, marginTop: 8 }}>{side.value}</div>
								<div style={{ marginTop: 18, height: 6, background: LAB.bgDeep }}>
									<div
										style={{
											height: '100%',
											width: `${(index === 0 ? leftShare : rightShare) * sideProgress}%`,
											background: side.color ?? LAB.blue,
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
