import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import thumbData from './data/thumbnail_data.json';
import { FontLoader } from './fonts';
import { C, FONT_BODY, FONT_HEAD, FONT_MONO } from './components/theme';

type Variant = 'A' | 'B' | 'C';

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
			width: 26,
			height: 26,
			borderTop: `2px solid ${C.cyan}`,
			borderLeft: `2px solid ${C.cyan}`,
			transform: `rotate(${rotate}deg)`,
		}}
	/>
);

const Shell: React.FC<{ children: React.ReactNode; accent?: string }> = ({ children, accent = C.cyan }) => (
	<AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden', fontFamily: FONT_BODY }}>
		<FontLoader />
		<AbsoluteFill
			style={{
				backgroundImage:
					'linear-gradient(rgba(0,245,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.06) 1px, transparent 1px)',
				backgroundSize: '40px 40px',
				maskImage: 'radial-gradient(ellipse at 50% 50%, black 18%, transparent 85%)',
				WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 18%, transparent 85%)',
			}}
		/>
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 85% 15%, ${accent}22 0%, transparent 45%), radial-gradient(circle at 10% 95%, rgba(255,159,28,0.12) 0%, transparent 40%)`,
			}}
		/>
		<div style={{ position: 'absolute', inset: 18, border: '1px solid rgba(0,245,212,0.22)' }} />
		<Corner top={14} left={14} rotate={0} />
		<Corner top={14} right={14} rotate={90} />
		<Corner bottom={14} right={14} rotate={180} />
		<Corner bottom={14} left={14} rotate={270} />
		<div style={{ position: 'absolute', top: 34, left: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
			<div style={{ width: 9, height: 9, borderRadius: 999, background: C.cyan, boxShadow: `0 0 14px ${C.cyan}` }} />
			<span style={{ color: C.white, fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 18, letterSpacing: 5 }}>{thumbData.brand}</span>
			<span style={{ color: 'rgba(159,179,200,0.55)', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2 }}>{thumbData.episode}</span>
		</div>
		<div style={{ position: 'absolute', top: 34, right: 48, color: 'rgba(159,179,200,0.55)', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 2 }}>AI INFRASTRUCTURE // HBM</div>
		{children}
		<div style={{ position: 'absolute', left: 48, right: 48, bottom: 26, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.6, color: 'rgba(159,179,200,0.5)' }}>
			<span>STACK LAYER // TECH</span>
			<span>HBM3E / HBM4 // COWOS</span>
		</div>
	</AbsoluteFill>
);

const ImagePanel: React.FC<{
	src: string;
	left: number;
	top: number;
	width: number;
	height: number;
	label: string;
	accent: string;
	fit?: 'cover' | 'contain';
	filter?: string;
}> = ({ src, left, top, width, height, label, accent, fit = 'cover', filter }) => (
	<div style={{ position: 'absolute', left, top, width, height, border: `2px solid ${accent}`, background: C.bgDeep, overflow: 'hidden', boxShadow: `0 24px 70px rgba(0,0,0,0.55)` }}>
		<Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: fit, filter }} />
		<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(5,10,24,0) 45%, rgba(5,10,24,0.9) 100%)' }} />
		<div style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.4, color: accent }}>{label}</div>
		<div style={{ position: 'absolute', left: 12, top: 10, width: 18, height: 18, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` }} />
	</div>
);

