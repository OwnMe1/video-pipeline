import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, clamp, easeOut, FONT_BODY, FONT_HEAD, FONT_MONO, reveal } from './theme';

type Props = { beat: number; variant?: 'package' | 'hbm3e' | 'hbm4' | 'bonding' };

const Label: React.FC<{
	x: number;
	y: number;
	text: string;
	color?: string;
	size?: number;
	anchor?: 'start' | 'middle' | 'end';
	mono?: boolean;
}> = ({ x, y, text, color = C.white, size = 18, anchor = 'start', mono = false }) => (
	<text
		x={x}
		y={y}
		fill={color}
		fontSize={size}
		textAnchor={anchor}
		fontFamily={mono ? FONT_MONO : FONT_BODY}
		letterSpacing={mono ? 1.2 : 0.2}
	>
		{text}
	</text>
);

const Line: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	color?: string;
	dash?: string;
	width?: number;
	opacity?: number;
}> = ({ x1, y1, x2, y2, color = C.cyanSoft, dash, width = 1, opacity = 1 }) => (
	<line
		x1={x1}
		y1={y1}
		x2={x2}
		y2={y2}
		stroke={color}
		strokeWidth={width}
		strokeDasharray={dash}
		opacity={opacity}
	/>
);

const Stack: React.FC<{
	x: number;
	y: number;
	w: number;
	layerH: number;
	layers: number;
	frame: number;
	accent?: string;
}> = ({ x, y, w, layerH, layers, frame, accent = C.cyan }) => (
	<g>
		{Array.from({ length: layers }).map((_, index) => {
			const p = reveal(frame, index * 2.1, 10);
			const yy = y + (layers - 1 - index) * (layerH + 3) + (1 - p) * 18;
			const isEdge = index === 0 || index === layers - 1;
			return (
				<g key={index} opacity={p}>
					<rect
						x={x}
						y={yy}
						width={w}
						height={layerH}
						rx={3}
						fill={isEdge ? 'rgba(0,245,212,0.20)' : 'rgba(0,245,212,0.09)'}
						stroke={isEdge ? accent : 'rgba(0,245,212,0.55)'}
						strokeWidth={1.1}
					/>
					<rect x={x + 10} y={yy + 4} width={w - 20} height={2} fill="rgba(255,255,255,0.16)" />
					<text
						x={x + w - 10}
						y={yy + layerH - 4}
						fill="rgba(159,179,200,0.45)"
						fontSize={8}
						textAnchor="end"
						fontFamily={FONT_MONO}
					>
						DRAM {String(index + 1).padStart(2, '0')}
					</text>
				</g>
			);
		})}
	</g>
);

