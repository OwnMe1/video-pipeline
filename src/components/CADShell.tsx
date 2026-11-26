import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { C, clamp, easeOut, FONT_BODY, FONT_HEAD, FONT_MONO } from './theme';

type Props = {
	beat: number;
	beatLabel: string;
	figure: string;
	children: React.ReactNode;
};

const Corner: React.FC<{
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
	rotate: number;
}> = ({ top, bottom, left, right, rotate }) => (
	<div
		style={{
			position: 'absolute',
			top,
			bottom,
			left,
			right,
			width: 28,
			height: 28,
			borderTop: `1px solid ${C.cyanSoft}`,
			borderLeft: `1px solid ${C.cyanSoft}`,
			transform: `rotate(${rotate}deg)`,
			opacity: 0.8,
		}}
	/>
);

const BeatBars: React.FC<{ beat: number }> = ({ beat }) => (
	<div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
		{['A', 'B', 'C'].map((label, index) => (
			<div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
				<div
					style={{
						width: index === beat ? 26 : 13,
						height: 3,
						background: index === beat ? C.cyan : 'rgba(159,179,200,0.25)',
						boxShadow: index === beat ? `0 0 12px ${C.cyan}` : 'none',
					}}
				/>
				<span
					style={{
						fontFamily: FONT_MONO,
						fontSize: 10,
						letterSpacing: 1.5,
						color: index === beat ? C.cyan : 'rgba(159,179,200,0.38)',
					}}
				>
					{label}
				</span>
			</div>
		))}
	</div>
);

export const CADShell: React.FC<Props> = ({
	beat,
	beatLabel,
	figure,
	children,
}) => {
	const frame = useCurrentFrame();
	const intro = interpolate(frame, [0, 12], [0, 1], {
		...clamp,
		easing: easeOut,
	});
	const pulse = 0.55 + 0.45 * Math.sin(frame / 8);
	const shift = -frame * 0.12;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: C.bg,
				backgroundImage:
					'radial-gradient(circle at 50% 42%, rgba(0,245,212,0.07) 0%, rgba(11,19,43,0) 48%), radial-gradient(circle at 85% 85%, rgba(255,159,28,0.045) 0%, rgba(11,19,43,0) 38%)',
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,245,212,0.065) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.065) 1px, transparent 1px)',
					backgroundSize: '48px 48px',
					backgroundPosition: `${shift}px ${shift}px`,
					maskImage:
						'radial-gradient(ellipse at 50% 50%, black 22%, transparent 82%)',
					WebkitMaskImage:
						'radial-gradient(ellipse at 50% 50%, black 22%, transparent 82%)',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					inset: 24,
					border: '1px solid rgba(0,245,212,0.18)',
				}}
			/>
			<Corner top={20} left={20} rotate={0} />
			<Corner top={20} right={20} rotate={90} />
			<Corner bottom={20} right={20} rotate={180} />
			<Corner bottom={20} left={20} rotate={270} />

			<div
				style={{
					position: 'absolute',
					top: 44,
					left: 64,
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					fontFamily: FONT_HEAD,
				}}
			>
				<div
					style={{
						width: 11,
						height: 11,
						borderRadius: 999,
						background: C.cyan,
						boxShadow: `0 0 ${10 + pulse * 14}px ${C.cyan}`,
					}}
				/>
				<span style={{ color: C.white, fontSize: 17, fontWeight: 700, letterSpacing: 5 }}>
					KINETIC LAB
				</span>
				<span style={{ color: C.dim, fontSize: 12, letterSpacing: 2.4, fontFamily: FONT_MONO }}>
					PHYSICS // EP.01
				</span>
			</div>

			<div
				style={{
					position: 'absolute',
					top: 44,
					right: 64,
					display: 'flex',
					alignItems: 'center',
					gap: 22,
					fontFamily: FONT_MONO,
				}}
			>
				<span style={{ color: 'rgba(159,179,200,0.55)', fontSize: 11, letterSpacing: 2 }}>
					LIVE CAD FEED
				</span>
				<BeatBars beat={beat} />
				<span style={{ color: C.cyan, fontSize: 11, letterSpacing: 2 }}>
					BEAT {['A', 'B', 'C'][beat] ?? 'A'}
				</span>
			</div>

			<div
				style={{
					position: 'absolute',
					top: 96,
					left: 64,
					right: 64,
					display: 'flex',
					justifyContent: 'space-between',
					color: 'rgba(159,179,200,0.42)',
					fontFamily: FONT_MONO,
					fontSize: 10,
					letterSpacing: 1.8,
				}}
			>
				<span>X 0000 — 1920</span>
				<span>Y 0000 — 1080</span>
				<span>AIR // TUNNEL BOOM</span>
			</div>

			<div style={{ position: 'absolute', top: 132, left: 78, right: 78, bottom: 152, opacity: intro }}>
				{children}
			</div>

			<div
				style={{
					position: 'absolute',
					left: 64,
					right: 64,
					bottom: 46,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
					fontFamily: FONT_MONO,
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
					<span style={{ color: C.orange, fontSize: 12, letterSpacing: 2.4 }}>{figure}</span>
					<span
						style={{
							color: C.white,
							fontSize: 15,
							letterSpacing: 0.4,
							fontFamily: FONT_BODY,
							fontWeight: 500,
						}}
					>
						{beatLabel}
					</span>
				</div>
				<div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
					<span style={{ color: 'rgba(159,179,200,0.5)', fontSize: 10, letterSpacing: 1.6 }}>
						CAD // 1920 × 1080 // 60 FPS
					</span>
					<span style={{ color: C.cyan, fontSize: 10, letterSpacing: 1.6 }}>
						SOURCE: JR WEST / WIKIPEDIA
					</span>
				</div>
			</div>

			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)',
					opacity: 0.45,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