const VariantA: React.FC = () => (
	<Shell>
		<div style={{ position: 'absolute', left: 48, top: 110, fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: C.orange }}>{thumbData.variantA.badge}</div>
		<div style={{ position: 'absolute', left: 48, top: 146, fontFamily: FONT_HEAD, fontSize: 94, lineHeight: 0.9, fontWeight: 700, letterSpacing: -3, color: C.white }}>
			THE REAL
			<br />
			<span style={{ color: C.orange }}>LIMIT</span>
		</div>
		<div style={{ position: 'absolute', left: 50, top: 320, fontFamily: FONT_BODY, fontSize: 19, color: C.muted, maxWidth: 420 }}>
			{thumbData.variantA.subline}
		</div>

		<ImagePanel src="assets/images/nvidia_blackwell.jpg" left={520} top={120} width={330} height={420} label="NVIDIA // GPU" accent={C.cyan} />
		<ImagePanel src="assets/images/hbm_stack.png" left={870} top={110} width={360} height={300} label="HBM STACK // MEMORY" accent={C.orange} fit="contain" filter="grayscale(1) sepia(1) saturate(4) hue-rotate(130deg) brightness(0.92) contrast(1.3)" />
		<div style={{ position: 'absolute', left: 870, top: 420, width: 360, height: 120, border: `2px solid ${C.orange}`, background: 'rgba(255,159,28,0.08)', padding: 16 }}>
			<div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.orange, letterSpacing: 1.4 }}>THE BOTTLENECK</div>
			<div style={{ fontFamily: FONT_HEAD, fontSize: 44, fontWeight: 700, color: C.white, lineHeight: 1 }}>HBM</div>
			<div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.muted }}>ONE SUPPLIER // MID-50%</div>
		</div>
		<div style={{ position: 'absolute', left: 520, top: 580, fontFamily: FONT_MONO, fontSize: 12, color: C.muted, letterSpacing: 1.5 }}>{thumbData.variantA.metricLabel}</div>
		<div style={{ position: 'absolute', left: 790, top: 540, fontFamily: FONT_MONO, fontSize: 74, fontWeight: 700, color: C.cyan, letterSpacing: -2 }}>{thumbData.variantA.metric}</div>
	</Shell>
);

const VariantB: React.FC = () => (
	<Shell accent={C.orange}>
		<div style={{ position: 'absolute', left: 48, top: 100, fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: C.orange }}>{thumbData.variantB.badge}</div>
		<div style={{ position: 'absolute', left: 48, top: 138, fontFamily: FONT_HEAD, fontSize: 68, lineHeight: 0.9, fontWeight: 700, letterSpacing: -3, color: C.white }}>
			1<br />
			<span style={{ color: C.orange }}>MONOPOLY</span>
		</div>
		<div style={{ position: 'absolute', left: 50, top: 350, fontFamily: FONT_BODY, fontSize: 19, color: C.muted, maxWidth: 380 }}>{thumbData.variantB.subline}</div>

		<div style={{ position: 'absolute', left: 470, top: 100, width: 430, height: 500, border: `2px solid ${C.cyan}`, background: C.bgDeep, overflow: 'hidden' }}>
			<Img src={staticFile('assets/images/south_korea_map.png')} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(1) brightness(0.8) contrast(1.3)' }} />
			<div style={{ position: 'absolute', left: '54%', top: '47%', width: 18, height: 18, borderRadius: 999, background: C.orange, boxShadow: `0 0 26px ${C.orange}` }} />
			<div style={{ position: 'absolute', left: '63%', top: '42%', fontFamily: FONT_MONO, fontSize: 11, color: C.orange, letterSpacing: 1.2 }}>SK HYNIX FABS</div>
			<div style={{ position: 'absolute', left: 14, bottom: 12, fontFamily: FONT_MONO, fontSize: 11, color: C.cyan, letterSpacing: 1.2 }}>SOUTH KOREA // ICHEON / CHEONGJU</div>
		</div>

		<div style={{ position: 'absolute', left: 940, top: 130, width: 280, height: 180, border: `2px solid ${C.cyan}`, background: C.bgDeep, overflow: 'hidden' }}>
			<Img src={staticFile('assets/images/tsmc_fab18.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.4) brightness(0.75)' }} />
			<div style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: FONT_MONO, fontSize: 11, color: C.cyan }}>TSMC // CoWoS</div>
		</div>
		<div style={{ position: 'absolute', left: 940, top: 350, width: 280, height: 150, border: `2px solid ${C.orange}`, background: C.bgDeep, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<Img src={staticFile('assets/images/nvidia_logo.png')} style={{ width: 200, height: 80, objectFit: 'contain' }} />
			<div style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: FONT_MONO, fontSize: 11, color: C.orange }}>NVIDIA // DEMAND</div>
		</div>
		<svg width={1280} height={720} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
			<path d="M 790 360 C 860 280, 900 250, 940 220" fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="10 8" />
			<path d="M 790 360 C 860 430, 900 430, 940 425" fill="none" stroke={C.orange} strokeWidth={3} strokeDasharray="10 8" />
		</svg>

		<div style={{ position: 'absolute', left: 940, top: 540, fontFamily: FONT_MONO, fontSize: 11, color: C.muted, letterSpacing: 1.4 }}>{thumbData.variantB.routeLabel}</div>
		<div style={{ position: 'absolute', left: 940, top: 564, fontFamily: FONT_HEAD, fontSize: 42, fontWeight: 700, color: C.white }}>MID-50%</div>
	</Shell>
);

