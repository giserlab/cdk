/**
 * @author wangshihan
 * @description 发布
 */

import path from 'path';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { getPkgs } from './utils.js';

const pkgsDir = path.resolve(fileURLToPath(new URL('../', import.meta.url)), 'packages');
const pkgs = getPkgs();

const publish = async pkg => {
  await execa('pnpm', ['link', `${pkgsDir}/${pkg}`], { stdio: 'inherit' });
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

runParallel(pkgs, publish);
