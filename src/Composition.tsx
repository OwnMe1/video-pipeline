import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import videoData from './data/video_data.json';
import { FontLoader } from './fonts';
import { AssetBeat, Beat } from './components/AssetBeat';
import { CADShell } from './components/CADShell';
import { Captions } from './components/Captions';
import { Hud } from './components/Hud';
import { LayerStackDiagram } from './components/LayerStackDiagram';
import { PhysicsComparison } from './components/PhysicsComparison';
import { SupplyChainMap } from './components/SupplyChainMap';
import { YieldMeter } from './components/YieldMeter';
import { C, clamp, easeOut } from './components/theme';

type BeatData = {
	kind: string;
	files?: string[];
	layout?: string;
	label: string;
};

type Scene = {
	id: string;
	number: number;
	start: number;
	duration: number;
	audio_file: string;
	narration: string;
	visual: {
		kind: 'asset' | 'component';
		component: string | null;
		beats: BeatData[];
	};
	sfx: { file: string; volume: number } | null;
	beat_sfx: { beat: number; file: string; volume: number }[];
};

type VideoData = {
	title: string;
	subtitle: string;
	channel: string;
	episode: string;
	fps: number;
	total_duration: number;
	scenes: Scene[];
};

const DATA = videoData as VideoData;
const SCENES = DATA.scenes;
const FPS = DATA.fps || 30;

export const getTotalDurationInFrames = (fps: number) =>
	SCENES.reduce((total, scene) => total + Math.round(scene.duration * fps), 0);

const beatFrames = (frames: number) => {
	const a = Math.round(frames / 3);
	const b = Math.round((frames * 2) / 3) - a;
	const c = frames - a - b;
	return [a, b, c];
};

const ComponentForBeat: React.FC<{ name: string | null; beat: number; sceneNumber: number }> = ({ name, beat, sceneNumber }) => {
	switch (name) {
		case 'LayerStackDiagram':
			return <LayerStackDiagram beat={beat} variant={sceneNumber === 15 ? 'hbm3e' : sceneNumber === 29 ? 'hbm4' : sceneNumber === 30 ? 'bonding' : 'package'} />;
		case 'PhysicsComparison':
			return <PhysicsComparison beat={beat} />;
		case 'YieldMeter':
			return <YieldMeter beat={beat} />;
		case 'SupplyChainMap':
			return <SupplyChainMap beat={beat} />;
		default:
			return null;
	}
};

const SceneBlock: React.FC<{ scene: Scene }> = ({ scene }) => {
	const { fps } = useVideoConfig();
	const frames = Math.max(1, Math.round(scene.duration * fps));
	const splits = beatFrames(frames);
	const offsets = [0, splits[0], splits[0] + splits[1]];
	const letters = ['A', 'B', 'C'];

	return (
		<>
			{scene.visual.beats.slice(0, 3).map((beat, index) => {
				const beatData: Beat = {
					kind: beat.kind,
					files: beat.files ?? [],
					layout: beat.layout ?? 'full',
					label: beat.label,
				};
				return (
					<Sequence key={`${scene.id}-beat-${index}`} from={offsets[index]} durationInFrames={splits[index]} name={`${scene.id} ${letters[index]}`}>
						<CADShell beat={index} beatLabel={beat.label} figure={`FIG. ${String(scene.number).padStart(2, '0')}.${letters[index]}`}>
							{scene.visual.kind === 'component' ? (
								<ComponentForBeat name={scene.visual.component} beat={index} sceneNumber={scene.number} />
							) : (
								<AssetBeat beat={beatData} beatIndex={index} sceneNumber={scene.number} durationInFrames={splits[index]} />
							)}
						</CADShell>
					</Sequence>
				);
			})}
		</>
	);
};

const SfxLayer: React.FC = () => {
	const { fps } = useVideoConfig();
	const cues: React.ReactNode[] = [];

	for (const scene of SCENES) {
		const sceneFrom = Math.round(scene.start * fps);
		const sceneFrames = Math.max(1, Math.round(scene.duration * fps));
		const splits = beatFrames(sceneFrames);

		if (scene.sfx) {
			cues.push(
				<Sequence key={`sfx-${scene.id}`} from={sceneFrom} durationInFrames={Math.min(90, sceneFrames)}>
					<Audio src={staticFile(scene.sfx.file)} volume={scene.sfx.volume} />
				</Sequence>,
			);
		}

		for (const cue of scene.beat_sfx) {
			const offset = cue.beat === 0 ? 0 : cue.beat === 1 ? splits[0] : splits[0] + splits[1];
			cues.push(
				<Sequence key={`sfx-${scene.id}-${cue.beat}`} from={sceneFrom + offset} durationInFrames={Math.min(45, splits[Math.min(2, cue.beat)])}>
					<Audio src={staticFile(cue.file)} volume={cue.volume} />
				</Sequence>,
			);
		}
	}

	return <>{cues}</>;
};

export const MyComposition: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();
	const intro = interpolate(frame, [0, 12], [1, 0], { ...clamp, easing: easeOut });
	const outro = interpolate(frame, [durationInFrames - 18, durationInFrames - 1], [0, 1], { ...clamp, easing: easeOut });

	return (
		<AbsoluteFill style={{ backgroundColor: C.bg }}>
			<FontLoader />
			<Audio src={staticFile('full_audio.wav')} />
			<Audio
				src={staticFile('audio/music_bed.mp3')}
				volume={(f) =>
					interpolate(f, [0, 30, durationInFrames - 60, durationInFrames - 1], [0, 1, 1, 0], clamp)
				}
			/>
			<SfxLayer />

			{SCENES.map((scene) => (
				<Sequence
					key={scene.id}
					from={Math.round(scene.start * FPS)}
					durationInFrames={Math.max(1, Math.round(scene.duration * FPS))}
					name={scene.id}
				>
					<SceneBlock scene={scene} />
				</Sequence>
			))}

			<AbsoluteFill
				style={{
					pointerEvents: 'none',
					background:
						'radial-gradient(ellipse at 50% 45%, rgba(0,245,212,0.025) 0%, rgba(0,0,0,0) 55%), radial-gradient(ellipse at 50% 110%, rgba(255,159,28,0.08) 0%, rgba(0,0,0,0) 55%)',
				}}
			/>

			<Captions />
			<Hud />

			<AbsoluteFill style={{ backgroundColor: '#000', opacity: intro, pointerEvents: 'none' }} />
			<AbsoluteFill style={{ backgroundColor: '#000', opacity: outro, pointerEvents: 'none' }} />
		</AbsoluteFill>
	);
};
