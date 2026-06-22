import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_C} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * C 类 · 缩放 · 形变 · 3D — 体量与纵深
 *  入场：偶数弹簧 Pop（scale 0→1 过冲），奇数绕 Y 轴翻牌从纵深推出
 *  出场：沿 Z 轴后退缩小入景深 + 轻微 rotateY
 *  堆栈：透视卡牌堆，越旧越远（translateZ 更负）越小越偏上
 */

const MAX_HIST = 5;

const Item: React.FC<{item: ShowItem; index: number; frame: number; fps: number}> = ({
  item,
  index,
  frame,
  fps,
}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  let tz: number;
  let scale = 1;
  let rotateY = 0;
  let scaleX = 1;
  let scaleY = 1;
  let opacity = 1;

  if (isFeatured) {
    opacity = clamp01(revealT * 2.5);
    if (index % 2 === 0) {
      // 弹簧 Pop
      const localFrame = frame - index * SEG;
      const s = spring({frame: localFrame, fps, config: {damping: 9, stiffness: 130, mass: 0.9}});
      scale = s;
      tz = 0;
    } else {
      // 3D 翻牌从纵深推出
      const e = easeOutCubic(clamp01(revealT));
      rotateY = lerp(95, 0, e);
      tz = lerp(-700, 0, e);
    }
  } else {
    // 出场：沿 Z 轴后退；堆栈：向后上方退去的透视卡牌堆（让位给主角）
    const t1 = move;
    const depth = Math.max(0, m - 1);
    tz = lerp(0, -360, t1) - depth * 260;
    rotateY = lerp(0, 14, t1);
    scale = 1; // 缩小完全交给 translateZ + 透视
    opacity =
      m > MAX_HIST - 1
        ? clamp01(MAX_HIST - m)
        : lerp(1, 0.5, clamp01(depth / 2.5));
  }

  // 历史卡牌整体上移并轻微左偏，露出层叠的卡顶，避免压住主角
  const yOffset = isFeatured ? 0 : -lerp(0, 210, move) - Math.max(0, m - 1) * 66;
  const xOffset = isFeatured ? 0 : -lerp(0, 34, move) - Math.max(0, m - 1) * 10;

  return (
    <div
      style={{
        position: 'absolute',
        left: FOCAL.x + xOffset,
        top: FOCAL.y + yOffset,
        transform: `translate(-50%,-50%) translateZ(${tz}px) rotateY(${rotateY}deg) scale(${scale}) scale(${scaleX}, ${scaleY})`,
        transformStyle: 'preserve-3d',
        opacity,
        whiteSpace: 'nowrap',
        textAlign: 'center',
        zIndex: index,
        color: isFeatured ? '#ffffff' : '#9fb0e0',
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          padding: isFeatured ? 0 : '14px 30px',
          borderRadius: isFeatured ? 0 : 16,
          background: isFeatured ? 'transparent' : 'rgba(26,36,68,0.82)',
          border: isFeatured ? 'none' : '1px solid rgba(120,150,220,0.3)',
          boxShadow: isFeatured ? 'none' : '0 18px 50px rgba(0,0,0,0.5)',
          textShadow: isFeatured ? '0 16px 70px rgba(120,90,255,0.4)' : 'none',
        }}
      >
        <span style={{color: '#a06bff'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
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

export const ScaleTransform3DC: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="C · 缩放 / 形变 / 3D"
      index={active}
      total={CATEGORY_C.length}
      background="radial-gradient(circle at 50% 40%, #241a44 0%, #120c22 60%, #08060f 100%)"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: 1600,
          transformStyle: 'preserve-3d',
        }}
      >
        {CATEGORY_C.map((item, i) => (
          <Item key={item.id} item={item} index={i} frame={frame} fps={fps} />
        ))}
      </div>
    </ShowcaseChrome>
  );
};
