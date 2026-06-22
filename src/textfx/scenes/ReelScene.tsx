import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {HeroScene} from './HeroScene';
import {CaptionScene} from './CaptionScene';
import {ListScene} from './ListScene';
import {LowerThirdScene} from './LowerThirdScene';
import {EmphasisScene} from './EmphasisScene';
import {GalleryScene} from './GalleryScene';
import {ReelSegment, segmentFrames} from '../schemas';

/**
 * 场景 · Reel 串联成片
 *  把多个场景片段按顺序拼成一条完整成片（片头 → 字幕 → 角标 → 行内强调 → 结尾 …）。
 *  每个片段 = {type, props}，时长由各场景的 *Frames() 自动推算，用 <Series> 顺序播放。
 */

const renderSegment = (s: ReelSegment): React.ReactNode => {
  switch (s.type) {
    case 'hero':
      return <HeroScene {...s.props} />;
    case 'caption':
      return <CaptionScene {...s.props} />;
    case 'list':
      return <ListScene {...s.props} />;
    case 'lowerThird':
      return <LowerThirdScene {...s.props} />;
    case 'emphasis':
      return <EmphasisScene {...s.props} />;
    case 'gallery':
      return <GalleryScene {...s.props} />;
  }
};

export const ReelScene: React.FC<{segments: ReelSegment[]}> = ({segments}) => {
  return (
    <AbsoluteFill style={{background: '#05060d'}}>
      <Series>
        {segments.map((s, i) => (
          <Series.Sequence key={i} durationInFrames={segmentFrames(s)}>
            {renderSegment(s)}
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
