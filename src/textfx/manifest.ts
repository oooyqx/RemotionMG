import {EFFECTS} from './library';

/** 机读的效果清单条目（不含渲染函数）。 */
export type EffectManifestEntry = {
  id: number;
  category: string;
  name: string;
  enName: string;
  formula: string;
};

/** 全部 100 个动效原子的机读清单，供其他 AI 查询「有哪些效果可用」。 */
export const EFFECT_MANIFEST: EffectManifestEntry[] = EFFECTS.map((e) => ({
  id: e.id,
  category: e.category,
  name: e.name,
  enName: e.enName,
  formula: e.formula,
}));

/** 各场景的机读说明（id 即 Remotion 合成 id）。 */
export type SceneManifestEntry = {
  id: string;
  name: string;
  role: string;
  stacks: boolean;
  propsKey: string;
};

export const SCENE_MANIFEST: SceneManifestEntry[] = [
  {id: 'SceneHero', name: '主标题', role: '单段超大居中、戏剧化进出', stacks: false, propsKey: 'entries[]'},
  {id: 'SceneCaption', name: '字幕', role: '下三分之一、快速进出/原地替换', stacks: false, propsKey: 'lines[]'},
  {id: 'SceneList', name: '逐条列表', role: '条目依次入场并持续累积', stacks: true, propsKey: 'items[]'},
  {id: 'SceneLowerThird', name: '角标/署名', role: '左下品牌条、滑入停留滑出', stacks: false, propsKey: 'entries[]'},
  {id: 'SceneEmphasis', name: '行内强调', role: '句中某词高亮登场', stacks: false, propsKey: 'lines[]'},
  {id: 'SceneGallery', name: '目录陈列', role: '顺序陈列效果库 + 历史栈', stacks: true, propsKey: 'effectIds[]'},
];

export const CATEGORIES: Record<string, string> = {
  A: '透明度 · 多项式与指数曲线',
  B: '缓动与方向位移',
  C: '缩放 · 形变 · 3D',
  D: '模糊 · 滤镜',
  E: '三角函数 · 波动',
  F: '逐字符 · 交错编排',
  G: '裁剪 · 遮罩',
  H: '噪声 · 随机',
  I: '粒子 · 重组',
  J: '颜色 · 光影',
  K: '故障 · 数字信号',
  L: '分形 · 混沌 · 高阶',
};
