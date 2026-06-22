import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_L} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * L 类 · 高阶创意 · 分形 · 混沌 — 涌现与轨迹
 *  入场：沿螺旋/吸引子轨迹从外旋入并自旋归位
 *  出场：沿对数螺旋越绕越远地飞离并淡出
 *  堆栈：沿阿基米德螺旋布局，每条在自身微混沌轨道上轻颤
 */

const SP_CX = 430;
const SP_CY = 330;
const MAX_HIST = 8;

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  let x: number;
  let y: number;
  let scale: number;
  let rotate: number;
  let opacity = 1;

  if (isFeatured) {
    const e = easeOutCubic(clamp01(revealT));
    const r = lerp(560, 0, e);
    const theta = index * 2.4 + (1 - e) * Math.PI * 4;
    x = FOCAL.x + Math.cos(theta) * r;
    y = FOCAL.y + Math.sin(theta) * r * 0.6;
    scale = lerp(0.2, 1, e);
    rotate = (1 - e) * 360;
    opacity = clamp01(revealT * 2);
  } else {
    const t1 = move;
    // 历史沿阿基米德螺旋布局
    const ang = m * 1.15 + index * 1.3;
    const rad = 130 + m * 125;
    const orbit = 10;
    const sx = SP_CX + Math.cos(ang) * rad + Math.cos(frame * 0.05 + index) * orbit;
    const sy = SP_CY + Math.sin(ang) * rad + Math.sin(frame * 0.06 + index * 1.7) * orbit;
    x = lerp(FOCAL.x, sx, easeOutCubic(t1));
    y = lerp(FOCAL.y, sy, easeOutCubic(t1));
    scale = lerp(1, 0.22, t1);
    rotate = lerp(0, ang * 12, t1);
    opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 0.9;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})`,
        opacity,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        zIndex: isFeatured ? 1000 : index,
        color: isFeatured ? '#ffffff' : '#b69cf0',
      }}
    >
      <div
        style={{
          fontSize: 148,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          textShadow: isFeatured ? '0 0 60px rgba(150,90,255,0.5)' : 'none',
        }}
      >
        <span style={{color: '#9b6bff'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
      </div>
      <div style={{opacity: isFeatured ? clamp01((revealT - 0.5) / 0.4) : 0, marginTop: 16}}>
        <div style={{fontSize: 30, color: '#7fd1c0', fontFamily: 'monospace'}}>{item.enName}</div>
        <div style={{fontSize: 30, color: '#f7b733', fontFamily: 'monospace', marginTop: 8}}>
          {item.formula}
        </div>
      </div>
    </div>
  );
};

export const FractalChaosL: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="L · 分形 / 混沌"
      index={active}
      total={CATEGORY_L.length}
      background="radial-gradient(circle at 50% 40%, #1c1140 0%, #100a26 60%, #070414 100%)"
    >
      {CATEGORY_L.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
