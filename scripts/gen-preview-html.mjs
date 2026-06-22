// 生成 docs/preview.html：按 A–L 分类网格陈列全部缩略图 + 编号/名称/公式，
// 人类用浏览器直接打开即可扫读全部效果、点开看大图。
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'docs', 'effects.json'), 'utf8'));
const {categories, effects, scenes} = manifest;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

const byCat = {};
for (const e of effects) (byCat[e.category] ??= []).push(e);

const sections = Object.keys(categories)
  .map((cat) => {
    const items = (byCat[cat] ?? [])
      .map(
        (e) => `
      <figure class="card" id="${e.category}${String(e.id).padStart(2, '0')}">
        <a href="${esc(e.thumbnail)}" target="_blank" rel="noopener">
          <img loading="lazy" src="${esc(e.thumbnail)}" alt="${esc(e.name)}" />
        </a>
        <figcaption>
          <span class="id">${e.category}${String(e.id).padStart(2, '0')}</span>
          <span class="name">${esc(e.name)}</span>
          <span class="en">${esc(e.enName)}</span>
          <code>${esc(e.formula)}</code>
        </figcaption>
      </figure>`
      )
      .join('');
    return `<section><h2>${cat} · ${esc(categories[cat])}</h2><div class="grid">${items}</div></section>`;
  })
  .join('\n');

const sceneRows = scenes
  .map((s) => `<tr><td><code>${esc(s.id)}</code></td><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${s.stacks ? '是' : '否'}</td><td><code>${esc(s.propsKey)}</code></td></tr>`)
  .join('');

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>文字动效预览 · 100 法 + 场景</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; background: #05060d; color: #e7ecff; font-family: -apple-system, "PingFang SC", "Microsoft YaHei", Arial, sans-serif; }
  header { padding: 28px 28px 8px; }
  header h1 { margin: 0 0 6px; font-size: 24px; }
  header p { margin: 4px 0; color: #8ea0d6; font-size: 14px; }
  .filter { margin: 14px 0; }
  .filter input { width: 280px; max-width: 60vw; padding: 8px 12px; border-radius: 8px; border: 1px solid #2a3454; background: #0c1022; color: #e7ecff; font-size: 14px; }
  section { padding: 8px 28px 20px; }
  section h2 { font-size: 17px; color: #4aa3ff; border-bottom: 1px solid #1c2540; padding-bottom: 8px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .card { margin: 0; background: #0b0f1e; border: 1px solid #1c2540; border-radius: 10px; overflow: hidden; }
  .card img { width: 100%; display: block; aspect-ratio: 16/9; object-fit: cover; background: #0a0e1c; }
  figcaption { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 2px; }
  figcaption .id { color: #4aa3ff; font-weight: 800; font-size: 12px; }
  figcaption .name { font-weight: 700; font-size: 15px; }
  figcaption .en { color: #8ea0d6; font-size: 12px; }
  figcaption code { color: #b6c2ea; font-size: 11px; background: #0e1430; padding: 2px 6px; border-radius: 5px; margin-top: 4px; word-break: break-all; }
  table { border-collapse: collapse; width: 100%; font-size: 13px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #1c2540; }
  th { color: #8ea0d6; }
  a { color: inherit; text-decoration: none; }
  .hidden { display: none !important; }
</style>
</head>
<body>
<header>
  <h1>文字动效预览 · 100 法 + 场景模板</h1>
  <p>点击缩略图查看大图。动态总览见 <code>docs/thumbnails-contact-sheet.png</code>；动起来的预览墙渲染合成 <code>SceneWall</code>。</p>
  <p>交互式实时预览：<code>npm run dev</code> → 打开 <code>SceneThumb</code>，在右侧 schema 面板改 <code>effectId</code>(1–100)。</p>
  <div class="filter"><input id="q" type="search" placeholder="按编号 / 名称 / 公式过滤，如 K95、螺旋、spring" /></div>
</header>
${sections}
<section>
  <h2>场景模板（${scenes.length}）</h2>
  <table><thead><tr><th>合成 ID</th><th>名称</th><th>角色</th><th>堆叠</th><th>props</th></tr></thead><tbody>${sceneRows}</tbody></table>
</section>
<script>
  const q = document.getElementById('q');
  const cards = [...document.querySelectorAll('.card')];
  q.addEventListener('input', () => {
    const v = q.value.trim().toLowerCase();
    for (const c of cards) {
      const hit = !v || c.textContent.toLowerCase().includes(v);
      c.classList.toggle('hidden', !hit);
    }
    for (const s of document.querySelectorAll('section')) {
      const grid = s.querySelector('.grid');
      if (!grid) continue;
      const any = [...grid.querySelectorAll('.card')].some((c) => !c.classList.contains('hidden'));
      s.classList.toggle('hidden', !any);
    }
  });
</script>
</body>
</html>
`;

const out = join(root, 'docs', 'preview.html');
writeFileSync(out, html);
console.log(`wrote ${effects.length} effects + ${scenes.length} scenes -> ${out}`);
