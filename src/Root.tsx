import { Composition, Still } from 'remotion';
import { getTotalDurationInFrames, MyComposition } from './Composition';
import { ThumbnailTemplate } from './Thumbnail';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MyComp" component={MyComposition} durationInFrames={getTotalDurationInFrames(FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="ThumbVariantA" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'A' as const }} />
    <Still id="ThumbVariantB" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'B' as const }} />
    <Still id="ThumbVariantC" component={ThumbnailTemplate} width={1280} height={720} defaultProps={{ variant: 'C' as const }} />
  </>
);
