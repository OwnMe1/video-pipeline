import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { C, clamp, easeOut, FONT_BODY, FONT_HEAD, FONT_MONO, reveal } from './theme';

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
	transform?: string;
}> = ({ x, y, text, color = C.white, size = 18, anchor = 'start', mono = false, weight = 500, transform }) => (
	<text x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontFamily={mono ? FONT_MONO : FONT_BODY} fontWeight={weight} letterSpacing={mono ? 1.1 : 0.2} transform={transform}>
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
	<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} opacity={opacity} />
);

const Bar: React.FC<{
	x: number;
	y: number;
	width: number;
	height: number;
	progress: number;
	color: string;
	label: string;
	value: string;
	sub?: string;
}> = ({ x, y, width, height, progress, color, label, value, sub }) => (
	<g>
		<Label x={x} y={y - 14} text={label} color={C.white} size={18} weight={600} />
		<rect x={x} y={y} width={width} height={height} rx={3} fill="rgba(255,255,255,0.045)" stroke="rgba(159,179,200,0.22)" />
		<rect x={x} y={y} width={width * progress} height={height} rx={3} fill={color} opacity={0.82} />
		<rect x={x} y={y} width={width * progress} height={height} rx={3} fill="url(#barGlow)" opacity={0.35} />
		<Label x={x + width + 16} y={y + height - 6} text={value} color={color} size={24} mono />
		{sub ? <Label x={x} y={y + height + 24} text={sub} color={C.muted} size={12} mono /> : null}
	</g>
);

const BeatA: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 18);
	const q = reveal(frame, 18, 18);
	const r = reveal(frame, 30, 18);

	return (
		<>
			<Label x={40} y={40} text="PHYSICS // BUS WIDTH AND DISTANCE" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="WHY GDDR RUNS OUT OF ROAD" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 04" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<rect x={40} y={112} width={1520} height={238} rx={6} fill="rgba(255,159,28,0.03)" stroke="rgba(255,159,28,0.28)" />
				<Label x={70} y={146} text="GDDR6X // PCB TRACE" color={C.orange} size={18} mono />
				<rect x={90} y={176} width={340} height={70} rx={4} fill="rgba(255,159,28,0.10)" stroke={C.orange} />
				<Label x={260} y={218} text="384-BIT BUS" color={C.orange} size={22} anchor="middle" mono />
				<Label x={520} y={204} text="DATA LANES ROUTED ACROSS A PRINTED CIRCUIT BOARD" color={C.muted} size={14} />
				<Label x={520} y={228} text="LENGTH: TENS OF MILLIMETRES // REFLECTIONS // LOSS" color={C.dim} size={12} mono />
				<Line x1={90} y1={286} x2={640} y2={286} color={C.orange} width={3} dash="12 8" opacity={p} />
				<Label x={620} y={310} text="LONGER TRACE → MORE ENERGY PER BIT" color={C.orange} size={12} anchor="end" mono />
			</g>

			<g opacity={q}>
				<rect x={40} y={370} width={1520} height={238} rx={6} fill="rgba(0,245,212,0.03)" stroke="rgba(0,245,212,0.32)" />
				<Label x={70} y={404} text="HBM3E // SILICON INTERPOSER" color={C.cyan} size={18} mono />
				<rect x={90} y={434} width={910} height={70} rx={4} fill="rgba(0,245,212,0.10)" stroke={C.cyan} />
				<Label x={545} y={476} text="1024-BIT BUS" color={C.cyan} size={22} anchor="middle" mono />
				<Label x={1040} y={456} text="HBM4 // 2048-BIT" color={C.cyan} size={16} mono />
				<rect x={1040} y={466} width={460} height={38} rx={3} fill="rgba(0,245,212,0.14)" stroke={C.cyan} />
				<Label x={1270} y={492} text="2× INTERFACE" color={C.white} size={17} anchor="middle" mono />
				<Line x1={90} y1={544} x2={900} y2={544} color={C.cyan} width={3} dash="12 8" opacity={q} />
				<Label x={900} y={568} text="MILLIMETRES OF SILICON // SHORT // LOW ENERGY" color={C.cyan} size={12} anchor="end" mono />
			</g>

			<g opacity={r}>
				<Label x={40} y={694} text="WIDTH SCALE" color={C.muted} size={12} mono />
				{[{ label: 'GDDR6X', value: 384, color: C.orange }, { label: 'HBM3E', value: 1024, color: C.cyan }, { label: 'HBM4', value: 2048, color: C.white }].map((item, index) => {
					const y = 716 + index * 20;
					return (
						<g key={item.label}>
							<Label x={40} y={y + 10} text={item.label} color={item.color} size={10} mono />
							<rect x={140} y={y} width={(item.value / 2048) * 900} height={8} fill={item.color} opacity={0.65} />
							<Label x={170 + (item.value / 2048) * 900} y={y + 9} text={`${item.value}-bit`} color={item.color} size={10} mono />
						</g>
					);
				})}
			</g>
		</>
	);
};