const BeatA: React.FC<{ frame: number }> = ({ frame }) => {
	const stackP = reveal(frame, 2, 18);
	const tsvP = reveal(frame, 18, 20);
	const gpuP = reveal(frame, 8, 18);

	return (
		<>
			<Label x={40} y={40} text="LAYER STACK // HBM3E 12-HI" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="2.5D PACKAGE CROSS-SECTION" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 11" color={C.orange} size={14} anchor="end" mono />

			{/* substrate + interposer */}
			<g opacity={stackP}>
				<rect x={120} y={660} width={1360} height={48} rx={3} fill="rgba(255,159,28,0.09)" stroke={C.orange} strokeWidth={1.2} />
				<Label x={140} y={690} text="CoWoS SUBSTRATE" color={C.orange} size={15} mono />
				<rect x={140} y={604} width={1320} height={42} rx={3} fill="rgba(0,245,212,0.08)" stroke={C.cyan} strokeWidth={1.2} />
				<Label x={160} y={631} text="SILICON INTERPOSER" color={C.cyan} size={15} mono />
				<Label x={1500} y={631} text="≈ 2 mm" color={C.muted} size={13} anchor="end" mono />
			</g>

			{/* GPU */}
			<g opacity={gpuP} transform={`translate(0 ${(1 - gpuP) * 22})`}>
				<rect x={230} y={470} width={440} height={122} rx={4} fill="rgba(255,255,255,0.075)" stroke="rgba(255,255,255,0.6)" strokeWidth={1.4} />
				<rect x={246} y={486} width={408} height={90} rx={2} fill="rgba(0,245,212,0.05)" stroke="rgba(0,245,212,0.25)" />
				<Label x={450} y={536} text="GPU DIE" color={C.white} size={26} anchor="middle" />
				<Label x={450} y={562} text="H100 / B200 CLASS" color={C.muted} size={12} anchor="middle" mono />
				{Array.from({ length: 9 }).map((_, i) => (
					<rect key={i} x={270 + i * 44} y={480} width={22} height={7} rx={2} fill={C.cyan} opacity={0.28} />
				))}
			</g>

			{/* HBM stack */}
			<g opacity={stackP}>
				<Stack x={960} y={300} w={286} layerH={18} layers={12} frame={frame} />
				<Label x={1103} y={286} text="HBM3E // 12-HI" color={C.cyan} size={20} anchor="middle" mono />
				<Label x={1103} y={592} text="36 GB // 1.2 TB/s" color={C.orange} size={15} anchor="middle" mono />
				<Label x={1103} y={616} text="APPROX. 720 µm TOTAL" color={C.muted} size={11} anchor="middle" mono />
			</g>

			{/* TSVs */}
			<g opacity={tsvP}>
				{Array.from({ length: 9 }).map((_, i) => {
					const x = 990 + i * 28;
					const p = reveal(frame, 18 + i * 1.3, 12);
					return (
						<line
							key={i}
							x1={x}
							y1={320}
							x2={x}
							y2={566}
							stroke={C.cyan}
							strokeWidth={1.5}
							opacity={0.55}
							strokeDasharray={`${p * 260} 260`}
						/>
					);
				})}
				<Line x1={1218} y1={410} x2={1320} y2={350} color={C.cyan} width={1} opacity={tsvP} />
				<Label x={1328} y={346} text="TSV // THROUGH-SILICON VIA" color={C.cyan} size={13} mono />
				<Label x={1328} y={368} text="> 10,000 VERTICAL CHANNELS" color={C.muted} size={11} mono />
			</g>

			{/* microbumps */}
			<g opacity={stackP}>
				{Array.from({ length: 11 }).map((_, i) => (
					<circle key={`g${i}`} cx={252 + i * 38} cy={604} r={5} fill={C.orange} opacity={0.75} />
				))}
				{Array.from({ length: 8 }).map((_, i) => (
					<circle key={`h${i}`} cx={980 + i * 34} cy={604} r={5} fill={C.orange} opacity={0.75} />
				))}
				<Label x={230} y={650} text="MICROBUMPS" color={C.orange} size={11} mono />
			</g>

			<Label x={40} y={760} text="SIGNAL PATH: DRAM → TSV → INTERPOSER → GPU" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatB: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 16);
	const zoom = interpolate(frame, [0, 90], [1.02, 1.06], { ...clamp, easing: easeOut });

	return (
		<>
			<Label x={40} y={40} text="TSV ARRAY // VERTICAL INTERCONNECT" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="DIE THINNING AND VIA DENSITY" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 12" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p} transform={`translate(80 40) scale(${zoom})`}>
				<Stack x={330} y={150} w={520} layerH={30} layers={12} frame={frame} />
				<Label x={590} y={130} text="12 × DRAM DIES" color={C.cyan} size={22} anchor="middle" mono />
				<Label x={590} y={580} text="DIE THICKNESS −40%" color={C.orange} size={18} anchor="middle" mono />
				<Label x={590} y={606} text="12-HI VS 8-HI" color={C.muted} size={12} anchor="middle" mono />
				{Array.from({ length: 13 }).map((_, i) => {
					const q = reveal(frame, 8 + i * 2, 10);
					return (
						<line
							key={i}
							x1={370 + i * 38}
							y1={160}
							x2={370 + i * 38}
							y2={160 + q * 420}
							stroke={C.cyan}
							strokeWidth={1.2}
							opacity={0.45}
						/>
					);
				})}
			</g>

			<g opacity={reveal(frame, 24, 18)}>
				<circle cx={1220} cy={320} r={146} fill="rgba(0,245,212,0.04)" stroke={C.cyanSoft} strokeWidth={1.2} />
				<circle cx={1220} cy={320} r={100} fill="rgba(0,245,212,0.06)" stroke="rgba(0,245,212,0.45)" strokeWidth={1} />
				<circle cx={1220} cy={320} r={34} fill="rgba(255,159,28,0.20)" stroke={C.orange} strokeWidth={2} />
				<circle cx={1220} cy={320} r={14} fill={C.orange} opacity={0.85} />
				<Line x1={1220} y1={454} x2={1220} y2={520} color={C.cyan} />
				<Line x1={1086} y1={320} x2={1010} y2={320} color={C.cyan} />
				<Label x={1220} y={548} text="TSV CROSS-SECTION" color={C.cyan} size={14} anchor="middle" mono />
				<Label x={1220} y={572} text="COPPER CORE + DIELECTRIC" color={C.muted} size={11} anchor="middle" mono />
				<Label x={1000} y={316} text="PITCH < 10 µm" color={C.orange} size={13} anchor="end" mono />
				<Label x={1220} y={210} text="> 10,000 VIAS" color={C.white} size={22} anchor="middle" mono />
			</g>

			<Label x={40} y={760} text="THINNER DIE → MORE LAYERS → HIGHER CAPACITY" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BondingBeatC: React.FC<{ frame: number }> = ({ frame }) => {
	const left = reveal(frame, 0, 16);
	const right = reveal(frame, 12, 16);

	const bumps = (x: number, color: string) =>
		Array.from({ length: 12 }).map((_, i) => (
			<circle key={i} cx={x + i * 34} cy={392} r={9} fill={color} opacity={0.8} />
		));

	return (
		<>
			<Label x={40} y={40} text="BONDING INTERFACE // SOLDER VS COPPER" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="WHY HYBRID BONDING REPLACES MICROBUMPS" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 13 / 30" color={C.orange} size={14} anchor="end" mono />

			<g opacity={left} transform={`translate(${(1 - left) * -30} 0)`}>
				<rect x={80} y={126} width={690} height={520} rx={6} fill="rgba(255,59,48,0.035)" stroke="rgba(255,59,48,0.45)" />
				<Label x={110} y={166} text="MICROBUMP // TC-NCF" color={C.red} size={20} mono />
				<rect x={150} y={250} width={540} height={86} rx={3} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" />
				<rect x={150} y={420} width={540} height={86} rx={3} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.5)" />
				{bumps(176, C.orange)}
				<Label x={420} y={366} text="SOLDER BUMPS" color={C.red} size={15} anchor="middle" mono />
				<Label x={420} y={552} text="PITCH ≈ 20 µm" color={C.orange} size={18} anchor="middle" mono />
				<Label x={420} y={580} text="FILM + PRESSURE → VOIDS / HEAT" color={C.muted} size={12} anchor="middle" mono />
				<circle cx={620} cy={210} r={16} fill={C.red} opacity={0.7} />
				<Label x={620} y={216} text="!" color={C.white} size={18} anchor="middle" mono />
			</g>

			<g opacity={right} transform={`translate(${(1 - right) * 30} 0)`}>
				<rect x={830} y={126} width={690} height={520} rx={6} fill="rgba(0,245,212,0.035)" stroke="rgba(0,245,212,0.5)" />
				<Label x={860} y={166} text="HYBRID BONDING // Cu–Cu" color={C.cyan} size={20} mono />
				<rect x={900} y={250} width={540} height={86} rx={3} fill="rgba(0,245,212,0.09)" stroke={C.cyan} />
				<rect x={900} y={420} width={540} height={86} rx={3} fill="rgba(0,245,212,0.09)" stroke={C.cyan} />
				{Array.from({ length: 12 }).map((_, i) => (
					<g key={i}>
						<rect x={920 + i * 34} y={336} width={16} height={14} fill={C.cyan} opacity={0.85} />
						<rect x={920 + i * 34} y={350} width={16} height={30} fill="rgba(0,245,212,0.35)" />
					</g>
				))}
				<Label x={1170} y={366} text="DIRECT Cu–Cu" color={C.cyan} size={15} anchor="middle" mono />
				<Label x={1170} y={552} text="PITCH < 1 µm" color={C.cyan} size={20} anchor="middle" mono />
				<Label x={1170} y={580} text="NO SOLDER // LOWER HEAT // 16-HI" color={C.muted} size={12} anchor="middle" mono />
			</g>

			<Label x={40} y={760} text="HYBRID BONDING: THE ROAD TO 16-HI HBM4E AND BEYOND" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};


const BeatCInterposer: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 18);
	const q = reveal(frame, 14, 18);
	const r = reveal(frame, 26, 18);

	return (
		<>
			<Label x={40} y={40} text="PACKAGE // CoWoS 2.5D" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="GPU AND HBM SIDE BY SIDE ON SILICON" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 13" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<rect x={160} y={560} width={1280} height={54} rx={3} fill="rgba(255,159,28,0.08)" stroke={C.orange} />
				<Label x={190} y={594} text="SUBSTRATE" color={C.orange} size={14} mono />
				<rect x={190} y={516} width={1220} height={36} rx={3} fill="rgba(0,245,212,0.08)" stroke={C.cyan} />
				<Label x={220} y={540} text="SILICON INTERPOSER // thousands of traces" color={C.cyan} size={13} mono />
			</g>

			<g opacity={q}>
				<rect x={510} y={360} width={580} height={150} rx={4} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.65)" />
				<Label x={800} y={430} text="GPU DIE" color={C.white} size={30} anchor="middle" />
				<Label x={800} y={462} text="LOGIC + MEMORY CONTROLLER" color={C.muted} size={11} anchor="middle" mono />
				{[250, 360].map((x, i) => (
					<g key={x}>
						<rect x={x} y={360} width={120} height={150} rx={3} fill="rgba(0,245,212,0.06)" stroke={C.cyan} />
						{Array.from({ length: 6 }).map((_, j) => (
							<rect key={j} x={x + 12} y={374 + j * 18} width={96} height={12} rx={2} fill="rgba(0,245,212,0.20)" />
						))}
						<Label x={x + 60} y={536} text={`HBM ${i + 1}`} color={C.cyan} size={11} anchor="middle" mono />
					</g>
				))}
				{[1130, 1240].map((x, i) => (
					<g key={x}>
						<rect x={x} y={360} width={120} height={150} rx={3} fill="rgba(0,245,212,0.06)" stroke={C.cyan} />
						{Array.from({ length: 6 }).map((_, j) => (
							<rect key={j} x={x + 12} y={374 + j * 18} width={96} height={12} rx={2} fill="rgba(0,245,212,0.20)" />
						))}
						<Label x={x + 60} y={536} text={`HBM ${i + 3}`} color={C.cyan} size={11} anchor="middle" mono />
					</g>
				))}
				<Label x={800} y={330} text="ONE PACKAGE // SHORTEST PATHS" color={C.white} size={17} anchor="middle" mono />
			</g>

			<g opacity={r}>
				<Line x1={310} y1={512} x2={310} y2={540} color={C.orange} />
				<Line x1={800} y1={512} x2={800} y2={540} color={C.orange} />
				<Line x1={1290} y1={512} x2={1290} y2={540} color={C.orange} />
				<Label x={800} y={660} text="COWS = CHIP ON WAFER ON SUBSTRATE // TSMC" color={C.orange} size={15} anchor="middle" mono />
				<Label x={800} y={692} text="PACKAGING IS THE THIRD BOTTLENECK" color={C.muted} size={12} anchor="middle" mono />
			</g>

			<Label x={40} y={760} text="2.5D PACKAGING: MEMORY AND LOGIC IN ONE SILICON SYSTEM" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const Hbm3eBeats: React.FC<{ beat: number; frame: number }> = ({ beat, frame }) => {
	const p = reveal(frame, 0, 18);
	if (beat === 0) {
		return (
			<>
				<Label x={40} y={40} text="HBM3E // 12-HI // 36 GB" color={C.cyan} size={24} mono />
				<Label x={40} y={74} text="THE GENERATION THAT POWERED BLACKWELL" color={C.muted} size={13} mono />
				<g opacity={p}>
					<Stack x={560} y={190} w={420} layerH={28} layers={12} frame={frame} />
					<Label x={770} y={170} text="12 × DRAM // 36 GB" color={C.white} size={26} anchor="middle" mono />
					<Label x={770} y={640} text="≈ 1.2 TB/s PER STACK" color={C.cyan} size={24} anchor="middle" mono />
					<Label x={770} y={674} text="1024-BIT INTERFACE" color={C.muted} size={13} anchor="middle" mono />
				</g>
			</>
		);
	}
	if (beat === 1) {
		return (
			<>
				<Label x={40} y={40} text="HBM3E // BANDWIDTH" color={C.cyan} size={24} mono />
				<Label x={40} y={74} text="PER-STACK THROUGHPUT" color={C.muted} size={13} mono />
				<g opacity={p}>
					<Label x={260} y={300} text="1.2" color={C.cyan} size={170} mono />
					<Label x={720} y={300} text="TB/s" color={C.white} size={96} mono />
					<Label x={260} y={360} text="PER HBM3E STACK" color={C.muted} size={16} mono />
					<rect x={260} y={410} width={1100} height={30} rx={3} fill="rgba(255,255,255,0.06)" stroke="rgba(159,179,200,0.22)" />
					<rect x={260} y={410} width={1100 * p} height={30} rx={3} fill={C.cyan} opacity={0.7} />
					<Label x={260} y={486} text="8-HI" color={C.muted} size={12} mono />
					<Label x={1360} y={486} text="12-HI" color={C.cyan} size={12} anchor="end" mono />
					<Label x={800} y={580} text="BANDWIDTH IS NOT FREE: EVERY BIT COSTS ENERGY" color={C.orange} size={16} anchor="middle" mono />
				</g>
			</>
		);
	}
	return (
		<>
			<Label x={40} y={40} text="HBM3E // TOTAL PACKAGE" color={C.cyan} size={24} mono />
			<Label x={40} y={74} text="EIGHT STACKS AROUND ONE GPU" color={C.muted} size={13} mono />
			<g opacity={p}>
				<rect x={560} y={310} width={480} height={190} rx={5} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.65)" />
				<Label x={800} y={390} text="GPU" color={C.white} size={40} anchor="middle" />
				<Label x={800} y={424} text="BLACKWELL" color={C.muted} size={13} anchor="middle" mono />
				{Array.from({ length: 8 }).map((_, i) => {
					const left = i < 4;
					const x = left ? 250 + (i % 4) * 62 : 1090 + ((i - 4) % 4) * 62;
					return (
						<g key={i}>
							<rect x={x} y={330} width={48} height={150} rx={3} fill="rgba(0,245,212,0.12)" stroke={C.cyan} />
							{Array.from({ length: 6 }).map((_, j) => (
								<rect key={j} x={x + 6} y={342 + j * 22} width={36} height={14} rx={2} fill="rgba(0,245,212,0.24)" />
							))}
						</g>
					);
				})}
				<Label x={800} y={560} text="8 × 1.2 TB/s ≈ 8 TB/s TOTAL" color={C.cyan} size={28} anchor="middle" mono />
				<Label x={800} y={598} text="THE BANDWIDTH WALL MOVES, NOT DISAPPEARS" color={C.muted} size={12} anchor="middle" mono />
			</g>
		</>
	);
};

