import React from 'react';
import {HeroScene, HeroEntry} from './scenes/HeroScene';
import {CaptionScene, CaptionLine} from './scenes/CaptionScene';
import {effectById} from './library';
import {slotLen, SeqTiming} from './scenes/sequence';

const HERO_TIMING: SeqTiming = {inF: 22, holdF: 40, outF: 18};
const CAPTION_TIMING: SeqTiming = {inF: 10, holdF: 44, outF: 8};

const HERO_ENTRIES: HeroEntry[] = [
  {text: '弹簧弹出', effectId: 21},
  {text: '旋转缩放螺入', effectId: 23},
  {text: '辉光绽放', effectId: 34},
  {text: '螺旋极坐标', effectId: 47},
  {text: '粒子聚合', effectId: 81},
  {text: '乱码解码', effectId: 72},
  {text: 'RGB撕裂故障', effectId: 95},
  {text: '混沌吸引子归位', effectId: 99},
].map((e) => ({...e, sub: `${effectById(e.effectId).enName} · ${effectById(e.effectId).formula}`}));

const CAPTION_LINES: CaptionLine[] = [
  {text: '同一个动效原子，可以插进任意场景。', effectId: 1},
  {text: '字幕场景强调可读性：快速进出、原地替换。', effectId: 11},
  {text: '打字机最适合解说词的逐字呈现。', effectId: 51},
  {text: '模糊聚焦让字幕柔和地浮现出来。', effectId: 31},
  {text: '这就是"效果库 + 场景模板"的解耦。', effectId: 72},
];

export const HeroDemo: React.FC = () => (
  <HeroScene entries={HERO_ENTRIES} timing={HERO_TIMING} />
);
export const HeroDemoFrames = HERO_ENTRIES.length * slotLen(HERO_TIMING);

export const CaptionDemo: React.FC = () => (
  <CaptionScene lines={CAPTION_LINES} timing={CAPTION_TIMING} />
);
export const CaptionDemoFrames = CAPTION_LINES.length * slotLen(CAPTION_TIMING);
