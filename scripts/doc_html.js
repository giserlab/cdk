/**
 * @author wangshihan
 * @description 生成文档
 */

import path from 'path';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { getPkgs } from './utils.js';

const pkgsDir = path.resolve(fileURLToPath(new URL('../', import.meta.url)), 'packages');
const pkgs = getPkgs();

const resolveDev = (pkg, p) => {
  return path.resolve(`${pkgsDir}/${pkg}`, p);
};

const buildDoc = async pkg => {
  const filePath = resolveDev(pkg, 'src/index.ts');
  await execa('typedoc', [filePath, '--out', resolveDev(pkg, 'docs/html'), '--favicon', '.assets/favicon.ico'], { stdio: 'inherit' });
};

const runParallel = (targets, buildFn) => {
  const res = [];
  for (const target of targets) {
    res.push(buildFn(target));
  }
  return Promise.all(res);
};

runParallel(pkgs, buildDoc);
