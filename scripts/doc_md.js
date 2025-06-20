/**
 * @author wangshihan
 * @description 生成文档
 */

import path from 'path';
import fs from 'fs';
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
  await execa(
    'typedoc',
    [
      filePath,
      '--plugin',
      'typedoc-plugin-markdown',
      '--out',
      resolveDev(pkg, 'docs/markdown'),
      '--mergeReadme',
      true,
      '--enumMembersFormat',
      'table',
      '--parametersFormat',
      'table',
      '--propertiesFormat',
      'table',
      '--typeDeclarationFormat',
      'table',
      '--indexFormat',
      'table',
      '--useCodeBlocks',
      true,
      '--expandObjects',
      true,
      '--outputFileStrategy',
      'modules',
    ],
    { stdio: 'inherit' }
  );
};

const runParallel = (targets, buildFn) => {
  const res = [];
  for (const target of targets) {
    res.push(buildFn(target));
  }
  return Promise.all(res);
};

runParallel(pkgs, buildDoc).then(() => {
  for (let pkg of pkgs) {
    const sourceDir = path.join(pkgsDir, pkg, 'docs', 'markdown', 'README.md');
    const targetDir = path.join(pkgsDir, pkg, 'README.md');
    fs.copyFile(sourceDir, targetDir, err => {
      if (err) {
        console.error(`移动README文件失败: ${pkg}`, err);
      } else {
        console.log(`成功移动README文件: ${pkg}`);
      }
    });
  }
});
