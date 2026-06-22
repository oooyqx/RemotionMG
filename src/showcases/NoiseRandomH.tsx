import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_H} from '../effects/categories';
import {clamp01, itemTiming, lerp, rand2, noise1, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * H 类 · 噪声 · 随机 · 概率 — 不确定性
 *  入场：逐字"乱码解码"（随机字形跳变后锁定为真字）
 *  出场：按随机阈值溶解 + 抖动飞散
 *  堆栈：随机散落的抖动碎片，持续微跳变，按龄淡出
 */

const GLYPHS = 'アカサタナ01XΞΨ#%&@王金木水火土π∑∆◇▦';
const MAX_HIST = 6;

const randGlyph = (seed: number): string =>
  GLYPHS[Math.floor(rand2(Math.floor(seed), 7.3) * GLYPHS.length)] ?? '#';

const DecodeChars: React.FC<{text: string; revealT: number; frame: number; salt: number}> = ({
  text,
  revealT,
  frame,
  salt,
}) => {
  const chars = Array.from(text);
  const N = chars.length;
  return (
    <span>
      {chars.map((ch, j) => {
        const lock = (j / Math.max(N, 1)) * 0.8;
        const locked = revealT > lock + 0.12;
        const show = locked ? ch : randGlyph(frame * 0.5 + j * 31 + salt);
        return (
          <span key={j} style={{color: locked ? '#ffffff' : '#ff4d6d', opacity: revealT > lock ? 1 : 0.5}}>
            {show}
          </span>
        );
      })}
    </span>
  );
};

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT} = itemTiming(frame, index);
  if (d < 0) return null;

  if (isFeatured) {
    return (
      <div
        style={{
          position: 'absolute',
          left: FOCAL.x,
          top: FOCAL.y,
          transform: 'translate(-50%,-50%)',
          textAlign: 'center',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          fontFamily: '"Courier New", monospace',
        }}
      >
        <div style={{fontSize: 146, fontWeight: 900, lineHeight: 1, textShadow: '0 0 40px rgba(255,77,109,0.4)'}}>
          <span style={{color: '#ff4d6d'}}>{String(item.id).padStart(2, '0')} </span>
          <DecodeChars text={item.name} revealT={revealT} frame={frame} salt={index * 100} />
        </div>
        <div style={{opacity: clamp01((revealT - 0.55) / 0.4), marginTop: 18}}>
          <div style={{fontSize: 30, color: '#7fd1c0'}}>{item.enName}</div>
          <div style={{fontSize: 30, color: '#f7b733', marginTop: 8}}>{item.formula}</div>
        </div>
      </div>
    );
  }

  // 历史 = 随机散落抖动碎片
  const px = 360 + rand2(index, 1) * 1200;
  const py = 170 + rand2(index, 2) * 260;
  const jx = noise1(frame * 0.08 + index * 10) * 14;
  const jy = noise1(frame * 0.08 + index * 10 + 50) * 14;
  // 背景队列中的碎片按龄逐渐透明
  const opacity = clamp01(1 - (m - 1) / (MAX_HIST - 1)) * 0.85;
  const flick = rand2(Math.floor(frame / 3), index) > 0.12 ? 1 : 0.35;
  return (
    <div
      style={{
        position: 'absolute',
        left: px + jx,
        top: py + jy,
        transform: `translate(-50%,-50%) scale(0.34) rotate(${(rand2(index, 3) - 0.5) * 16}deg)`,
        opacity: opacity * flick,
        zIndex: index,
        whiteSpace: 'nowrap',
        fontFamily: '"Courier New", monospace',
        fontWeight: 900,
        fontSize: 120,
        color: '#9a6b7d',
      }}
    >
      {String(item.id).padStart(2, '0')} {item.name}
    </div>
  );
};

export const NoiseRandomH: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="H · 噪声 / 随机"
      index={active}
      total={CATEGORY_H.length}
      background="radial-gradient(circle at 50% 45%, #2a1020 0%, #160812 60%, #0c040a 100%)"
    >
      {CATEGORY_H.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
