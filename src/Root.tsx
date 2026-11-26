import { Composition, Still } from 'remotion';
import { getTotalDurationInFrames, MyComposition } from './Composition';
import { getShortDurationInFrames, Short1Hook, Short2Tech, Short3Monopoly } from './ShortsComposition';
import { ThumbnailTemplate } from './Thumbnail';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition id="MyComp" component={MyComposition} durationInFrames={getTotalDurationInFrames(FPS)} fps={FPS} width={1920} height={1080} />
		<Composition id="Short1Hook" component={Short1Hook} durationInFrames={getShortDurationInFrames('Short1Hook', FPS)} fps={FPS} width={1080} height={1920} />
		<Composition id="Short2Tech" component={Short2Tech} durationInFrames={getShortDurationInFrames('Short2Tech', FPS)} fps={FPS} width={1080} height={1920} />
		<Composition id="Short3Monopoly" component={Short3Monopoly} durationInFrames={getShortDurationInFrames('Short3Monopoly', FPS)} fps={FPS} width={1080} height={1920} />
		<Still id="ThumbVariantA" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'A' as const }} />
		<Still id="ThumbVariantB" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'B' as const }} />
		<Still id="ThumbVariantC" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'C' as const }} />
	</>
);
