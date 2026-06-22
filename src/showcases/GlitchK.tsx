import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_K} from '../effects/categories';
import {clamp01, itemTiming, lerp, rand2, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * K 类 · 故障 · 数字信号 — 信号干扰
 *  入场：RGB 撕裂故障（通道偏移 + 行抖动，随出现衰减）
 *  出场：剧烈故障后纵向坍缩成一行"日志条"
 *  堆栈：顶部 CRT 扫描线迷你终端条目，绿字 + 闪烁
 */

const LOG_TOP = 150;
const LOG_LINE_H = 70;
const MAX_HIST = 5;

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  const label = `${String(item.id).padStart(2, '0')} ${item.name}`;

  if (isFeatured) {
    const g = 1 - clamp01(revealT); // 故障强度
    const jit = (rand2(Math.floor(frame / 2), index) - 0.5) * g * 40;
    const split = g * 18 + Math.abs(jit) * 0.4;
    const skew = (rand2(Math.floor(frame / 3), index + 9) - 0.5) * g * 8;
    return (
      <div
        style={{
          position: 'absolute',
          left: FOCAL.x + jit,
          top: FOCAL.y,
          transform: `translate(-50%,-50%) skewX(${skew}deg)`,
          zIndex: 1000,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          opacity: clamp01(revealT * 3),
          fontFamily: '"Courier New", monospace',
          fontWeight: 900,
        }}
      >
        <div style={{position: 'relative', fontSize: 150, lineHeight: 1}}>
          <span style={{position: 'absolute', left: -split, top: 0, color: '#ff003c', mixBlendMode: 'screen'}}>
            {label}
          </span>
          <span style={{position: 'absolute', left: split, top: 0, color: '#00e5ff', mixBlendMode: 'screen'}}>
            {label}
          </span>
          <span style={{position: 'relative', color: '#ffffff'}}>{label}</span>
        </div>
        <div style={{opacity: clamp01((revealT - 0.5) / 0.4), marginTop: 16}}>
          <div style={{fontSize: 30, color: '#7fd1c0'}}>{item.enName}</div>
          <div style={{fontSize: 30, color: '#f7b733', marginTop: 8}}>{item.formula}</div>
        </div>
      </div>
    );
  }

  // 出场坍缩 → 顶部 CRT 终端日志
  const t1 = move;
  const e = easeOutCubic(t1);
  const targetX = 150;
  const targetY = LOG_TOP + Math.max(0, m - 1) * LOG_LINE_H;
  const x = lerp(FOCAL.x, targetX, e);
  const y = lerp(FOCAL.y, targetY, e);
  const scaleY = lerp(1, 0.16, e); // 纵向坍缩
  const fontSize = lerp(150, 40, e);
  const flick = rand2(Math.floor(frame / 4), index) > 0.1 ? 1 : 0.45;
  const opacity = (m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1) * flick;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${e > 0.7 ? '0' : '-50%'},-50%) scaleY(${scaleY})`,
        opacity,
        zIndex: index,
        whiteSpace: 'nowrap',
        fontFamily: '"Courier New", monospace',
        fontWeight: 700,
        fontSize,
        color: '#39e06a',
        textShadow: '0 0 6px rgba(57,224,106,0.8)',
        background:
          e > 0.7
            ? 'repeating-linear-gradient(0deg,rgba(57,224,106,0.08) 0 2px,transparent 2px 4px)'
            : 'none',
        padding: e > 0.7 ? '2px 10px' : 0,
      }}
    >
      {e > 0.7 ? <span style={{color: '#1f7d44'}}>{'> '}</span> : null}
      {label}
    </div>
  );
};

export const GlitchK: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="K · 故障 / 数字信号"
      index={active}
      total={CATEGORY_K.length}
      background="radial-gradient(circle at 50% 45%, #0a1622 0%, #060d16 60%, #03070c 100%)"
    >
      {CATEGORY_K.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
