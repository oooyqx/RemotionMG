import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_B} from '../effects/categories';
import {
  clamp01,
  itemTiming,
  lerp,
  easeOutBack,
  easeInBack,
  easeOutCubic,
  ShowItem,
} from '../effects/showcaseKit';

/**
 * B 类 · 缓动与方向位移 — 方向感与惯性
 *  入场：从屏外某方向带 Back 过冲滑入 + 运动模糊
 *  出场：滑向底部"横向滑轨"，过渡段带运动模糊
 *  堆栈：底部横向滑轨，新者在右、随新内容整体左移，过旧淡出
 */

const RAIL_Y = 940;
const RAIL_RIGHT_X = 1760;
const RAIL_GAP = 46;
const RAIL_SCALE = 0.34;
const MAX_HIST = 5;

// 按文字实际长度估算滑轨上的占位宽度（避免长短不一互相叠加）
const estRailW = (it: ShowItem): number =>
  RAIL_SCALE * (150 + Array.from(it.name).length * 150);

const DIRS = [
  {x: 0, y: -1},
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: -1, y: 0},
];

const Item: React.FC<{
  item: ShowItem;
  index: number;
  frame: number;
  items: ShowItem[];
  active: number;
}> = ({item, index, frame, items, active}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  const dir = DIRS[index % DIRS.length];

  // 滑轨槽位中心 = 右端 - 右侧所有更新条目的占位宽度之和 - 自身半宽
  const railCenterX = (): number => {
    let acc = 0;
    for (let j = index + 1; j < active; j++) acc += estRailW(items[j]) + RAIL_GAP;
    return RAIL_RIGHT_X - acc - estRailW(item) / 2;
  };

  let x: number;
  let y: number;
  let scale: number;
  let rotate = 0;
  let blur = 0;
  let opacity = 1;

  if (isFeatured) {
    const e = easeOutBack(clamp01(revealT));
    x = lerp(FOCAL.x + dir.x * 1500, FOCAL.x, e);
    y = lerp(FOCAL.y + dir.y * 1100, FOCAL.y, e);
    scale = 1;
    opacity = clamp01(revealT * 2.2);
    blur = lerp(20, 0, easeOutCubic(clamp01(revealT)));
  } else {
    // 出场 → 底部横向滑轨
    const t1 = move; // 0→1 第一段：中心 → 轨道槽位
    const railX = railCenterX();
    x = lerp(FOCAL.x, railX, easeInBack(t1, 1.1));
    y = lerp(FOCAL.y, RAIL_Y, t1);
    scale = lerp(1, RAIL_SCALE, t1);
    rotate = 0;
    // 运动模糊：过渡中段最强
    blur = Math.sin(Math.PI * t1) * 16;
    opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})`,
        transformOrigin: 'center center',
        opacity,
        filter: blur > 0.2 ? `blur(${blur}px)` : 'none',
        whiteSpace: 'nowrap',
        textAlign: 'center',
        zIndex: index,
        color: isFeatured ? '#ffffff' : '#8ea0d6',
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          fontFamily: 'Arial, "PingFang SC", sans-serif',
          lineHeight: 1,
          textShadow: isFeatured ? '0 14px 60px rgba(64,160,255,0.35)' : 'none',
        }}
      >
        <span style={{color: '#4aa3ff'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
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

export const EasingMotionB: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / 48);
  return (
    <ShowcaseChrome
      label="B · 缓动与方向位移"
      index={active}
      total={CATEGORY_B.length}
      background="radial-gradient(circle at 50% 40%, #11294a 0%, #0a1424 60%, #070b16 100%)"
    >
      {CATEGORY_B.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} items={CATEGORY_B} active={active} />
      ))}
    </ShowcaseChrome>
  );
};
