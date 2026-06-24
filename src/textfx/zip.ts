/**
 * 极简 ZIP 打包器 —— 零依赖，浏览器与 Node 均可用。
 *
 * 仅实现 STORE（无压缩），对于 JSON/MD 等文本文件足够。
 * 生成标准 ZIP 文件格式（兼容所有解压工具）。
 *
 * 参考：https://en.wikipedia.org/wiki/ZIP_(file_format)
 */

/* ---- CRC-32 (IEEE 802.3 polynomial) ---- */

const crcTable: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

const crc32 = (data: Uint8Array): number => {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
};

/* ---- Helpers ---- */

const u16 = (n: number): [number, number] => [n & 0xff, (n >>> 8) & 0xff];
const u32 = (n: number): [number, number, number, number] => [
  n & 0xff,
  (n >>> 8) & 0xff,
  (n >>> 16) & 0xff,
  (n >>> 24) & 0xff,
];

const pushBytes = (arr: number[], ...groups: number[][]): void => {
  for (const g of groups) arr.push(...g);
};

const strToBytes = (s: string): Uint8Array => new TextEncoder().encode(s);

/* ---- ZIP builder ---- */

type ZipEntry = {
  name: string;
  data: Uint8Array;
  crc: number;
  offset: number;
};

/**
 * 创建一个 ZIP 文件（STORE 模式，无压缩）。
 * @param files 文件名 → 文本内容
 * @returns Uint8Array — 完整的 ZIP 文件字节
 */
export const createZip = (files: Record<string, string>): Uint8Array => {
  const entries: ZipEntry[] = [];

  // 本地文件头 + 数据
  const localParts: number[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const data = strToBytes(content);
    const crc = crc32(data);
    const nameBytes = strToBytes(name);

    // Local file header (30 bytes + name)
    pushBytes(
      localParts,
      u32(0x04034b50), // signature
      u16(20), // version needed
      u16(0), // flags
      u16(0), // compression: store
      u16(0), u16(0), // mod time, mod date
      u32(crc), // CRC-32
      u32(data.length), // compressed size
      u32(data.length), // uncompressed size
      u16(nameBytes.length), // filename length
      u16(0), // extra field length
      Array.from(nameBytes), // filename
      Array.from(data) // file data
    );

    entries.push({name, data, crc, offset});
    offset += 30 + nameBytes.length + data.length;
  }

  // Central directory
  const centralParts: number[] = [];
  let centralSize = 0;

  for (const entry of entries) {
    const nameBytes = strToBytes(entry.name);
    const centralHeader = [
      ...u32(0x02014b50), // signature
      ...u16(20), // version made by
      ...u16(20), // version needed
      ...u16(0), // flags
      ...u16(0), // compression: store
      ...u16(0), ...u16(0), // mod time, mod date
      ...u32(entry.crc),
      ...u32(entry.data.length),
      ...u32(entry.data.length),
      ...u16(nameBytes.length),
      ...u16(0), // extra field length
      ...u16(0), // comment length
      ...u16(0), // disk number start
      ...u16(0), // internal attrs
      ...u32(0), // external attrs
      ...u32(entry.offset), // local header offset
      ...Array.from(nameBytes),
    ];
    centralParts.push(...centralHeader);
    centralSize += centralHeader.length;
  }

  // End of central directory record
  const eocd = [
    ...u32(0x06054b50), // signature
    ...u16(0), ...u16(0), // disk number, disk with central dir
    ...u16(entries.length), // entries on this disk
    ...u16(entries.length), // total entries
    ...u32(centralSize), // central directory size
    ...u32(offset), // central directory offset
    ...u16(0), // comment length
  ];

  const allParts = [...localParts, ...centralParts, ...eocd];
  return new Uint8Array(allParts);
};

/**
 * 浏览器：触发 ZIP 文件下载。
 * @param files 文件名 → 文本内容
 * @param zipName 下载的 zip 文件名
 */
export const downloadZip = (files: Record<string, string>, zipName: string): void => {
  const zipBytes = createZip(files);
  const blob = new Blob([zipBytes.buffer as ArrayBuffer], {type: 'application/zip'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
