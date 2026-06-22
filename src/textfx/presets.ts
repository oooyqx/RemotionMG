import {effectById} from './library';
import {
  HeroProps,
  CaptionProps,
  ListProps,
  LowerThirdProps,
  EmphasisProps,
  GalleryProps,
} from './schemas';
import {EFFECTS} from './library';

/** 各场景的默认 props（Remotion defaultProps / Studio 初始值，也是 AI 调用的范例）。 */

export const HERO_DEFAULT: HeroProps = {
  entries: [
    {text: '弹簧弹出', effectId: 21},
    {text: '旋转缩放螺入', effectId: 23},
    {text: '辉光绽放', effectId: 34},
    {text: '螺旋极坐标', effectId: 47},
    {text: '粒子聚合', effectId: 81},
    {text: '乱码解码', effectId: 72},
    {text: 'RGB撕裂故障', effectId: 95},
    {text: '混沌吸引子归位', effectId: 99},
  ].map((e) => ({...e, sub: `${effectById(e.effectId).enName} · ${effectById(e.effectId).formula}`})),
  timing: {inF: 22, holdF: 40, outF: 18},
  background: 'radial-gradient(circle at 50% 42%, #1b1f3a 0%, #0c0e1c 60%, #05060d 100%)',
  color: '#ffffff',
  fontSize: 200,
};

export const CAPTION_DEFAULT: CaptionProps = {
  lines: [
    {text: '同一个动效原子，可以插进任意场景。', effectId: 1},
    {text: '字幕场景强调可读性：快速进出、原地替换。', effectId: 11},
    {text: '打字机最适合解说词的逐字呈现。', effectId: 51},
    {text: '模糊聚焦让字幕柔和地浮现出来。', effectId: 31},
    {text: '这就是"效果库 + 场景模板"的解耦。', effectId: 72},
  ],
  timing: {inF: 10, holdF: 44, outF: 8},
  background: 'linear-gradient(180deg, #0a1020 0%, #0d1426 100%)',
  barColor: 'rgba(10,14,26,0.72)',
  color: '#f2f6ff',
  fontSize: 64,
};

export const LIST_DEFAULT: ListProps = {
  title: '效果库 + 场景模板',
  items: [
    {text: '动效原子：只描述一段文字怎么进/出', effectId: 11},
    {text: '场景模板：负责布局 / 停留 / 堆叠', effectId: 11},
    {text: 'Hero — 主标题，戏剧化进出', effectId: 11},
    {text: 'Caption — 字幕，可读性优先', effectId: 11},
    {text: 'List — 逐条列表，持续累积', effectId: 11},
    {text: 'Gallery — 目录陈列，浏览整库', effectId: 11},
  ],
  stepFrames: 22,
  inFrames: 18,
  background: 'linear-gradient(135deg, #101a33 0%, #0a1020 100%)',
  color: '#eaf0ff',
  fontSize: 70,
};

export const LOWER_THIRD_DEFAULT: LowerThirdProps = {
  entries: [
    {name: '林述白', role: '动态设计师 / Motion Designer', effectId: 12},
    {name: '上海 · 外滩', role: '实景拍摄地', effectId: 63},
    {name: '第三章', role: '场景模板的诞生', effectId: 31},
  ],
  timing: {inF: 16, holdF: 40, outF: 14},
  background: 'linear-gradient(120deg, #0b1530 0%, #0a0f1f 100%)',
  accent: '#ff7a3c',
};

export const EMPHASIS_DEFAULT: EmphasisProps = {
  lines: [
    {pre: '渲染速度提升了 ', token: '300%', post: '。', effectId: 21, accent: '#ffd23f'},
    {pre: '这是全场最', token: '关键', post: '的一步。', effectId: 34, accent: '#ff5d73'},
    {pre: '只需', token: '一行', post: '代码即可切换场景。', effectId: 72, accent: '#4ad9ff'},
  ],
  timing: {inF: 16, holdF: 42, outF: 12},
  background: 'radial-gradient(circle at 50% 50%, #161a2e 0%, #0a0c16 70%)',
  color: '#e7ecff',
  fontSize: 88,
};

export const GALLERY_DEFAULT: GalleryProps = {
  effectIds: EFFECTS.map((e) => e.id),
  background: 'radial-gradient(circle at 50% 42%, #16213f 0%, #0a0e1c 60%, #05060d 100%)',
  color: '#ffffff',
  fontSize: 150,
};
