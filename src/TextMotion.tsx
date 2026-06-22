import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const TextMotion: React.FC<{
  text: string;
}> = ({text}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 60], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [0, 60], [50, 0], {
    extrapolateRight: 'clamp',
  });

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 'bold',
          color: '#e94560',
          fontFamily: 'Arial, sans-serif',
          opacity: Math.min(opacity, exitOpacity),
          transform: `scale(${scale}) translateY(${translateY}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
