/**
 * @author wangshihan
 * @description 发布
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const pkgsDir = path.resolve(fileURLToPath(new URL('../', import.meta.url)), 'packages');
const args = process.argv;
// 获取要处理的包名称，不设置将处理全部
const tPkgs = args.slice(2, args.length);

export function getPkgs() {
  // 过滤包
  return fs.readdirSync('packages').filter(p => {
    const isDir = fs.statSync(`${pkgsDir}/${p}`).isDirectory();
    if (isDir) {
      if (tPkgs.length == 0) return true;
      else return tPkgs.includes(p);
    } else return false;
  });
}