const BeatB: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 18);
	const q = reveal(frame, 12, 18);
	const heat = interpolate(frame, [30, 90], [0.2, 1], { ...clamp, easing: easeOut });

	return (
		<>
			<Label x={40} y={40} text="PHYSICS // ENERGY PER BIT" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="MOVING DATA COSTS POWER BEFORE IT COSTS TIME" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 06" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<Bar x={80} y={220} width={620} height={54} progress={p} color={C.orange} label="PCB TRACE // GDDR" value="HIGH" sub="LONGER DISTANCE + HIGHER CAPACITANCE" />
				<Bar x={80} y={360} width={620} height={54} progress={q} color={C.cyan} label="SILICON INTERPOSER // HBM" value="LOW" sub="SHORT REACH + WIDE PARALLEL BUS" />
			</g>

			<g opacity={reveal(frame, 24, 18)}>
				<rect x={820} y={142} width={700} height={430} rx={6} fill="rgba(255,59,48,0.035)" stroke="rgba(255,59,48,0.35)" />
				<Label x={850} y={180} text="THERMAL CONSEQUENCE" color={C.red} size={18} mono />
				<circle cx={1160} cy={340} r={100} fill="rgba(255,59,48,0.10)" stroke={C.red} strokeWidth={2} opacity={heat} />
				<circle cx={1160} cy={340} r={62} fill="rgba(255,159,28,0.16)" stroke={C.orange} strokeWidth={2} opacity={heat} />
				<Label x={1160} y={348} text="HEAT" color={C.red} size={30} anchor="middle" mono />
				<Label x={1160} y={474} text="ENERGY / BIT → HEAT → COOLING BUDGET" color={C.muted} size={12} anchor="middle" mono />
				<Label x={1160} y={510} text="THE DATA CENTER PAYS TWICE" color={C.orange} size={14} anchor="middle" mono />
			</g>

			<Label x={40} y={760} text="WHY THE INDUSTRY MOVED MEMORY NEXT TO THE COMPUTE DIE" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatC: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 20);
	const q = reveal(frame, 16, 20);
	const x0 = 160;
	const y0 = 630;
	const w = 1280;
	const h = 440;

	const gddrRoof = `M ${x0} ${y0} L ${x0 + w * 0.42} ${y0 - h * 0.78} L ${x0 + w} ${y0 - h * 0.78}`;
	const hbmRoof = `M ${x0} ${y0} L ${x0 + w * 0.73} ${y0 - h * 0.95} L ${x0 + w} ${y0 - h * 0.95}`;

	return (
		<>
			<Label x={40} y={40} text="PHYSICS // ROOFLINE" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="COMPUTE VS BANDWIDTH // THE MEMORY WALL" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 07" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke="rgba(159,179,200,0.45)" strokeWidth={1.5} />
				<line x1={x0} y1={y0} x2={x0} y2={y0 - h} stroke="rgba(159,179,200,0.45)" strokeWidth={1.5} />
				{[0.25, 0.5, 0.75, 1].map((t) => (
					<g key={t}>
						<line x1={x0} y1={y0 - h * t} x2={x0 + w} y2={y0 - h * t} stroke="rgba(159,179,200,0.10)" strokeDasharray="4 8" />
						<line x1={x0 + w * t} y1={y0} x2={x0 + w * t} y2={y0 - h} stroke="rgba(159,179,200,0.10)" strokeDasharray="4 8" />
					</g>
				))}
				<Label x={x0 + w / 2} y={y0 + 54} text="ARITHMETIC INTENSITY →" color={C.muted} size={14} anchor="middle" mono />
				<Label x={x0 - 26} y={y0 - h / 2} text="PERFORMANCE →" color={C.muted} size={14} anchor="middle" mono transform={`rotate(-90 ${x0 - 26} ${y0 - h / 2})`} />
			</g>

			<g opacity={q}>
				<path d={gddrRoof} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="900" strokeDashoffset={900 * (1 - q)} />
				<path d={hbmRoof} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="900" strokeDashoffset={900 * (1 - q)} />
				<Label x={x0 + w * 0.42} y={y0 - h * 0.78 - 16} text="GDDR ROOFLINE" color={C.orange} size={14} mono />
				<Label x={x0 + w * 0.73} y={y0 - h * 0.95 - 16} text="HBM ROOFLINE" color={C.cyan} size={14} mono />
				<circle cx={x0 + w * 0.36} cy={y0 - h * 0.42} r={9} fill={C.orange} />
				<Label x={x0 + w * 0.36 + 18} y={y0 - h * 0.42 + 5} text="GPU + GDDR" color={C.orange} size={13} mono />
				<circle cx={x0 + w * 0.68} cy={y0 - h * 0.68} r={9} fill={C.cyan} />
				<Label x={x0 + w * 0.68 + 18} y={y0 - h * 0.68 + 5} text="GPU + HBM" color={C.cyan} size={13} mono />
				<Label x={x0 + w * 0.92} y={y0 - h * 0.55} text="COMPUTE BOUND" color={C.muted} size={12} anchor="middle" mono />
				<Label x={x0 + w * 0.20} y={y0 - h * 0.30} text="MEMORY BOUND" color={C.muted} size={12} anchor="middle" mono />
			</g>

			<g opacity={reveal(frame, 36, 18)}>
				<rect x={x0 + w - 360} y={y0 - h + 14} width={330} height={100} rx={4} fill="rgba(0,245,212,0.05)" stroke={C.cyanSoft} />
				<Label x={x0 + w - 340} y={y0 - h + 44} text="HBM MOVES THE ROOF" color={C.cyan} size={14} mono />
				<Label x={x0 + w - 340} y={y0 - h + 72} text="MORE BANDWIDTH → HIGHER UTILIZATION" color={C.muted} size={11} mono />
			</g>

			<Label x={40} y={760} text="A FASTER GPU IS USELESS IF MEMORY CANNOT FEED IT" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

export const PhysicsComparison: React.FC<Props> = ({ beat }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<svg viewBox="0 0 1600 780" style={{ width: '100%', height: '100%' }}>
				<defs>
					<linearGradient id="barGlow" x1="0" x2="1">
						<stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
						<stop offset="1" stopColor="#FFFFFF" stopOpacity="0.8" />
					</linearGradient>
				</defs>
				{beat === 0 ? <BeatA frame={frame} /> : null}
				{beat === 1 ? <BeatB frame={frame} /> : null}
				{beat === 2 ? <BeatC frame={frame} /> : null}
			</svg>
			<div style={{ position: 'absolute', right: 0, top: 0, fontFamily: FONT_HEAD, fontSize: 11, letterSpacing: 2, color: 'rgba(159,179,200,0.38)' }}>
				BLUEPRINT / PHYSICS
			</div>
		</div>
	);
};
