import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	interpolate,
	OffthreadVideo,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import shortsData from './data/shorts_data.json';
import { FontLoader } from './fonts';
import { LayerStackDiagram } from './components/LayerStackDiagram';
import { PhysicsComparison } from './components/PhysicsComparison';
import { SupplyChainMap } from './components/SupplyChainMap';
import { YieldMeter } from './components/YieldMeter';
import { C, clamp, easeOut, FONT_HEAD, FONT_MONO } from './components/theme';

type Word = { word: string; start: number; end: number; segment: string };
type Caption = { text: string; start: number; end: number; words: Word[] };
type Visual = {
	type: 'asset' | 'component';
	start: number;
	end: number;
	files?: string[];
	layout?: 'single' | 'split' | 'collage' | 'background';
	component?: string;
	variant?: string | null;
	beat?: number;
	focusX?: number;
	focusY?: number;
	scale?: number;
	label: string;
};
type Short = {
	id: 'Short1Hook' | 'Short2Tech' | 'Short3Monopoly';
	title: string;
	shortLabel: string;
	titleLines: { text: string; color: 'white' | 'cyan' | 'orange' }[];
	audio: string;
	duration: number;
	ctaStart: number;
	ctaText: string;
	words: Word[];
	captions: Caption[];
	visuals: Visual[];
};

const SHORTS = (shortsData as { shorts: Short[] }).shorts;
const FPS = 30;

export const getShortDurationInFrames = (id: string, fps = FPS) => {
	const short = SHORTS.find((item) => item.id === id) ?? SHORTS[0];
	return Math.max(1, Math.round(short.duration * fps));
};

const SAFE_TOP = 220;
const SAFE_BOTTOM = 380;
const SAFE_RIGHT = 140;
const LEFT = 40;
const CONTENT_WIDTH = 1080 - LEFT - SAFE_RIGHT;
const STAGE_TOP = 400;
const STAGE_HEIGHT = 750;

const accentOf = (short: Short) => (short.id === 'Short1Hook' ? C.orange : C.cyan);
const colorOf = (name: string, accent: string) => {
	if (name === 'cyan') return C.cyan;
	if (name === 'orange') return C.orange;
	return accent;
};

const Corner: React.FC<{
	top?: number;
	bottom?: number;
	left?: number;
	right?: number;
	rotate: number;
	color?: string;
}> = ({ top, bottom, left, right, rotate, color = C.cyan }) => (
	<div
		style={{
			position: 'absolute',
			top,
			bottom,
			left,
			right,
			width: 20,
			height: 20,
			borderTop: `1px solid ${color}`,
			borderLeft: `1px solid ${color}`,
			transform: `rotate(${rotate}deg)`,
			opacity: 0.75,
		}}
	/>
);