const Hbm4Beats: React.FC<{ beat: number; frame: number }> = ({ beat, frame }) => {
	const p = reveal(frame, 0, 18);
	if (beat === 0) {
		return (
			<>
				<Label x={40} y={40} text="HBM4 // 2048-BIT INTERFACE" color={C.cyan} size={24} mono />
				<Label x={40} y={74} text="THE INTERFACE DOUBLES" color={C.muted} size={13} mono />
				<g opacity={p}>
					<Label x={260} y={230} text="HBM3E" color={C.muted} size={18} mono />
					<rect x={260} y={254} width={520} height={52} rx={3} fill="rgba(159,179,200,0.18)" stroke="rgba(159,179,200,0.4)" />
					<Label x={520} y={289} text="1024-BIT" color={C.white} size={24} anchor="middle" mono />
					<Label x={260} y={370} text="HBM4" color={C.cyan} size={18} mono />
					<rect x={260} y={394} width={1040} height={52} rx={3} fill="rgba(0,245,212,0.18)" stroke={C.cyan} />
					<Label x={780} y={429} text="2048-BIT // 2× WIDTH" color={C.white} size={26} anchor="middle" mono />
					<Label x={1360} y={520} text="MORE LANES = MORE BANDWIDTH AT LOWER ENERGY / BIT" color={C.orange} size={14} anchor="end" mono />
				</g>
			</>
		);
	}
	if (beat === 1) {
		return (
			<>
				<Label x={40} y={40} text="HBM4 // CAPACITY" color={C.cyan} size={24} mono />
				<Label x={40} y={74} text="12-HI VS 16-HI" color={C.muted} size={13} mono />
				<g opacity={p}>
					<Stack x={300} y={230} w={340} layerH={24} layers={12} frame={frame} />
					<Label x={470} y={210} text="12-HI // 36 GB" color={C.white} size={22} anchor="middle" mono />
					<Stack x={960} y={180} w={340} layerH={22} layers={16} frame={frame} />
					<Label x={1130} y={160} text="16-HI // 48 GB" color={C.cyan} size={22} anchor="middle" mono />
					<Label x={800} y={650} text="MORE LAYERS → MORE CAPACITY → HIGHER PACKAGING RISK" color={C.orange} size={14} anchor="middle" mono />
				</g>
			</>
		);
	}
	return (
		<>
			<Label x={40} y={40} text="HBM4 // 2 TB/s PER STACK" color={C.cyan} size={24} mono />
			<Label x={40} y={74} text="VERA RUBIN DEMAND" color={C.muted} size={13} mono />
			<g opacity={p}>
				<Label x={260} y={300} text="2" color={C.cyan} size={180} mono />
				<Label x={460} y={300} text="TB/s" color={C.white} size={100} mono />
				<Label x={260} y={360} text="PER HBM4 STACK" color={C.muted} size={16} mono />
				<rect x={260} y={420} width={1100} height={30} rx={3} fill="rgba(255,255,255,0.06)" stroke="rgba(159,179,200,0.22)" />
				<rect x={260} y={420} width={1100 * p} height={30} rx={3} fill={C.cyan} opacity={0.7} />
				<Label x={800} y={560} text="THE PACKAGE IS NOW THE PRODUCT" color={C.orange} size={18} anchor="middle" mono />
			</g>
		</>
	);
};

