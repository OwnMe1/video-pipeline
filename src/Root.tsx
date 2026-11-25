import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={300} // 300 кадров = 10 секунд при 30 fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
