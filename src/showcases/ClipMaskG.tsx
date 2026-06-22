import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_G} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * G 类 · 裁剪 · 遮罩揭示 — 擦除揭示
 *  入场：clip-path 揭开（横向 Wipe / 对角 / 圆形光圈 / 纵向，逐条轮换）
 *  出场：遮罩反向闭合擦掉主角，并移向右侧
 *  堆栈：右侧文字以左边为锚点旋转 90°，越早出现越成倍缩小
 */

const STRIP_X = 1820;
const STRIP_Y0 = 150;
const STRIP_DX = 96;
const STRIP_SCALE = 0.4;
const STRIP_SHRINK = 0.72;
const MAX_HIST = 6;

const revealClip = (variant: number, p: number): string => {
  switch (variant) {
    case 0:
      return `inset(0 ${(1 - p) * 100}% 0 0)`; // 横向擦除
    case 1:
      return `inset(${(1 - p) * 100}% 0 0 0)`; // 纵向擦除
    case 2:
      return `circle(${p * 75}% at 50% 50%)`; // 圆形光圈
    default: {
      const e = p * 160 - 30; // 对角推进
      return `polygon(0 0, ${e}% 0, ${e - 60}% 100%, 0 100%)`;
    }
  }
};

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  const variant = index % 4;

  let x: number;
  let y: number;
  let scale: number;
  let rotate = 0;
  let clip: string;
  let opacity = 1;

  if (isFeatured) {
    x = FOCAL.x;
    y = FOCAL.y;
    scale = 1;
    clip = revealClip(variant, easeOutCubic(clamp01(revealT)));
  } else {
    const t1 = easeOutCubic(move);
    const depth = Math.max(0, m - 1);
    // 越早出现（depth 越大）越成倍缩小，并朝左退去
    const sclT = STRIP_SCALE * Math.pow(STRIP_SHRINK, depth);
    x = lerp(FOCAL.x, STRIP_X - depth * STRIP_DX, t1);
    y = lerp(FOCAL.y, STRIP_Y0, t1);
    scale = lerp(1, sclT, t1);
    rotate = lerp(0, 90, t1); // 以左边为锚点旋转 90°
    clip = 'none';
    opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: isFeatured
          ? 'translate(-50%,-50%)'
          : `translate(0,-50%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: isFeatured ? 'center center' : 'left center',
        clipPath: clip,
        WebkitClipPath: clip,
        opacity,
        whiteSpace: 'nowrap',
        textAlign: isFeatured ? 'center' : 'left',
        zIndex: isFeatured ? 1000 : 1000 - index,
        color: isFeatured ? '#ffffff' : '#d6c2a6',
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          padding: isFeatured ? 0 : '6px 22px',
          background: isFeatured ? 'transparent' : 'rgba(60,48,30,0.5)',
          textShadow: isFeatured ? '0 14px 60px rgba(255,180,80,0.28)' : 'none',
        }}
      >
        <span style={{color: '#ffb347'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
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

export const ClipMaskG: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="G · 裁剪 / 遮罩"
      index={active}
      total={CATEGORY_G.length}
      background="radial-gradient(circle at 50% 45%, #2a2410 0%, #161204 60%, #0c0a02 100%)"
    >
      {CATEGORY_G.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