const VerticalShell: React.FC<{ short: Short }> = ({ short }) => {
	const frame = useCurrentFrame();
	const accent = accentOf(short);
	const shift = -frame * 0.16;

	return (
		<AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
			<AbsoluteFill
				style={{
					backgroundImage:
						'linear-gradient(rgba(0,245,212,0.065) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.065) 1px, transparent 1px)',
					backgroundSize: '48px 48px',
					backgroundPosition: `${shift}px ${shift}px`,
					maskImage:
						'radial-gradient(ellipse at 50% 45%, black 16%, transparent 82%)',
					WebkitMaskImage:
						'radial-gradient(ellipse at 50% 45%, black 16%, transparent 82%)',
				}}
			/>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 80% 10%, ${accent}20 0%, transparent 42%), radial-gradient(circle at 10% 85%, rgba(255,159,28,0.10) 0%, transparent 45%)`,
				}}
			/>

			<div style={{ position: 'absolute', top: SAFE_TOP, left: LEFT, display: 'flex', alignItems: 'center', gap: 10 }}>
				<div style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 14px ${accent}` }} />
				<span style={{ color: C.white, fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, letterSpacing: 4 }}>STACK LAYER</span>
				<span style={{ color: C.dim, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.8 }}>SHORTS</span>
			</div>
			<div style={{ position: 'absolute', top: SAFE_TOP + 2, right: SAFE_RIGHT, textAlign: 'right', fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.3, color: 'rgba(159,179,200,0.52)' }}>
				{short.shortLabel}
			</div>

			{/* safe-area guides */}
			<div style={{ position: 'absolute', top: SAFE_TOP, left: 16, right: 16, borderTop: '1px dashed rgba(0,245,212,0.12)' }} />
			<div style={{ position: 'absolute', top: 1920 - SAFE_BOTTOM, left: 16, right: 16, borderTop: '1px dashed rgba(255,159,28,0.16)' }} />
			<div style={{ position: 'absolute', top: SAFE_TOP, bottom: SAFE_BOTTOM, right: SAFE_RIGHT, borderLeft: '1px dashed rgba(0,245,212,0.10)' }} />
			<div style={{ position: 'absolute', right: 14, top: 1430, fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.2, color: 'rgba(159,179,200,0.35)', transform: 'rotate(-90deg)', transformOrigin: 'right top' }}>
				SAFE RIGHT // 140
			</div>

			<div style={{ position: 'absolute', left: LEFT, top: STAGE_TOP - 14, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.3, color: 'rgba(159,179,200,0.38)' }}>
				CAD // VERTICAL STAGE // 1080 × 1920
			</div>

			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(0deg, rgba(255,255,255,0.014) 0px, rgba(255,255,255,0.014) 1px, transparent 1px, transparent 4px)',
					opacity: 0.5,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

const HookTitle: React.FC<{ short: Short }> = ({ short }) => {
	const accent = accentOf(short);

	return (
		<div style={{ position: 'absolute', top: 248, left: LEFT, width: CONTENT_WIDTH }}>
			<div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
				<div style={{ width: 4, height: 42, background: accent, boxShadow: `0 0 12px ${accent}` }} />
				<div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2, color: C.orange }}>
					THE HIDDEN BOTTLENECK OF AI
				</div>
			</div>
			{short.titleLines.map((line) => (
				<div
					key={line.text}
					style={{
						fontFamily: FONT_HEAD,
						fontSize: 56,
						lineHeight: 0.94,
						fontWeight: 700,
						letterSpacing: -1.8,
						color: line.color === 'white' ? C.white : colorOf(line.color, accent),
						textShadow: line.color === 'white' ? '0 4px 24px rgba(0,0,0,0.55)' : `0 0 22px ${colorOf(line.color, accent)}44`,
					}}
				>
					{line.text}
				</div>
			))}
		</div>
	);
};

const StageFrame: React.FC<{ label: string; accent: string; children: React.ReactNode }> = ({
	label,
	accent,
	children,
}) => (
	<div style={{ position: 'absolute', inset: 0, border: `1px solid ${accent}55`, background: 'rgba(5,10,24,0.32)', overflow: 'hidden' }}>
		{children}
		<Corner top={6} left={6} rotate={0} color={accent} />
		<Corner top={6} right={6} rotate={90} color={accent} />
		<Corner bottom={6} right={6} rotate={180} color={accent} />
		<Corner bottom={6} left={6} rotate={270} color={accent} />
		<div style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.2, color: accent, background: 'rgba(5,10,24,0.72)', padding: '3px 6px' }}>
			{label}
		</div>
	</div>
);

const isVideo = (file: string) => file.endsWith('.mp4');
const isContain = (file: string) =>
	/(logo|hbm_stack|through_silicon|silicon_interposer|_map\.png|south_korea|taiwan_map)/i.test(file);

