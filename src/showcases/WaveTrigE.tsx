import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_E} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * E 类 · 三角函数 · 波动 — 振荡与周期
 *  入场：沿正弦上浮 + 衰减摆动（偶数）/ 心跳脉动缩放（奇数）
 *  出场：沿正弦路径摇摆离场，振幅随推进增大
 *  堆栈：历史挂在顶部一条正弦曲线上，持续轻微荡漾
 */

const STACK_Y0 = 200;
const STACK_RIGHT_X = 1540;
const STACK_STEP = 300;
const STACK_SCALE = 0.3;
const MAX_HIST = 6;

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  let x: number;
  let y: number;
  let scale = 1;
  let rotate = 0;
  let opacity = 1;

  if (isFeatured) {
    opacity = clamp01(revealT * 2.2);
    x = FOCAL.x;
    const k = 1 - clamp01(revealT);
    if (index % 2 === 0) {
      // 正弦上浮 + 衰减摆动
      y = FOCAL.y + Math.sin(k * Math.PI * 3) * 140 * k;
      rotate = Math.sin(k * Math.PI * 3) * 10 * k;
      scale = 1;
    } else {
      // 心跳脉动
      const beat = Math.sin(revealT * Math.PI * 4) + 0.5 * Math.sin(revealT * Math.PI * 8);
      scale = 1 + beat * 0.12 * k;
      y = FOCAL.y;
    }
  } else {
    const t1 = move;
    const stackX = STACK_RIGHT_X - Math.max(0, m - 1) * STACK_STEP;
    // 历史挂在正弦曲线上轻微荡漾
    const bob = Math.sin(m * 0.9 + frame * 0.06) * 16;
    x = lerp(FOCAL.x, stackX, easeOutCubic(t1)) + Math.sin(t1 * Math.PI * 2) * 60 * (1 - t1);
    y = lerp(FOCAL.y, STACK_Y0 + bob, easeOutCubic(t1));
    scale = lerp(1, STACK_SCALE, t1);
    rotate = Math.sin(m * 0.9 + frame * 0.06) * 6;
    opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1;
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
        zIndex: index,
        color: isFeatured ? '#ffffff' : '#8fe0c8',
      }}
    >
      <div
        style={{
          fontSize: 148,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          textShadow: isFeatured ? '0 14px 60px rgba(40,220,180,0.3)' : 'none',
        }}
      >
        <span style={{color: '#2bd6a6'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
      </div>
      <div style={{opacity: isFeatured ? clamp01((revealT - 0.4) / 0.4) : 0, marginTop: 16}}>
        <div style={{fontSize: 30, color: '#7fd1c0', fontFamily: 'monospace'}}>{item.enName}</div>
        <div style={{fontSize: 30, color: '#f7b733', fontFamily: 'monospace', marginTop: 8}}>
          {item.formula}
        </div>
      </div>
    </div>
  );
};

export const WaveTrigE: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="E · 三角 / 波动"
      index={active}
      total={CATEGORY_E.length}
      background="radial-gradient(circle at 50% 40%, #0e3340 0%, #08202a 60%, #051015 100%)"
    >
      {CATEGORY_E.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
