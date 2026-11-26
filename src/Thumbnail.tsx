import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import thumbData from './data/thumbnail_data.json';
import { FontLoader } from './fonts';
import { FONT_HEAD, FONT_MONO } from './components/theme';

type Variant = 'A' | 'B' | 'C';

type GenericData = {
	headline: string;
	background: string;
	accent: string;
	fontSize: number;
};

type SplitData = {
	headline: string;
	leftImage: string;
	rightImage: string;
	accent: string;
	fontSize: number;
};

type TunnelData = {
	headline: string;
	accent: string;
	fontSize: number;
};

const splitHeadline = (headline: string): [string, string] => {
	const words = headline.trim().split(/\s+/);
	if (words.length <= 1) return [headline, ''];
	const splitAt = Math.ceil(words.length / 2);
	return [words.slice(0, splitAt).join(' '), words.slice(splitAt).join(' ')];
};

const B_DATA: GenericData = thumbData.variantB;
const A_DATA: SplitData = thumbData.variantA;
const C_DATA: TunnelData = thumbData.variantC;

const GenericThumbnail: React.FC<{ data: GenericData }> = ({ data }) => {
	const [first, second] = splitHeadline(data.headline);

	return (
		<AbsoluteFill style={{ backgroundColor: '#02030A', overflow: 'hidden', fontFamily: FONT_HEAD }}>
			<FontLoader />
			<Img
				src={staticFile(data.background)}
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
			/>
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(90deg, rgba(2,3,10,0.92) 0%, rgba(2,3,10,0.62) 34%, rgba(2,3,10,0) 70%), linear-gradient(0deg, rgba(2,3,10,0.92) 0%, rgba(2,3,10,0.28) 42%, rgba(2,3,10,0) 68%)',
				}}
			/>
			<div style={{ position: 'absolute', left: 56, bottom: 42, width: 780 }}>
				<div
					style={{
						width: 120,
						height: 9,
						background: data.accent,
						marginBottom: 16,
						boxShadow: `0 0 30px ${data.accent}`,
					}}
				/>
				<div
					style={{
						fontSize: data.fontSize,
						lineHeight: 0.84,
						fontWeight: 800,
						letterSpacing: -5,
						color: '#F8FAFC',
						textShadow: '0 10px 50px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.9)',
						WebkitTextStroke: '1.5px rgba(0,0,0,0.35)',
					}}
				>
					<div>{first}</div>
					{second ? (
						<div
							style={{
								color: data.accent,
								textShadow: `0 10px 50px rgba(0,0,0,0.95), 0 0 40px ${data.accent}44`,
							}}
						>
							{second}
						</div>
					) : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const SplitThumbnail: React.FC<{ data: SplitData }> = ({ data }) => {
	const words = data.headline.trim().split(/\s+/);

	return (
		<AbsoluteFill style={{ backgroundColor: '#02030A', overflow: 'hidden', fontFamily: FONT_HEAD }}>
			<FontLoader />
			<div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
				<div style={{ position: 'relative', width: '50%', height: '100%', overflow: 'hidden' }}>
					<Img
						src={staticFile(data.leftImage)}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>
				<div style={{ position: 'relative', width: '50%', height: '100%', overflow: 'hidden' }}>
					<Img
						src={staticFile(data.rightImage)}
						style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					/>
				</div>
			</div>
			<AbsoluteFill
				style={{
					background:
						'linear-gradient(180deg, rgba(2,3,10,0.45) 0%, rgba(2,3,10,0) 24%, rgba(2,3,10,0) 58%, rgba(2,3,10,0.92) 100%)',
				}}
			/>
			<svg
				viewBox="0 0 1280 720"
				preserveAspectRatio="none"
				style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
			>
				<line
					x1={690}
					y1={0}
					x2={590}
					y2={720}
					stroke={data.accent}
					strokeWidth={5}
					strokeDasharray="20 16"
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					padding: '18px 0 28px',
					background: 'rgba(2,3,10,0.86)',
					borderTop: `2px solid ${data.accent}`,
					textAlign: 'center',
					boxShadow: '0 -20px 60px rgba(0,0,0,0.55)',
				}}
			>
				<div
					style={{
						fontSize: data.fontSize,
						lineHeight: 0.9,
						fontWeight: 800,
						letterSpacing: -5,
						color: '#F8FAFC',
						textShadow: '0 10px 50px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.9)',
						WebkitTextStroke: '1.5px rgba(0,0,0,0.35)',
					}}
				>
					{words.map((word, index) => (
						<span
							key={`${word}-${index}`}
							style={{ color: index === words.length - 1 ? data.accent : '#F8FAFC' }}
						>
							{word}
							{index < words.length - 1 ? ' ' : ''}
						</span>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const TunnelThumbnail: React.FC<{ data: TunnelData }> = ({ data }) => {
	const [first, second] = splitHeadline(data.headline);

	return (
		<AbsoluteFill style={{ backgroundColor: '#05060F', overflow: 'hidden', fontFamily: FONT_HEAD }}>
			<FontLoader />
			<svg viewBox="0 0 1280 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
				<defs>
					<linearGradient id="c-bg" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#0B0D1A" />
						<stop offset="100%" stopColor="#05060F" />
					</linearGradient>
					<linearGradient id="c-concrete-top" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#3A4150" />
						<stop offset="100%" stopColor="#1A1E28" />
					</linearGradient>
					<linearGradient id="c-concrete-bottom" x1="0" y1="1" x2="0" y2="0">
						<stop offset="0%" stopColor="#3A4150" />
						<stop offset="100%" stopColor="#1A1E28" />
					</linearGradient>
					<pattern id="c-concrete" width="36" height="36" patternUnits="userSpaceOnUse">
						<circle cx="6" cy="9" r="1.2" fill="#7A8496" opacity="0.25" />
						<circle cx="24" cy="22" r="1" fill="#7A8496" opacity="0.18" />
						<path d="M 0 18 H 36" stroke="#7A8496" strokeOpacity="0.08" />
					</pattern>
					<linearGradient id="c-wall" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#FB7185" />
						<stop offset="18%" stopColor="#F43F5E" />
						<stop offset="70%" stopColor="#9F1239" />
						<stop offset="100%" stopColor="#4C0519" />
					</linearGradient>
					<linearGradient id="c-wall-fold" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#FB7185" stopOpacity="0.95" />
						<stop offset="50%" stopColor="#F43F5E" stopOpacity="0.8" />
						<stop offset="100%" stopColor="#9F1239" stopOpacity="0.95" />
					</linearGradient>
					<radialGradient id="c-headlight" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#FFFFFF" />
						<stop offset="35%" stopColor="#FDE68A" stopOpacity="0.9" />
						<stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
					</radialGradient>
					<linearGradient id="c-train" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#FFFFFF" />
						<stop offset="55%" stopColor="#E2E8F0" />
						<stop offset="100%" stopColor="#94A3B8" />
					</linearGradient>
					<filter id="c-glow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="18" />
					</filter>
					<filter id="c-soft" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur stdDeviation="4" />
					</filter>
				</defs>
				<rect width="1280" height="720" fill="url(#c-bg)" />
				<path d="M0 190 L1280 250 L1280 510 L0 570 Z" fill="#070912" />
				{Array.from({ length: 6 }, (_, index) => {
					const yLeft = 210 + index * 52;
					const yRight = 270 + index * 34;
					return <line key={`persp-${index}`} x1={0} y1={yLeft} x2={1280} y2={yRight} stroke="#1E293B" strokeWidth={2} opacity={0.55} />;
				})}
				<path d="M0 0 H1280 V250 L0 190 Z" fill="url(#c-concrete-top)" />
				<path d="M0 0 H1280 V250 L0 190 Z" fill="url(#c-concrete)" opacity={0.9} />
				<path d="M0 190 L1280 250" stroke="#94A3B8" strokeWidth={4} opacity={0.5} />
				{Array.from({ length: 8 }, (_, index) => {
					const x = 90 + index * 150;
					const y = 190 + (x / 1280) * 60;
					return (
						<g key={`top-joint-${index}`}>
							<line x1={x} y1={0} x2={x} y2={y} stroke="#0B0D1A" strokeWidth={3} opacity={0.6} />
							<circle cx={x} cy={y - 12} r={4} fill="#111827" stroke="#64748B" strokeWidth={2} />
						</g>
					);
				})}
				<path d="M 150 36 L 176 62 L 162 88 L 198 118 L 186 152" stroke="#0B0D1A" strokeWidth={4} fill="none" opacity={0.55} />
				<path d="M 760 28 L 742 58 L 770 86 L 752 120" stroke="#0B0D1A" strokeWidth={3} fill="none" opacity={0.5} />
				<path d="M 1080 24 L 1104 54 L 1088 84" stroke="#0B0D1A" strokeWidth={3} fill="none" opacity={0.45} />
				<path d="M 40 172 L 1240 232" stroke="#A3E635" strokeWidth={3} strokeDasharray="22 16" opacity={0.35} />
				{Array.from({ length: 7 }, (_, index) => {
					const x = 180 + index * 150;
					const y = 172 + (x / 1280) * 60;
					return <path key={`chev-top-${index}`} d={`M ${x} ${y} L ${x + 22} ${y + 2} L ${x} ${y + 8}`} stroke="#A3E635" strokeWidth={3} fill="none" opacity={0.28} />;
				})}
				<path d="M0 720 H1280 V510 L0 570 Z" fill="url(#c-concrete-bottom)" />
				<path d="M0 720 H1280 V510 L0 570 Z" fill="url(#c-concrete)" opacity={0.9} />
				<path d="M0 570 L1280 510" stroke="#94A3B8" strokeWidth={4} opacity={0.5} />
				{Array.from({ length: 8 }, (_, index) => {
					const x = 90 + index * 150;
					const y = 570 - (x / 1280) * 60;
					return (
						<g key={`bottom-joint-${index}`}>
							<line x1={x} y1={720} x2={x} y2={y} stroke="#0B0D1A" strokeWidth={3} opacity={0.6} />
							<circle cx={x} cy={y + 12} r={4} fill="#111827" stroke="#64748B" strokeWidth={2} />
						</g>
					);
				})}
				<path d="M 320 690 L 300 662 L 326 636 L 310 608" stroke="#0B0D1A" strokeWidth={4} fill="none" opacity={0.5} />
				<path d="M 980 700 L 1002 670 L 984 644 L 1008 616" stroke="#0B0D1A" strokeWidth={3} fill="none" opacity={0.45} />
				<path d="M 40 570 L 1240 510" stroke="#A3E635" strokeWidth={3} strokeDasharray="22 16" opacity={0.35} />
				<path d="M0 552 L900 492 L900 540 L0 620 Z" fill="#151A24" />
				<path d="M0 552 L900 492" stroke="#64748B" strokeWidth={8} />
				<path d="M0 548 L900 488" stroke="#CBD5E1" strokeWidth={2} opacity={0.35} />
				{Array.from({ length: 16 }, (_, index) => {
					const x = 20 + index * 54;
					const yTop = 552 - (x / 900) * 60;
					const yBottom = 620 - (x / 900) * 72;
					return <line key={`sleeper-${index}`} x1={x} y1={yTop} x2={x + 10} y2={yBottom} stroke="#334155" strokeWidth={5} opacity={0.75} />;
				})}
				<ellipse cx={420} cy={545} rx={380} ry={34} fill="#000000" opacity={0.55} filter="url(#c-soft)" />
				<path d="M 0 300 C 190 286 380 292 560 316" stroke="#3B82F6" strokeWidth={4} fill="none" opacity={0.7} />
				<path d="M 0 318 C 220 304 400 310 600 336" stroke="#3B82F6" strokeWidth={2} fill="none" opacity={0.45} />
				<path d="M 0 532 C 200 552 400 546 640 518" stroke="#3B82F6" strokeWidth={4} fill="none" opacity={0.65} />
				<path d="M 0 550 C 220 570 420 562 660 532" stroke="#3B82F6" strokeWidth={2} fill="none" opacity={0.4} />
				{Array.from({ length: 5 }, (_, index) => {
					const y = 292 + index * 16;
					return <line key={`speed-${index}`} x1={0} y1={y} x2={90 + index * 12} y2={y} stroke="#3B82F6" strokeWidth={3} opacity={0.35} />;
				})}
				<path d="M -30 338 L 540 338 C 640 338 720 348 780 378 C 815 396 830 412 830 425 C 830 440 812 458 778 474 C 716 502 640 506 540 506 L -30 506 Z" fill="url(#c-train)" stroke="#0F172A" strokeWidth={3} />
				<path d="M -30 338 L 540 338 C 640 338 720 348 780 378" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.65} />
				<path d="M -30 440 L 560 440 C 650 440 720 452 784 478 L 784 496 L -30 496 Z" fill="#2563EB" />
				<path d="M -30 438 L 560 438 C 650 438 720 450 786 476" stroke="#93C5FD" strokeWidth={3} fill="none" opacity={0.85} />
				{Array.from({ length: 8 }, (_, index) => {
					const x = 36 + index * 64;
					return <rect key={`window-${index}`} x={x} y={362} width={44} height={28} rx={7} fill="#0F172A" stroke="#60A5FA" strokeWidth={1.5} opacity={0.95} />;
				})}
				<path d="M 690 362 C 742 362 774 376 792 396 L 776 414 C 744 404 716 400 690 398 Z" fill="#0F172A" stroke="#60A5FA" strokeWidth={2} />
				<path d="M 700 370 C 736 370 762 380 778 392" stroke="#93C5FD" strokeWidth={2} fill="none" opacity={0.65} />
				<rect x={120} y={500} width={150} height={26} rx={10} fill="#0F172A" />
				<rect x={360} y={500} width={160} height={26} rx={10} fill="#0F172A" />
				<circle cx={160} cy={528} r={14} fill="#111827" stroke="#64748B" strokeWidth={3} />
				<circle cx={220} cy={528} r={14} fill="#111827" stroke="#64748B" strokeWidth={3} />
				<circle cx={400} cy={528} r={14} fill="#111827" stroke="#64748B" strokeWidth={3} />
				<circle cx={460} cy={528} r={14} fill="#111827" stroke="#64748B" strokeWidth={3} />
				<ellipse cx={850} cy={424} rx={90} ry={34} fill="url(#c-headlight)" opacity={0.95} />
				<circle cx={816} cy={418} r={10} fill="#FFFFFF" />
				<circle cx={816} cy={444} r={7} fill="#FDE68A" />
				<circle cx={816} cy={418} r={18} fill="#FDE68A" opacity={0.35} filter="url(#c-glow)" />
				<ellipse cx={950} cy={360} rx={220} ry={170} fill="#F43F5E" opacity={0.16} filter="url(#c-glow)" />
				<path d="M 845 232 L 1140 246 L 1140 516 L 845 531 Z" fill="url(#c-wall)" />
				{Array.from({ length: 6 }, (_, index) => {
					const x = 850 + index * 48;
					return (
						<path
							key={`fold-${index}`}
							d={`M ${x} 236 C ${x + 24} 290 ${x - 8} 340 ${x + 18} 390 C ${x + 40} 440 ${x + 6} 490 ${x} 526 L ${x + 38} 526 C ${x + 52} 490 ${x + 22} 440 ${x + 48} 390 C ${x + 66} 340 ${x + 34} 290 ${x + 38} 236 Z`}
							fill={index % 2 === 0 ? 'url(#c-wall-fold)' : '#7F1D2D'}
							opacity={0.82 - index * 0.07}
						/>
					);
				})}
				<path d="M 845 232 L 874 240 L 874 523 L 845 531 Z" fill="#FB7185" opacity={0.95} />
				<path d="M 845 232 L 845 531" stroke="#FECDD3" strokeWidth={4} opacity={0.9} />
				<path d="M 1120 244 L 1140 246 L 1140 516 L 1120 514 Z" fill="#4C0519" opacity={0.9} />
				{Array.from({ length: 9 }, (_, index) => {
					const y = 260 + index * 30;
					return <path key={`seam-${index}`} d={`M 850 ${y} H 1130`} stroke="#FECDD3" strokeWidth={2} strokeDasharray="10 12" opacity={0.22} />;
				})}
				<path d="M 880 270 L 902 298 L 890 326 L 914 352" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.45} />
				<path d="M 1000 330 L 1024 360 L 1010 390 L 1034 418" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.35} />
				<path d="M 930 470 L 954 454 L 972 478 L 996 462" stroke="#FECDD3" strokeWidth={2} fill="none" opacity={0.4} />
				<circle cx={842} cy={424} r={12} fill="#FFFFFF" opacity={0.9} />
				<circle cx={842} cy={424} r={30} fill="#FDE68A" opacity={0.35} filter="url(#c-glow)" />
				<path d="M 838 300 L 752 300 M 776 280 L 748 300 L 776 320" stroke="#A3E635" strokeWidth={7} fill="none" strokeLinecap="square" />
				<path d="M 838 390 L 716 390 M 744 364 L 712 390 L 744 416" stroke="#A3E635" strokeWidth={7} fill="none" strokeLinecap="square" />
				<path d="M 838 480 L 760 480 M 784 460 L 756 480 L 784 500" stroke="#A3E635" strokeWidth={7} fill="none" strokeLinecap="square" />
				{Array.from({ length: 6 }, (_, index) => {
					const angle = (index / 6) * Math.PI * 2;
					const x1 = 842 + Math.cos(angle) * 22;
					const y1 = 424 + Math.sin(angle) * 22;
					const x2 = 842 + Math.cos(angle) * 52;
					const y2 = 424 + Math.sin(angle) * 52;
					return <line key={`spark-${index}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FDE68A" strokeWidth={3} opacity={0.75} />;
				})}
				<g>
					<rect x={960} y={296} width={176} height={78} rx={6} fill="#090A1A" stroke="#F43F5E" strokeWidth={3} />
					<rect x={960} y={296} width={9} height={78} fill="#A3E635" />
					<text x={990} y={350} fill="#F8FAFC" fontFamily={FONT_MONO} fontSize={46} fontWeight={700} letterSpacing={1}>5 kPa</text>
				</g>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 44,
					top: 36,
					padding: '18px 28px 22px',
					background: 'rgba(9,10,26,0.94)',
					borderLeft: `8px solid ${data.accent}`,
					boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
				}}
			>
				<div
					style={{
						fontSize: data.fontSize,
						lineHeight: 0.86,
						fontWeight: 800,
						letterSpacing: -5,
						color: '#F8FAFC',
						textShadow: '0 10px 50px rgba(0,0,0,0.95), 0 4px 12px rgba(0,0,0,0.9)',
					}}
				>
					<div>{first}</div>
					{second ? <div style={{ color: '#F43F5E' }}>{second}</div> : null}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const ThumbnailTemplate: React.FC<{ variant: Variant }> = ({ variant }) => {
	if (variant === 'A') return <SplitThumbnail data={A_DATA} />;
	if (variant === 'C') return <TunnelThumbnail data={C_DATA} />;
	return <GenericThumbnail data={B_DATA} />;
};