const Media: React.FC<{ file: string; durationInFrames: number }> = ({ file, durationInFrames }) => {
	const frame = useCurrentFrame();
	const contain = isContain(file);
	const isHbm = /hbm_stack/i.test(file);
	const isLogo = /logo/i.test(file);
	const isMap = /_map|south_korea|taiwan_map/i.test(file);
	const zoom = interpolate(frame, [0, Math.max(1, durationInFrames)], [1.0, 1.08], { ...clamp, easing: easeOut });

	const style: React.CSSProperties = {
		width: '100%',
		height: '100%',
		objectFit: contain ? 'contain' : 'cover',
		objectPosition: 'center',
		filter: isHbm
			? 'grayscale(1) sepia(1) saturate(4) hue-rotate(130deg) brightness(0.92) contrast(1.3)'
			: contain
				? 'brightness(1.04) contrast(1.05)'
				: 'saturate(0.62) contrast(1.12) brightness(0.72)',
		transform: contain ? 'none' : `scale(${zoom})`,
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
					padding: isLogo ? 26 : isHbm ? 8 : isMap ? 6 : 10,
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

const MediaCard: React.FC<{
	file: string;
	label: string;
	durationInFrames: number;
	style?: React.CSSProperties;
}> = ({ file, label, durationInFrames, style }) => (
	<div
		style={{
			position: 'relative',
			overflow: 'hidden',
			border: `1px solid ${C.cyan}66`,
			background: C.bgDeep,
			...style,
		}}
	>
		<Media file={file} durationInFrames={durationInFrames} />
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background:
					'linear-gradient(180deg, rgba(5,10,24,0.35) 0%, rgba(5,10,24,0) 22%, rgba(5,10,24,0) 72%, rgba(5,10,24,0.76) 100%)',
				pointerEvents: 'none',
			}}
		/>
		<div style={{ position: 'absolute', left: 10, bottom: 8, right: 10, fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.1, color: C.cyan, background: 'rgba(5,10,24,0.7)', padding: '3px 5px' }}>
			{label}
		</div>
		<Corner top={5} left={5} rotate={0} />
		<Corner bottom={5} right={5} rotate={180} />
	</div>
);

const VerticalAssetStage: React.FC<{ visual: Visual; durationInFrames: number }> = ({
	visual,
	durationInFrames,
}) => {
	const files = visual.files ?? [];
	const layout = visual.layout ?? 'single';
	const accent = C.cyan;

	const body = () => {
		if (layout === 'split' && files.length >= 2) {
			return (
				<>
					<MediaCard file={files[0]} label="A // PRIMARY" durationInFrames={durationInFrames} style={{ position: 'absolute', left: 52, top: 28, width: 356, height: 632 }} />
					<MediaCard file={files[1]} label="B // REFERENCE" durationInFrames={durationInFrames} style={{ position: 'absolute', left: 490, top: 28, width: 356, height: 632 }} />
				</>
			);
		}
		if (layout === 'collage' && files.length >= 3) {
			return (
				<>
					{files.slice(0, 3).map((file, index) => (
						<MediaCard key={file} file={file} label={`${String.fromCharCode(65 + index)} // ASSET`} durationInFrames={durationInFrames} style={{ position: 'absolute', left: 10 + index * 300, top: 110, width: 280, height: 500 }} />
					))}
				</>
			);
		}
		if (layout === 'background' && files.length >= 2) {
			return (
				<>
					<AbsoluteFill style={{ opacity: 0.5 }}>
						<Media file={files[0]} durationInFrames={durationInFrames} />
					</AbsoluteFill>
					<AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(5,10,24,0.25), rgba(5,10,24,0.8))' }} />
					<MediaCard file={files[0]} label="CAD UNDERLAY" durationInFrames={durationInFrames} style={{ position: 'absolute', left: 18, top: 18, width: 380, height: 675, opacity: 0.92 }} />
					{files.slice(1, 4).map((file, index) => (
						<MediaCard key={file} file={file} label="INSERT" durationInFrames={durationInFrames} style={{ position: 'absolute', left: 450 + (index % 2) * 220, top: 40 + Math.floor(index / 2) * 250, width: 190, height: 210 }} />
					))}
				</>
			);
		}
		return (
			<MediaCard file={files[0]} label={visual.label} durationInFrames={durationInFrames} style={{ position: 'absolute', left: 248, top: 8, width: 404, height: 718 }} />
		);
	};

	return (
		<Sequence durationInFrames={durationInFrames}>
			<div style={{ position: 'absolute', inset: 0 }}>
				{body()}
				<div style={{ position: 'absolute', left: 12, top: 10, fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.2, color: 'rgba(159,179,200,0.6)', background: 'rgba(5,10,24,0.7)', padding: '3px 6px' }}>
					9:16 INSERT // SOURCE: WIKIMEDIA / MIXKIT
				</div>
				<div style={{ position: 'absolute', right: 12, top: 10, fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.2, color: accent, background: 'rgba(5,10,24,0.7)', padding: '3px 6px' }}>
					{visual.label}
				</div>
			</div>
		</Sequence>
	);
};

