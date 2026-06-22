import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_J} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * J 类 · 颜色 · 光影 — 色彩情绪
 *  入场：色相旋转 + 饱和度上升 + 流光扫过文字
 *  出场：去色 + 变暗，一道高光从上扫走
 *  堆栈：左侧灰阶小色板竖列（含色块），仅主角保留满色
 */

const SW_X = 380;
const SW_Y0 = 250;
const SW_STEP = 130;
const MAX_HIST = 6;

const hueOf = (id: number): number => (id * 47) % 360;

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  const hue = hueOf(item.id);

  if (isFeatured) {
    const e = easeOutCubic(clamp01(revealT));
    const bgPos = lerp(-120, 220, clamp01((revealT - 0.1) / 0.7)); // 流光扫过
    const filter = `hue-rotate(${lerp(120, 0, e)}deg) saturate(${lerp(0.55, 1.35, e)})`;
    // 出场高光扫走（move 阶段）
    return (
      <div
        style={{
          position: 'absolute',
          left: FOCAL.x,
          top: FOCAL.y,
          transform: 'translate(-50%,-50%)',
          zIndex: 1000,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          filter,
        }}
      >
        <div
          style={{
            fontSize: 152,
            fontWeight: 900,
            fontFamily: 'Arial, "PingFang SC", sans-serif',
            lineHeight: 1,
            backgroundImage:
              'linear-gradient(100deg,#ff5e7e 0%,#ffd166 25%,#5effc8 50%,#5ea0ff 75%,#c25eff 100%)',
            backgroundSize: '200% 100%',
            backgroundPosition: `${bgPos}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            opacity: clamp01(revealT * 3),
          }}
        >
          {String(item.id).padStart(2, '0')} {item.name}
        </div>
        <div style={{opacity: clamp01((revealT - 0.45) / 0.4), marginTop: 16}}>
          <div style={{fontSize: 30, color: '#7fd1c0', fontFamily: 'monospace'}}>{item.enName}</div>
          <div style={{fontSize: 30, color: '#f7b733', fontFamily: 'monospace', marginTop: 8}}>
            {item.formula}
          </div>
        </div>
      </div>
    );
  }

  // 历史 = 左侧灰阶色板竖列
  const t1 = move;
  const swY = SW_Y0 + Math.max(0, m - 1) * SW_STEP;
  const x = lerp(FOCAL.x, SW_X, easeOutCubic(t1));
  const y = lerp(FOCAL.y, swY, easeOutCubic(t1));
  const scale = lerp(1, 0.3, t1);
  const opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1;
  const sat = lerp(1, 0.12, t1); // 退场后去色成灰阶色卡
  const chipOpacity = clamp01((t1 - 0.6) / 0.3); // 缩小后才显出色块
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${scale})`,
        opacity,
        filter: `saturate(${sat}) brightness(${lerp(1, 0.8, t1)})`,
        zIndex: index,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        color: '#c8cdd8',
        fontWeight: 900,
        fontSize: 140,
        fontFamily: 'Arial, "PingFang SC", sans-serif',
      }}
    >
      <span
        style={{
          width: 90,
          height: 90,
          borderRadius: 12,
          background: `hsl(${hue},70%,55%)`,
          opacity: chipOpacity,
          flex: '0 0 auto',
        }}
      />
      {String(item.id).padStart(2, '0')} {item.name}
    </div>
  );
};

export const ColorLightJ: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="J · 颜色 / 光影"
      index={active}
      total={CATEGORY_J.length}
      background="radial-gradient(circle at 50% 40%, #161433 0%, #0c0a1e 60%, #06050f 100%)"
    >
      {CATEGORY_J.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
