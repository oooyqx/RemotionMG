import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ShowcaseChrome, FOCAL} from '../components/ShowcaseChrome';
import {CATEGORY_I} from '../effects/categories';
import {clamp01, itemTiming, lerp, rand2, easeOutCubic, smoothstep, SEG, ShowItem} from '../effects/showcaseKit';

/**
 * I 类 · 粒子 · 分解重组 — 聚散
 *  入场：四散粒子飞入聚合，文字在粒子收拢后显形
 *  出场：文字炸成粒子向外飞散
 *  堆栈：小型文字 + 少量环绕碎屑，漂浮在"碎屑场"中
 */

const N_PART = 64;
const MAX_HIST = 5;

const Particles: React.FC<{index: number; revealT: number; move: number; isFeatured: boolean}> = ({
  index,
  revealT,
  move,
  isFeatured,
}) => {
  const dots = [];
  for (let k = 0; k < N_PART; k++) {
    const ang = rand2(index * 50 + k, 1) * Math.PI * 2;
    const spawnR = 500 + rand2(index * 50 + k, 2) * 500;
    // 目标：文字附近的椭圆带
    const tAng = (k / N_PART) * Math.PI * 2;
    const tx = Math.cos(tAng) * (260 + rand2(k, 3) * 60);
    const ty = Math.sin(tAng) * (70 + rand2(k, 4) * 30);
    let dx: number;
    let dy: number;
    let op: number;
    if (isFeatured) {
      const e = easeOutCubic(clamp01(revealT * 1.1));
      dx = lerp(Math.cos(ang) * spawnR, tx, e);
      dy = lerp(Math.sin(ang) * spawnR, ty, e);
      op = (1 - smoothstep(0.6, 0.95, revealT)) * 0.9;
    } else {
      // 炸开
      dx = tx + Math.cos(ang) * move * 1100;
      dy = ty + Math.sin(ang) * move * 1100;
      op = clamp01(1 - move) * 0.8;
    }
    dots.push(
      <div
        key={k}
        style={{
          position: 'absolute',
          left: dx,
          top: dy,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: k % 3 === 0 ? '#ffd166' : '#ff7b54',
          opacity: op,
          boxShadow: '0 0 8px rgba(255,150,80,0.8)',
        }}
      />,
    );
  }
  return <>{dots}</>;
};

const Item: React.FC<{item: ShowItem; index: number; frame: number}> = ({item, index, frame}) => {
  const {d, m, isFeatured, revealT, move} = itemTiming(frame, index);
  if (d < 0) return null;

  if (isFeatured || m < 1) {
    const textOp = isFeatured ? smoothstep(0.55, 0.92, revealT) : clamp01(1 - move * 2);
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
        }}
      >
        <Particles index={index} revealT={revealT} move={move} isFeatured={isFeatured} />
        <div
          style={{
            fontSize: 150,
            fontWeight: 900,
            fontFamily: 'Arial, "PingFang SC", sans-serif',
            lineHeight: 1,
            color: '#ffffff',
            opacity: textOp,
            textShadow: '0 0 50px rgba(255,160,80,0.5)',
          }}
        >
          <span style={{color: '#ff8c42'}}>{String(item.id).padStart(2, '0')}</span> {item.name}
        </div>
        <div style={{opacity: isFeatured ? clamp01((revealT - 0.7) / 0.3) : 0, marginTop: 16}}>
          <div style={{fontSize: 30, color: '#7fd1c0', fontFamily: 'monospace'}}>{item.enName}</div>
          <div style={{fontSize: 30, color: '#f7b733', fontFamily: 'monospace', marginTop: 8}}>
            {item.formula}
          </div>
        </div>
      </div>
    );
  }

  // 历史 = 漂浮碎屑场中的小字
  const cx = 380 + rand2(index, 11) * 1160;
  const cy = 170 + rand2(index, 12) * 250;
  const driftX = Math.cos(frame * 0.03 + index) * 12;
  const driftY = Math.sin(frame * 0.035 + index * 2) * 12;
  const opacity = m > MAX_HIST - 1 ? clamp01(MAX_HIST - m) : 0.85;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx + driftX,
        top: cy + driftY,
        transform: 'translate(-50%,-50%) scale(0.34)',
        opacity,
        zIndex: index,
        whiteSpace: 'nowrap',
        color: '#caa07a',
        fontWeight: 900,
        fontSize: 130,
        fontFamily: 'Arial, "PingFang SC", sans-serif',
      }}
    >
      {String(item.id).padStart(2, '0')} {item.name}
    </div>
  );
};

export const ParticleI: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.floor(frame / SEG);
  return (
    <ShowcaseChrome
      label="I · 粒子 / 重组"
      index={active}
      total={CATEGORY_I.length}
      background="radial-gradient(circle at 50% 45%, #2a1c0c 0%, #160f06 60%, #0a0703 100%)"
    >
      {CATEGORY_I.map((item, i) => (
        <Item key={item.id} item={item} index={i} frame={frame} />
      ))}
    </ShowcaseChrome>
  );
};