const VariantC: React.FC = () => (
	<Shell accent={C.red}>
		<div style={{ position: 'absolute', left: 48, top: 106, fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 2, color: C.orange }}>{thumbData.variantC.badge}</div>
		<div style={{ position: 'absolute', left: 48, top: 144, fontFamily: FONT_HEAD, fontSize: 92, lineHeight: 0.9, fontWeight: 700, letterSpacing: -3, color: C.white }}>
			8 TB/S
			<br />
			<span style={{ color: C.cyan }}>WALL</span>
		</div>
		<div style={{ position: 'absolute', left: 50, top: 330, fontFamily: FONT_BODY, fontSize: 18, color: C.muted, maxWidth: 360 }}>
			{thumbData.variantC.subline}
		</div>

		<div style={{ position: 'absolute', left: 470, top: 96, width: 760, height: 520, overflow: 'hidden', border: `2px solid ${C.red}` }}>
			<div style={{ position: 'absolute', inset: 0, width: '50%', overflow: 'hidden' }}>
				<Img src={staticFile('assets/images/nvidia_blackwell.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) sepia(1) saturate(5) hue-rotate(-28deg) brightness(0.68) contrast(1.25)' }} />
				<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,59,48,0.42), rgba(255,59,48,0.05))' }} />
				<div style={{ position: 'absolute', left: 24, bottom: 24, fontFamily: FONT_MONO, fontSize: 13, color: C.white, letterSpacing: 1.4 }}>THERMAL LIMIT // TC-NCF</div>
			</div>
			<div style={{ position: 'absolute', inset: 0, left: '50%', width: '50%', overflow: 'hidden' }}>
				<Img src={staticFile('assets/images/hbm_package.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) sepia(1) saturate(3) hue-rotate(120deg) brightness(0.62) contrast(1.3)' }} />
				<div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(270deg, rgba(0,245,212,0.38), rgba(0,245,212,0.03))' }} />
				<div style={{ position: 'absolute', right: 24, bottom: 24, fontFamily: FONT_MONO, fontSize: 13, color: C.white, letterSpacing: 1.4 }}>MR-MUF // +36% HEAT</div>
			</div>
			<div style={{ position: 'absolute', left: '50%', top: -40, bottom: -40, width: 4, background: C.white, transform: 'rotate(14deg)', boxShadow: `0 0 24px ${C.cyan}` }} />
		</div>

		<div style={{ position: 'absolute', left: 480, top: 632, display: 'flex', gap: 22 }}>
			<div style={{ border: `2px solid ${C.red}`, padding: '10px 18px', color: C.red, fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 1.4 }}>{thumbData.variantC.leftLabel}: {thumbData.variantC.leftValue}</div>
			<div style={{ border: `2px solid ${C.cyan}`, padding: '10px 18px', color: C.cyan, fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 1.4 }}>{thumbData.variantC.rightLabel}: {thumbData.variantC.rightValue}</div>
		</div>
		<div style={{ position: 'absolute', left: 1000, top: 620, fontFamily: FONT_MONO, fontSize: 12, color: C.muted }}>PHYSICAL LIMIT // PACKAGING</div>
	</Shell>
);

export const ThumbnailTemplate: React.FC<{ variant: Variant }> = ({ variant }) => {
	if (variant === 'A') return <VariantA />;
	if (variant === 'B') return <VariantB />;
	return <VariantC />;
};
