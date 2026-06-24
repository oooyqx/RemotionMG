#!/usr/bin/env node
/**
 * CLI: 导出主题包（theme.json + README.md → zip）
 *
 * 用法 / Usage:
 *   npm run export:theme -- --theme glitch --out theme-package.zip
 *   npm run export:theme -- --config my-theme.json --out theme-package.zip
 *   npm run export:theme -- --theme glitch --content '{"hero":{"entries":[{"text":"Hello"}]}}'
 *   npm run export:theme -- --theme glitch --dir ./output    (不打包，直接写文件)
 *
 * 参数 / Args:
 *   --theme <id>       主题 id (glitch/soft/bouncy/minimal/elegant)
 *   --config <path>    从 JSON 文件读取完整 ThemeConfig（与 --theme 互斥）
 *   --content <json>   内联 content JSON（与 --theme 搭配）
 *   --out <path>       输出 zip 路径（默认: theme-<id>.zip）
 *   --dir <path>       输出目录（不打包 zip，直接写 theme.json + README.md）
 *   --print            只打印到 stdout，不写文件
 */
import {readFileSync, writeFileSync, mkdirSync} from 'fs';
import {join, dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import {createZip} from '../src/textfx/zip';
import {exportThemePackage} from '../src/textfx/themeExport';
import {THEME_CONFIG_DEFAULT, DEMO_CONTENT, ThemeConfig} from '../src/textfx/themes';

const args = process.argv.slice(2);
const getArg = (name: string): string | undefined => {
  const i = args.indexOf('--' + name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : undefined;
};
const hasFlag = (name: string): boolean => args.includes('--' + name);

function parseArgs() {
  const configPath = getArg('config');
  const themeId = getArg('theme');
  const contentJson = getArg('content');
  const outPath = getArg('out');
  const dirPath = getArg('dir');
  const printOnly = hasFlag('print');

  let config: ThemeConfig;

  if (configPath) {
    const raw = readFileSync(resolve(process.cwd(), configPath), 'utf8');
    config = JSON.parse(raw);
  } else if (themeId) {
    let content = DEMO_CONTENT;
    if (contentJson) {
      content = JSON.parse(contentJson);
    }
    config = {theme: themeId, content};
  } else {
    config = THEME_CONFIG_DEFAULT;
  }

  return {config, outPath, dirPath, printOnly};
}

function main() {
  const {config, outPath, dirPath, printOnly} = parseArgs();
  const {themeJson, readmeMd} = exportThemePackage(config);

  if (printOnly) {
    console.log('=== theme.json ===');
    console.log(themeJson);
    console.log('\n=== README.md ===');
    console.log(readmeMd);
    return;
  }

  if (dirPath) {
    const absDir = resolve(process.cwd(), dirPath);
    mkdirSync(absDir, {recursive: true});
    writeFileSync(join(absDir, 'theme.json'), themeJson);
    writeFileSync(join(absDir, 'README.md'), readmeMd);
    console.log(`✓ Wrote theme.json + README.md to ${dirPath}/`);
    return;
  }

  const zipPath = outPath || `theme-${config.theme}.zip`;
  const absZipPath = resolve(process.cwd(), zipPath);
  const zipBytes = createZip({'theme.json': themeJson, 'README.md': readmeMd});
  writeFileSync(absZipPath, zipBytes);
  console.log(`✓ Wrote theme package to ${zipPath}`);
  console.log(`  theme: ${config.theme}`);
  console.log(`  files: theme.json, README.md`);
}

main();
