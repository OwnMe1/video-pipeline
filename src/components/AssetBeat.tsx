import React from 'react';
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { C, clamp, FONT_MONO } from './theme';

export type Beat = {
	kind: string;
	files: string[];
	layout: string;
	label: string;
};

type Props = {
	beat: Beat;
	beatIndex: number;
	sceneNumber: number;
	durationInFrames: number;
};

const isVideo = (file: string) => file.endsWith('.mp4');
const isContain = (file: string) =>
	/(logo|hbm_stack|through_silicon|silicon_interposer|_map\.png|south_korea|taiwan_map)/i.test(file);

const Media: React.FC<{
	file: string;
	frame: number;
	duration: number;
	pan?: number;
}> = ({ file, frame, duration, pan = 0 }) => {
	const contain = isContain(file);
	const isHbmDiagram = /hbm_stack/i.test(file);
	const isLogo = /logo/i.test(file);
	const isMap = /_map|south_korea|taiwan_map/i.test(file);
	const zoom = interpolate(frame, [0, Math.max(1, duration)], [1.015, 1.075], {
		...clamp,
	});
	const style: React.CSSProperties = {
		boxSizing: 'border-box',
		width: '100%',
		height: '100%',
		objectFit: contain ? 'contain' : 'cover',
		objectPosition: 'center',
		filter: isHbmDiagram
			? 'grayscale(1) sepia(1) saturate(4) hue-rotate(130deg) brightness(0.92) contrast(1.3)'
			: contain
				? 'brightness(1.04) contrast(1.05)'
				: 'saturate(0.62) contrast(1.12) brightness(0.82)',
		transform: contain ? 'none' : `scale(${zoom}) translateX(${pan}px)`,
	};

	const content = isVideo(file) ? (
		<OffthreadVideo src={staticFile(file)} muted style={style} />
	) : (
		<Img src={staticFile(file)} style={style} />
	);

	if (contain) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					padding: isLogo ? 72 : isHbmDiagram ? 24 : isMap ? 10 : 24,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					boxSizing: 'border-box',
				}}
			>
				{content}
			</div>
		);
	}

	return content;
};

const Corner: React.FC<{ top?: number; bottom?: number; left?: number; right?: number; rotate: number }> = ({
	top,
	bottom,
	left,
	right,
	rotate,
}) => (
	<div
		style={{
			position: 'absolute',
			top,
			bottom,
			left,
			right,
			width: 22,
			height: 22,
			borderTop: `1px solid ${C.cyan}`,
			borderLeft: `1px solid ${C.cyan}`,
			transform: `rotate(${rotate}deg)`,
			opacity: 0.8,
		}}
	/>
);

const Panel: React.FC<{ children: React.ReactNode; flex?: number }> = ({
	children,
	flex = 1,
}) => (
	<div style={{ position: 'relative', flex, minWidth: 0, overflow: 'hidden', border: '1px solid rgba(0,245,212,0.22)', background: C.bgDeep }}>
		{children}
		<Corner top={8} left={8} rotate={0} />
		<Corner bottom={8} right={8} rotate={180} />
	</div>
);

