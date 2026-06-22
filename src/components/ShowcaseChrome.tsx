import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * 各类别全屏展示共享外框：背景 + 左上角类别标识 + 底部进度条。
 */
export const ShowcaseChrome: React.FC<{
  label: string;
  index: number;
  total: number;
  background?: string;
  children: React.ReactNode;
}> = ({label, index, total, background, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background:
          background ??
          'radial-gradient(circle at 50% 35%, #1a2348 0%, #0b1020 60%, #070b16 100%)',
        overflow: 'hidden',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 60,
          color: '#566092',
          fontFamily: 'monospace',
          fontSize: 22,
          letterSpacing: 2,
          opacity: 0.7,
          zIndex: 9999,
        }}
      >
        {label} {String(Math.min(index + 1, total)).padStart(2, '0')} / {total}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 5,
          width: `${(frame / durationInFrames) * 100}%`,
          background: 'linear-gradient(90deg,#e94560,#f7b733)',
          zIndex: 9999,
        }}
      />
    </AbsoluteFill>
  );
};

export const FOCAL = {x: 960, y: 560};
