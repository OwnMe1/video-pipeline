import {
	AbsoluteFill,
	Audio,
	Easing,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';

const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

const fade = (
	frame: number,
	inStart: number,
	inEnd: number,
	outStart: number,
	outEnd: number,
) =>
	interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], clamp);

const fadeIn = (frame: number, start: number, end: number) =>
	interpolate(frame, [start, end], [0, 1], clamp);

const Grid: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				backgroundImage:
					'linear-gradient(rgba(79,209,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(79,209,255,0.10) 1px, transparent 1px)',
				backgroundSize: '80px 80px',
				backgroundPosition: `${-frame * 0.3}px ${-frame * 0.15}px`,
				maskImage:
					'radial-gradient(ellipse at center, black 25%, transparent 75%)',
				WebkitMaskImage:
					'radial-gradient(ellipse at center, black 25%, transparent 75%)',
			}}
		/>
	);
};

const TitleScene: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = fade(frame, 8, 34, 100, 128);
	const rise = interpolate(frame, [8, 34, 100, 128], [46, 0, 0, -22], clamp);
	const subtitleOpacity = fade(frame, 30, 50, 100, 128);
	const lineWidth = interpolate(frame, [20, 60], [0, 520], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				opacity,
			}}
		>
			<div
				style={{
					transform: `translateY(${rise}px)`,
					textAlign: 'center',
					fontFamily: 'Helvetica, Arial, sans-serif',
				}}
			>
				<div
					style={{
						color: '#4fd1ff',
						fontSize: 26,
						letterSpacing: 14,
						fontWeight: 600,
						marginBottom: 28,
					}}
				>
					THE HARDEST MACHINE ON EARTH
				</div>
				<div
					style={{
						color: '#f2f5ff',
						fontSize: 132,
						fontWeight: 800,
						letterSpacing: 6,
						lineHeight: 1,
					}}
				>
					EUV
					<br />
					LITHOGRAPHY
				</div>
				<div
					style={{
						height: 4,
						width: lineWidth,
						background:
							'linear-gradient(90deg, transparent, #4fd1ff, transparent)',
						margin: '34px auto 26px',
					}}
				/>
				<div
					style={{
						color: '#a8b3cf',
						fontSize: 40,
						fontWeight: 400,
						opacity: subtitleOpacity,
						letterSpacing: 1,
					}}
				>
					The most complex technology ever built.
				</div>
			</div>
		</AbsoluteFill>
	);
};

const TinScene: React.FC = () => {
	const frame = useCurrentFrame();

	const sceneOpacity = fadeIn(frame, 108, 132);
	const cx = 960;
	const impactY = 545;

	const dropY = interpolate(frame, [118, 164], [-90, impactY], {
		...clamp,
		easing: Easing.in(Easing.quad),
	});
	const dropOpacity = interpolate(frame, [118, 124, 164, 172], [0, 1, 1, 0], clamp);

	const beamOpacity = interpolate(frame, [158, 166, 184, 202], [0, 1, 0.9, 0], clamp);
	const beamLength = interpolate(frame, [158, 166], [0, cx], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});

	const flashRadius = interpolate(frame, [164, 230], [10, 340], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const flashOpacity = interpolate(frame, [164, 172, 230], [0, 0.85, 0], clamp);

	const ringOpacity = (delay: number) =>
		interpolate(frame, [delay, delay + 12, delay + 60], [0, 0.6, 0], clamp);
	const ringRadius = (delay: number) =>
		interpolate(frame, [delay, delay + 80], [20, 330], {
			...clamp,
			easing: Easing.out(Easing.quad),
		});

	const textOpacity = fadeIn(frame, 178, 206);
	const textRise = interpolate(frame, [178, 206], [28, 0], clamp);
	const nmOpacity = fadeIn(frame, 210, 240);
	const nmScale = interpolate(frame, [210, 245], [0.85, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill style={{ opacity: sceneOpacity }}>
			{/* Laser beam */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: impactY - 4,
					width: beamLength,
					height: 8,
					opacity: beamOpacity,
					background:
						'linear-gradient(90deg, rgba(255,122,60,0) 0%, #ff7a3c 60%, #ffd7a8 100%)',
					boxShadow: '0 0 28px 8px rgba(255,122,60,0.55)',
					borderRadius: 4,
				}}
			/>

			{/* Impact flash */}
			<div
				style={{
					position: 'absolute',
					left: cx - flashRadius,
					top: impactY - flashRadius,
					width: flashRadius * 2,
					height: flashRadius * 2,
					borderRadius: '50%',
					opacity: flashOpacity,
					background:
						'radial-gradient(circle, #ffffff 0%, #ffd7a8 30%, rgba(255,122,60,0) 70%)',
				}}
			/>

			{/* Expanding EUV rings */}
			{[166, 186, 206].map((delay) => (
				<div
					key={delay}
					style={{
						position: 'absolute',
						left: cx - ringRadius(delay),
						top: impactY - ringRadius(delay),
						width: ringRadius(delay) * 2,
						height: ringRadius(delay) * 2,
						borderRadius: '50%',
						border: '3px solid #9b8cff',
						opacity: ringOpacity(delay),
						boxShadow: '0 0 24px rgba(155,140,255,0.6)',
					}}
				/>
			))}

			{/* Falling tin droplet */}
			<div
				style={{
					position: 'absolute',
					left: cx - 34,
					top: dropY - 34,
					width: 68,
					height: 68,
					borderRadius: '50%',
					opacity: dropOpacity,
					background:
						'radial-gradient(circle at 32% 28%, #ffffff 0%, #c9d4e8 35%, #7f8aa3 100%)',
					boxShadow: '0 0 40px rgba(200,220,255,0.5)',
				}}
			/>

			{/* Caption */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 680,
					textAlign: 'center',
					fontFamily: 'Helvetica, Arial, sans-serif',
					transform: `translateY(${textRise}px)`,
					opacity: textOpacity,
				}}
			>
				<div
					style={{
						color: '#f2f5ff',
						fontSize: 74,
						fontWeight: 700,
						letterSpacing: 1,
					}}
				>
					Tin becomes light.
				</div>
				<div
					style={{
						marginTop: 18,
						color: '#9b8cff',
						fontSize: 40,
						letterSpacing: 6,
						fontWeight: 600,
						opacity: nmOpacity,
						transform: `scale(${nmScale})`,
					}}
				>
					13 NANOMETERS
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const MyComposition = () => {
	const frame = useCurrentFrame();
	const endFade = interpolate(frame, [288, 300], [0, 1], clamp);

	return (
		<AbsoluteFill style={{ backgroundColor: '#070b14' }}>
			<Audio src={staticFile('euv_0.wav')} />
			<Grid />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(ellipse at 50% 45%, rgba(30,52,96,0.55) 0%, rgba(7,11,20,0) 65%)',
				}}
			/>
			<TitleScene />
			<TinScene />
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundColor: '#000',
					opacity: endFade,
				}}
			/>
		</AbsoluteFill>
	);
};
