/**
 * @description: 新增monorepo子包
 * @author: wangshihan
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pkgsDir = path.resolve(fileURLToPath(new URL('../', import.meta.url)), 'packages');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const pkgTemplate = {
  name: '*name*',
  version: '0.0.0',
  description: '*description*',
  main: 'dist/index.esm.js',
  module: 'dist/index.esm.js',
  types: 'dist/index.d.ts',
  buildOptions: {
    name: '*name*',
    formats: ['esm'],
  },
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  keywords: ['cesium', 'geospatial'],
  author: '*author*',
  license: 'ISC',
  dependencies: {
    cesium: '^1.101.0',
  },
};

const commands = [
  {
    tip: '请输入包名：',
    key: 'name',
    cb: (key, val) => {
      pkgTemplate.name = `@giserlab/${val}`;
      pkgTemplate.buildOptions.name = val;
    },
  },
  { tip: '请输入版本：', key: 'version', cb: (key, val) => (pkgTemplate.version = val) },
  { tip: '请输入描述：', key: 'description', cb: (key, val) => (pkgTemplate.description = val) },
  { tip: '请输入作者信息：', key: 'author', cb: (key, val) => (pkgTemplate.author = val) },
];

async function askQuestion(cmds) {
  return new Promise((rs, rj) => {
    const cmd = cmds.shift();
    if (cmd) {
      const { tip, key, cb } = cmd;
      rl.question(tip, answer => {
        cb(key, answer);
        askQuestion(cmds);
      });
    } else {
      rl.close();
      const pkgDir = path.resolve(pkgsDir, pkgTemplate.buildOptions.name);
      fs.mkdirSync(pkgDir);
      const state = fs.statSync(pkgDir);
      if (fs.existsSync(path.resolve(pkgDir, 'package.json'))) {
        console.error('包已存在！');
        rs();
        return;
      } else {
        const filePath = path.resolve(pkgDir, 'package.json');
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify(pkgTemplate, null, 2));
        }
        console.log('包创建成功！');
      }

      rs();
    }
  });
}

askQuestion(commands);
