import {Composition} from 'remotion';
import {TextMotion} from './TextMotion';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TextMotion"
      component={TextMotion}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        text: 'Hello Motion Graphics',
      }}
    />
  );
};
