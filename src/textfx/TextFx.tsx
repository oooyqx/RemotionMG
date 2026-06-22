import React from 'react';
import {Phase, TextEffect} from './types';

/**
 * 把一个「动效原子」渲染成一段文字。场景只负责定位/字号/配色（baseStyle），
 * 效果只负责进/出的视觉（wrapper + content）。两者在此组合。
 */
export const TextFx: React.FC<{
  effect: TextEffect;
  text: string;
  phase: Phase;
  t: number;
  frame: number;
  seed?: number;
  baseStyle?: React.CSSProperties;
}> = ({effect, text, phase, t, frame, seed = 1, baseStyle}) => {
  const v = effect.visual({text, phase, t, frame, seed});
  return (
    <span style={{display: 'inline-block', whiteSpace: 'nowrap', ...baseStyle, ...v.wrapper}}>
      {v.content ?? text}
    </span>
  );
};
