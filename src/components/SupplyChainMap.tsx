import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FONT_BODY, FONT_HEAD, FONT_MONO, reveal } from './theme';

type Props = { beat: number };

const Label: React.FC<{
	x: number;
	y: number;
	text: string;
	color?: string;
	size?: number;
	anchor?: 'start' | 'middle' | 'end';
	mono?: boolean;
	weight?: number;
}> = ({ x, y, text, color = C.white, size = 18, anchor = 'start', mono = false, weight = 500 }) => (
	<text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontFamily={mono ? FONT_MONO : FONT_BODY} fontWeight={weight} letterSpacing={mono ? 1.1 : 0.2}>
		{text}
	</text>
);

const MapPanel: React.FC<{
	src: string;
	left: number;
	top: number;
	width: number;
	height: number;
	label: string;
	opacity: number;
}> = ({ src, left, top, width, height, label, opacity }) => (
	<div style={{ position: 'absolute', left, top, width, height, opacity, border: '1px solid rgba(0,245,212,0.22)', background: 'rgba(0,245,212,0.02)', overflow: 'hidden' }}>
		<Img
			src={staticFile(src)}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'contain',
				filter: 'grayscale(1) brightness(0.42) contrast(1.5)',
				opacity: 0.8,
			}}
		/>
		<div style={{ position: 'absolute', left: 10, top: 8, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5, color: C.cyan }}>{label}</div>
	</div>
);

const KoreaMap: React.FC<{ opacity: number }> = ({ opacity }) => (
	<MapPanel src="assets/images/south_korea_map.png" left={70} top={120} width={440} height={500} label="SOUTH KOREA // FAB CLUSTER" opacity={opacity} />
);

const TaiwanMap: React.FC<{ opacity: number }> = ({ opacity }) => (
	<MapPanel src="assets/images/taiwan_map.png" left={1120} top={120} width={400} height={500} label="TAIWAN // CoWoS" opacity={opacity} />
);

const FlowLine: React.FC<{
	d: string;
	progress: number;
	color: string;
	dashOffset: number;
	width?: number;
}> = ({ d, progress, color, dashOffset, width = 2.5 }) => (
	<path
		d={d}
		fill="none"
		stroke={color}
		strokeWidth={width}
		strokeDashoffset={dashOffset}
		opacity={0.85}
		style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
		strokeDasharray={`${progress * 1000} 1000`}
	/>
);

