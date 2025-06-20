/**
 * @author wangshihan
 * @description 打包, 若子包和主包一同打包，则先打包子包，再打主包
 */
import { execa } from 'execa';
import { getPkgs } from './utils.js';

const mainPkgName = 'cak';
const pkgsSrc = getPkgs();

const pkgsSubs = pkgsSrc.filter(p => p !== mainPkgName);

const build = async pkg => {
  await execa('rollup', ['-c', '--environment', `TARGET:${pkg}`], { stdio: 'inherit' });
};

const runParallel = (targets, buildFn) => {
  const res = [];
  for (const target of targets) {
    res.push(buildFn(target));
  }
  return Promise.allSettled(res);
};

runParallel(pkgsSubs, build)
  .then(() => {
    console.log('全部子包打包完毕');
  })
  .finally(async () => {
    if (pkgsSrc.includes(mainPkgName)) {
      await runParallel([mainPkgName], build).then(() => {
        console.log('主包打包完毕');
      });
    }
    console.log('全部打包完毕');
  });
