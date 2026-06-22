import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {TextFx} from '../TextFx';
import {effectById} from '../library';
import {SeqTiming, seqAt} from './sequence';

/**
 * 场景 · Caption 字幕
 *  下三分之一、可读性优先：快速进出、原地替换，停留时长占多数。
 *  适合：对白字幕、解说词、轻量说明。同一时刻只有一条，不堆叠。
 */
export type CaptionLine = {text: string; effectId: number};

export const CaptionScene: React.FC<{
  lines: CaptionLine[];
  timing?: SeqTiming;
  background?: string;
  barColor?: string;
  color?: string;
  fontSize?: number;
}> = ({
  lines,
  timing = {inF: 10, holdF: 44, outF: 8},
  background = 'linear-gradient(180deg, #0a1020 0%, #0d1426 100%)',
  barColor = 'rgba(10,14,26,0.72)',
  color = '#f2f6ff',
  fontSize = 64,
}) => {
  const frame = useCurrentFrame();
  const {active, phase, t} = seqAt(frame, timing);
  const line = lines[Math.min(active, lines.length - 1)];
  const fx = line ? effectById(line.effectId) : null;

  return (
    <AbsoluteFill style={{background, fontFamily: 'Arial, "PingFang SC", sans-serif'}}>
      {/* 上方留白象征画面主体 */}
      <div style={{position: 'absolute', left: 60, top: 48, fontSize: 24, letterSpacing: 4, color: '#5b6688'}}>
        CAPTION · 下三分之一字幕
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 110,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: barColor,
            padding: '20px 48px',
            borderRadius: 14,
            maxWidth: 1500,
            textAlign: 'center',
            boxShadow: '0 18px 60px rgba(0,0,0,0.4)',
          }}
        >
          {fx && line ? (
            <TextFx
              key={active}
              effect={fx}
              text={line.text}
              phase={phase}
              t={t}
              frame={frame}
              seed={active + 1}
              baseStyle={{fontSize, fontWeight: 700, color, lineHeight: 1.2, whiteSpace: 'normal'}}
            />
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