const BeatA: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 20);
	const q = reveal(frame, 14, 20);
	const flow = reveal(frame, 20, 30);
	const dash = -frame * 1.6;

	return (
		<>
			<Label x={40} y={40} text="SUPPLY CHAIN // KOREA → TAIWAN → USA" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="THE THREE-SIDED BOTTLENECK" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 26" color={C.orange} size={14} anchor="end" mono />

			<KoreaMap opacity={p} />
			<TaiwanMap opacity={q} />

			<svg viewBox="0 0 1600 780" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
				<FlowLine d="M 510 360 C 720 210, 960 210, 1120 360" progress={flow} color={C.cyan} dashOffset={dash} />
				<FlowLine d="M 1520 360 C 1560 250, 1440 160, 1280 120" progress={flow} color={C.orange} dashOffset={dash} />

				<g opacity={p}>
					<circle cx={330} cy={330} r={9} fill={C.orange} />
					<circle cx={330} cy={330} r={22} fill="none" stroke={C.orange} strokeWidth={1.5} opacity={0.55} />
					<Label x={352} y={326} text="ICHEON" color={C.white} size={14} mono />
					<Label x={352} y={346} text="DRAM / HBM" color={C.muted} size={10} mono />
					<circle cx={390} cy={400} r={7} fill={C.orange} />
					<Label x={410} y={396} text="CHEONGJU" color={C.white} size={13} mono />
					<Label x={410} y={414} text="M15X / P&T" color={C.muted} size={9} mono />
					<circle cx={300} cy={452} r={7} fill={C.orange} />
					<Label x={318} y={448} text="YONGIN" color={C.white} size={13} mono />
					<Label x={318} y={466} text="FUTURE CLUSTER" color={C.muted} size={9} mono />
				</g>

				<g opacity={q}>
					<circle cx={1260} cy={330} r={9} fill={C.cyan} />
					<circle cx={1260} cy={330} r={22} fill="none" stroke={C.cyan} strokeWidth={1.5} opacity={0.55} />
					<Label x={1282} y={326} text="HSINCHU / TAINAN" color={C.white} size={14} mono />
					<Label x={1282} y={346} text="TSMC CoWoS" color={C.muted} size={10} mono />
				</g>

				<g opacity={reveal(frame, 34, 20)}>
					<rect x={730} y={110} width={220} height={110} rx={5} fill="rgba(255,255,255,0.035)" stroke={C.cyan} />
					<image href={staticFile('assets/images/nvidia_logo.png')} x={760} y={138} width={160} height={44} preserveAspectRatio="xMidYMid meet" />
					<Label x={840} y={204} text="NVIDIA // SANTA CLARA" color={C.white} size={12} anchor="middle" mono />
					<Label x={840} y={246} text="DEMAND" color={C.orange} size={12} anchor="middle" mono />
					<Label x={840} y={270} text="THE AI ACCELERATOR" color={C.muted} size={10} anchor="middle" mono />
				</g>

				<g opacity={reveal(frame, 44, 18)}>
					<rect x={560} y={600} width={480} height={92} rx={5} fill="rgba(0,245,212,0.035)" stroke="rgba(0,245,212,0.3)" />
					<Label x={590} y={634} text="HBM → CoWoS → GPU" color={C.cyan} size={16} mono />
					<Label x={590} y={660} text="MEMORY + LOGIC + PACKAGING" color={C.muted} size={11} mono />
					<Label x={1010} y={634} text="ONE CHAIN" color={C.orange} size={14} anchor="end" mono />
				</g>
			</svg>

			<Label x={40} y={760} text="A SINGLE DISRUPTION IN THIS NARROW GEOGRAPHY MOVES THE ROADMAP" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatB: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 18);
	const q = reveal(frame, 16, 18);
	const r = reveal(frame, 30, 18);

	return (
		<>
			<Label x={40} y={40} text="SUPPLY CHAIN // CoWoS PACKAGE FLOW" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="TSMC TURNS MEMORY AND LOGIC INTO ONE PACKAGE" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 26B" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<rect x={140} y={540} width={1320} height={62} rx={4} fill="rgba(255,159,28,0.08)" stroke={C.orange} />
				<Label x={170} y={578} text="SUBSTRATE" color={C.orange} size={16} mono />
				<Label x={1430} y={578} text="ORGANIC PACKAGE" color={C.muted} size={11} anchor="end" mono />
				<rect x={180} y={490} width={1240} height={36} rx={3} fill="rgba(0,245,212,0.08)" stroke={C.cyan} />
				<Label x={210} y={514} text="SILICON INTERPOSER // CoWoS" color={C.cyan} size={15} mono />
			</g>

			<g opacity={q}>
				<rect x={620} y={300} width={360} height={170} rx={4} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.65)" />
				<Label x={800} y={370} text="GPU DIE" color={C.white} size={30} anchor="middle" />
				<Label x={800} y={402} text="LOGIC" color={C.muted} size={12} anchor="middle" mono />
				{[
					{ x: 270, label: 'HBM' },
					{ x: 390, label: 'HBM' },
					{ x: 510, label: 'HBM' },
				].map((stack) => (
					<g key={stack.x}>
						{Array.from({ length: 8 }).map((_, layer) => (
							<rect key={layer} x={stack.x} y={340 - layer * 16} width={80} height={13} rx={2} fill="rgba(0,245,212,0.18)" stroke={C.cyan} strokeWidth={0.8} />
						))}
						<Label x={stack.x + 40} y={370} text={stack.label} color={C.cyan} size={10} anchor="middle" mono />
					</g>
				))}
				{[
					{ x: 1120, label: 'HBM' },
					{ x: 1240, label: 'HBM' },
					{ x: 1360, label: 'HBM' },
				].map((stack) => (
					<g key={stack.x}>
						{Array.from({ length: 8 }).map((_, layer) => (
							<rect key={layer} x={stack.x} y={340 - layer * 16} width={80} height={13} rx={2} fill="rgba(0,245,212,0.18)" stroke={C.cyan} strokeWidth={0.8} />
						))}
						<Label x={stack.x + 40} y={370} text={stack.label} color={C.cyan} size={10} anchor="middle" mono />
					</g>
				))}
				<Label x={800} y={330} text="2.5D ASSEMBLY" color={C.cyan} size={15} anchor="middle" mono />
			</g>

			<g opacity={r}>
				<line x1={310} y1={468} x2={310} y2={490} stroke={C.orange} strokeWidth={2} />
				<line x1={800} y1={470} x2={800} y2={490} stroke={C.orange} strokeWidth={2} />
				<line x1={1290} y1={468} x2={1290} y2={490} stroke={C.orange} strokeWidth={2} />
				<circle cx={800} cy={530} r={5} fill={C.orange} opacity={0.7 + 0.3 * Math.sin(frame / 8)} />
				<Label x={800} y={660} text="HBM + GPU → INTERPOSER → SUBSTRATE → BOARD" color={C.muted} size={13} anchor="middle" mono />
				<Label x={800} y={694} text="COWS = CHIP ON WAFER ON SUBSTRATE" color={C.cyan} size={15} anchor="middle" mono />
				<Label x={1340} y={660} text="TSMC // PACKAGING" color={C.orange} size={12} anchor="end" mono />
			</g>

			<Label x={40} y={760} text="THE PACKAGE IS THE PRODUCT: MEMORY, LOGIC AND PACKAGING ARE ONE SYSTEM" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatC: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 20);
	const q = reveal(frame, 14, 20);
	const segments = [
		{ label: 'SK HYNIX', value: 55, color: C.cyan, logo: 'assets/images/sk_hynix_logo.png', sub: 'MID-50%' },
		{ label: 'SAMSUNG', value: 25, color: C.orange, logo: 'assets/images/samsung_logo.png', sub: 'MID-20%' },
		{ label: 'MICRON', value: 20, color: C.muted, logo: 'assets/images/micron_logo_white.png', sub: '≈ 20%' },
	];

	return (
		<>
			<Label x={40} y={40} text="SUPPLY CHAIN // HBM4 ALLOCATION" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="WHO GETS THE FIRST SILICON" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 27" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<rect x={80} y={120} width={1440} height={66} rx={4} fill="rgba(255,255,255,0.035)" stroke="rgba(159,179,200,0.2)" />
				{segments.map((s, i) => {
					const prev = segments.slice(0, i).reduce((a, b) => a + b.value, 0);
					return (
						<g key={s.label}>
							<rect x={80 + (prev / 100) * 1440} y={120} width={(s.value / 100) * 1440 * p} height={66} fill={s.color} opacity={0.85} />
							<Label x={80 + ((prev + s.value / 2) / 100) * 1440} y={162} text={`${s.value}%`} color={C.bg} size={24} anchor="middle" mono weight={700} />
						</g>
					);
				})}
				<Label x={80} y={214} text="INITIAL HBM4 VOLUME // TIER ONE AI CUSTOMER" color={C.muted} size={11} mono />
			</g>

			<g opacity={q}>
				{segments.map((s, i) => {
					const x = 80 + i * 500;
					return (
						<g key={s.label}>
							<rect x={x} y={260} width={440} height={180} rx={5} fill="rgba(255,255,255,0.03)" stroke={s.color} />
							<image href={staticFile(s.logo)} x={x + 26} y={286} width={220} height={56} preserveAspectRatio="xMinYMid meet" />
							<Label x={x + 26} y={390} text={s.label} color={s.color} size={22} mono />
							<Label x={x + 26} y={418} text={s.sub} color={C.white} size={20} mono />
						</g>
					);
				})}
			</g>

			<g opacity={reveal(frame, 30, 18)}>
				<rect x={80} y={486} width={1440} height={210} rx={5} fill="rgba(0,245,212,0.03)" stroke="rgba(0,245,212,0.28)" />
				<Label x={110} y={526} text="THE CHOKEHOLD" color={C.cyan} size={18} mono />
				<Label x={110} y={562} text="NOT A TEXTBOOK MONOPOLY." color={C.white} size={24} />
				<Label x={110} y={594} text="THE LARGEST AI CUSTOMER CANNOT DIVERSIFY" color={C.muted} size={12} mono />
				<Label x={110} y={616} text="FASTER THAN THE SECOND SUPPLIER CAN FIX YIELD." color={C.muted} size={12} mono />
				<Label x={1490} y={562} text="MID-50%" color={C.cyan} size={30} anchor="end" mono />
				<Label x={1490} y={596} text="SK HYNIX SHARE" color={C.dim} size={10} anchor="end" mono />
				<Label x={1490} y={650} text="MID-20% / 20%" color={C.orange} size={16} anchor="end" mono />
			</g>

			<Label x={40} y={760} text="ALLOCATION IS A FUNCTION OF PROVEN YIELD AND CAPACITY" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

export const SupplyChainMap: React.FC<Props> = ({ beat }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			{beat === 0 ? <BeatA frame={frame} /> : null}
			{beat === 1 ? <BeatB frame={frame} /> : null}
			{beat === 2 ? <BeatC frame={frame} /> : null}
			<div style={{ position: 'absolute', right: 0, top: 0, fontFamily: FONT_HEAD, fontSize: 11, letterSpacing: 2, color: 'rgba(159,179,200,0.38)' }}>
				BLUEPRINT / SUPPLY CHAIN
			</div>
		</div>
	);
};