const VerticalComponentStage: React.FC<{ visual: Visual; durationInFrames: number }> = ({
	visual,
	durationInFrames,
}) => {
	const scale = visual.scale ?? 1.32;
	const focusX = visual.focusX ?? 800;
	const focusY = visual.focusY ?? 390;
	const beat = visual.beat ?? 0;
	const name = visual.component;

	return (
		<Sequence durationInFrames={durationInFrames}>
			<StageFrame label={visual.label} accent={C.cyan}>
				<div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 90, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', background: 'rgba(5,10,24,0.98)', pointerEvents: 'none' }}>
					<span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.3, color: C.cyan }}>{visual.label}</span>
					<span style={{ fontFamily: FONT_MONO, fontSize: 8, letterSpacing: 1.3, color: 'rgba(159,179,200,0.45)' }}>CAD // COMPONENT</span>
				</div>
				<div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
					<div
						style={{
							position: 'absolute',
							width: 1600,
							height: 780,
							left: 450 - focusX * scale,
							top: 375 - focusY * scale,
							transform: `scale(${scale})`,
							transformOrigin: 'top left',
						}}
					>
						{name === 'LayerStackDiagram' ? (
							<LayerStackDiagram beat={beat} variant={(visual.variant ?? 'package') as 'package' | 'hbm3e' | 'hbm4' | 'bonding'} />
						) : null}
						{name === 'YieldMeter' ? <YieldMeter beat={beat} /> : null}
						{name === 'PhysicsComparison' ? <PhysicsComparison beat={beat} /> : null}
						{name === 'SupplyChainMap' ? <SupplyChainMap beat={beat} /> : null}
					</div>
				</div>
			</StageFrame>
		</Sequence>
	);
};

