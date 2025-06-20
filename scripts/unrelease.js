/**
 * @author wangshihan
 * @description 取消发布
 */

import path from 'path';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { getPkgs } from './utils.js';

const pkgsDir = path.resolve(fileURLToPath(new URL('../', import.meta.url)), 'packages');
const pkgs = getPkgs();

const release = async pkg => {
  await execa('npm', ['unpublish', '-f', '--w', `${pkgsDir}/${pkg}`], { stdio: 'inherit' });
};

const runParallel = (targets, buildFn) => {
  const res = [];
  for (const target of targets) {
    try {
      res.push(buildFn(target));
    } catch (e) {
      console.error(e);
      res.push(Promise.resolve(e));
    }
  }
  return Promise.all(res);
};

runParallel(pkgs, release);
