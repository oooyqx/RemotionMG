import React from 'react';
import {HeroScene, HeroEntry} from './scenes/HeroScene';
import {CaptionScene, CaptionLine} from './scenes/CaptionScene';
import {ListScene, ListItem, listTotalFrames} from './scenes/ListScene';
import {LowerThirdScene, LowerThirdEntry} from './scenes/LowerThirdScene';
import {EmphasisScene, EmphasisLine} from './scenes/EmphasisScene';
import {GalleryScene, galleryTotalFrames} from './scenes/GalleryScene';
import {EFFECTS, effectById} from './library';
import {slotLen, SeqTiming} from './scenes/sequence';

const HERO_TIMING: SeqTiming = {inF: 22, holdF: 40, outF: 18};
const CAPTION_TIMING: SeqTiming = {inF: 10, holdF: 44, outF: 8};
const LT_TIMING: SeqTiming = {inF: 16, holdF: 40, outF: 14};
const EM_TIMING: SeqTiming = {inF: 16, holdF: 42, outF: 12};

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

const LIST_ITEMS: ListItem[] = [
  {text: '动效原子：只描述一段文字怎么进/出', effectId: 11},
  {text: '场景模板：负责布局 / 停留 / 堆叠', effectId: 11},
  {text: 'Hero — 主标题，戏剧化进出', effectId: 11},
  {text: 'Caption — 字幕，可读性优先', effectId: 11},
  {text: 'List — 逐条列表，持续累积', effectId: 11},
  {text: 'Gallery — 目录陈列，浏览整库', effectId: 11},
];

const LT_ENTRIES: LowerThirdEntry[] = [
  {name: '林述白', role: '动态设计师 / Motion Designer', effectId: 12},
  {name: '上海 · 外滩', role: '实景拍摄地', effectId: 63},
  {name: '第三章', role: '场景模板的诞生', effectId: 31},
];

const EM_LINES: EmphasisLine[] = [
  {pre: '渲染速度提升了 ', token: '300%', post: '。', effectId: 21, accent: '#ffd23f'},
  {pre: '这是全场最', token: '关键', post: '的一步。', effectId: 34, accent: '#ff5d73'},
  {pre: '只需', token: '一行', post: '代码即可切换场景。', effectId: 72, accent: '#4ad9ff'},
];

export const HeroDemo: React.FC = () => <HeroScene entries={HERO_ENTRIES} timing={HERO_TIMING} />;
export const HeroDemoFrames = HERO_ENTRIES.length * slotLen(HERO_TIMING);

export const CaptionDemo: React.FC = () => <CaptionScene lines={CAPTION_LINES} timing={CAPTION_TIMING} />;
export const CaptionDemoFrames = CAPTION_LINES.length * slotLen(CAPTION_TIMING);

export const ListDemo: React.FC = () => (
  <ListScene title="效果库 + 场景模板" items={LIST_ITEMS} />
);
export const ListDemoFrames = listTotalFrames(LIST_ITEMS.length);

export const LowerThirdDemo: React.FC = () => <LowerThirdScene entries={LT_ENTRIES} timing={LT_TIMING} />;
export const LowerThirdDemoFrames = LT_ENTRIES.length * slotLen(LT_TIMING);

export const EmphasisDemo: React.FC = () => <EmphasisScene lines={EM_LINES} timing={EM_TIMING} />;
export const EmphasisDemoFrames = EM_LINES.length * slotLen(EM_TIMING);

export const GalleryDemo: React.FC = () => <GalleryScene effects={EFFECTS} />;
export const GalleryDemoFrames = galleryTotalFrames(EFFECTS.length);