const ShortCaptions: React.FC<{ short: Short }> = ({ short }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const time = frame / fps;
	const accent = accentOf(short);

	const caption = short.captions.find((item) => time >= item.start && time < item.end);
	if (!caption) {
		return null;
	}

	let active = -1;
	for (let i = 0; i < caption.words.length; i++) {
		if (time >= caption.words[i].start - 0.03) {
			active = i;
		}
	}

	const opacity = 1;

	return (
		<div
			style={{
				position: 'absolute',
				top: 1200,
				left: LEFT,
				width: CONTENT_WIDTH,
				height: 220,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				opacity,
				pointerEvents: 'none',
			}}
		>
			<div
				style={{
					width: '100%',
					minHeight: 150,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 8,
					padding: '16px 22px 18px',
					background: 'linear-gradient(180deg, rgba(5,10,24,0.86), rgba(5,10,24,0.95))',
					border: `1px solid ${accent}55`,
					boxShadow: `0 24px 60px rgba(0,0,0,0.55), inset 0 0 30px ${accent}0d`,
				}}
			>
				<div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.4, color: C.orange }}>
					{`CAP // ${String(short.captions.indexOf(caption) + 1).padStart(3, '0')} // ${caption.start.toFixed(1)}s`}
				</div>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						justifyContent: 'center',
						alignItems: 'baseline',
						gap: '8px 14px',
						maxWidth: 820,
					}}
				>
					{caption.words.map((word, index) => (
						<span
							key={`${word.word}-${word.start}`}
							style={{
								fontFamily: FONT_HEAD,
								fontSize: 56,
								lineHeight: 1.02,
								fontWeight: 700,
								letterSpacing: -1.2,
								color: index === active ? accent : index < active ? C.white : 'rgba(210,222,240,0.55)',
								textShadow:
									index === active
										? `0 0 22px ${accent}88, 0 2px 18px rgba(0,0,0,0.85)`
										: '0 2px 18px rgba(0,0,0,0.85)',
								WebkitTextStroke: '0.5px rgba(5,10,24,0.8)',
								transform: index === active ? 'scale(1.06)' : 'none',
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

const ShortCta: React.FC<{ short: Short }> = ({ short }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const time = frame / fps;
	const local = time - short.ctaStart;

	if (local < 0) {
		return null;
	}

	const enter = interpolate(local, [0, 0.35], [0, 1], { ...clamp, easing: easeOut });
	const pulse = 0.5 + 0.5 * Math.sin(local * 7.5);
	const accent = accentOf(short);

	return (
		<div
			style={{
				position: 'absolute',
				top: 1440,
				left: LEFT,
				width: CONTENT_WIDTH,
				height: 90,
				opacity: enter,
				transform: `translateY(${(1 - enter) * 18}px)`,
			}}
		>
			<div
				style={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					padding: '0 22px',
					background: 'rgba(5,10,24,0.92)',
					border: `2px solid ${accent}`,
					boxShadow: `0 0 ${18 + pulse * 22}px ${accent}55, inset 0 0 30px ${accent}12`,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
					<div
						style={{
							width: 34,
							height: 34,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							border: `1px solid ${accent}`,
							color: accent,
							fontSize: 20,
							transform: `translateY(${pulse * 4}px)`,
							boxShadow: `0 0 14px ${accent}55`,
						}}
					>
						↓
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
						<div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.6, color: 'rgba(159,179,200,0.62)' }}>
							RELATED VIDEO
						</div>
						<div style={{ fontFamily: FONT_HEAD, fontSize: 27, fontWeight: 700, letterSpacing: 0.4, color: C.white }}>
							{short.ctaText}
						</div>
					</div>
				</div>
				<div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.4, color: accent, textAlign: 'right' }}>
					FULL EPISODE
					<br />
					EP.01
				</div>
			</div>
		</div>
	);
};

const ShortsVideo: React.FC<{ shortId: string }> = ({ shortId }) => {
	const { fps } = useVideoConfig();
	const short = SHORTS.find((item) => item.id === shortId) ?? SHORTS[0];

	return (
		<AbsoluteFill style={{ backgroundColor: C.bg }}>
			<FontLoader />
			<Audio src={staticFile(short.audio)} />
			<VerticalShell short={short} />
			<HookTitle short={short} />

			<div style={{ position: 'absolute', top: STAGE_TOP, left: LEFT, width: CONTENT_WIDTH, height: STAGE_HEIGHT }}>
				{short.visuals.map((visual, index) => {
					const from = Math.round(visual.start * fps);
					const frames = Math.max(1, Math.round((visual.end - visual.start) * fps));
					return (
						<Sequence key={`${short.id}-visual-${index}`} from={from} durationInFrames={frames} name={`${short.id} visual ${index + 1}`}>
							{visual.type === 'component' ? (
								<VerticalComponentStage visual={visual} durationInFrames={frames} />
							) : (
								<VerticalAssetStage visual={visual} durationInFrames={frames} />
							)}
						</Sequence>
					);
				})}
			</div>

			<ShortCaptions short={short} />
			<ShortCta short={short} />
		</AbsoluteFill>
	);
};

export const Short1Hook: React.FC = () => <ShortsVideo shortId="Short1Hook" />;
export const Short2Tech: React.FC = () => <ShortsVideo shortId="Short2Tech" />;
export const Short3Monopoly: React.FC = () => <ShortsVideo shortId="Short3Monopoly" />;

export default ShortsVideo;
