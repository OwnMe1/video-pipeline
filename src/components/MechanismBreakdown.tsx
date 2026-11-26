import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { LAB } from './labTheme';
import { FONT_BODY, FONT_HEAD, FONT_MONO } from './theme';

type Step = {
	label: string;
	detail?: string;
	value?: string;
};

type Props = {
	steps?: Step[];
	title?: string;
	beat?: number;
};

const FALLBACK_STEPS: Step[] = [
	{ label: 'LOAD', detail: 'Apply voltage across the test cell.', value: '0.0s' },
	{ label: 'STRESS', detail: 'Drive current until the lattice saturates.', value: '1.4s' },
	{ label: 'FAILURE', detail: 'Thermal runaway propagates through the package.', value: '2.8s' },
	{ label: 'RESULT', detail: 'The failure mode becomes the design constraint.', value: '4.1s' },
];

export const MechanismBreakdown: React.FC<Props> = ({
	steps = FALLBACK_STEPS,
	title = 'MECHANISM BREAKDOWN',
	beat = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const base = beat * 8;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: LAB.bg,
				color: LAB.white,
				fontFamily: FONT_HEAD,
				padding: '54px 64px',
				justifyContent: 'center',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(90deg, ${LAB.grid} 1px, transparent 1px)`,
					backgroundSize: '120px 100%',
					opacity: 0.7,
				}}
			/>
			<div style={{ position: 'relative', width: '100%' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
					<div style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 4, color: LAB.blue }}>{title}</div>
					<div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2, color: LAB.dim }}>{steps.length} STAGES // SEQUENTIAL</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
					{steps.map((step, index) => {
						const local = Math.max(0, frame - base - index * 12);
						const reveal = spring({ frame: local, fps, config: { damping: 20, mass: 0.75, stiffness: 110 } });
						const accent = index === steps.length - 1 ? LAB.rose : index === 1 ? LAB.lime : LAB.blue;
						return (
							<div
								key={`${step.label}-${index}`}
								style={{
									display: 'flex',
									alignItems: 'stretch',
									gap: 18,
									opacity: reveal,
									transform: `translateX(${(1 - reveal) * 34}px)`,
								}}
							>
								<div style={{ width: 84, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									<div
										style={{
											width: 54,
											height: 54,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											border: `2px solid ${accent}`,
											color: accent,
											fontFamily: FONT_MONO,
											fontSize: 18,
											background: LAB.bgDeep,
											boxShadow: `0 0 18px ${accent}44`,
										}}
									>
										{String(index + 1).padStart(2, '0')}
									</div>
									{index < steps.length - 1 ? (
										<div style={{ flex: 1, width: 2, marginTop: 8, background: `linear-gradient(${accent}, ${LAB.gridStrong})`, opacity: reveal }} />
									) : null}
								</div>
								<div
									style={{
										flex: 1,
										background: LAB.panel,
										border: `1px solid ${accent}44`,
										borderLeft: `4px solid ${accent}`,
										padding: '16px 22px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
										gap: 24,
									}}
								>
									<div>
										<div style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>{step.label}</div>
										{step.detail ? (
											<div style={{ fontFamily: FONT_BODY, fontSize: 16, color: LAB.muted, marginTop: 4, maxWidth: 780 }}>{step.detail}</div>
										) : null}
									</div>
									{step.value ? (
										<div style={{ fontFamily: FONT_MONO, fontSize: 20, color: accent, letterSpacing: 1.5, whiteSpace: 'nowrap' }}>{step.value}</div>
									) : null}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
