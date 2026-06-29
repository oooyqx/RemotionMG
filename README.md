<p align="right"><strong>简体中文</strong> · <a href="./README.en.md">English</a></p>

# RemotionMG · 文字动效库 + 场景模板

> 用 [Remotion](https://www.remotion.dev/) 做的文字进出场动效系统：**100 个纯动效原子**（不同数学表达 × 创意）+ **9 个场景模板**。
> 两层解耦——*效果只管「一段文字怎么进/怎么出」，场景只管「布局/角色/停留/堆叠」*——任意效果可插进任意场景。
> 全部场景 **props 化**，其他 AI / 程序**零改代码、传 JSON 即可出片**。

![wall](docs/media/wall.webp)

> 上图：`SceneWall` 动态预览墙——100 个效果在网格里同步循环。整库一图速览见 [`docs/thumbnails-contact-sheet.png`](docs/thumbnails-contact-sheet.png)。

---

## 30 秒上手

```bash
npm i
npm run dev          # 打开 Remotion Studio，左侧选合成预览/调 props
# 渲染任意场景（传 JSON props，无需改代码）：
npx remotion render src/index.ts SceneHero out.mp4 \
  --props='{"entries":[{"text":"你的标题","effectId":21}],"timing":{"inF":22,"holdF":40,"outF":18},"background":"#101225","color":"#fff","fontSize":200}'
```

- **想看有哪些效果**：[`docs/preview.html`](docs/preview.html)（浏览器打开，可搜索/点开大图）或 [`docs/effects.json`](docs/effects.json)（机读）。
- **想让 AI 调用**：读 [`docs/ai-usage.md`](docs/ai-usage.md)（每个场景的 props 示例，拷贝即用）。
- **想了解设计/数学**：读 [`docs/font-entrance-effects-100.md`](docs/font-entrance-effects-100.md)（100 法的效果/公式/创意变体）。

---

## 主题配置器 · 零代码出片

打开 [`docs/configurator.html`](docs/configurator.html)（纯静态 HTML，浏览器直接打开即可），在可视化界面中完成所有配置：

1. **选主题** — 5 个预设（故障赛博 / 柔和聚焦 / 活力弹跳 / 极简打字 / 优雅衬线），一键切换配色、字体、动效风格
2. **编辑内容** — 按场景角色（主标题 / 列表 / 角标 / 字幕 / 强调）填写文字
3. **调参数** — 时序滑块（入场/停留/出场帧数）、配色覆盖、逐场景动效覆盖
4. **悬浮预览动效** — 鼠标悬浮在动效下拉选项上时，预览区立即切换到该效果并重播；移开恢复原值，点击才永久应用
5. **选择字体** — 内置 13 种常用字体 + 「读取本机字体」按钮（Font Access API），一键加载系统全部字体族
6. **实时预览** — 右侧画布同步播放动画效果
7. **导出 ZIP** — 点击一个按钮，得到**自包含的 Remotion 项目**

### 自包含 ZIP 导出

导出的 ZIP 是一个**完整可运行的 Remotion 项目**，不需要克隆本仓库：

```
theme-glitch/
├── theme.json              ← 主题配置（唯一需要修改的文件）
├── AI_INSTRUCTIONS.md      ← AI 使用指南（含 effectId 速查表）
├── README.md               ← 人类使用说明
├── package.json            ← 依赖声明
├── tsconfig.json / remotion.config.ts
└── src/                    ← 完整渲染引擎源码
    ├── index.ts, Root.tsx
    ├── effects/            ← 100 个动效原子
    └── textfx/             ← 场景组件 + 类型 + 主题定义
```

使用方式：

```bash
# 解压后
npm install
npx remotion render src/index.ts SceneTheme out.mp4 --props=@theme.json
# 或启动交互式预览
npm run dev
```

#### 智能场景裁剪

ZIP 只包含你实际配置了内容的场景组件。例如只填了主标题和字幕 → ZIP 中不会出现 `ListScene.tsx`、`LowerThirdScene.tsx`、`EmphasisScene.tsx`，包体更小、结构更清晰。

#### AI 友好

导出的 `AI_INSTRUCTIONS.md` 包含：
- 一键渲染命令
- `theme.json` 配置项说明（改文字、换主题、调时序、覆盖配色/动效）
- effectId 1-100 分类速查表（A-L 共 12 族）
- Remotion Studio 交互预览方法
- 高级渲染格式（MP4 / GIF / PNG 序列）

将 ZIP 解压后整个文件夹丢给 AI，AI 读 `AI_INSTRUCTIONS.md` 即可理解如何使用和修改。

---

## 架构：效果原子 × 场景模板

```
                ┌──────────────── 100 个动效原子 (src/textfx/library.tsx) ────────────────┐
                │  A 透明度曲线 · B 缓动位移 · C 3D形变 · D 模糊滤镜 · E 三角波动           │
   TextEffect → │  F 逐字交错 · G 裁剪遮罩 · H 噪声随机 · I 粒子重组 · J 颜色光影           │
   (纯进/出)    │  K 故障信号 · L 分形混沌                                                  │
                └──────────────────────────────┬───────────────────────────────────────────┘
                                                │  effectId ∈ [1,100]
                ┌──────────────────────────────▼───────────────── 9 个场景模板 (scenes/) ──┐
                │  Hero 主标题 · Caption 字幕 · List 逐条 · LowerThird 角标 · Emphasis 强调  │
                │  Gallery 目录陈列 · Reel 串联成片 · Thumb 缩略图 · Wall 动态预览墙         │
                └───────────────────────────────────────────────────────────────────────────┘
```

每个动效原子只实现一个函数——给定阶段 `phase ∈ {'in','out'}` 与进度 `t ∈ [0,1]`，返回作用在文字上的视觉：

```ts
type TextEffect = {
  id; category; name; enName; formula;
  visual(a: {text; phase; t; frame; seed}): {wrapper?: CSSProperties; content?: ReactNode};
};
// 统一在场度：presence(phase, t) = phase === 'in' ? ease(t) : 1 - ease(t)
```

场景模板负责布局/角色/停留/堆叠，调用 `<TextFx effect={...} phase t .../>` 渲染。
同一个原子（如「乱码解码」`effectId=72`）可同时做炸裂标题（Hero）、柔和字幕（Caption）、关键词高亮（Emphasis）。

---

## 场景一览（含预览）

| 合成 ID | 角色 | props 入口 | 预览 |
|---|---|---|---|
| `SceneHero` | 主标题：单段超大居中、戏剧化进出 | `entries[]` | 见下 |
| `SceneCaption` | 字幕：下三分之一、快速进出/原地替换 | `lines[]` | 见下 |
| `SceneList` | 逐条列表：条目依次入场并持续累积 | `items[]` | 见下 |
| `SceneLowerThird` | 角标/署名：左下品牌条、滑入停留滑出 | `entries[]` | 见下 |
| `SceneEmphasis` | 行内强调：句中某词高亮登场 | `lines[]` | 见下 |
| `SceneGallery` | 目录陈列：顺序陈列效果库 + 历史栈 | `effectIds[]` | 见下 |
| `SceneReel` | 串联成片：多场景按顺序拼成完整成片 | `segments[]` | 见下 |
| `SceneThumb` | 缩略图：单原子静态预览 | `effectId` | — |
| `SceneWall` | 动态预览墙：全部效果网格同步循环 | `effectIds[]` | 见顶部 |

### Hero · 主标题
![hero](docs/media/hero.webp)

### Caption · 字幕
![caption](docs/media/caption.webp)

### List · 逐条列表
![list](docs/media/list.webp)

### LowerThird · 角标/署名
![lowerthird](docs/media/lowerthird.webp)

### Emphasis · 行内强调
![emphasis](docs/media/emphasis.webp)

### Gallery · 目录陈列
![gallery](docs/media/gallery.webp)

### Reel · 串联成片（片头 → 列表 → 角标 → 字幕 → 强调 → 结尾）
![reel](docs/media/reel.webp)

---

## 场景可配置参数

每个场景除了 `entries/lines/items`（文字 + `effectId`）外，还可用以下**可选** props 定义排版与位置（不传即用默认值，向后兼容）：

| 参数 | 类型 | 含义 | 适用场景 |
|---|---|---|---|
| `fontSize` | number | 字号(px) | 全部文字场景 |
| `fontWeight` | number | 字重(100–900) | Hero/Caption/List/Emphasis/LowerThird |
| `fontFamily` | string | 字体族 | 同上 |
| `letterSpacing` | number | 字间距(px) | 同上 |
| `align` | `'left'\|'center'\|'right'` | 水平对齐 | Hero/Caption/Emphasis |
| `vAlign` | `'top'\|'center'\|'bottom'` | 垂直对齐 | Hero |
| `offsetX` / `offsetY` | number | 位置偏移(px) | Hero/Caption/LowerThird |
| `subSize` / `subColor` | number / string | 副标题字号/颜色 | Hero |
| `showLabel` | boolean | 是否显示左上角场景标签 | 全部 |
| `background` / `color` / `accent` | string | 背景/前景/强调色 | 各场景 |

示例（左对齐、置顶、细体、青色、自定字号 + 位置）：

```bash
npx remotion render src/index.ts SceneHero out.mp4 --props='{
  "entries":[{"text":"左上角标题","sub":"custom","effectId":21}],
  "timing":{"inF":22,"holdF":40,"outF":18},
  "background":"#0c0e1c","color":"#7fe3ff",
  "fontSize":120,"fontWeight":400,"letterSpacing":8,
  "align":"left","vAlign":"top","offsetX":40,"offsetY":20,"showLabel":false
}'
```

## 给其他 AI 调用

1. 读 [`docs/effects.json`](docs/effects.json) 选 `effectId`（每条含 `category/name/enName/formula/thumbnail`）。
2. 读 [`docs/ai-usage.md`](docs/ai-usage.md) 取对应场景的 props 形状。
3. 渲染：`npx remotion render src/index.ts <SceneId> out.mp4 --props='<JSON>'`，时长由 `calculateMetadata` 按 props 自动计算。

**串联成片**（一条命令出整片）：

```bash
npx remotion render src/index.ts SceneReel reel.mp4 --props='{
  "segments":[
    {"type":"hero","props":{"entries":[{"text":"片头","effectId":21}],"timing":{"inF":20,"holdF":34,"outF":16},"background":"#0c0e1c","color":"#fff","fontSize":150}},
    {"type":"caption","props":{"lines":[{"text":"一句解说","effectId":51}],"timing":{"inF":10,"holdF":44,"outF":8},"background":"#0a1020","barColor":"rgba(10,14,26,0.72)","color":"#f2f6ff","fontSize":60}},
    {"type":"hero","props":{"entries":[{"text":"谢谢观看","effectId":34}],"timing":{"inF":20,"holdF":36,"outF":18},"background":"#0c0e1c","color":"#fff","fontSize":170}}
  ]
}'
```

---

## 快速选效果（人类）

| 方式 | 文件 / 命令 | 适合 |
|---|---|---|
| 静态总览墙 | [`docs/thumbnails-contact-sheet.png`](docs/thumbnails-contact-sheet.png) | 一图扫读全部 100 个中段状态 |
| 可点击预览页 | [`docs/preview.html`](docs/preview.html) | 分类网格 + 搜索 + 点开大图 |
| 动态预览墙 | `SceneWall` 合成 | 看全部"动起来"的样子 |
| 交互式实时 | `npm run dev` → `SceneThumb` 改 `effectId` | 逐个实时预览 |

---

## 目录结构

```
src/textfx/
  types.ts            核心类型 Phase / TextEffect / EffectVisualArgs
  shared.tsx          共享构件 presence / PerChar / Scramble / 数学工具
  library.tsx         100 个动效原子（导出 EFFECTS / effectById）
  TextFx.tsx          渲染器：组合「效果原子 + 场景 baseStyle」
  schemas.ts          各场景 Zod schema + 时长函数
  presets.ts          各场景默认 props（即 AI 调用范例）
  manifest.ts         机读清单数据源（含 thumbnail 路径）
  index.ts            统一 barrel 出口
  scenes/             9 个场景模板
docs/
  configurator.html              主题配置器（可视化配置 + 自包含 ZIP 导出）
  font-entrance-effects-100.md   100 法设计 + 数学公式参考
  ai-usage.md                    AI 调用指南（props 示例）
  effects.json                   机读清单（100 法 + 9 场景）
  preview.html                   可点击预览页
  thumbnails/                    100 张效果缩略图
  thumbnails-contact-sheet.png   缩略图总览
  media/                         README/文档内嵌的场景预览动画
scripts/
  gen-manifest.ts     生成 effects.json
  gen-thumbnails.mjs  批量渲染 100 张缩略图
  gen-preview-html.mjs 生成 preview.html
```

## 常用命令

```bash
npm run dev             # Remotion Studio 预览
npm run typecheck       # tsc --noEmit
npm run gen:manifest    # 重新生成 docs/effects.json
npm run gen:thumbnails  # 重新渲染 100 张缩略图（需先 npm i）
npm run gen:preview     # 重新生成 docs/preview.html
```
