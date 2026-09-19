// Run after changing Chinese copy; the resulting WOFF2 is served locally.
import {
  readdir,
  readFile,
  writeFile,
  access,
  mkdir,
  copyFile,
} from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

async function textIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const text = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory()
        ? textIn(path)
        : /\.(vue|ts|css)$/.test(path)
          ? readFile(path, 'utf8')
          : '';
    }),
  );
  return text.join('');
}
const content = (
  await Promise.all(['src'].map(textIn))
).join('');
const glyphs = [
  ...new Set(content.match(/[\p{Script=Han}，。；：、！？「」《》·—↗↘↑&]/gu)),
]
  .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  .join('');
const families = [
  ['Noto Serif SC', 'letter-serif', null],
  ['Ma Shan Zheng', 'letter-brush', 'mashanzheng'],
];
for (const [family, file, license] of families) {
  const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400&display=swap&text=${encodeURIComponent(glyphs)}`;
  const cssResponse = await fetch(cssURL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });
  if (!cssResponse.ok)
    throw new Error(`Font CSS ${family}: ${cssResponse.status}`);
  const css = await cssResponse.text();
  const fontURL = css.match(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/,
  )?.[1];
  if (!fontURL) throw new Error(`No Google Fonts asset returned for ${family}`);
  const fontResponse = await fetch(fontURL);
  if (!fontResponse.ok)
    throw new Error(`Font download: ${fontResponse.status}`);
  const bytes = Buffer.from(await fontResponse.arrayBuffer());
  if (bytes.subarray(0, 4).toString() !== 'wOF2')
    throw new Error('Expected WOFF2 font');
  await writeFile(`src/assets/${file}.woff2`, bytes);
  if (license) {
    const response = await fetch(
      `https://raw.githubusercontent.com/google/fonts/main/ofl/${license}/OFL.txt`,
    );
    if (!response.ok)
      throw new Error(`Font license ${family}: ${response.status}`);
    await writeFile(`public/fonts/${file}-OFL.txt`, await response.text());
  }
  console.log(
    `${family}: ${glyphs.length} glyphs; ${bytes.length} bytes; src/assets/${file}.woff2`,
  );
}

// GB supplies the full signature, including 喆, instead of falling back mid-name.
const gbDir = 'assets/font-sources/lxgw-wenkai-gb';
const gbFont = `${gbDir}/LXGWWenKaiGB-Regular.ttf`;
await mkdir(gbDir, { recursive: true });
for (const [path, url] of [
  [
    gbFont,
    'https://github.com/lxgw/LxgwWenkaiGB/releases/download/v1.522/LXGWWenKaiGB-Regular.ttf',
  ],
  [
    `${gbDir}/OFL.txt`,
    'https://raw.githubusercontent.com/lxgw/LxgwWenkaiGB/v1.522/OFL.txt',
  ],
]) {
  try {
    await access(path);
  } catch {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`LXGW GB source: ${response.status}`);
    await writeFile(path, Buffer.from(await response.arrayBuffer()));
  }
}
const subset = spawnSync(
  process.env.FONT_PYTHON || 'python3',
  [
    '-m',
    'fontTools.subset',
    gbFont,
    `--text=${glyphs}`,
    '--flavor=woff2',
    '--output-file=src/assets/letter-hand.woff2',
    '--layout-features=*',
    '--no-recalc-timestamp',
    '--recommended-glyphs',
  ],
  { encoding: 'utf8' },
);
if (subset.error || subset.status !== 0)
  throw new Error(subset.error?.message || subset.stderr);
await copyFile(`${gbDir}/OFL.txt`, 'public/fonts/letter-hand-OFL.txt');
console.log(
  `LXGW WenKai GB v1.522: ${glyphs.length} glyphs; ${(await readFile('src/assets/letter-hand.woff2')).length} bytes`,
);
