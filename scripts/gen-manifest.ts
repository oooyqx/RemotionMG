import {writeFileSync} from 'fs';
import {join} from 'path';
import {EFFECT_MANIFEST, SCENE_MANIFEST, CATEGORIES} from '../src/textfx/manifest';

const out = {
  $comment:
    'Auto-generated. 100 个文字动效原子 + 6 个场景模板的机读清单。渲染：npx remotion render <scene.id> out.mp4 --props=<json>',
  categories: CATEGORIES,
  effects: EFFECT_MANIFEST,
  scenes: SCENE_MANIFEST,
};

const path = join(process.cwd(), 'docs', 'effects.json');
writeFileSync(path, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${EFFECT_MANIFEST.length} effects + ${SCENE_MANIFEST.length} scenes -> ${path}`);