const BondingBeats: React.FC<{ beat: number; frame: number }> = ({ beat, frame }) => {
	if (beat === 0) {
		return <BondingBeatC frame={frame} />;
	}
	const p = reveal(frame, 0, 18);
	if (beat === 1) {
		return (
			<>
				<Label x={40} y={40} text="BONDING // PITCH" color={C.cyan} size={24} mono />
				<Label x={40} y={74} text="FROM 20 MICRONS TO BELOW ONE" color={C.muted} size={13} mono />
				<g opacity={p}>
					<rect x={180} y={220} width={520} height={120} rx={4} fill="rgba(255,59,48,0.06)" stroke={C.red} />
					<Label x={440} y={286} text="MICROBUMP" color={C.red} size={28} anchor="middle" mono />
					<Label x={440} y={380} text="PITCH ≈ 20 µm" color={C.orange} size={24} anchor="middle" mono />
					<rect x={860} y={220} width={560} height={120} rx={4} fill="rgba(0,245,212,0.06)" stroke={C.cyan} />
					<Label x={1140} y={286} text="Cu–Cu" color={C.cyan} size={28} anchor="middle" mono />
					<Label x={1140} y={380} text="PITCH < 1 µm" color={C.cyan} size={24} anchor="middle" mono />
					<Label x={800} y={560} text="DENSER CONNECTIONS // SHORTER PATHS // LESS HEAT" color={C.white} size={17} anchor="middle" mono />
				</g>
			</>
		);
	}
	return (
		<>
			<Label x={40} y={40} text="BONDING // 16-HI HORIZON" color={C.cyan} size={24} mono />
			<Label x={40} y={74} text="HYBRID BONDING ENABLES THE NEXT STACK HEIGHT" color={C.muted} size={13} mono />
			<g opacity={p}>
				<Stack x={560} y={170} w={420} layerH={28} layers={16} frame={frame} accent={C.cyan} />
				<Label x={770} y={150} text="16-HI // HBM4E" color={C.cyan} size={22} anchor="middle" mono />
				<Label x={770} y={680} text="NO SOLDER // DIRECT COPPER // HIGHER YIELD" color={C.orange} size={14} anchor="middle" mono />
			</g>
		</>
	);
};

export const LayerStackDiagram: React.FC<Props> = ({ beat, variant = 'package' }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<svg viewBox="0 0 1600 780" style={{ width: '100%', height: '100%' }}>
				<rect x={0} y={0} width={1600} height={780} fill="transparent" />
				{variant === 'hbm3e' ? <Hbm3eBeats beat={beat} frame={frame} /> : null}
				{variant === 'hbm4' ? <Hbm4Beats beat={beat} frame={frame} /> : null}
				{variant === 'bonding' ? <BondingBeats beat={beat} frame={frame} /> : null}
				{variant === 'package' ? (
					<>
						{beat === 0 ? <BeatA frame={frame} /> : null}
						{beat === 1 ? <BeatB frame={frame} /> : null}
						{beat === 2 ? <BeatCInterposer frame={frame} /> : null}
					</>
				) : null}
			</svg>
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 0,
					fontFamily: FONT_HEAD,
					fontSize: 11,
					letterSpacing: 2,
					color: 'rgba(159,179,200,0.38)',
				}}
			>
				BLUEPRINT / LAYER STACK
			</div>
		</div>
	);
};
