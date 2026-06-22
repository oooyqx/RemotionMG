import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {OPACITY_CURVES_A, OpacityCurve} from './effects/opacityCurves';

/**
 * A 类：透明度 · 多项式与指数曲线（1–10）的「全屏突出展示」合成。
 *
 * 不是字幕式网格对比，而是顺序播放的舞台动画：
 *  - 当前方式以超大字号在画面中下方登场，使用它自己的数学曲线"出现"；
 *  - 当下一段登场时，上一段缩小 + 旋转 + 滑到左侧，堆叠成历史栈；
 *  - 历史栈随新内容不断向下滚动，过旧的逐渐淡出。
 */

const SEG = 48; // 每个方式占据"主角"的帧数
const REVEAL_FRAC = 0.5; // 主角阶段中用于"出现"的比例（前一半做淡入）
const MAX_HIST = 5; // 左侧历史栈最多保留多少条

// 主角焦点位置（画面中下方，超大字）
const FOCAL_X = 960;
const FOCAL_Y = 600;
const FOCAL_SCALE = 1;

// 左侧历史栈
const STACK_X = 330;
const STACK_Y0 = 150;
const STACK_ROW = 92;
const STACK_SCALE = 0.32;
const STACK_ROT = -9; // 度

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const ShowcaseItem: React.FC<{curve: OpacityCurve; frame: number; index: number}> = ({
  curve,
  frame,
  index,
}) => {
  // d = 连续"出场序数"：d∈[0,1) 表示当前为主角，d≥1 表示已成为历史。
  const d = (frame - index * SEG) / SEG;
  if (d < 0) return null;

  const isFeatured = d < 1;
  // m：离开主角后的位移/堆叠量。主角阶段 m=0（保持不动），其后逐段增大。
  const m = Math.max(0, d - 1);
  const move = clamp01(m); // 0→1：从焦点滑向栈顶

  // 主角阶段用该曲线做"出现"；之后由历史淡出控制。
  const revealT = clamp01(d / REVEAL_FRAC);
  const revealStyle = curve.apply(revealT);

  // 历史过旧时淡出
  const pastFade = interpolate(m, [MAX_HIST - 1, MAX_HIST], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = isFeatured ? revealStyle.opacity : pastFade;

  // 位置 / 缩放 / 旋转：主角 → 左侧栈的连续过渡，过旧继续向下滚动。
  const x = lerp(FOCAL_X, STACK_X, move);
  const y = lerp(FOCAL_Y, STACK_Y0, move) + Math.max(0, m - 1) * STACK_ROW;
  const baseScale = lerp(FOCAL_SCALE, STACK_SCALE, move);
  const rot = lerp(0, STACK_ROT, move);

  // 主角出现时叠加该曲线自带的 transform（如双指数过冲的 scale）与 filter（如高斯闪现的 brightness）。
  const featuredScale =
    isFeatured && revealStyle.transform
      ? `${revealStyle.transform}`
      : '';
  const filter = isFeatured && revealStyle.filter ? revealStyle.filter : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: index, // 越新越靠上层
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${baseScale}) ${featuredScale}`,
        transformOrigin: 'center center',
        opacity,
        filter,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        color: isFeatured ? '#ffffff' : '#9aa7c7',
      }}
    >
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          letterSpacing: 2,
          fontFamily: 'Arial, "PingFang SC", "Noto Sans CJK SC", sans-serif',
          lineHeight: 1,
          textShadow: isFeatured ? '0 12px 60px rgba(233,69,96,0.35)' : 'none',
        }}
      >
        <span style={{color: '#e94560'}}>{String(curve.id).padStart(2, '0')}</span>{' '}
        {curve.name}
      </div>
      {/* 主角阶段才显示英文名与公式，进入历史栈后隐去以保持简洁 */}
      <div
        style={{
          opacity: isFeatured ? clamp01((revealT - 0.4) / 0.4) : 0,
          marginTop: 18,
        }}
      >
        <div
          style={{
            fontSize: 30,
            color: '#7fd1c0',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        >
          {curve.enName}
        </div>
        <div style={{fontSize: 34, color: '#f7b733', fontFamily: 'monospace', marginTop: 10}}>
          {curve.formula}
        </div>
      </div>
    </div>
  );
};

export const OpacityCurvesA: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const activeIndex = Math.min(OPACITY_CURVES_A.length - 1, Math.floor(frame / SEG));

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 35%, #1a2348 0%, #0b1020 60%, #070b16 100%)',
      }}
    >
      {/* 左上角极简标识，避免抢主角文字 */}
      <div
        style={{
          position: 'absolute',
          top: 48,
          left: 60,
          color: '#3c466b',
          fontFamily: 'monospace',
          fontSize: 20,
          letterSpacing: 2,
          opacity: 0.6,
        }}
      >
        A · 透明度曲线 {String(activeIndex + 1).padStart(2, '0')} / {OPACITY_CURVES_A.length}
      </div>

      {OPACITY_CURVES_A.map((curve, i) => (
        <ShowcaseItem key={curve.id} curve={curve} frame={frame} index={i} />
      ))}

      {/* 底部进度条 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: 5,
          width: `${(frame / durationInFrames) * 100}%`,
          background: 'linear-gradient(90deg,#e94560,#f7b733)',
        }}
      />
    </AbsoluteFill>
  );
};
