// 批量渲染 100 个动效原子的预览缩略图到 docs/thumbnails/。
// 用法：node scripts/gen-thumbnails.mjs   （需先 npm i）
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync, readFileSync} from 'fs';
import {join} from 'path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'docs', 'effects.json'), 'utf8'));
const effects = manifest.effects;

const outDir = join(root, 'docs', 'thumbnails');
mkdirSync(outDir, {recursive: true});

console.log('bundling...');
const serveUrl = await bundle({entryPoint: join(root, 'src', 'index.ts')});

const comp = await selectComposition({serveUrl, id: 'SceneThumb', inputProps: {}});

let n = 0;
for (const e of effects) {
  const output = join(root, 'docs', e.thumbnail);
  const props = {
    effectId: e.id,
    background: 'radial-gradient(circle at 50% 45%, #1b2140 0%, #0a0e1c 70%)',
    color: '#ffffff',
    fontSize: 56,
  };
  await renderStill({
    serveUrl,
    composition: {...comp, width: 480, height: 270, props},
    output,
    frame: 0,
    inputProps: props,
    overwrite: true,
  });
  n += 1;
  if (n % 10 === 0) console.log(`  ${n}/${effects.length}`);
}
console.log(`done: ${n} thumbnails -> ${outDir}`);
