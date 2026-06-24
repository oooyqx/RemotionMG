/**
 * 主题包导出 —— 核心逻辑（浏览器 / Node 共享）。
 *
 * 给定一份 ThemeConfig（单一事实源），生成：
 *   1) theme.json  —— 配置本身
 *   2) README.md   —— 双语说明（渲染命令 + 配置摘要）
 *
 * 被 ThemeConfigurator（浏览器）和 scripts/export-theme.ts（CLI）共同使用。
 */

import {ThemeConfig, getTheme, themeConfigFrames, themeRoles, ThemeRole} from './themes';

/** 把 ThemeConfig 序列化为格式化 JSON 字符串。 */
export const generateThemeJson = (config: ThemeConfig): string =>
  JSON.stringify(config, null, 2) + '\n';

/** 计算配置摘要所需的信息。 */
const summarize = (config: ThemeConfig) => {
  const theme = getTheme(config.theme);
  const style = {...theme.style, ...config.style};
  const timing = config.timing ?? theme.timing;
  const order = config.order ?? themeRoles;
  const totalFrames = themeConfigFrames(config);
  const seconds = (totalFrames / 30).toFixed(1);

  const activeScenes = order.filter((role) => {
    const c = config.content;
    if (role === 'hero') return c.hero && c.hero.entries.length > 0;
    if (role === 'list') return c.list && c.list.items.length > 0;
    if (role === 'lowerThird') return c.lowerThird && c.lowerThird.entries.length > 0;
    if (role === 'caption') return c.caption && c.caption.lines.length > 0;
    if (role === 'emphasis') return c.emphasis && c.emphasis.lines.length > 0;
    return false;
  });

  return {theme, style, timing, order, activeScenes, totalFrames, seconds};
};

const sceneLabel: Record<ThemeRole, [string, string]> = {
  hero: ['主标题', 'Hero'],
  list: ['列表', 'List'],
  lowerThird: ['角标', 'Lower-third'],
  caption: ['字幕', 'Caption'],
  emphasis: ['强调', 'Emphasis'],
};

/** 生成双语 README.md 字符串。 */
export const generateReadme = (config: ThemeConfig): string => {
  const {theme, style, timing, activeScenes, totalFrames, seconds} = summarize(config);
  const themeJson = generateThemeJson(config);
  const renderCmd = `npx remotion render src/index.ts SceneTheme out.mp4 --props='${themeJson.trim()}'`;

  const sceneList = activeScenes
    .map((r) => `${sceneLabel[r][0]} (${sceneLabel[r][1]})`)
    .join(' → ');

  const contentSections: string[] = [];
  if (config.content.hero) {
    contentSections.push(
      `### 主标题 / Hero\n` +
        config.content.hero.entries
          .map((e) => `- **${e.text}**${e.sub ? ` — ${e.sub}` : ''}`)
          .join('\n')
    );
  }
  if (config.content.list) {
    contentSections.push(
      `### 列表 / List\n` +
        (config.content.list.title ? `*${config.content.list.title}*\n` : '') +
        config.content.list.items.map((it) => `- ${it.text}`).join('\n')
    );
  }
  if (config.content.lowerThird) {
    contentSections.push(
      `### 角标 / Lower-third\n` +
        config.content.lowerThird.entries
          .map((e) => `- **${e.name}** — ${e.role}`)
          .join('\n')
    );
  }
  if (config.content.caption) {
    contentSections.push(
      `### 字幕 / Caption\n` + config.content.caption.lines.map((l) => `- ${l.text}`).join('\n')
    );
  }
  if (config.content.emphasis) {
    contentSections.push(
      `### 强调 / Emphasis\n` +
        config.content.emphasis.lines
          .map((l) => `- ${l.pre}**${l.token}**${l.post}`)
          .join('\n')
    );
  }

  const hasStyleOverride = !!config.style;
  const hasTimingOverride = !!config.timing;
  const hasEffectOverride = !!config.effects;

  return `# 主题包 / Theme Package: ${theme.name} · ${theme.enName}

> ${theme.description}

## 渲染命令 / Render Command

\`\`\`bash
${renderCmd}
\`\`\`

> 也可用 \`--props=@theme.json\` 从文件读取。
> Alternatively, use \`--props=@theme.json\` to read from file.

## 配置摘要 / Config Summary

| 项目 / Item | 值 / Value |
|---|---|
| 主题 / Theme | \`${theme.id}\` — ${theme.name} / ${theme.enName} |
| 场景顺序 / Scenes | ${sceneList} |
| 时序 / Timing | 入场 ${timing.inF}f · 停留 ${timing.holdF}f · 出场 ${timing.outF}f${hasTimingOverride ? ' (已覆盖 / overridden)' : ''} |
| 总时长 / Duration | ${totalFrames}f (${seconds}s @ 30fps) |
| 背景 / Background | \`${style.background}\` |
| 前景 / Foreground | \`${style.color}\` |
| 强调 / Accent | \`${style.accent}\` |
| 字体 / Font | \`${style.fontFamily}\` · 字重 ${style.fontWeight} · 字间距 ${style.letterSpacing}${hasStyleOverride ? ' (已覆盖 / overridden)' : ''} |
| 动效覆盖 / Effect overrides | ${hasEffectOverride ? '是 / yes' : '否 / no'} |

## 内容 / Content

${contentSections.join('\n\n')}

## 文件 / Files

- \`theme.json\` — 单一事实源 / Single source of truth (the ThemeConfig)
- \`README.md\` — 本文件 / This file

## 用法 / Usage

1. **命令行渲染 / CLI render:**
   \`\`\`bash
   npx remotion render src/index.ts SceneTheme out.mp4 --props=@theme.json
   \`\`\`

2. **Remotion Studio:**
   \`npm run dev\` → 选择 \`SceneTheme\` 合成 → 在 props 面板粘贴 \`theme.json\` 内容。
   \`npm run dev\` → select \`SceneTheme\` composition → paste \`theme.json\` into the props panel.

3. **AI / 脚本调用 / AI / script usage:**
   \`\`\`bash
   npm run export:theme -- --config theme.json --out theme-package.zip
   \`\`\`
`;
};

/** 组合生成 theme.json + README.md。 */
export const exportThemePackage = (
  config: ThemeConfig
): {themeJson: string; readmeMd: string} => ({
  themeJson: generateThemeJson(config),
  readmeMd: generateReadme(config),
});
