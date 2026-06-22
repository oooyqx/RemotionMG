import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';

/**
 * 场景 · Thumb 缩略图
 *  单个动效原子在中段进度（t≈0.62）的静态预览，用于生成"选效果"缩略图清单。
 *  固定一帧静态渲染（frame 用常量，避免逐帧动画影响截图）。
 */
export const ThumbScene: React.FC<{
  effectId?: number;
  background?: string;
  color?: string;
  fontSize?: number;
}> = ({
  effectId = 1,
  background = 'radial-gradient(circle at 50% 45%, #1b2140 0%, #0a0e1c 70%)',
  color = '#ffffff',
  fontSize = 120,
}) => {
  const fx = effectById(effectId);
  return (
    <AbsoluteFill style={{background, color, fontFamily: 'Arial, "PingFang SC", sans-serif'}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <TextFx
          effect={fx}
          text={fx.name}
          phase="in"
          t={0.62}
          frame={20}
          seed={effectId}
          baseStyle={{fontSize, fontWeight: 900, textAlign: 'center'}}
        />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 28, top: 20, fontSize: 26, fontWeight: 800, color: '#4aa3ff'}}>
        {fx.category}
        {String(fx.id).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: 28, bottom: 18, fontSize: 22, color: '#8ea0d6'}}>{fx.enName}</div>
    </AbsoluteFill>
  );
};