export const AssetBeat: React.FC<Props> = ({ beat, beatIndex, sceneNumber, durationInFrames }) => {
	const frame = useCurrentFrame();
	const intro = interpolate(frame, [0, 10], [0.25, 1], { ...clamp });
	const scan = interpolate(frame, [0, 24], [-30, 130], { ...clamp });
	const files = beat.files.filter(Boolean);
	const first = files[0];
	const extras = files.slice(1);
	const source = isVideo(first) ? 'MIXKIT // LICENSED B-ROLL' : 'WIKIMEDIA COMMONS // CC';

	if (files.length === 0) {
		return null;
	}

	const renderLayout = () => {
		if (beat.layout === 'split' && files.length >= 2) {
			return (
				<div style={{ display: 'flex', gap: 18, width: '100%', height: '100%' }}>
					<Panel flex={1.15}>
						<Media file={files[0]} frame={frame} duration={durationInFrames} />
					</Panel>
					<Panel flex={1}>
						<Media file={files[1]} frame={frame} duration={durationInFrames} pan={-6} />
					</Panel>
				</div>
			);
		}

		if (beat.layout === 'collage' && files.length >= 3) {
			return (
				<div style={{ display: 'flex', gap: 16, width: '100%', height: '100%' }}>
					{files.slice(0, 3).map((file, index) => (
						<Panel key={file}>
							<Media file={file} frame={frame} duration={durationInFrames} pan={index === 1 ? -8 : 8} />
						</Panel>
					))}
				</div>
			);
		}

		if (beat.layout === 'background' && files.length >= 2) {
			return (
				<div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', border: '1px solid rgba(0,245,212,0.22)' }}>
					<AbsoluteFill style={{ opacity: 0.55 }}>
						<Media file={first} frame={frame} duration={durationInFrames} />
					</AbsoluteFill>
					<AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(5,10,24,0.25), rgba(5,10,24,0.82))' }} />
					<div style={{ position: 'absolute', right: 24, bottom: 64, display: 'flex', gap: 14 }}>
						{extras.slice(0, 3).map((file) => (
							<div key={file} style={{ width: 270, height: 170, position: 'relative', border: `1px solid ${C.cyan}`, background: C.bgDeep, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.45)' }}>
								<Media file={file} frame={frame} duration={durationInFrames} />
								<div style={{ position: 'absolute', left: 8, top: 6, fontFamily: FONT_MONO, fontSize: 9, color: C.cyan, letterSpacing: 1 }}>INSERT</div>
							</div>
						))}
					</div>
					<div style={{ position: 'absolute', left: 24, top: 20, fontFamily: FONT_MONO, fontSize: 11, color: C.orange, letterSpacing: 1.4 }}>CAD UNDERLAY</div>
				</div>
			);
		}

		return (
			<div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', border: '1px solid rgba(0,245,212,0.22)' }}>
				<Media file={first} frame={frame} duration={durationInFrames} />
			</div>
		);
	};

	return (
		<AbsoluteFill style={{ opacity: intro }}>
			{renderLayout()}
			<AbsoluteFill style={{ backgroundColor: 'rgba(11,19,43,0.18)', pointerEvents: 'none' }} />
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(5,10,24,0.72) 0%, rgba(5,10,24,0) 18%, rgba(5,10,24,0) 82%, rgba(5,10,24,0.78) 100%)',
					pointerEvents: 'none',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					left: 18,
					top: 12,
					right: 18,
					display: 'flex',
					justifyContent: 'space-between',
					fontFamily: FONT_MONO,
					fontSize: 10,
					letterSpacing: 1.5,
					color: 'rgba(159,179,200,0.62)',
				}}
			>
				<span style={{ background: 'rgba(5,10,24,0.72)', padding: '4px 8px', border: '1px solid rgba(0,245,212,0.18)' }}>{source}</span>
				<span style={{ background: 'rgba(5,10,24,0.72)', padding: '4px 8px', border: '1px solid rgba(0,245,212,0.18)' }}>{`SCENE ${String(sceneNumber).padStart(2, '0')} // BEAT ${['A', 'B', 'C'][beatIndex]}`}</span>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 18,
					right: 18,
					bottom: 12,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
					fontFamily: FONT_MONO,
					fontSize: 10,
					letterSpacing: 1.2,
					color: 'rgba(159,179,200,0.55)',
				}}
			>
				<span />
				<span style={{ background: 'rgba(5,10,24,0.72)', padding: '4px 8px', border: '1px solid rgba(0,245,212,0.18)' }}>ASSET FRAME // CAD OVERLAY</span>
			</div>

			<div
				style={{
					position: 'absolute',
					top: `${scan}%`,
					left: 0,
					right: 0,
					height: 2,
					background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
					opacity: 0.35,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};
