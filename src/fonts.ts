import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

export const FONT_HEAD = "'Space Grotesk', 'Inter', sans-serif";
export const FONT_BODY = "'Inter', 'Space Grotesk', sans-serif";
export const FONT_MONO = "'JetBrains Mono', 'SFMono-Regular', monospace";

type Face = { family: string; weight: string; file: string };

const FACES: Face[] = [
	{ family: 'Space Grotesk', weight: '400', file: 'fonts/space-grotesk-400.woff2' },
	{ family: 'Space Grotesk', weight: '500', file: 'fonts/space-grotesk-500.woff2' },
	{ family: 'Space Grotesk', weight: '600', file: 'fonts/space-grotesk-600.woff2' },
	{ family: 'Space Grotesk', weight: '700', file: 'fonts/space-grotesk-700.woff2' },
	{ family: 'Inter', weight: '400', file: 'fonts/inter-400.woff2' },
	{ family: 'Inter', weight: '500', file: 'fonts/inter-500.woff2' },
	{ family: 'Inter', weight: '600', file: 'fonts/inter-600.woff2' },
	{ family: 'Inter', weight: '700', file: 'fonts/inter-700.woff2' },
	{ family: 'Inter', weight: '800', file: 'fonts/inter-800.woff2' },
	{ family: 'JetBrains Mono', weight: '400', file: 'fonts/jetbrains-mono-400.woff2' },
	{ family: 'JetBrains Mono', weight: '500', file: 'fonts/jetbrains-mono-500.woff2' },
	{ family: 'JetBrains Mono', weight: '600', file: 'fonts/jetbrains-mono-600.woff2' },
	{ family: 'JetBrains Mono', weight: '700', file: 'fonts/jetbrains-mono-700.woff2' },
];

export const FontLoader: React.FC = () => {
	const [handle] = useState(() => delayRender('Loading Kinetic Lab fonts'));

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			await Promise.all(
				FACES.map(async (item) => {
					const face = new FontFace(
						item.family,
						`url(${staticFile(item.file)}) format('woff2')`,
						{ weight: item.weight, style: 'normal' },
					);
					await face.load();
					document.fonts.add(face);
				}),
			);
		};

		load()
			.catch((error) => {
				console.error('Font loading failed', error);
			})
			.finally(() => {
				if (!cancelled) {
					continueRender(handle);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [handle]);

	return null;
};
