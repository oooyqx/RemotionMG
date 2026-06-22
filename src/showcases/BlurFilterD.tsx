import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_D} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * D 类 · 模糊 · 滤镜 — 焦点切换
 *  入场：blur 16→0 对焦登场 + scale 1.06→1
 *  出场：失焦（blur→16）+ 缩成"虚化缩略图"
 *  堆栈：顶部一排始终保持虚化的小缩略图，过旧淡出
 */

const THUMB_Y = 200;
const THUMB_RIGHT_X = 1640;
const THUMB_STEP = 360;
const THUMB_SCALE = 0.4;
const MAX_HIST = 4;

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  let x: number;
  let y: number;
  let scale: number;
  let blur: number;
  let brightness = 1;
  let opacity = 1;

  if (isFeatured) {
    const e = easeOutCubic(clamp01(revealT));
    x = FOCAL.x;
    y = FOCAL.y;
    scale = lerp(1.06, 1, e);
    blur = lerp(18, 0, e);
    opacity = clamp01(revealT * 2);
  } else {
    const t1 = move;
    const thumbX = THUMB_RIGHT_X - Math.max(0, m - 1) * THUMB_STEP;
    x = lerp(FOCAL.x, thumbX, easeOutCubic(t1));
    y = lerp(FOCAL.y, THUMB_Y, easeOutCubic(t1));
    scale = lerp(1, THUMB_SCALE, t1);
    blur = lerp(0, 9, t1); // 退场后保持虚化
    brightness = lerp(1, 0.7, t1);
    opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px) brightness(${brightness})`,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        zIndex: isFeatured ? 1000 : index,
        color: isFeatured ? '#ffffff' : '#aebbe0',
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          textShadow: isFeatured ? '0 0 50px rgba(120,200,255,0.5)' : 'none',
        }}
      >
        <span style={{color: '#46c8ff'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
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

export const BlurFilterD: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="D · 模糊 / 滤镜"
      index={active}
      total={CATEGORY_D.length}
      background="radial-gradient(circle at 50% 45%, #103040 0%, #0a1a24 60%, #060e14 100%)"
    >
      {CATEGORY_D.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
