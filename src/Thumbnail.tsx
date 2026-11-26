import React from 'react';
import { AbsoluteFill } from 'remotion';
import thumbData from './data/thumbnail_data.json';
import { FontLoader } from './fonts';
import { LAB } from './components/labTheme';
import { FONT_HEAD, FONT_MONO } from './components/theme';

type Variant = 'A' | 'B' | 'C';

const splitHeadline = (headline: string): [string, string] => {
	const words = headline.trim().split(/\s+/);
	if (words.length <= 1) return [headline, ''];
	const splitAt = Math.ceil(words.length / 2);
	return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')];
};

const Corner: React.FC<{ top?: number; bottom?: number; left?: number; right?: number; rotate: number; color: string }> = ({
	top,
	bottom,
	left,
	right,
	rotate,
	color,
}) => (
	<div
		style={{
			position: 'absolute',
			top,
			bottom,
			left,
			right,
			width: 34,
			height: 34,
			borderTop: `2px solid ${color}`,
			borderLeft: `2px solid ${color}`,
			transform: `rotate(${rotate}deg)`,
		}}
	/>
);

const Shell: React.FC<{ children: React.ReactNode; accent: string }> = ({ children, accent }) => (
	<AbsoluteFill style={{ backgroundColor: LAB.bg, overflow: 'hidden', fontFamily: FONT_HEAD }}>
		<FontLoader />
		<AbsoluteFill
			style={{
				backgroundImage: `linear-gradient(${LAB.grid} 1px, transparent 1px), linear-gradient(90deg, ${LAB.grid} 1px, transparent 1px)`,
				backgroundSize: '52px 52px',
				maskImage: 'radial-gradient(ellipse at 55% 50%, black 18%, transparent 88%)',
				WebkitMaskImage: 'radial-gradient(ellipse at 55% 50%, black 18%, transparent 88%)',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 82% 18%, ${accent}26 0%, transparent 46%), radial-gradient(circle at 12% 92%, ${LAB.blue}18 0%, transparent 44%)`,
			}}
		/>
		<div style={{ position: 'absolute', inset: 18, border: `1px solid ${LAB.gridStrong}` }} />
		<Corner top={12} left={12} rotate={0} color={accent} />
		<Corner top={12} right={12} rotate={90} color={accent} />
		<Corner bottom={12} right={12} rotate={180} color={accent} />
		<Corner bottom={12} left={12} rotate={270} color={accent} />

		<div style={{ position: 'absolute', top: 34, left: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
			<div style={{ width: 9, height: 9, borderRadius: 999, background: accent, boxShadow: `0 0 16px ${accent}` }} />
			<span style={{ color: LAB.white, fontWeight: 700, fontSize: 20, letterSpacing: 5 }}>{thumbData.brand}</span>
			<span style={{ color: LAB.dim, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2 }}>{thumbData.episode}</span>
		</div>
		<div style={{ position: 'absolute', top: 36, right: 52, color: LAB.dim, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 2 }}>
			{thumbData.channel.replace('-', ' ').toUpperCase()}
		</div>

		{children}

		<div style={{ position: 'absolute', left: 52, right: 52, bottom: 24, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.8, color: LAB.dim }}>
			<span>{`${thumbData.brand} // ${thumbData.episode}`}</span>
			<span>HIGH-VOLTAGE LAB</span>
		</div>
	</AbsoluteFill>
);

const Headline: React.FC<{ headline: string; accent: string; top: number }> = ({ headline, accent, top }) => {
	const [first, second] = splitHeadline(headline);
	return (
		<div style={{ position: 'absolute', left: 52, top, width: 520 }}>
			<div style={{ fontSize: 84, lineHeight: 0.9, fontWeight: 700, letterSpacing: -3, color: LAB.white }}>{first}</div>
			{second ? (
				<div style={{ fontSize: 84, lineHeight: 0.9, fontWeight: 700, letterSpacing: -3, color: accent, textShadow: `0 0 30px ${accent}55` }}>{second}</div>
			) : null}
		</div>
	);
};

const Badge: React.FC<{ text: string; accent: string; top: number }> = ({ text, accent, top }) => (
	<div
		style={{
			position: 'absolute',
			left: 52,
			top,
			border: `1px solid ${accent}`,
			background: `${accent}14`,
			color: accent,
			fontFamily: FONT_MONO,
			fontSize: 14,
			letterSpacing: 3,
			padding: '7px 12px',
		}}
	>
		{text}
	</div>
);

const TunnelShock: React.FC = () => (
	<svg viewBox="0 0 700 560" style={{ position: 'absolute', right: 18, top: 84, width: 700, height: 560 }}>
		<defs>
			<linearGradient id="tunnel" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor="#05060F" />
				<stop offset="100%" stopColor="#11162E" />
			</linearGradient>
			<radialGradient id="shock" cx="50%" cy="50%" r="50%">
				<stop offset="0%" stopColor={LAB.rose} stopOpacity={0.9} />
				<stop offset="55%" stopColor={LAB.rose} stopOpacity={0.35} />
				<stop offset="100%" stopColor={LAB.rose} stopOpacity={0} />
			</radialGradient>
			<linearGradient id="train" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor={LAB.blue} />
				<stop offset="100%" stopColor="#93C5FD" />
			</linearGradient>
		</defs>
		<rect x="52" y="46" width="596" height="468" rx="52" fill="url(#tunnel)" stroke={LAB.blue} strokeOpacity={0.5} strokeWidth={3} />
		<path d="M 96 92 L 604 92 M 76 146 L 624 146 M 76 414 L 624 414 M 96 468 L 604 468" stroke={LAB.blue} strokeOpacity={0.12} strokeWidth={2} />
		<ellipse cx="470" cy="280" rx="210" ry="210" fill="url(#shock)" />
		{[90, 145, 205, 270].map((radius, index) => (
			<circle
				key={radius}
				cx={470}
				cy={280}
				r={radius}
				fill="none"
				stroke={LAB.rose}
				strokeWidth={index === 0 ? 16 : 9}
				strokeOpacity={0.88 - index * 0.14}
			/>
		))}
		<path d="M 150 280 C 150 214, 208 186, 268 186 L 268 374 C 208 374, 150 346, 150 280 Z" fill="url(#train)" />
		<path d="M 160 280 C 160 230, 202 204, 252 204 L 252 356 C 202 356, 160 330, 160 280 Z" fill="#0B1226" opacity={0.72} />
		<rect x="176" y="252" width="64" height="18" rx="9" fill={LAB.lime} opacity={0.9} />
		<rect x="176" y="292" width="40" height="12" rx="6" fill={LAB.blue} opacity={0.9} />
		<circle cx="470" cy="280" r="24" fill={LAB.rose} />
		<circle cx="470" cy="280" r="10" fill={LAB.white} />
	</svg>
);

const PressureNose: React.FC = () => (
	<svg viewBox="0 0 700 560" style={{ position: 'absolute', right: 18, top: 84, width: 700, height: 560 }}>
		<defs>
			<linearGradient id="heat" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor={LAB.rose} stopOpacity={0.95} />
				<stop offset="42%" stopColor={LAB.rose} stopOpacity={0.45} />
				<stop offset="100%" stopColor={LAB.lime} stopOpacity={0.12} />
			</linearGradient>
			<linearGradient id="nose" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor="#DBEAFE" />
				<stop offset="100%" stopColor={LAB.blue} />
			</linearGradient>
		</defs>
		<rect x="40" y="60" width="620" height="440" rx="28" fill="#070A18" stroke={LAB.gridStrong} strokeWidth={2} />
		{[0, 1, 2, 3, 4].map((line) => (
			<line key={line} x1={72 + line * 116} y1={80} x2={72 + line * 116} y2={480} stroke={LAB.grid} strokeWidth={1.5} />
		))}
		<path d="M 660 150 C 560 150, 456 194, 396 250 C 456 306, 560 350, 660 350 L 660 150 Z" fill="url(#nose)" opacity={0.92} />
		<path d="M 660 188 C 586 188, 506 222, 462 262 C 506 302, 586 336, 660 336 L 660 188 Z" fill="#0B1226" opacity={0.55} />
		<ellipse cx="410" cy="250" rx="138" ry="132" fill="url(#heat)" />
		{[52, 88, 124].map((radius, index) => (
			<ellipse key={radius} cx="410" cy="250" rx={radius} ry={radius * 0.92} fill="none" stroke={LAB.rose} strokeWidth={index === 0 ? 12 : 6} strokeOpacity={0.75 - index * 0.16} />
		))}
		<line x1="410" y1="96" x2="410" y2="404" stroke={LAB.rose} strokeWidth={2} strokeDasharray="7 9" opacity={0.7} />
		<line x1="270" y1="250" x2="550" y2="250" stroke={LAB.lime} strokeWidth={2} strokeDasharray="7 9" opacity={0.5} />
		<circle cx="410" cy="250" r="16" fill={LAB.rose} />
		<circle cx="410" cy="250" r="6" fill={LAB.white} />
		<rect x="72" y="442" width="148" height="34" fill={LAB.panel} stroke={LAB.rose} strokeOpacity={0.5} />
		<rect x="84" y="454" width="124" height="10" fill={LAB.rose} opacity={0.7} />
	</svg>
);

const BeakSplit: React.FC = () => (
	<svg viewBox="0 0 700 560" style={{ position: 'absolute', right: 18, top: 84, width: 700, height: 560 }}>
		<defs>
			<linearGradient id="blunt" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor={LAB.rose} stopOpacity={0.8} />
				<stop offset="100%" stopColor={LAB.rose} stopOpacity={0.08} />
			</linearGradient>
			<linearGradient id="beak" x1="0" y1="0" x2="1" y2="0">
				<stop offset="0%" stopColor={LAB.lime} stopOpacity={0.12} />
				<stop offset="100%" stopColor={LAB.lime} stopOpacity={0.8} />
			</linearGradient>
		</defs>
		<rect x="34" y="60" width="632" height="440" rx="24" fill="#070A18" stroke={LAB.gridStrong} strokeWidth={2} />
		<line x1="350" y1="74" x2="350" y2="486" stroke={LAB.white} strokeOpacity={0.18} strokeWidth={2} strokeDasharray="8 10" />

		<rect x="58" y="88" width="264" height="384" rx="18" fill="url(#blunt)" />
		<rect x="92" y="168" width="92" height="224" rx="18" fill={LAB.rose} opacity={0.92} />
		{[54, 92, 130, 172].map((radius, index) => (
			<path
				key={radius}
				d={`M 184 ${280 - radius} C 232 ${280 - radius * 0.65}, 264 ${280 - radius * 0.3}, 264 280 C 264 ${280 + radius * 0.3}, 232 ${280 + radius * 0.65}, 184 ${280 + radius}`}
				fill="none"
				stroke={LAB.rose}
				strokeWidth={index === 0 ? 10 : 5}
				strokeOpacity={0.7 - index * 0.13}
			/>
		))}
		<text x="188" y="300" fill={LAB.white} fontFamily={FONT_MONO} fontSize={15} letterSpacing={2}>
			{thumbData.variantC.leftValue}
		</text>

		<rect x="378" y="88" width="264" height="384" rx="18" fill="url(#beak)" />
		<path d="M 396 204 C 486 204, 566 236, 622 280 C 566 324, 486 356, 396 356 Z" fill={LAB.lime} opacity={0.9} />
		<path d="M 396 228 C 474 228, 540 252, 586 280 C 540 308, 474 332, 396 332 Z" fill="#0B1226" opacity={0.6} />
		{[0, 1, 2, 3].map((line) => (
			<path
				key={line}
				d={`M 404 ${240 + line * 26} C 486 ${238 + line * 26}, 548 ${256 + line * 26}, 604 ${276 + line * 26}`}
				fill="none"
				stroke={LAB.lime}
				strokeWidth={2}
				strokeOpacity={0.6 - line * 0.1}
			/>
		))}
		<text x="500" y="300" fill={LAB.white} fontFamily={FONT_MONO} fontSize={15} letterSpacing={2}>
			{thumbData.variantC.rightValue}
		</text>
	</svg>
);

const VariantA: React.FC = () => (
	<Shell accent={LAB.rose}>
		<Badge text={thumbData.variantA.badge} accent={LAB.rose} top={142} />
		<Headline headline={thumbData.variantA.headline} accent={LAB.rose} top={196} />
		<TunnelShock />
	</Shell>
);

const VariantB: React.FC = () => (
	<Shell accent={LAB.lime}>
		<Badge text={thumbData.variantB.badge} accent={LAB.lime} top={142} />
		<Headline headline={thumbData.variantB.headline} accent={LAB.lime} top={196} />
		<PressureNose />
	</Shell>
);

const VariantC: React.FC = () => (
	<Shell accent={LAB.blue}>
		<Badge text={thumbData.variantC.badge} accent={LAB.blue} top={142} />
		<Headline headline={thumbData.variantC.headline} accent={LAB.lime} top={196} />
		<BeakSplit />
	</Shell>
);

export const ThumbnailTemplate: React.FC<{ variant: Variant }> = ({ variant }) => {
	if (variant === 'A') return <VariantA />;
	if (variant === 'B') return <VariantB />;
	return <VariantC />;
};
