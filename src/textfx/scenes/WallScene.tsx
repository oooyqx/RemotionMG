import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {EFFECTS, effectById} from '../library';
import {Phase} from '../types';

/**
 * 场景 · Wall 动态预览墙
 *  把全部（或指定）效果排成网格，所有格子按同一个 in→hold→out 循环同步播放，
 *  让人类"一眼看全部动起来的样子"，按编号挑效果。
 */
export const WallScene: React.FC<{
  effectIds?: number[];
  columns?: number;
  loopFrames?: number;
  background?: string;
  color?: string;
}> = ({
  effectIds,
  columns = 10,
  loopFrames = 90,
  background = 'radial-gradient(circle at 50% 40%, #141a30 0%, #0a0e1c 60%, #05060d 100%)',
  color = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const list = effectIds && effectIds.length > 0 ? effectIds.map(effectById) : EFFECTS;

  const inF = Math.round(loopFrames * 0.25);
  const holdF = Math.round(loopFrames * 0.45);
  const outF = loopFrames - inF - holdF;

  return (
    <AbsoluteFill style={{background, color, fontFamily: 'Arial, "PingFang SC", sans-serif'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 24,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 8,
        }}
      >
        {list.map((fx, i) => {
          // 轻微错峰，让墙面像波浪一样此起彼伏
          const stagger = (i % columns) * 2 + Math.floor(i / columns) * 3;
          const local = (frame + stagger) % loopFrames;
          let phase: Phase = 'in';
          let t = 1;
          if (local < inF) {
            phase = 'in';
            t = local / inF;
          } else if (local < inF + holdF) {
            phase = 'in';
            t = 1;
          } else {
            phase = 'out';
            t = (local - inF - holdF) / outF;
          }
          return (
            <div
              key={fx.id}
              style={{
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 6,
                background: 'rgba(255,255,255,0.015)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <div
                style={{position: 'absolute', left: 6, top: 4, fontSize: 12, fontWeight: 800, color: '#4aa3ff'}}
              >
                {fx.category}
                {String(fx.id).padStart(2, '0')}
              </div>
              <TextFx
                effect={fx}
                text={fx.name}
                phase={phase}
                t={t}
                frame={frame}
                seed={fx.id}
                baseStyle={{fontSize: 22, fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap'}}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
