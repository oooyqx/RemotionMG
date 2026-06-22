import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_F} from '../effects/categories';
import {clamp01, itemTiming, lerp, easeOutCubic, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * F 类 · 逐字符 · 交错编排 — 逐字节奏
 *  入场：逐字符级联（打字机/cascade），每字带 stagger 偏移上浮
 *  出场：字距坍缩 + 整体缩小上移
 *  堆栈：终端式日志行，向上滚动（等宽绿字，前缀 ">"）
 */

const LOG_BOTTOM_Y = 330;
const LOG_X = 120;
const LOG_LINE_H = 64;
const MAX_HIST = 5;

const FeaturedChars: React.FC<{text: string; revealT: number}> = ({text, revealT}) => {
  const chars = Array.from(text);
  const N = chars.length;
  return (
    <span>
      {chars.map((ch, j) => {
        const cp = clamp01((revealT * 1.35 - (j / Math.max(N, 1)) * 0.85) / 0.28);
        return (
          <span
            key={j}
            style={{
              display: 'inline-block',
              opacity: cp,
              transform: `translateY(${lerp(46, 0, cp)}px)`,
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  if (isFeatured) {
    return (
      <div
        style={{
          position: 'absolute',
          left: FOCAL.x,
          top: FOCAL.y,
          transform: `translate(-50%,-50%) scale(${lerp(1, 0.9, move)})`,
          letterSpacing: lerp(2, -60, move), // 出场前的字距坍缩起点
          opacity: 1,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          zIndex: 1000,
          color: '#ffffff',
          fontFamily: '"Courier New", monospace',
        }}
      >
        <div style={{fontSize: 150, fontWeight: 900, lineHeight: 1}}>
          <span style={{color: '#39e06a'}}>{String(item.id).padStart(2, '0')} </span>
          <FeaturedChars text={item.name} revealT={revealT} />
          <span
            style={{
              opacity: Math.sin(frame * 0.4) > 0 ? 1 : 0.15,
              color: '#39e06a',
              marginLeft: 6,
            }}
          >
            ▋
          </span>
        </div>
        <div style={{opacity: clamp01((revealT - 0.5) / 0.4), marginTop: 18}}>
          <div style={{fontSize: 30, color: '#7fd1c0'}}>{item.enName}</div>
          <div style={{fontSize: 30, color: '#f7b733', marginTop: 8}}>{item.formula}</div>
        </div>
      </div>
    );
  }

  // 历史 = 终端日志行，向上滚动
  const t1 = move;
  const y = lerp(FOCAL.y, LOG_BOTTOM_Y, easeOutCubic(t1)) - Math.max(0, m - 1) * LOG_LINE_H;
  const opacity = (m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 1) * lerp(0.4, 1, clamp01(t1 * 2));
  return (
    <div
      style={{
        position: 'absolute',
        left: LOG_X,
        top: y,
        opacity,
        zIndex: index,
        fontFamily: '"Courier New", monospace',
        fontSize: 40,
        color: '#5fcf86',
        whiteSpace: 'nowrap',
        letterSpacing: 1,
      }}
    >
      <span style={{color: '#2f7d4c'}}>{'> '}</span>
      {String(item.id).padStart(2, '0')} {item.name}{' '}
      <span style={{color: '#2f7d4c', fontSize: 28}}>· {item.enName}</span>
    </div>
  );
};

export const PerCharStaggerF: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="F · 逐字符 / 交错"
      index={active}
      total={CATEGORY_F.length}
      background="radial-gradient(circle at 50% 45%, #0c2418 0%, #07140e 60%, #040a07 100%)"
    >
      {CATEGORY_F.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
