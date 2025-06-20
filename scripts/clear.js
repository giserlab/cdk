/**
 * @author wangshihan
 * @description 移除包文件内自动生成的相关资源
 */
import fs from 'fs';
import { execa } from 'execa';

const pkgs = fs.readdirSync('packages').filter(p => {
  return fs.statSync(`packages/${p}`).isDirectory();
});

const delDirs = ['dist'];

const build = async (pkg, dir) => {
  await execa('rm', ['-rf', `packages/${pkg}/${dir}`], { stdio: 'inherit' });
};

const runParallel = (targets, buildFn) => {
  const res = [];
  try {
    for (const target of targets) {
      for (const dir of delDirs) {
        res.push(buildFn(target, dir));
      }
    }
  } catch (e) {
    console.error(e);
    res.push(Promise.reject(e));
  }
  return Promise.all(res);
};

runParallel(pkgs, build);
