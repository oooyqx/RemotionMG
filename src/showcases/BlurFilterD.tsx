import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_D} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * D 类 · 模糊 · 滤镜 — 焦点切换
 *  入场：blur 16→0 对焦登场 + scale 1.06→1
 *  出场：失焦后边缩小边淡出，朝右上角飘走（不做横向滑移）
 */

const CORNER_X = 1780;
const CORNER_Y = 120;

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
    // 失焦缩小并朝右上角飘走，同时渐渐透明消失
    const prog = easeOutCubic(clamp01(m / 1.3));
    x = lerp(FOCAL.x, CORNER_X, prog);
    y = lerp(FOCAL.y, CORNER_Y, prog);
    scale = lerp(1, 0.2, prog);
    blur = lerp(0, 16, easeOutCubic(clamp01(move)));
    brightness = lerp(1, 0.7, move);
    opacity = clamp01(1.4 - m);
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
