import React from 'react';
import { useCurrentFrame } from 'remotion';
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

const Gauge: React.FC<{
	cx: number;
	cy: number;
	r: number;
	value: number;
	progress: number;
	color: string;
	label: string;
	sub: string;
}> = ({ cx, cy, r, value, progress, color, label, sub }) => {
	const circumference = 2 * Math.PI * r;
	const pct = Math.min(1, Math.max(0, value / 100)) * progress;

	return (
		<g>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(159,179,200,0.16)" strokeWidth={18} />
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke={color}
				strokeWidth={18}
				strokeLinecap="round"
				strokeDasharray={`${circumference * pct} ${circumference}`}
				transform={`rotate(-90 ${cx} ${cy})`}
				style={{ filter: `drop-shadow(0 0 16px ${color}66)` }}
			/>
			<Label x={cx} y={cy + 8} text={`${Math.round(value * progress)}%`} color={color} size={58} anchor="middle" mono />
			<Label x={cx} y={cy + 46} text={label} color={C.white} size={16} anchor="middle" weight={600} />
			<Label x={cx} y={cy + 70} text={sub} color={C.muted} size={11} anchor="middle" mono />
		</g>
	);
};

const BeatA: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 22);
	const q = reveal(frame, 14, 22);
	const r = reveal(frame, 28, 18);

	return (
		<>
			<Label x={40} y={40} text="YIELD // HBM3E 12-HI" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="GOOD DIE RATE AT VOLUME" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 18" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<Gauge cx={420} cy={330} r={160} value={70} progress={p} color={C.cyan} label="SK HYNIX" sub="HBM3E // REPORTED YIELD" />
			</g>

			<g opacity={q}>
				<Gauge cx={1120} cy={330} r={130} value={50} progress={q} color={C.orange} label="COMPETITOR RAMP" sub="EARLY 12-HI // BELOW 50%" />
				<Label x={1120} y={496} text="HEAT + WARPAGE" color={C.red} size={15} anchor="middle" mono />
				<Label x={1120} y={520} text="TC-NCF FILM LIMITS" color={C.muted} size={11} anchor="middle" mono />
			</g>

			<g opacity={r}>
				<rect x={80} y={610} width={1440} height={100} rx={5} fill="rgba(0,245,212,0.03)" stroke="rgba(0,245,212,0.28)" />
				<Label x={108} y={646} text="YIELD IS THE PRODUCT" color={C.white} size={18} weight={600} />
				<Label x={108} y={674} text="A STACK THAT FAILS IN TEST CANNOT SHIP INTO A DATA CENTER" color={C.muted} size={12} mono />
				<Label x={1490} y={646} text="70% / 100%" color={C.cyan} size={24} anchor="end" mono />
				<Label x={1490} y={674} text="YIELD METER" color={C.dim} size={10} anchor="end" mono />
			</g>

			<Label x={40} y={760} text="YIELD RATE: THE QUIET MOAT OF THE HBM LEADER" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatB: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 18);
	const q = reveal(frame, 12, 18);
	const r = reveal(frame, 24, 18);

	const cards = [
		{ y: 130, title: 'HEAT DISSIPATION', value: '+36%', sub: 'MR-MUF VS PRIOR GEN', color: C.cyan, progress: p },
		{ y: 290, title: 'ADVANCED EMC', value: '1.6×', sub: 'VS ORIGINAL MR-MUF', color: C.orange, progress: q },
		{ y: 450, title: 'THERMAL DUMMY BUMPS', value: '4×', sub: 'HEAT SPREADING DENSITY', color: C.cyan, progress: r },
	];

	return (
		<>
			<Label x={40} y={40} text="YIELD // THERMAL RESISTANCE" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="MR-MUF VS TC-NCF" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 19" color={C.orange} size={14} anchor="end" mono />

			{cards.map((card) => (
				<g key={card.title} opacity={card.progress}>
					<rect x={80} y={card.y} width={820} height={130} rx={5} fill="rgba(255,255,255,0.03)" stroke="rgba(0,245,212,0.22)" />
					<Label x={110} y={card.y + 34} text={card.title} color={C.muted} size={12} mono />
					<Label x={110} y={card.y + 86} text={card.value} color={card.color} size={48} mono />
					<Label x={330} y={card.y + 78} text={card.sub} color={C.muted} size={11} mono />
					<rect x={330} y={card.y + 94} width={520 * card.progress} height={5} fill={card.color} opacity={0.55} />
				</g>
			))}

			<g opacity={reveal(frame, 34, 18)}>
				<rect x={950} y={130} width={570} height={450} rx={5} fill="rgba(255,59,48,0.035)" stroke="rgba(255,59,48,0.35)" />
				<Label x={980} y={170} text="HEAT PATH" color={C.red} size={18} mono />
				<rect x={1000} y={210} width={470} height={24} rx={2} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" />
				<rect x={1000} y={250} width={470} height={24} rx={2} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" />
				<rect x={1000} y={290} width={470} height={24} rx={2} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.35)" />
				<Label x={1240} y={352} text="TC-NCF: FILM ADDS RESISTANCE" color={C.red} size={14} anchor="middle" mono />
				<path d="M 1240 370 C 1240 430, 1080 430, 1080 500" fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="6 5" />
				<path d="M 1240 370 C 1240 430, 1400 430, 1400 500" fill="none" stroke={C.cyan} strokeWidth={2} strokeDasharray="6 5" />
				<Label x={1080} y={526} text="TRAPPED HEAT" color={C.red} size={11} anchor="middle" mono />
				<Label x={1400} y={526} text="LIQUID EMC" color={C.cyan} size={11} anchor="middle" mono />
			</g>

			<Label x={40} y={760} text="MASS REFLOW + LIQUID EMC: BETTER WARPAGE, BETTER HEAT SPREAD" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

const BeatC: React.FC<{ frame: number }> = ({ frame }) => {
	const p = reveal(frame, 0, 20);
	const q = reveal(frame, 14, 20);
	const segments = [
		{ label: 'SK HYNIX', value: 55, color: C.cyan, sub: 'MID-50% RANGE' },
		{ label: 'SAMSUNG', value: 25, color: C.orange, sub: 'MID-20% RANGE' },
		{ label: 'MICRON', value: 20, color: C.muted, sub: '≈ 20%' },
	];

	return (
		<>
			<Label x={40} y={40} text="ORDERS // NVIDIA HBM4 ALLOCATION" color={C.cyan} size={22} mono />
			<Label x={40} y={70} text="INITIAL VOLUME ALLOCATION // TIER ONE CUSTOMER" color={C.muted} size={13} mono />
			<Label x={1540} y={40} text="FIG. 21" color={C.orange} size={14} anchor="end" mono />

			<g opacity={p}>
				<Label x={80} y={126} text="STACKED SHARE" color={C.muted} size={12} mono />
				<rect x={80} y={150} width={1440} height={78} rx={5} fill="rgba(255,255,255,0.035)" stroke="rgba(159,179,200,0.2)" />
				{segments.map((s, i) => {
					const prev = segments.slice(0, i).reduce((a, b) => a + b.value, 0);
					return (
						<g key={s.label}>
							<rect x={80 + (prev / 100) * 1440} y={150} width={(s.value / 100) * 1440 * p} height={78} fill={s.color} opacity={0.82} />
							<Label x={80 + ((prev + s.value / 2) / 100) * 1440} y={196} text={`${s.value}%`} color={C.bg} size={26} anchor="middle" mono weight={700} />
						</g>
					);
				})}
				<Label x={80} y={262} text="0%" color={C.dim} size={11} mono />
				<Label x={1520} y={262} text="100%" color={C.dim} size={11} anchor="end" mono />
			</g>

			<g opacity={q}>
				{segments.map((s, i) => {
					const y = 320 + i * 108;
					return (
						<g key={s.label}>
							<rect x={80} y={y} width={900} height={78} rx={4} fill="rgba(255,255,255,0.03)" stroke="rgba(159,179,200,0.2)" />
							<rect x={80} y={y} width={18} height={78} fill={s.color} />
							<Label x={120} y={y + 32} text={s.label} color={C.white} size={19} weight={600} />
							<Label x={120} y={y + 58} text={s.sub} color={C.muted} size={11} mono />
							<Label x={470} y={y + 48} text={`${s.value}%`} color={s.color} size={34} mono />
							<rect x={600} y={y + 28} width={340} height={20} rx={3} fill="rgba(255,255,255,0.06)" />
							<rect x={600} y={y + 28} width={340 * (s.value / 100) * q} height={20} rx={3} fill={s.color} opacity={0.7} />
						</g>
					);
				})}
			</g>

			<g opacity={reveal(frame, 32, 18)}>
				<rect x={1040} y={320} width={480} height={300} rx={5} fill="rgba(0,245,212,0.03)" stroke="rgba(0,245,212,0.28)" />
				<Label x={1070} y={360} text="NOT A TEXTBOOK MONOPOLY" color={C.cyan} size={16} mono />
				<Label x={1070} y={396} text="A CHOKEHOLD." color={C.orange} size={30} mono />
				<Label x={1070} y={434} text="THE LARGEST AI CUSTOMER CANNOT" color={C.muted} size={11} mono />
				<Label x={1070} y={454} text="DIVERSIFY FASTER THAN THE" color={C.muted} size={11} mono />
				<Label x={1070} y={474} text="SECOND SUPPLIER CAN FIX YIELD." color={C.muted} size={11} mono />
				<Label x={1070} y={530} text="MID-50% / MID-20% / 20%" color={C.white} size={18} mono />
			</g>

			<Label x={40} y={760} text="ALLOCATION IS A FUNCTION OF PROVEN YIELD AND CAPACITY" color="rgba(159,179,200,0.55)" size={12} mono />
		</>
	);
};

export const YieldMeter: React.FC<Props> = ({ beat }) => {
	const frame = useCurrentFrame();
	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<svg viewBox="0 0 1600 780" style={{ width: '100%', height: '100%' }}>
				{beat === 0 ? <BeatA frame={frame} /> : null}
				{beat === 1 ? <BeatB frame={frame} /> : null}
				{beat === 2 ? <BeatC frame={frame} /> : null}
			</svg>
			<div style={{ position: 'absolute', right: 0, top: 0, fontFamily: FONT_HEAD, fontSize: 11, letterSpacing: 2, color: 'rgba(159,179,200,0.38)' }}>
				BLUEPRINT / YIELD
			</div>
		</div>
	);
};
